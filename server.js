// Load environment variables (fixed absolute path)
require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const carbonRoutes = require('./routes/carbon');
const locationRoutes = require('./src/routes/location.routes'); // nearest centers

const app = express();

// Port from .env or fallback
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/carbon', carbonRoutes);
app.use('/api/location', locationRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
