const mongoose = require('mongoose');

let cachedConnPromise = null;

/**
 * Establishes and caches a MongoDB connection across serverless invocations.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedConnPromise) {
    return cachedConnPromise;
  }

  let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  const isPlaceholder =
    !uri ||
    uri.includes('your_mongodb_atlas_connection_string') ||
    uri.startsWith('your_') ||
    uri.trim() === '';

  if (isPlaceholder) {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      throw new Error(
        'Cloud MongoDB URI is not configured. Please set MONGODB_URI in your deployment environment variables.'
      );
    }
    console.log('ℹ️  MongoDB Atlas URI is set to placeholder in server/.env.');
    console.log('⚡ Connecting to local MongoDB instance: mongodb://127.0.0.1:27017/hostel_allocation_system');
    uri = 'mongodb://127.0.0.1:27017/hostel_allocation_system';
  } else {
    console.log('🌐 Connecting to MongoDB Atlas cluster...');
  }

  cachedConnPromise = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 8000,
    })
    .then((conn) => {
      console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host} (Database: ${conn.connection.name})`);
      return conn;
    })
    .catch((error) => {
      cachedConnPromise = null;
      console.error(`❌ MongoDB Connection Error: ${error.message}`);
      throw error;
    });

  return cachedConnPromise;
};

const disconnectDB = async () => {
  try {
    cachedConnPromise = null;
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error disconnecting MongoDB:', err);
  }
};

module.exports = { connectDB, disconnectDB };
