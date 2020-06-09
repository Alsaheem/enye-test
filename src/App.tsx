import React, { useEffect, useState } from "react";
import SearchLocationInput from "./components/SearchInput";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
// Add And Read Data to Firebase
import axios from "axios";

export interface IHospital {
  business_status: string;
  name: string;
  id: number;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
}

const App = (props: any): JSX.Element => {
  const [latitude, setLatitude] = useState(0);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
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
  let keywords = [`pharmacy`, `medical center`, `clinic`, `hospitals`];

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

  const readData = () => {
    axios
      .get(`${DBurl}/history.json`)
      .then((response) => {
        console.log(response.data);
        setHistory(response.data);
      })
      .catch((error) => console.log(error));
  };

  const ApiKey = "";

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
    readData();
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
    let random_pick = [proxy2, proxyurl]
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
  //

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(slugify(input));
    setLoading(true);
    fetchData(latitude, longitude);
    let input_slug = slugify(input)
    addData(input_slug, radius);
    // might cause some issues soon enough
    // setReload(!reload)
  };

  const handleHistoryReload = () => {
    readData();
  };

  const handleLoad =(category:any,radius:any) => {
    console.log(category,radius)
    setInput(category)
    setRadius(radius)
    fetchData(latitude, longitude);
  }

  return (
    <div className="">
      <Navbar />
      <br />
      <div className="container-fluid">
        <div className="row">
          <div className="col-9">
            <h2 className="mb-3  text-center bg-white p-3">
              Search for Hospitals Nearby
            </h2>
            <div className="">
              Search options
              {keywords.map((keyword, index) => {
                return (
                  <div
                    key={index}
                    className="btn btn-outline-success bg-white ml-2"
                  >
                    {keyword}
                  </div>
                );
              })}
            </div>
            <form
              onSubmit={handleSubmit}
              className="bg-primary mt-2 p-3 rounded"
            >
              <div className="align-items-center">
                <div className="form-group">
                  <label htmlFor="lol" className="text-white">
                    Input A Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    id="lol"
                    placeholder="Search By Category Name Hospitals, Pharmacies, Clinics and Medical centers"
                  />
                </div>
                <div className="">
                  <label
                    className="mr-sm-2 sr-only"
                    htmlFor="inlineFormCustomSelect"
                  >
                    select distance in km
                  </label>
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
                <br />
                <div className="">
                  <button type="submit" className="btn btn-success">
                    Submit
                  </button>
                </div>
              </div>
            </form>

            <br />
            <br />

            <h3 className="p-2 text-center bg-white text-capitalize">
              Hospitals around you within {radius}m
            </h3>

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

            {hospitals.map((hospital: any, index: number) => {
              return (
                <div
                  key={hospital.id}
                  className="card mb-3 mt-4 shadow rounded p-4"
                >
                  <div className="row no-gutters">
                    <div className="col-md-4">
                      <img
                        src={hospital.icon}
                        height="270px"
                        width="260px"
                        alt=""
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <h5 className="card-title">
                          Hospital Name : {hospital.name}
                        </h5>
                        <p className="card-text">
                          Buisness Status : {hospital.business_status}
                        </p>
                        <p className="card-text">
                          Location : {hospital.vicinity}
                        </p>
                        <p className="card-text">Rating : {hospital.rating}</p>
                        <p className="card-text">
                          Average Rating : {hospital.user_ratings_total}
                        </p>
                        <p className="card-text">
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
          <div className="col-3 bg-secondary p-3" style={{ maxHeight: "800px" }}>
            <h2 className="bg-white p-3">
              History{" "}
              <button
                onClick={handleHistoryReload}
                type="button"
                className="ml-4 text-right btn"
                data-toggle="tooltip"
                data-placement="top"
                title="Reload"
              >
                <i className="ml-4  fa fa-2x fa-refresh text-primary text-right"></i>
              </button>
            </h2>
            <p className="text-white">recent searches</p>
            <ul
              className="list-group"
              style={{ overflowY: "scroll", maxHeight: "400px" }}
            >
              {Object.keys(history).map((keey: any) => {
                return (
                  <li key={keey} className="list-group-item mb-2 d-flex ">
                    {history[keey][`category`]} === {history[keey][`radius`]}M
                    <button type="button" className="btn btn-sm btn-primary justify-content-end" onClick={() => handleLoad(history[keey][`category`],history[keey][`radius`])}>Load</button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
