import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// MongoDB Configuration from .env file
const host = process.env.MONGO_HOST || 'localhost';
const port = process.env.MONGO_PORT || 27017;
const dbName = process.env.MONGO_DB || 'urlshortener';
const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const authDb = process.env.MONGO_AUTH_DB || 'admin';

// Construct the MongoDB connection string
let mongoURI = `mongodb://${host}:${port}/${dbName}`;

if (user && password) {
  mongoURI = `mongodb://${user}:${password}@${host}:${port}/${dbName}?authSource=${authDb}`;
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`MongoDB connected to ${dbName} at ${host}:${port}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
};

export default connectToDatabase;
