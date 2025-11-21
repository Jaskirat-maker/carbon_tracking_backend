require('dotenv').config();
const mongoose = require('mongoose');
const Center = require('../models/Center');

const centers = [
  {
    name: 'Near Hostel A',
    latitude: 31.2266,
    longitude: 75.6411,
    city: 'Ludhiana',
    country: 'India'
  },
  {
    name: 'Near TAN',
    latitude: 31.2141,
    longitude: 75.6590,
    city: 'Ludhiana',
    country: 'India'
  },
  {
    name: 'Near The COS',
    latitude: 31.2459,
    longitude: 75.6350,
    city: 'Ludhiana',
    country: 'India'
  },
  {
    name: 'Near The Hostel PG',
    latitude: 31.2015,
    longitude: 75.6180,
    city: 'Ludhiana',
    country: 'India'
  },
  {
    name: 'Near The Main Gate Parking',
    latitude: 31.2893,
    longitude: 75.6275,
    city: 'Ludhiana',
    country: 'India'
  }
];

const insertCenters = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Center.deleteMany({});
    console.log('Deleted existing centers');

    await Center.insertMany(centers);
    console.log('Inserted 5 centers successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error inserting centers:', error);
    process.exit(1);
  }
};

insertCenters();
