import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("⚠️  MONGODB_URI is not defined in environment variables. Falling back to local/in-memory mode.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.warn("⚠️  The application will continue running with resilient fallback authentication handling.");
  }
};

export default connectDB;
