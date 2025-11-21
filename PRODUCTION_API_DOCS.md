# Carbon Tracking API - Production Documentation

## 🌐 Base URL
```
https://carbon-tracking-backend.onrender.com
```

---

## 📡 API Endpoints

### 1. Record Waste Scan
**POST** `/api/carbon/scan`

Records a waste scan from ML model and calculates CO2 savings.

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
    "timestamp": "2025-11-22T10:30:00.000Z"
  }
}
```

---

### 2. Get User Summary
**GET** `/api/carbon/summary/:userId`

Returns user's carbon tracking statistics.

**Example:**
```
GET /api/carbon/summary/user123
```

**Response:**
```json
{
  "totalCo2Saved": 5.432,
  "weeklyCo2": 1.234,
  "pieChartData": [
    { "category": "plastic", "co2Saved": 2.1 },
    { "category": "metal", "co2Saved": 1.8 },
    { "category": "paper", "co2Saved": 1.532 }
  ],
  "recentEntries": [
    {
      "category": "plastic",
      "quantity": 1,
      "totalWeight": 0.05,
      "co2Saved": 0.105,
      "timestamp": "2025-11-22T10:30:00.000Z"
    }
  ]
}
```

**Notes:**
- `recentEntries` returns last 20 entries
- `weeklyCo2` includes last 7 days
- `pieChartData` shows breakdown by category

---

### 3. Find Nearest Waste Centers
**POST** `/api/location/nearest`

Returns nearest waste collection centers based on user's GPS location.

**Request:**
```json
{
  "latitude": 31.24,
  "longitude": 75.64,
  "limit": 5
}
```

**Response:**
```json
{
  "success": true,
  "nearestCenters": [
    {
      "name": "Near The COS",
      "latitude": 31.2459,
      "longitude": 75.635,
      "city": "Ludhiana",
      "country": "India",
      "distance_km": 0.81
    },
    {
      "name": "Near Hostel A",
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
- Get user's GPS coordinates from device

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

## 🗑️ Valid Waste Categories

```
battery
biological
brown-glass
cardboard
clothes
green-glass
metal
paper
plastic
shoes
trash
white-glass
```

---

## 📍 Available Waste Collection Centers

1. **Near Hostel A** - (31.2266, 75.6411)
2. **Near TAN** - (31.2141, 75.6590)
3. **Near The COS** - (31.2459, 75.6350)
4. **Near The Hostel PG** - (31.2015, 75.6180)
5. **Near The Main Gate Parking** - (31.2893, 75.6275)

All centers are in Ludhiana, India.

---

## 💻 Integration Examples

### JavaScript / React
```javascript
const API_BASE = 'https://carbon-tracking-backend.onrender.com';

// Record waste scan
async function recordScan(userId, category, quantity = 1) {
  const response = await fetch(`${API_BASE}/api/carbon/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, category, quantity })
  });
  return await response.json();
}

// Get user summary
async function getUserSummary(userId) {
  const response = await fetch(`${API_BASE}/api/carbon/summary/${userId}`);
  return await response.json();
}

// Find nearest centers
async function getNearestCenters(latitude, longitude, limit = 5) {
  const response = await fetch(`${API_BASE}/api/location/nearest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude, limit })
  });
  return await response.json();
}

// Usage
const result = await recordScan('user123', 'plastic', 1);
console.log(`CO2 Saved: ${result.co2Saved} kg`);

const centers = await getNearestCenters(31.24, 75.64, 5);
console.log(centers.nearestCenters);
```

---

### Android / Kotlin
```kotlin
// Retrofit Interface
interface WasteApi {
    @POST("api/carbon/scan")
    suspend fun recordScan(@Body request: ScanRequest): ScanResponse
    
    @GET("api/carbon/summary/{userId}")
    suspend fun getSummary(@Path("userId") userId: String): SummaryResponse
    
    @POST("api/location/nearest")
    suspend fun getNearestCenters(@Body request: LocationRequest): LocationResponse
}

// Data Classes
data class ScanRequest(
    val userId: String,
    val category: String,
    val quantity: Int = 1
)

data class ScanResponse(
    val success: Boolean,
    val co2Saved: Double,
    val totalCo2Saved: Double
)

data class LocationRequest(
    val latitude: Double,
    val longitude: Double,
    val limit: Int = 5
)

data class Center(
    val name: String,
    val latitude: Double,
    val longitude: Double,
    val city: String,
    val country: String,
    val distance_km: Double
)

data class LocationResponse(
    val success: Boolean,
    val nearestCenters: List<Center>
)

// Retrofit Instance
val retrofit = Retrofit.Builder()
    .baseUrl("https://carbon-tracking-backend.onrender.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val api = retrofit.create(WasteApi::class.java)

// Usage
lifecycleScope.launch {
    // Record scan
    val result = api.recordScan(ScanRequest("user123", "plastic", 1))
    println("CO2 Saved: ${result.co2Saved} kg")
    
    // Get nearest centers
    val centers = api.getNearestCenters(LocationRequest(31.24, 75.64, 5))
    centers.nearestCenters.forEach { center ->
        println("${center.name} - ${center.distance_km} km away")
    }
}
```

---

### React Native
```javascript
import axios from 'axios';

const API_BASE = 'https://carbon-tracking-backend.onrender.com';

// Record scan
export const recordScan = async (userId, category, quantity = 1) => {
  try {
    const response = await axios.post(`${API_BASE}/api/carbon/scan`, {
      userId,
      category,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error recording scan:', error);
    throw error;
  }
};

// Get summary
export const getUserSummary = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/api/carbon/summary/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting summary:', error);
    throw error;
  }
};

// Find nearest centers
export const getNearestCenters = async (latitude, longitude, limit = 5) => {
  try {
    const response = await axios.post(`${API_BASE}/api/location/nearest`, {
      latitude,
      longitude,
      limit
    });
    return response.data;
  } catch (error) {
    console.error('Error finding centers:', error);
    throw error;
  }
};
```

---

## 🔧 Testing with cURL

```bash
# Health check
curl https://carbon-tracking-backend.onrender.com/health

# Record scan
curl -X POST https://carbon-tracking-backend.onrender.com/api/carbon/scan \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","category":"plastic","quantity":1}'

# Get summary
curl https://carbon-tracking-backend.onrender.com/api/carbon/summary/user123

# Find nearest centers
curl -X POST https://carbon-tracking-backend.onrender.com/api/location/nearest \
  -H "Content-Type: application/json" \
  -d '{"latitude":31.24,"longitude":75.64,"limit":5}'
```

---

## 🔒 Authentication

**No authentication required** - API is public and open for use.

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

---

## 📊 Data Flow Example

### Typical User Journey:

1. **User scans waste with camera**
   - ML model detects: "plastic"

2. **App calls API:**
   ```
   POST /api/carbon/scan
   Body: {"userId":"user123","category":"plastic","quantity":1}
   ```

3. **Backend calculates:**
   - Weight: 0.05 kg
   - CO2 saved: 0.105 kg
   - Updates user total

4. **App displays:**
   - "You saved 0.105 kg CO2!"
   - "Total saved: 5.432 kg CO2"

5. **User wants to find centers:**
   - App gets GPS: (31.24, 75.64)
   - Calls: `POST /api/location/nearest`

6. **App shows:**
   - "Near The COS - 0.81 km away"
   - "Near Hostel A - 1.52 km away"
   - Display on map with markers

---

## 💡 Important Notes

1. **Category Names**: Must match exactly (case-insensitive)
2. **User ID**: Use a unique identifier for each user (UUID recommended)
3. **Coordinates**: Use device GPS for accurate location
4. **Units**: 
   - CO2 values in kilograms (kg)
   - Distance in kilometers (km)
   - Weight in kilograms (kg)
5. **Caching**: Consider caching user summary to reduce API calls
6. **Offline**: Queue scans when offline and sync when online

---

## 🚀 Quick Start Checklist

- [ ] API is live at: https://carbon-tracking-backend.onrender.com
- [ ] Test `/health` endpoint
- [ ] Test `/api/carbon/scan` with sample data
- [ ] Test `/api/carbon/summary/:userId`
- [ ] Test `/api/location/nearest` with coordinates
- [ ] Integrate with ML model output
- [ ] Handle errors gracefully
- [ ] Display CO2 savings to user
- [ ] Show nearest collection centers on map

---

## 📞 Support

If any endpoint returns an error:
1. Check the request format matches examples exactly
2. Verify category name is valid
3. Ensure Content-Type header is set to `application/json`
4. Check network connectivity
5. Verify coordinates are valid numbers

---

**API is live and ready to use!** 🎉

**Production URL:** https://carbon-tracking-backend.onrender.com
