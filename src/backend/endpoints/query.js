require('dotenv').config();
const mongoose = require('mongoose');
const { Hurricane } = require('../schemas/Hurricane');

const util = require('util');

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.model('Hurricane', Hurricane).find(
  { 'properties.year': 2018 },
  function(err, result) {
    console.log(util.inspect(result, {  depth: null }));
    mongoose.connection.close();
  }
);
