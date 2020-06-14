import React, { useState, useEffect, useRef } from "react";

let autoComplete;

const loadScript = (url, callback) => {
  let script = document.createElement("script");
  script.type = "text/javascript";

  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === "loaded" || script.readyState === "complete") {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {
    script.onload = () => callback();
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
};

const getCoordinates = (address) => {
  fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+ibadan&key=AIzaSyDHqQ4CwrgtvMJJwTuRtiF3qDb4vU3KTk4`) // https://cors-anywhere.herokuapp.com/https://example.com
      .then((response) => response.json())
      .then((data) => {
        if (data.error_message) {
          console.log(data.error_message);
        } else {
          console.log(data.results[0].geometry.location.lat);
          console.log(data.results[0].geometry.location.lng);
        }
      })
      .catch(() => {
        console.log("Can’t access https://maps.googleapis.com/maps/api/geocodeesponse. Blocked by browser?");
      });
}

function handleScriptLoad(updateQuery, autoCompleteRef) {
  autoComplete = new window.google.maps.places.Autocomplete(
    autoCompleteRef.current,
    { types: ["(cities)"] }
  );
  autoComplete.setFields(["address_components", "formatted_address"]);
  autoComplete.addListener("place_changed", () => {
    handlePlaceSelect(updateQuery);
  });
}

async function handlePlaceSelect(updateQuery) {
  const addressObject = autoComplete.getPlace();
  const query = addressObject.formatted_address;
  updateQuery(query);
  console.log(query);
  getCoordinates(query)
}
const ApiKey = "AIzaSyDHqQ4CwrgtvMJJwTuRtiF3qDb4vU3KTk4";

function SearchLocationInput() {
  const [query, setQuery] = useState("");
  const autoCompleteRef = useRef(null);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${ApiKey}&libraries=places`,
      () => handleScriptLoad(setQuery, autoCompleteRef)
    );
  }, []);

  return (
    <div className="search-location-input">
      <input
        className="form-control"
        ref={autoCompleteRef}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Enter a City"
        value={query}
      />
    </div>
  );
}

export default SearchLocationInput;
