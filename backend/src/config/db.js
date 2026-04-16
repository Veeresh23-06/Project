const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri || uri.includes('yourUsername') || uri.includes('yourPassword')) {
      console.warn('⚠️  MONGO_URI not configured. Using in-memory mock database.');
      console.log('To use real MongoDB, update MONGO_URI in .env');
      return;
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB connected');
  } catch (error) {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.log('Proceeding with in-memory mock database...');
  }
};

module.exports = connectDB;
