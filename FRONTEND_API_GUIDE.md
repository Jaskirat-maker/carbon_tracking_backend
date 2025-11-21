# Waste Carbon Tracker - API Documentation for Frontend

Base URL: `http://localhost:3000`

---

## 🔥 Available Endpoints

### 1. Record Waste Scan
**POST** `/api/carbon/scan`

Records a waste scan from the ML model and calculates CO2 savings.

**Request:**
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

---

### 2. Get User Summary
**GET** `/api/carbon/summary/:userId`

Returns user's carbon tracking statistics.

**Example:** `GET /api/carbon/summary/user123`

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

**Notes:**
- `recentEntries` returns last 20 entries
- `weeklyCo2` includes last 7 days
- `pieChartData` shows breakdown by category

---

### 3. Find Nearest Waste Collection Centers
**POST** `/api/location/nearest`

Returns nearest waste collection centers based on user's location.

**Request:**
```json
{
  "latitude": 31.24,
  "longitude": 75.64,
  "limit": 5
}
```

**Parameters:**
- `latitude` (number, required) - User's latitude
- `longitude` (number, required) - User's longitude
- `limit` (number, optional) - Number of centers to return (default: 5)

**Response:**
```json
{
  "success": true,
  "nearestCenters": [
    {
      "name": "Organic Composting Plant",
      "latitude": 31.2459,
      "longitude": 75.635,
      "city": "Ludhiana",
      "country": "India",
      "distance_km": 0.81
    },
    {
      "name": "City Plastic Recycling Center",
      "latitude": 31.2266,
      "longitude": 75.6411,
      "city": "Ludhiana",
      "country": "India",
      "distance_km": 1.52
    }
  ]
}
```

**Notes:**
- Centers are sorted by distance (closest first)
- `distance_km` is calculated using Haversine formula

---

### 4. Health Check
**GET** `/health`

Check if server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 📦 Supported Waste Categories

| Category   | Description              |
|------------|--------------------------|
| plastic    | Plastic bottles, bags    |
| aluminum   | Aluminum cans            |
| paper      | Paper, newspapers        |
| glass      | Glass bottles, jars      |
| cardboard  | Cardboard boxes          |
| metal      | Metal cans, scraps       |

---

## 🔧 Integration Examples

### JavaScript (Fetch API)

**Record a scan:**
```javascript
const recordScan = async (userId, category, quantity = 1) => {
  const response = await fetch('http://localhost:3000/api/carbon/scan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId, category, quantity })
  });
  
  const data = await response.json();
  return data;
};

// Usage
const result = await recordScan('user123', 'plastic', 1);
console.log(`CO2 Saved: ${result.co2Saved} kg`);
console.log(`Total CO2 Saved: ${result.totalCo2Saved} kg`);
```

**Get user summary:**
```javascript
const getUserSummary = async (userId) => {
  const response = await fetch(`http://localhost:3000/api/carbon/summary/${userId}`);
  const data = await response.json();
  return data;
};

// Usage
const summary = await getUserSummary('user123');
console.log(`Total CO2: ${summary.totalCo2Saved} kg`);
console.log(`Weekly CO2: ${summary.weeklyCo2} kg`);
```

**Find nearest centers:**
```javascript
const findNearestCenters = async (latitude, longitude, limit = 5) => {
  const response = await fetch('http://localhost:3000/api/location/nearest', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latitude, longitude, limit })
  });
  
  const data = await response.json();
  return data;
};

// Usage
const centers = await findNearestCenters(31.24, 75.64, 5);
centers.nearestCenters.forEach(center => {
  console.log(`${center.name} - ${center.distance_km} km away`);
});
```

---

### Android (Kotlin + Retrofit)

**API Interface:**
```kotlin
interface CarbonApi {
    @POST("api/carbon/scan")
    suspend fun recordScan(@Body request: ScanRequest): ScanResponse
    
    @GET("api/carbon/summary/{userId}")
    suspend fun getUserSummary(@Path("userId") userId: String): SummaryResponse
    
    @POST("api/location/nearest")
    suspend fun getNearestCenters(@Body request: LocationRequest): LocationResponse
}

data class ScanRequest(
    val userId: String,
    val category: String,
    val quantity: Int = 1
)

data class ScanResponse(
    val success: Boolean,
    val co2Saved: Double,
    val totalCo2Saved: Double,
    val entry: Entry
)

data class LocationRequest(
    val latitude: Double,
    val longitude: Double,
    val limit: Int = 5
)

data class LocationResponse(
    val success: Boolean,
    val nearestCenters: List<Center>
)

data class Center(
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val city: String,
    val country: String,
    val distance_km: Double
)
```

**Usage:**
```kotlin
// Record scan
val response = api.recordScan(
    ScanRequest(
        userId = "user123",
        category = "plastic",
        quantity = 1
    )
)
println("CO2 Saved: ${response.co2Saved} kg")

// Find nearest centers
val centers = api.getNearestCenters(
    LocationRequest(
        latitude = 31.24,
        longitude = 75.64,
        limit = 5
    )
)
centers.nearestCenters.forEach { center ->
    println("${center.name} - ${center.distance_km} km")
}
```

---

## ⚠️ Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK` - Success
- `400 Bad Request` - Invalid input (missing fields, invalid category)
- `404 Not Found` - Resource not found (user not found)
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

**Example Error Handling:**
```javascript
try {
  const response = await fetch('http://localhost:3000/api/carbon/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 'user123', category: 'plastic' })
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Error:', error.message);
    return;
  }
  
  const data = await response.json();
  console.log('Success:', data);
} catch (error) {
  console.error('Network error:', error);
}
```

---

## 📊 Data Flow

1. **ML Model** detects waste → sends `category` to app
2. **App** calls `/api/carbon/scan` with `userId`, `category`, `quantity`
3. **Backend** calculates CO2 savings and updates user total
4. **App** displays results and updated total
5. **App** can fetch summary with `/api/carbon/summary/:userId`
6. **App** can find nearby centers with `/api/location/nearest`

---

## 🚀 Quick Start Checklist

- [ ] Server running on `http://localhost:3000`
- [ ] MongoDB connected
- [ ] Test `/health` endpoint
- [ ] Test `/api/carbon/scan` with sample data
- [ ] Test `/api/carbon/summary/:userId`
- [ ] Test `/api/location/nearest` with coordinates
- [ ] Integrate with your ML model output
- [ ] Handle errors gracefully
- [ ] Display CO2 savings to user
- [ ] Show nearest collection centers on map

---

## 💡 Tips

1. **User ID**: Generate a unique ID for each user (UUID recommended)
2. **Category Names**: Must match exactly (case-insensitive): plastic, aluminum, paper, glass, cardboard, metal
3. **Coordinates**: Use device GPS for accurate location
4. **Caching**: Consider caching user summary to reduce API calls
5. **Offline**: Queue scans when offline and sync when online
6. **Units**: All CO2 values are in kilograms (kg)
7. **Distance**: All distances are in kilometers (km)

---

## 📞 Support

If you encounter any issues:
1. Check server is running: `GET /health`
2. Verify request format matches examples
3. Check console logs for errors
4. Ensure MongoDB is connected

Happy coding! 🎉
