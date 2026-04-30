import mongoose from "mongoose";
import { config } from "./index.js";

export const connectMongo = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
};