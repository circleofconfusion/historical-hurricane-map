'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const { Hurricane } = require('./schemas/Hurricane');
const util = require('util');

module.exports = { search };

async function search(event) {
  let { name, year, intensity, special } = event.multiValueQueryStringParameters;
  
  // clean up query params
  if (name && name.length) name = name[0];
  if (year && year.length) year = year[0];

  // build query object
  const queryObj = {};
  if (year) queryObj['properties.year'] = +year;
  if (name) queryObj['properties.name'] = name.toUpperCase();
  if (intensity) queryObj['properties.measurements.systemStatus'] = { $in: intensity };
  if (special) queryObj['properties.measurements.systemStatus'] = { $in: special };

  mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const result = await mongoose.model('Hurricane', Hurricane).find(queryObj);
  
  mongoose.connection.close();

  return {
    status: 200,
    body: JSON.stringify(result)
  };
}