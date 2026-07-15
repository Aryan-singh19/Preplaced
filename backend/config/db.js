const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/placemate_db', {
      // Configuration for optimal connections
      maxPoolSize: 10,     // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, 
      socketTimeoutMS: 45000, 
    });

    console.log(`✅ MongoDB Connected securely: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Warning: Error connecting to database: ${error.message}`);
    console.warn('The application will run with in-memory database fallback or mock features.');
  }
};

module.exports = connectDB;
