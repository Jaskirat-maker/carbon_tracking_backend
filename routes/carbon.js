const express = require('express');
const router = express.Router();
const User = require('../models/User');
const CarbonEntry = require('../models/CarbonEntry');
const carbonTable = require('../carbonTable.json');

// POST /api/carbon/scan - Record a new scan
router.post('/scan', async (req, res) => {
  try {
    const { userId, category, quantity = 1 } = req.body;

    if (!userId || !category) {
      return res.status(400).json({ 
        error: 'userId and category are required' 
      });
    }

    // Look up emission factors
    const categoryData = carbonTable[category.toLowerCase()];
    if (!categoryData) {
      return res.status(400).json({ 
        error: `Unknown category: ${category}` 
      });
    }

    // Calculate carbon savings
    const totalWeight = categoryData.avg_weight * quantity;
    const co2Saved = totalWeight * categoryData.ef_recycle;

    // Create carbon entry
    const carbonEntry = new CarbonEntry({
      userId,
      category: category.toLowerCase(),
      quantity,
      totalWeight,
      co2Saved
    });
    await carbonEntry.save();

    // Update or create user
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ 
        userId, 
        name: req.body.name || '',
        totalCo2Saved: 0 
      });
    }
    user.totalCo2Saved += co2Saved;
    await user.save();

    res.json({
      success: true,
      co2Saved: parseFloat(co2Saved.toFixed(4)),
      totalCo2Saved: parseFloat(user.totalCo2Saved.toFixed(4)),
      entry: {
        category: carbonEntry.category,
        quantity: carbonEntry.quantity,
        totalWeight: parseFloat(totalWeight.toFixed(4)),
        timestamp: carbonEntry.timestamp
      }
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/carbon/summary/:userId - Get user summary
router.get('/summary/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user total
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate weekly CO2
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyEntries = await CarbonEntry.find({
      userId,
      timestamp: { $gte: oneWeekAgo }
    });

    const weeklyCo2 = weeklyEntries.reduce((sum, entry) => sum + entry.co2Saved, 0);

    // Get pie chart data (category breakdown)
    const allEntries = await CarbonEntry.find({ userId });
    const categoryTotals = {};
    
    allEntries.forEach(entry => {
      if (!categoryTotals[entry.category]) {
        categoryTotals[entry.category] = 0;
      }
      categoryTotals[entry.category] += entry.co2Saved;
    });

    const pieChartData = Object.keys(categoryTotals).map(category => ({
      category,
      co2Saved: parseFloat(categoryTotals[category].toFixed(4))
    }));

    // Get recent 20 entries
    const recentEntries = await CarbonEntry.find({ userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .select('category quantity totalWeight co2Saved timestamp');

    res.json({
      totalCo2Saved: parseFloat(user.totalCo2Saved.toFixed(4)),
      weeklyCo2: parseFloat(weeklyCo2.toFixed(4)),
      pieChartData,
      recentEntries: recentEntries.map(entry => ({
        category: entry.category,
        quantity: entry.quantity,
        totalWeight: parseFloat(entry.totalWeight.toFixed(4)),
        co2Saved: parseFloat(entry.co2Saved.toFixed(4)),
        timestamp: entry.timestamp
      }))
    });
  } catch (error) {
    console.error('Summary error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
