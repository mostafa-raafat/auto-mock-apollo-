import React, { ReactNode } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { SchemaLink } from "@apollo/client/link/schema";

import {
  addResolversToSchema,
  makeExecutableSchema,
} from "@graphql-tools/schema";

import { addMocksToSchema } from "@graphql-tools/mock";

import { buildClientSchema } from "graphql/utilities";
import * as introspectionResult from "../../schema.json";

const AutoMockedProvider: React.FunctionComponent<{
  children: ReactNode;
  mockResolvers?: any;
}> = ({ children, mockResolvers }) => {
  // 1) Convert JSON schema into Schema Definition Language
  const schemaSDL = buildClientSchema({
    __schema: introspectionResult.__schema as any,
  });

  // 2) Make schema "executable"
  let schema = makeExecutableSchema({
    typeDefs: schemaSDL,
    resolverValidationOptions: {
      requireResolversForResolveType: "ignore",
    },
  });

  schema = addResolversToSchema(schema, mockResolvers);

  // 3) Apply mock resolvers to executable schema
  addMocksToSchema({ schema, preserveResolvers: false });

  // 4) Define ApolloClient (client variable used below)
  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default AutoMockedProvider;
