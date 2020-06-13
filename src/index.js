import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "https://enye-medical.herokuapp.com/graphql/",
  fetchOptions: {
    credentials: "include"
  },
  // to set headers for all request
  request: operation => {
    operation.setContext({
      headers: {
      }
    });
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
     <App />
  </ApolloProvider>,
  document.getElementById("root")
);


serviceWorker.unregister();
