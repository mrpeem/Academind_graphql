const express = require('express');
const bodyParser = require("body-parser");
const { graphqlHTTP } = require('express-graphql');
const mongoose = require("mongoose");

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');

const port = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(bodyParser.json());



app.use('/graphql', graphqlHTTP({
  schema: graphQLSchema,
  rootValue: graphQLResolvers,
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











