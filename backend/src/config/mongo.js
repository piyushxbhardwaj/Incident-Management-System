import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/ims"); // ✅ FIX
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("MongoDB error:", err);
  }
};