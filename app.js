const express = require('express');
const bodyParser = require("body-parser");


const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('hi');
})
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`) 
});