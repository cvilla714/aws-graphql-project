import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate, Link } from 'react-router-dom';
import zxcvbn from 'zxcvbn'; // Password strength scoring

// GraphQL mutation for adding a user
const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      id
      username
      email
    }
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordScore, setPasswordScore] = useState(0); // To track password strength score
  const [showPassword, setShowPassword] = useState(false); // To track password visibility

  const [register, { loading, error }] = useMutation(ADD_USER);
  const navigate = useNavigate();

  // Handle password change and check its strength using zxcvbn
  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    const score = zxcvbn(passwordValue).score;
    setPasswordScore(score); // Password strength score ranges from 0 to 4
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ variables: { username, email, password } });
      alert(`User Registered: ${username}`);
      navigate('/login');
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  // Password validation requirements
  const passwordRequirements = [
    { label: 'Lowercase Letter (a-z)', satisfied: /[a-z]/.test(password) },
    { label: 'Uppercase Letter (A-Z)', satisfied: /[A-Z]/.test(password) },
    { label: 'Number (0-9)', satisfied: /\d/.test(password) },
    { label: 'Symbol', satisfied: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    { label: 'Minimum 8 Characters', satisfied: password.length >= 8 },
  ];

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" />
        <div>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle between text and password input type
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            className="form-input"
          />
          <button type="button" onClick={togglePasswordVisibility} className="toggle-password-btn">
            {showPassword ? 'Hide' : 'Show'} {/* Button to toggle password visibility */}
          </button>
        </div>
        <button type="submit" className="form-button">
          Register
        </button>
      </form>

      {/* Password Requirements */}
      <div>
        <h4>Password Requirements</h4>
        <ul>
          {passwordRequirements.map((req, index) => (
            <li key={index} style={{ color: req.satisfied ? 'green' : 'red' }}>
              {req.label}
            </li>
          ))}
        </ul>
        <p>Password strength: {passwordScore}/4</p> {/* Password strength score displayed */}
      </div>

      {/* Loading and Error Messages */}
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}

      {/* Navigation Links */}
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
};

export default Register;
