const { gql } = require('apollo-server-express');

const typeDefs = gql`
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

  type Query {
    users: [User]
    photos: [Photo]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): User
    uploadPhoto(title: String!, imgSrc: String!): Photo
    login(username: String!, password: String!): AuthPayload
  }
`;

module.exports = typeDefs;
