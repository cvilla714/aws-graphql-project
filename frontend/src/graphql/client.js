import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://52.91.7.221:4000/graphql', // Directly set to the production endpoint
  cache: new InMemoryCache(),
});

export default client;
