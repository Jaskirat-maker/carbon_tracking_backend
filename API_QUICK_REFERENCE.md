# API Quick Reference for Frontend Developer

## Base URL
```
http://localhost:3000
```

---

## 🔥 All Endpoints

### 1. Record Waste Scan
```
POST /api/carbon/scan
```

**Body:**
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
```
GET /api/carbon/summary/:userId
```

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

### 3. Find Nearest Waste Centers
```
POST /api/location/nearest
```

**Body:**
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

### 4. Health Check
```
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

## 📦 Valid Categories (from ML Model)

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

## 🗺️ Available Waste Collection Centers

1. **Near Hostel A**
2. **Near TAN**
3. **Near The COS**
4. **Near The Hostel PG**
5. **Near The Main Gate Parking**

---

## 🚀 Quick Integration Code

### JavaScript/React Example

```javascript
const API_BASE_URL = 'http://localhost:3000';

// 1. Record a scan
const recordScan = async (userId, category, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/api/carbon/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, category, quantity })
  });
  return await response.json();
};

// 2. Get user summary
const getUserSummary = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/api/carbon/summary/${userId}`);
  return await response.json();
};

// 3. Find nearest centers
const getNearestCenters = async (latitude, longitude, limit = 5) => {
  const response = await fetch(`${API_BASE_URL}/api/location/nearest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude, limit })
  });
  return await response.json();
};

// Usage Example
const handleScan = async () => {
  // After ML model detects waste
  const mlCategory = 'plastic'; // from ML model
  
  const result = await recordScan('user123', mlCategory, 1);
  console.log(`You saved ${result.co2Saved} kg CO2!`);
  console.log(`Total saved: ${result.totalCo2Saved} kg CO2`);
};

const showSummary = async () => {
  const summary = await getUserSummary('user123');
  console.log(`Total CO2: ${summary.totalCo2Saved} kg`);
  console.log(`This week: ${summary.weeklyCo2} kg`);
  // Use pieChartData for charts
  // Use recentEntries for history list
};

const findCenters = async () => {
  // Get user's GPS location
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    const centers = await getNearestCenters(latitude, longitude, 5);
    
    centers.nearestCenters.forEach(center => {
      console.log(`${center.name} - ${center.distance_km} km away`);
    });
  });
};
```

---

### Android/Kotlin Example

```kotlin
// Retrofit API Interface
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

// Usage
lifecycleScope.launch {
    // Record scan
    val result = api.recordScan(
        ScanRequest("user123", "plastic", 1)
    )
    println("CO2 Saved: ${result.co2Saved} kg")
    
    // Get nearest centers
    val centers = api.getNearestCenters(
        LocationRequest(31.24, 75.64, 5)
    )
    centers.nearestCenters.forEach { center ->
        println("${center.name} - ${center.distance_km} km")
    }
}
```

---

## ⚠️ Important Notes

1. **Category Names**: Must match exactly (case-insensitive)
2. **User ID**: Use a unique identifier for each user
3. **Coordinates**: Use device GPS for accurate location
4. **Units**: 
   - CO2 values in kilograms (kg)
   - Distance in kilometers (km)
   - Weight in kilograms (kg)

---

## 🧪 Test Commands

**PowerShell:**
```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:3000/health

# Record scan
Invoke-WebRequest -Uri http://localhost:3000/api/carbon/scan -Method POST -ContentType "application/json" -Body '{"userId":"user123","category":"plastic","quantity":1}'

# Get summary
Invoke-WebRequest -Uri http://localhost:3000/api/carbon/summary/user123

# Find centers
Invoke-WebRequest -Uri http://localhost:3000/api/location/nearest -Method POST -ContentType "application/json" -Body '{"latitude":31.24,"longitude":75.64,"limit":5}'
```

---

## 📊 Typical User Flow

1. User scans waste with camera
2. ML model returns category (e.g., "plastic")
3. App calls `POST /api/carbon/scan` with userId, category, quantity
4. Backend calculates CO2 saved and returns total
5. App displays: "You saved X kg CO2! Total: Y kg"
6. User can view summary with `GET /api/carbon/summary/:userId`
7. User can find nearest centers with `POST /api/location/nearest`

---

## 🎯 Key Features to Implement

- [ ] Scan waste and record CO2 savings
- [ ] Display total CO2 saved
- [ ] Show weekly CO2 savings
- [ ] Display pie chart of waste categories
- [ ] Show recent 20 scan history
- [ ] Find and display nearest waste centers on map
- [ ] Show distance to each center

---

## 💡 Pro Tips

1. Cache user summary to reduce API calls
2. Queue scans when offline, sync when online
3. Use loading states during API calls
4. Handle errors gracefully with user-friendly messages
5. Validate category before sending to API
6. Request location permission for nearest centers feature

---

Need help? Check `FRONTEND_API_GUIDE.md` for detailed documentation.
