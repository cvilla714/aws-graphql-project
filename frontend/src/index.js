import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; // Make sure these paths are correct

// Initialize Apollo Client
const client = new ApolloClient({
  uri:'http://52.91.7.221:4000/graphql', // Production endpoint
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} /> {/* This renders the Login page */}
          <Route path="/login" element={<Login />} /> {/* Just in case you have a specific /login path */}
          <Route path="/register" element={<Register />} /> {/* This renders the Register page */}
          <Route path="/dashboard" element={<Dashboard />} /> {/* After login, you can route to Dashboard */}
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
);

reportWebVitals();
