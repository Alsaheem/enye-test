import Firebase from "firebase";

let Fire:any;
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "test-46aa8.firebaseapp.com",
  databaseURL: "https://test-46aa8.firebaseio.com",
  projectId: "test-46aa8",
  storageBucket: "test-46aa8.appspot.com",
  messagingSenderId: "158391814101",
  appId: "1:158391814101:web:20ce0ae1bf73d1d183df5c",
  measurementId: "G-W5MWQQQ3YK"
};

try {
  Fire = Firebase.initializeApp(firebaseConfig);
} catch (err) {
  // we skip the "already exists" message which is
  // not an actual error when we're hot-reloading
  if (!/already exists/.test(err.message)) {
    console.error("Firebase initialization error", err.stack);
  }
}

export default Fire;
