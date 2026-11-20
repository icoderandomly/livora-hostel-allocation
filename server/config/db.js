const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    // Check if user has provided an actual MongoDB Atlas connection string
    const isPlaceholder =
      !uri ||
      uri.includes('your_mongodb_atlas_connection_string') ||
      uri.startsWith('your_') ||
      uri.trim() === '';

    if (isPlaceholder) {
      console.log('ℹ️  MongoDB Atlas URI is set to placeholder in server/.env.');
      console.log('⚡ Connecting to active MongoDB instance: mongodb://127.0.0.1:27017/hostel_allocation_system');
      console.log('💡 To switch to your MongoDB Atlas Cloud database:');
      console.log('   1. Open server/.env');
      console.log('   2. Set MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hostel_db?retryWrites=true&w=majority');
      uri = 'mongodb://127.0.0.1:27017/hostel_allocation_system';
    } else {
      console.log('🌐 Connecting to MongoDB Atlas cluster...');
    }

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('Please verify your MONGODB_URI in server/.env or ensure MongoDB service is running.');
    throw error;
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
