'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { Hurricane } = require('./schemas/Hurricane');
const util = require('util');

module.exports = { 
  queryByYear,
  queryByName
};

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

async function queryByYear(event) {

  const result = await mongoose.model('Hurricane', Hurricane).find({ 'properties.year': event.pathParameters.year }).exec();

  mongoose.connection.close();

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };

}

async function queryByName(event) {
  const result = await mongoose.model('Hurricane', Hurricane).find({ 'properties.name': `'${event.pathParameters.name.toUpperCase()}'` }).exec();
  
  mongoose.connection.close();

  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };
}