const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type EventType {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: UserType!
  }
  input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
  }

  type UserType {
    _id: ID!,
    email: String!,
    password: String
    createdEvents: [EventType!]
  }
  input UserInput {
    email: String!,
    password: String!
  }

  type RootQuery {
    events: [EventType!]!
  } 
  type RootMutation {
    createEvent(eventInput: EventInput): EventType
    createUser(userInput: UserInput): UserType
  }      
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);