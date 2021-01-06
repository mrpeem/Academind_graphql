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

  type BookingType {
    _id: ID!
    event: EventType!
    user: UserType!
    createdAt: String!
    updatedAt: String!
  }

  type AuthDataType {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  type RootQuery {
    events: [EventType!]!
    bookings: [BookingType!]!
    login(email: String!, password: String!): AuthDataType
  } 
  type RootMutation {
    createEvent(eventInput: EventInput): EventType
    createUser(userInput: UserInput): UserType
    bookEvent(eventId: ID!): BookingType
    cancelBooking(bookingId: ID!): EventType
  }      
  schema {
    query: RootQuery
    mutation: RootMutation
  }
`);