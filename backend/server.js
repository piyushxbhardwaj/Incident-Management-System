import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import signalRoutes from "./src/controllers/signalController.js";
import workItemRoutes from "./src/controllers/workItemRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// 🚀 Rate Limiter for Ingestion
const ingestionLimiter = rateLimit({
  windowMs: 1000, // 1 second
  max: 10000,     // limit each IP to 10k signals per window
  message: "Too many signals from this IP, please try again later."
});

// ✅ THROUGHPUT METRICS
let signalCounter = 0;
app.use("/api/signals", (req, res, next) => {
  if (req.method === "POST") signalCounter++;
  next();
});

setInterval(() => {
  console.log(`[METRICS] Throughput: ${signalCounter / 5} signals/sec`);
  signalCounter = 0;
}, 5000);

app.use("/api/signals", ingestionLimiter, signalRoutes);

app.get("/api/stats", async (req, res) => {
  try {
    const { pool } = await import("./src/config/postgres.js");
    const result = await pool.query(
      "SELECT status, COUNT(*) as count FROM work_items GROUP BY status"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/work-items", workItemRoutes);


app.get("/health", (req, res) => {
  res.json({ status: "OK", throughput: "Logged to console" });
});

import { connectMongo } from "./src/config/mongo.js";
import { connectMongo as connectMongoWorker } from "./src/config/mongo.js"; // same config

connectMongo();

app.listen(5000, () => {
  console.log("IMS Backend running on port 5000");
});