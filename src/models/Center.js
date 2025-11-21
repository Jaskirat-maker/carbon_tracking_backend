const mongoose = require("mongoose");

const centerSchema = new mongoose.Schema({
  name: String,
  city: String,
  country: String,
  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model("Center", centerSchema);
