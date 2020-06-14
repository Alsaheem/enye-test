import React, { useEffect, useState, useContext } from "react";
import Navbar from ".././components/Navbar";
import Loading from ".././components/Loading";
import axios from "axios";
import "./Home.css";
import { Query, Mutation } from "react-apollo";
import { CREATE_DATA_MUTATION } from "../graphql/mutations";
import { GET_MYDATA_QUERY } from "../graphql/queries";
import Fire from "./Fire";
import LoaderSmall from "../components/LoaderSmall";
import { AuthContext } from "../App";
import { useHistory } from "react-router-dom";

export interface IHospital {
  business_status: string;
  name: string;
  id: number;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
}

const Home = (props: any): JSX.Element => {
  const isAuthenticated = useContext(AuthContext);
  console.log(isAuthenticated);
  const history = useHistory();

  const [latitude, setLatitude] = useState(0);
  const [input, setInput] = useState("");
  const [myhistory, setHistory] = useState([]);
  const [longitude, setLongitude] = useState(0);
  const [radius, setRadius] = useState("500");
  const [loading, setLoading] = useState(false);
  const [items] = React.useState([
    {
      label: "5 km",
      value: 500,
    },
    { label: "10 km", value: 1000 },
    { label: "15 km", value: 1500 },
    { label: "20 km", value: 2000 },
  ]);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hospitals, setHospitals] = useState([]);

  const DBurl = `https://enye-locator.firebaseio.com/`;

  const addData = (category: any, radius: any) => {
    axios
      .post(`${DBurl}/history.json`, { category, radius })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const ApiKey = "xxxxxxxxxxxxxxxxxxxxxxx";

  useEffect(() => {
    if ("geolocation" in navigator) {
      console.log("Available");
    } else {
      console.log("Not Available");
    }
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
    if (!localStorage.getItem("enye_app_email")) {
      history.push("/");
    }
  }, [reload]);

  const slugify = (string: any) => {
    return string
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const fetchData = async (mylatitude: any, mylongitude: any) => {
    console.log(`fetching...`);
    let num_radius = Number(radius);
    let input_slug = slugify(input);

    // Where we're fetching data from
    const proxyurl = "https://secure-dusk-66741.herokuapp.com/";
    let proxy2 = "https://cors-anywhere.herokuapp.com/";
    let random_pick = [proxy2, proxyurl];
    var usedProxy = random_pick[Math.floor(Math.random() * random_pick.length)];
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${mylatitude},${mylongitude}&type=hospital&radius=${num_radius}&keyword=${input_slug}&key=${ApiKey}`; // site that doesn’t send Access-Control-*
    fetch(usedProxy + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.error_message) {
          setError(true);
          setErrorMessage(data.error_message);
        } else {
          setHospitals(data.results);
          setLoading(false);
        }
      })
      .catch(() => {
        console.log("Can’t access " + url + " response. Blocked by browser?");
        setLoading(false);
      });
  };

  const handleGetUserFromLocalStorage = () => {
    return localStorage.getItem("enye_app_email");
  };
  //

  const handleHistoryReload = () => {
    console.log(`reload`);
  };

  const handleNewSubmit = async (event: any, createData: any) => {
    event.preventDefault();
    setLoading(true);
    // Add data to graphql endpoint
    let title = slugify(input);
    let email = handleGetUserFromLocalStorage();
    await fetchData(latitude, longitude);
    await createData({ variables: { title, radius, email } });
    setLoading(false);
  };

  const handleLoad = (category: any, radius: any) => {
    console.log(category, radius);
    setLoading(true);
    setInput(category);
    setRadius(radius);
    fetchData(latitude, longitude);
    setLoading(false);
  };

  return (
    <div className="">
      <div>
        {/* Vertical navbar */}
        <Navbar>
          <Query
            query={GET_MYDATA_QUERY}
            variables={{ email: handleGetUserFromLocalStorage() }}
          >
            {(props: any) => {
              const { loading, error, data } = props;

              if (loading) {
                return <LoaderSmall />;
              }
              if (data) {
                setHistory(data.myData);
              }
              return (
                <div className="">
                  {myhistory.map((hist: any, index: any) => {
                    return (
                      <li key={index} className="list-group-item ">
                        <div className="row">
                          <div className="col-8">
                            <span className="badge badge-success">
                              {hist.title}
                            </span>{" "}
                            <span className="badge badge-secondary">
                              {hist.radius}M
                            </span>
                          </div>
                          <div className="col-2">
                            <button
                              type="button"
                              style={{ backgroundColor: "#144a84" }}
                              className="btn text-white btn-sm justify-content-end"
                              onClick={() =>
                                handleLoad(hist.title, hist.radius)
                              }
                            >
                              <i className="fa  fa-rocket mr-2">_load</i>
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </div>
              );
            }}
          </Query>
        </Navbar>

        <div className="page-content p-5" id="content">
          <div className="jumbotron">
            <button
              id="sidebarCollapse"
              type="button"
              onClick={handleHistoryReload}
              className="btn btn-light  rounded-pill shadow-sm px-4 mb-3 btn-outline-primary"
            >
              <i className="fa  fa-refresh mr-2" />
              <small className="text-uppercase font-weight-bold">Reload</small>
            </button>
            {/* Demo content */}
            <h2 className="display-4 myblue">Search for Hospitals Nearby</h2>
            <Mutation
              mutation={CREATE_DATA_MUTATION}
              refetchQueries={() => [
                {
                  query: GET_MYDATA_QUERY,
                  variables: { email: handleGetUserFromLocalStorage() },
                },
              ]}
            >
              {(createData: any, props: any) => {
                if (props.error) return <div className="">Error</div>;
                if (props.data) {
                  console.log(`created sucessfully`);
                }
                return (
                  <div className="">
                    <form
                      onSubmit={(e) => handleNewSubmit(e, createData)}
                      className="mt-2 p-3 rounded"
                      style={{ backgroundColor: "#83a9cb" }}
                    >
                      <div className="align-items-center">
                        <div className="form-row">
                          <div className="col">
                            <input
                              type="text"
                              className="form-control"
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              id="lol"
                              placeholder="Search By Category Name Hospitals, Pharmacies, Clinics and Medical centers"
                            />
                          </div>
                          <div className="col">
                            <select
                              className="custom-select mr-sm-2"
                              id="inlineFormCustomSelect"
                              value={radius}
                              onChange={(e) => {
                                setRadius(e.target.value);
                              }}
                              onBlur={(e) => setRadius(e.target.value)}
                            >
                              {items.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="">
                            <button
                              type="submit"
                              className="btn rounded text-white"
                              style={{ backgroundColor: "#144a84" }}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                    <small className="text-danger">
                      Note : when you get no results , it means there isnt any
                      result within that range{" "}
                    </small>
                  </div>
                );
              }}
            </Mutation>
          </div>
          <div className="separator text-dark" />
          <div className="row text-white">
            <div className="col-12">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}

              {loading && (
                <div className="text-center" role="alert">
                  <Loading />
                </div>
              )}

              <div className="data">
                <div className="row">
                  {hospitals.map((hospital: any, index: number) => {
                    return (
                      <div className="card mb-3 col-4 ">
                        <div className="row no-gutters">
                          <div className="col-md-4">
                            <img
                              src={hospital.icon}
                              height="170px"
                              className="card-img "
                              alt="Hospital-icon"
                            />
                          </div>
                          <div className="col-md-8 text-dark">
                            <div className="card-body">
                              <h5 className="card-title">
                                Name : {hospital.name}
                              </h5>
                              <p className="card-text">
                                Location : {hospital.vicinity}
                              </p>
                              <p className="card-text">
                                Buisness Status : {hospital.business_status}
                              </p>
                              <p className="card-text">
                                Rating : {hospital.rating} ,Status :
                                {hospital.opening_hours ? (
                                  <small className="btn btn-outline-success">
                                    Open
                                  </small>
                                ) : (
                                  <small className="btn btn-outline-danger">
                                    Closed
                                  </small>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End demo content */}
      </div>
    </div>
  );
};

export default Home;
