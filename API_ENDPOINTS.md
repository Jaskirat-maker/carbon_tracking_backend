# API Endpoints Reference

Base URL: `http://localhost:3000`

---

## 1. Record Waste Scan
**POST** `/api/carbon/scan`

Records a new waste scan from the ML model and calculates CO2 savings.

### Request Body
```json
{
  "userId": "user123",
  "category": "plastic",
  "quantity": 2
}
```

### Parameters
- `userId` (string, required) - Unique user identifier
- `category` (string, required) - Waste category from ML model
- `quantity` (number, optional) - Number of items scanned (default: 1)

### Response (200 OK)
```json
{
  "success": true,
  "co2Saved": 0.21,
  "totalCo2Saved": 5.432,
  "entry": {
    "category": "plastic",
    "quantity": 2,
    "totalWeight": 0.1,
    "timestamp": "2025-11-21T10:30:00.000Z"
  }
}
```

### Error Responses
- `400 Bad Request` - Missing userId or category, or unknown category
- `500 Internal Server Error` - Server error

---

## 2. Get User Summary
**GET** `/api/carbon/summary/:userId`

Returns complete user statistics including total CO2 saved, weekly CO2, pie chart data, and recent entries.

### URL Parameters
- `userId` (string, required) - Unique user identifier

### Response (200 OK)
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
    },
    {
      "category": "aluminum",
      "quantity": 2,
      "totalWeight": 0.03,
      "co2Saved": 0.27,
      "timestamp": "2025-11-21T09:15:00.000Z"
    }
  ]
}
```

### Response Fields
- `totalCo2Saved` - Total CO2 saved by user (all time)
- `weeklyCo2` - CO2 saved in the last 7 days
- `pieChartData` - Array of category breakdowns for pie chart
- `recentEntries` - Last 20 entries, sorted by most recent

### Error Responses
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

## 3. Health Check
**GET** `/health`

Checks if the server is running.

### Response (200 OK)
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Supported Waste Categories

| Category   | Avg Weight (kg) | Emission Factor (kg CO2/kg) |
|------------|-----------------|----------------------------|
| plastic    | 0.05            | 2.1                        |
| aluminum   | 0.015           | 9.0                        |
| paper      | 0.01            | 0.9                        |
| glass      | 0.2             | 0.3                        |
| cardboard  | 0.03            | 0.7                        |
| metal      | 0.1             | 5.5                        |

---

## Calculation Formula

```
totalWeight = avg_weight × quantity
co2Saved = totalWeight × ef_recycle
```

---

## Example Usage

### Scan a plastic bottle
```bash
curl -X POST http://localhost:3000/api/carbon/scan \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "category": "plastic",
    "quantity": 1
  }'
```

### Get user summary
```bash
curl http://localhost:3000/api/carbon/summary/user123
```

### Health check
```bash
curl http://localhost:3000/health
```

---

## Notes

- All CO2 values are in kilograms (kg)
- All weights are in kilograms (kg)
- Timestamps are in ISO 8601 format (UTC)
- Category names are case-insensitive
- Recent entries are limited to 20 items
- Weekly CO2 includes entries from the last 7 days
