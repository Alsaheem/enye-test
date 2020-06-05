import React, { useEffect, useState } from "react";

export interface IHospital {
  business_status: string;
  name: string;
  id: number;
  vicinity: string;
  rating: number;
  user_ratings_total: number;
}

const App = (): JSX.Element => {
  const [latitude, setLatitude] = useState(6.5568767999999995);
  const [longitude, setLongitude] = useState(3.3456128);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [hospitals, setHospitals] = useState([]);

  const ApiKey = "AIzaSyDHqQ4CwrgtvMJJwTuRtiF3qDb4vU3KTk4";

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
    setLoading(true);
    fetchData();
  }, [radius]);

  const fetchData = async () => {
    console.log(`fetching...`);
    let num_radius = Number(radius);
    // Where we're fetching data from
    const proxyurl = "https://secure-dusk-66741.herokuapp.com/";
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&type=hospital&radius=${num_radius}&key=${ApiKey}`; // site that doesn’t send Access-Control-*
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
      .then((response) => response.json())
      .then((data) => {
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <div className="">
      <Navbar />
      <div className="container">
        <h2 className="mb-5  text-center bg-white">
          Search for Hospitals Nearby
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row align-items-center">
            <div className="col-md-5 offset-md-3 my-1">
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
            <div className="col-auto my-1">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>

        <br />
        <br />
        <br />
        <br />

        <h3 className=" text-center bg-white">
          Here are the hospitals around you within {radius} m
        </h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}

        {loading && (
          <div className="alert alert-info" role="alert">
            Loading....
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
                      Buisness Status : {hospital.buisness_status}
                    </p>
                    <p className="card-text">Location : {hospital.vicinity}</p>
                    <p className="card-text">Rating : {hospital.rating}</p>
                    <p className="card-text">
                      Average Rating : {hospital.user_ratings_total}
                    </p>
                    <p className="card-text">
                      {hospital.opening_hours ? (
                        <small className="btn btn-outline-success">Open</small>
                      ) : (
                        <small className="btn btn-outline-danger">Closed</small>
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
  );
};

export default App;

export const Navbar = () => {
  return (
    <>
      <nav className=" navbar-expand-lg navbar navbar-dark bg-primary fixed">
        <a className="navbar-brand" href="#">
          Hospital-Locator
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item active">
              <a
                className="nav-link"
                href="https://github.com/Alsaheem"
                target="_blank"
              >
                Github <span className="sr-only">(current)</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};
