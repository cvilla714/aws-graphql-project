import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://52.91.7.221:4000/graphql',
  cache: new InMemoryCache(),
});

export default client;
