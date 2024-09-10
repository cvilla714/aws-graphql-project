import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://54.83.91.201:4000/graphql', // Directly set to the production endpoint
  cache: new InMemoryCache(),
});

export default client;
