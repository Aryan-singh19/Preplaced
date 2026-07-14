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
    console.error(`❌ Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
