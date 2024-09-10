import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import { jwtDecode } from 'jwt-decode';

// Define the GraphQL mutation for image upload
const UPLOAD_IMAGE = gql`
  mutation uploadImage($file: Upload!, $userId: Int!) {
    uploadImage(file: $file, userId: $userId) {
      url
      message
    }
  }
`;

const Dashboard = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [preview, setPreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // New state to store the uploaded image URL
  const navigate = useNavigate();

  const [uploadImage] = useMutation(UPLOAD_IMAGE);

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
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file)); // Show a preview of the selected image
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image first.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      // Wrap the image in a File object
      const file = new File([image], image.name, { type: image.type });
      const response = await uploadImage({
        variables: {
          file: file, // Use the wrapped file
          userId: userId,
        },
      });

      if (response.data.uploadImage) {
        setPreview(response.data.uploadImage.url); 
        setUploadedImageUrl(response.data.uploadImage.url); // Set the uploaded image URL to state
        setMessage(response.data.uploadImage.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage('Image upload failed.');
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h1>Welcome to your Dashboard, {username}!</h1>
      <p>This is your personalized space.</p>

      <div className="upload-form">
        <h3>Upload an Image</h3>
        <form onSubmit={handleImageUpload}>
          <input type="file" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Image Preview" />}
          <button type="submit">Upload Image</button>
        </form>
        {message && <p>{message}</p>}
        
        {/* Show the uploaded image URL */}
        {uploadedImageUrl && (
          <div>
            <p>Image URL: <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer">{uploadedImageUrl}</a></p>
          </div>
        )}
      </div>

      <button onClick={handleSignOut} className="signout-button">
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
