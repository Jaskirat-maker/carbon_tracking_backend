const Center = require('../models/Center');
const { calculateDistance } = require('../utils/distance');

exports.getNearest = async (req, res) => {
  try {
    const { latitude, longitude, limit = 5 } = req.body;

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude must be valid numbers'
      });
    }

    const centers = await Center.find().lean();

    const centersWithDistance = centers.map(center => ({
      name: center.name,
      latitude: center.latitude,
      longitude: center.longitude,
      city: center.city,
      country: center.country,
      distance_km: parseFloat(calculateDistance(latitude, longitude, center.latitude, center.longitude).toFixed(2))
    }));

    centersWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    const nearestCenters = centersWithDistance.slice(0, limit);

    res.json({
      success: true,
      nearestCenters
    });
  } catch (error) {
    console.error('Error fetching nearest centers:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
