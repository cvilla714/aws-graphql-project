# Full-Stack Image Upload Application

## Overview

This is a full-stack application built with **Node.js**, **React.js**, **GraphQL**, **Apollo Client**, and **AWS S3**. The project demonstrates key features such as user authentication, image uploads to an S3 bucket, and efficient GraphQL queries and mutations.

## Technologies Used
- **Backend**: Node.js, Apollo Server, GraphQL, PostgreSQL, AWS S3, bcrypt, JWT
- **Frontend**: React.js, Apollo Client, React Router
- **Database**: PostgreSQL
- **File Storage**: AWS S3

## Features

### Backend (Node.js + Apollo Server + PostgreSQL + AWS S3)
- **GraphQL API**: The backend is built with Apollo Server and Express.js, serving a GraphQL schema for users, authentication, and image uploads.
- **User Authentication**: Users can register, log in, and receive JWT tokens for authentication.
- **Image Uploads**: Users can upload images via the dashboard, which are then stored in AWS S3 and accessible via a URL.
- **PostgreSQL Database**: Stores user information and image metadata.

### Frontend (React.js + Apollo Client + React Router)
- **Authentication**: Users can log in and register, with JWT tokens stored in localStorage for authenticated requests.
- **Image Upload**: Users can upload images from the dashboard, and previews are shown after successful upload.
- **Routing**: Managed using React Router for navigation between login, registration, and dashboard.

## Key Features

1. **GraphQL API**: Efficient querying and mutation handling for user and image data.
2. **AWS S3 Integration**: Secure file storage with image URLs returned to the frontend.
3. **JWT Authentication**: Secure login with token-based authentication.
4. **Password Hashing**: Secure password storage using bcrypt.

## How to Run the Project

### Backend
1. Clone the repository.
2. Navigate to the `backend` folder.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the environment variables in a `.env` file (or use AWS Secrets Manager in production).
5. Run the backend:
   ```bash
   node app.js
   ```

### Frontend
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend:
   ```bash
   npm start
   ```
