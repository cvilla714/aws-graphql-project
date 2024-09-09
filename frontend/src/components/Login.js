import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Initialize the login mutation with useMutation
  const [login, { data, loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Execute the mutation with username and password as variables
      const result = await login({ variables: { username, password } });
      console.log('Login successful:', result.data.login.token);

      // Save the token (e.g., in localStorage for future authenticated requests)
      localStorage.setItem('token', result.data.login.token);
      alert('Login Successful!');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login Failed: ' + err.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Token: {data.login.token}</p>} {/* This is optional to display */}
    </div>
  );
};

export default Login;
