require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../../models/User');
const CarbonEntry = require('../../models/CarbonEntry');

const sampleUsers = [
  {
    userId: 'user001',
    totalCo2Saved: 15.5,
    entries: [
      { category: 'plastic', quantity: 5, totalWeight: 0.25, co2Saved: 0.525 },
      { category: 'aluminum', quantity: 10, totalWeight: 0.15, co2Saved: 1.35 },
      { category: 'paper', quantity: 20, totalWeight: 0.2, co2Saved: 0.18 },
      { category: 'glass', quantity: 3, totalWeight: 0.6, co2Saved: 0.18 },
      { category: 'cardboard', quantity: 8, totalWeight: 0.24, co2Saved: 0.168 }
    ]
  },
  {
    userId: 'user002',
    totalCo2Saved: 22.8,
    entries: [
      { category: 'metal', quantity: 4, totalWeight: 0.4, co2Saved: 2.2 },
      { category: 'plastic', quantity: 15, totalWeight: 0.75, co2Saved: 1.575 },
      { category: 'battery', quantity: 6, totalWeight: 0.12, co2Saved: 0.18 },
      { category: 'clothes', quantity: 2, totalWeight: 1.0, co2Saved: 1.2 }
    ]
  },
  {
    userId: 'user003',
    totalCo2Saved: 8.9,
    entries: [
      { category: 'biological', quantity: 10, totalWeight: 1.5, co2Saved: 0.6 },
      { category: 'paper', quantity: 30, totalWeight: 0.3, co2Saved: 0.27 },
      { category: 'cardboard', quantity: 12, totalWeight: 0.36, co2Saved: 0.252 }
    ]
  },
  {
    userId: 'user004',
    totalCo2Saved: 31.2,
    entries: [
      { category: 'aluminum', quantity: 25, totalWeight: 0.375, co2Saved: 3.375 },
      { category: 'metal', quantity: 8, totalWeight: 0.8, co2Saved: 4.4 },
      { category: 'plastic', quantity: 20, totalWeight: 1.0, co2Saved: 2.1 },
      { category: 'glass', quantity: 10, totalWeight: 2.0, co2Saved: 0.6 }
    ]
  },
  {
    userId: 'user005',
    totalCo2Saved: 12.4,
    entries: [
      { category: 'shoes', quantity: 3, totalWeight: 1.2, co2Saved: 1.2 },
      { category: 'clothes', quantity: 4, totalWeight: 2.0, co2Saved: 2.4 },
      { category: 'plastic', quantity: 8, totalWeight: 0.4, co2Saved: 0.84 }
    ]
  }
];

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await CarbonEntry.deleteMany({});
    console.log('Cleared existing user data');

    // Insert sample users and entries
    for (const userData of sampleUsers) {
      // Create user
      const user = new User({
        userId: userData.userId,
        totalCo2Saved: userData.totalCo2Saved
      });
      await user.save();
      console.log(`Created user: ${userData.userId}`);

      // Create entries for this user
      for (const entry of userData.entries) {
        const carbonEntry = new CarbonEntry({
          userId: userData.userId,
          category: entry.category,
          quantity: entry.quantity,
          totalWeight: entry.totalWeight,
          co2Saved: entry.co2Saved,
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random time in last 7 days
        });
        await carbonEntry.save();
      }
      console.log(`Created ${userData.entries.length} entries for ${userData.userId}`);
    }

    console.log('\n✅ Successfully seeded 5 users with sample data!');
    console.log('\nSample User IDs:');
    console.log('- user001 (15.5 kg CO2)');
    console.log('- user002 (22.8 kg CO2)');
    console.log('- user003 (8.9 kg CO2)');
    console.log('- user004 (31.2 kg CO2)');
    console.log('- user005 (12.4 kg CO2)');

    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
