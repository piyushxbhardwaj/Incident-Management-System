import mongoose from "mongoose";

const signalSchema = new mongoose.Schema({
  component_id: String,
  severity: String,
  message: String,
  work_item_id: { type: Number, default: null }, // Linked Work Item ID
  created_at: { type: Date, default: Date.now }
});


export default mongoose.model("Signal", signalSchema);