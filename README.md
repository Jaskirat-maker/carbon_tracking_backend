# Waste Carbon Tracker Backend

Backend API for waste scanning carbon tracking mobile app.

## Features

- Record waste scans with ML-detected categories
- Calculate CO2 savings based on emission factors
- Track user's total carbon savings
- Provide summary statistics (total, weekly, pie chart, recent entries)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/waste-carbon-tracker
```

3. Make sure MongoDB is running locally or update the URI to your MongoDB instance.

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### POST /api/carbon/scan
Record a new waste scan.

**Request Body:**
```json
{
  "userId": "user123",
  "category": "plastic",
  "quantity": 1
}
```

**Response:**
```json
{
  "success": true,
  "co2Saved": 0.105,
  "totalCo2Saved": 5.432,
  "entry": {
    "category": "plastic",
    "quantity": 1,
    "totalWeight": 0.05,
    "timestamp": "2025-11-21T10:30:00.000Z"
  }
}
```

### GET /api/carbon/summary/:userId
Get user's carbon tracking summary.

**Response:**
```json
{
  "totalCo2Saved": 5.432,
  "weeklyCo2": 1.234,
  "pieChartData": [
    { "category": "plastic", "co2Saved": 2.1 },
    { "category": "aluminum", "co2Saved": 1.8 },
    { "category": "paper", "co2Saved": 1.532 }
  ],
  "recentEntries": [
    {
      "category": "plastic",
      "quantity": 1,
      "totalWeight": 0.05,
      "co2Saved": 0.105,
      "timestamp": "2025-11-21T10:30:00.000Z"
    }
  ]
}
```

## Supported Categories

- plastic
- aluminum
- paper
- glass
- cardboard
- metal

## Carbon Table

Emission factors are stored in `carbonTable.json`:
- `avg_weight`: Average weight in kg per item
- `ef_recycle`: CO2 emission factor (kg CO2 saved per kg recycled)

## Project Structure

```
├── config/
│   └── db.js              # MongoDB connection
├── models/
│   ├── User.js            # User schema
│   └── CarbonEntry.js     # Carbon entry schema
├── routes/
│   └── carbon.js          # API routes
├── carbonTable.json       # Emission factors
├── server.js              # Main server file
├── package.json
└── .env                   # Environment variables
```
