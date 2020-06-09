// Add And Read Data to Firebase
import axios from "axios";

const DBurl = `https://enye-locator.firebaseio.com/`;

export const addData = (category:any, radius:any) => {
  axios
    .post(`${DBurl}/history.json`, { category, radius })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const readData = () => {
  axios
    .get(`${DBurl}/history.json`)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.log(error));
};
