'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { Hurricane } = require('./schemas/Hurricane');
const util = require('util');

module.exports.queryYear = async event => {
  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const result = await mongoose.model('Hurricane', Hurricane).find({ 'properties.year': 2018 }).exec();

  mongoose.connection.close();
  
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  };

}