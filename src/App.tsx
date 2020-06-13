import React, { useState, useEffect } from "react";
import Fire from "../src/containers/Fire";
import Home from "../src/containers/Home";
import Auth from "../src/containers/Auth";
import "./App.css";

export default function App() {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState({});

  const authListener = () => {
    Fire.auth().onAuthStateChanged((user: any) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true)
      } else {
        console.log(`error getting user`);
        console.log(user);
        setIsAuthenticated(false)
      }
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  return <div className="App">{isAuthenticated ? <Home /> : <Auth />}</div>;
}
