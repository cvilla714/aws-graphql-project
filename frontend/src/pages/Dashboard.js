import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { jwtDecode } from 'jwt-decode'; // Fix import for jwt-decode

const Dashboard = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate for redirection

  // Decode the JWT to extract the username when the component loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) {
        console.error('Failed to decode token:', error);
        setMessage('Invalid token.');
      }
    } else {
      setMessage('No token found. Please login again.');
    }
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', image);

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Image uploaded successfully!');
      } else {
        setMessage('Image upload failed.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Error uploading image.');
    }
  };

  // Handle sign out functionality
  const handleSignOut = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard, {username}!</h1>
      <p>This is your personalized space.</p>

      <div className="upload-form">
        <h3>Upload an Image</h3>
        <form onSubmit={handleImageUpload}>
          <input type="file" onChange={handleImageChange} />
          <button type="submit">Upload Image</button>
        </form>
        {message && <p>{message}</p>}
      </div>

      {/* Sign Out Button */}
      <button onClick={handleSignOut} className="signout-button">
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
