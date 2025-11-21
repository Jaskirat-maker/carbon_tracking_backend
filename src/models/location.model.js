const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
    name: String,
    city: String,
    country: String,
    latitude: Number,
    longitude: Number
});

module.exports = mongoose.model("Location", locationSchema);
