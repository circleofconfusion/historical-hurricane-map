const { Schema } = require('mongoose');

exports.Measurement = new Schema({
  recordIdentifier: String,
  maxWind: Number,
  systemStatus: String,
  minPressure: Number,
  dateTime: Date
});