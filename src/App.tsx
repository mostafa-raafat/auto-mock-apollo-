import React from "react";
import { ApolloProvider } from "@apollo/client";

import createClient from "./apolloClient";
import Products from "./Products";
import "./App.css";

const client = createClient();

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Products />
    </ApolloProvider>
  );
}
