# API Endpoints for Frontend Developer

## Base URL
```
https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app
```

---

## 1. Record Waste Scan

**Endpoint:** `POST /api/carbon/scan`

**Full URL:** 
```
https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/api/carbon/scan
```

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

---

## 2. Get User Summary

**Endpoint:** `GET /api/carbon/summary/:userId`

**Full URL Example:** 
```
https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/api/carbon/summary/user123
```

**Response:**
```json
{
  "totalCo2Saved": 5.432,
  "weeklyCo2": 1.234,
  "pieChartData": [
    { "category": "plastic", "co2Saved": 2.1 },
    { "category": "metal", "co2Saved": 1.8 }
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

---

## 3. Find Nearest Waste Centers

**Endpoint:** `POST /api/location/nearest`

**Full URL:** 
```
https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/api/location/nearest
```

**Request Body:**
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
      "name": "Near Hostel A",
      "latitude": 31.2266,
      "longitude": 75.6411,
      "city": "Ludhiana",
      "country": "India",
      "distance_km": 1.52
    },
    {
      "name": "Near TAN",
      "latitude": 31.2141,
      "longitude": 75.6590,
      "city": "Ludhiana",
      "country": "India",
      "distance_km": 2.34
    }
  ]
}
```

---

## 4. Health Check

**Endpoint:** `GET /health`

**Full URL:** 
```
https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## Valid Waste Categories

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

## JavaScript Integration Example

```javascript
const API_BASE = 'https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app';

// 1. Record scan
async function recordScan(userId, category, quantity = 1) {
  const response = await fetch(`${API_BASE}/api/carbon/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, category, quantity })
  });
  return await response.json();
}

// 2. Get summary
async function getUserSummary(userId) {
  const response = await fetch(`${API_BASE}/api/carbon/summary/${userId}`);
  return await response.json();
}

// 3. Find nearest centers
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

const summary = await getUserSummary('user123');
console.log(`Total: ${summary.totalCo2Saved} kg`);

const centers = await getNearestCenters(31.24, 75.64, 5);
console.log(centers.nearestCenters);
```

---

## Android/Kotlin Integration Example

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

// Retrofit Instance
val retrofit = Retrofit.Builder()
    .baseUrl("https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val api = retrofit.create(WasteApi::class.java)

// Usage
lifecycleScope.launch {
    val result = api.recordScan(ScanRequest("user123", "plastic", 1))
    println("CO2 Saved: ${result.co2Saved} kg")
    
    val centers = api.getNearestCenters(LocationRequest(31.24, 75.64, 5))
    centers.nearestCenters.forEach { 
        println("${it.name} - ${it.distance_km} km")
    }
}
```

---

## React Native Example

```javascript
import axios from 'axios';

const API_BASE = 'https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app';

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

## Important Notes

1. **CORS**: Already enabled - frontend can call from any domain
2. **HTTPS**: All requests must use HTTPS (not HTTP)
3. **Content-Type**: Always set to `application/json` for POST requests
4. **User ID**: Use a unique identifier for each user (UUID recommended)
5. **Categories**: Must match exactly (case-insensitive)
6. **Coordinates**: Use device GPS for accurate location

---

## Test Commands (PowerShell)

```powershell
# Health check
Invoke-WebRequest -Uri https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/health

# Record scan
Invoke-WebRequest -Uri https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/api/carbon/scan -Method POST -ContentType "application/json" -Body '{"userId":"user123","category":"plastic","quantity":1}'

# Get summary
Invoke-WebRequest -Uri https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/api/carbon/summary/user123

# Find centers
Invoke-WebRequest -Uri https://bios-backend-9phi5yghf-jaskirat-singhs-projects-964ff5f0.vercel.app/api/location/nearest -Method POST -ContentType "application/json" -Body '{"latitude":31.24,"longitude":75.64,"limit":5}'
```

---

## Support

If any endpoint returns an error:
1. Check the request format matches exactly
2. Verify category name is valid
3. Ensure Content-Type header is set
4. Check network connectivity
5. Verify coordinates are valid numbers

---

**API is live and ready to use!** 🚀
