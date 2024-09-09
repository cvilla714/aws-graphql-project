import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri:
    process.env.NODE_ENV === 'production'
      ? 'http://52.91.7.221:4000/graphql' // Production endpoint
      : 'http://localhost:4000/graphql', // Local development endpoint
  cache: new InMemoryCache(),
});

export default client;
