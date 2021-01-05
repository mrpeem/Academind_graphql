const express = require('express');
const bodyParser = require("body-parser");
const { graphqlHTTP } = require('express-graphql');
const { buildSchema }  = require('graphql');
const mongoose = require("mongoose");

const Event = require('./models/event');

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }
    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    } 
    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }      
    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => {
      return Event
        .find()
        .then( data => {
          // remove metadata and return new object for every event element
          return data.map( event => { 
            return { ...event._doc };
          });
        })
        .catch( err => {
          throw err;
        });
    },
    createEvent: (args) => {

      // create mongoose object
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date( args.eventInput.date )
      });

      // save to mongodb
      return event
        .save()
        .then( data => {
          console.log(data);
          return { ...data._doc };
        })
        .catch( err => {
          console.log(err);
          throw err;
        });
    }

  },
  graphiql: true
})); 




const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.m1bbz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
mongoose
  .connect(uri, { 
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("MongoDB database connection established successfully");
    app.listen(port, () => {
      console.log(`Server started on ${port}`) 
    });
  })
  .catch(e => {
    console.log(e)
  });











