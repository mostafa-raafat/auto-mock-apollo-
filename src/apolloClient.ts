
import {  HttpLink, ApolloLink, ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import produce from "immer";

const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path }) =>
      console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
    );
  }

  if (networkError) {
    console.log(
      `[Network error ${operation.operationName}]: ${networkError.message}`
    );
  }
});

const createClient = () => {
  const cache = new InMemoryCache();

  const httpLink = new HttpLink({
    uri: `https://graphql.myshopify.com/api/graphql`
  });

  const authLink = setContext((_, oldContext) => {
    return produce(oldContext, draft => {
      if (!draft.headers) {
        draft.headers = {};
      }
      draft.headers[
        "X-Shopify-Storefront-Access-Token"
      ] = `078bc5caa0ddebfa89cccb4a1baa1f5c`;
    });
  });

  const client = new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, authLink, httpLink])
  });

  return client;
};

export default createClient;
