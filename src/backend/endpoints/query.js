const mongoose = require('mongoose');
const { Hurricane } = require('../schemas/Hurricane');

const util = require('util');

mongoose.connect('mongodb://localhost:27017/hurricanes', { useNewUrlParser: true, useUnifiedTopology: true });

const query = mongoose.model('Hurricane', Hurricane).find(
  { 'properties.year': 2018 },
  function(err, result) {
    console.log(util.inspect(result, {  depth: null }));
    mongoose.connection.close();
  });
