const { Schema } = require('mongoose');
const { LineString } = require('mongoose-geojson-schemas');
const Measurement = require('./Measurement');

exports.Hurricane = new Schema({
  type: String,
  geometry: LineString,
  properties: {
    name: String,
    measurements: [Measurement],
    cycloneNumber: Number,
    year: Number,
    basin: String,
  }
}, { collection: 'paths' });
