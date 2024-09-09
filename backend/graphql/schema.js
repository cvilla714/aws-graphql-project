const { gql } = require('apollo-server-express');

const typeDefs = gql`
  scalar Upload

  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Photo {
    id: ID!
    title: String!
    imgSrc: String!
  }

  type AuthPayload {
    token: String!
  }

  type UploadResponse {
    url: String!
    message: String!
  }

  type Query {
    users: [User]
    photos: [Photo]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): User
    uploadPhoto(title: String!, imgSrc: String!): Photo
    login(username: String!, password: String!): AuthPayload

    # New mutation for uploading images
    uploadImage(file: Upload!, userId: Int!): UploadResponse!
  }
`;

module.exports = typeDefs;
