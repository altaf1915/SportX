import mongoose from "mongoose";

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required. Add your MongoDB Atlas connection string.");
  }

  mongoose.set("strictQuery", true);
  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    autoIndex: process.env.NODE_ENV !== "production"
  });
  console.log(`MongoDB connected: ${connection.connection.host}`);
}
