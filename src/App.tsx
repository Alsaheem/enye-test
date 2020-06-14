import React, { useState, useEffect, createContext } from "react";
import Fire from "../src/containers/Fire";
import Home from "../src/containers/Home";
import Auth from "../src/containers/Auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";

export const AuthContext = createContext(false);

export default function App() {
  const [user, setUser] = useState({});
  let isAuth = localStorage.getItem("enye_app_email") ? true : false;
  const [isAuthenticated, setIsAuthenticated] = useState(isAuth);

  const authListener = () => {
    Fire.auth().onAuthStateChanged((user: any) => {
      if (user) {
        setUser(user);
        setIsAuthenticated(true);
      } else {
        console.log(`error getting user`);
        console.log(user);
        setIsAuthenticated(false);
      }
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  return (
    <Router>
      <AuthContext.Provider value={isAuthenticated}>
        <Switch>
          <Route exact path="/" component={Auth} />
          <Route path="/home" component={Home} />
        </Switch>
      </AuthContext.Provider>
    </Router>
  );
}
