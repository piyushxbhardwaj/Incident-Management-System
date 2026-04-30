import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import { config } from "./src/config/index.js";
import { connectMongo } from "./src/config/mongo.js";
import { pool } from "./src/config/postgres.js";
import redis from "./src/utils/redisClient.js";
import { logger } from "./src/utils/logger.js";

import signalRoutes from "./src/controllers/signalController.js";

import workItemRoutes from "./src/controllers/workItemRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// 🚀 Rate Limiter for Ingestion
const ingestionLimiter = rateLimit({
  windowMs: 1000,
  max: 10000,
  message: "Too many signals from this IP, please try again later."
});

// ✅ THROUGHPUT METRICS
let signalCounter = 0;
app.use("/api/signals", (req, res, next) => {
  if (req.method === "POST") signalCounter++;
  next();
});

setInterval(() => {
  logger.info("Ingestion metrics", { throughput_per_sec: signalCounter / 5 });
  signalCounter = 0;
}, 5000);


app.use("/api/signals", ingestionLimiter, signalRoutes);

app.get("/api/stats", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT status, COUNT(*) as count FROM work_items GROUP BY status"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use("/api/work-items", workItemRoutes);

app.get("/health", async (req, res) => {
  try {
    const status = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      checks: {
        mongodb: mongoose.connection.readyState === 1 ? "UP" : "DOWN",
        postgres: (await pool.query("SELECT 1")).rowCount === 1 ? "UP" : "DOWN",
        redis: (await redis.ping()) === "PONG" ? "UP" : "DOWN",
      }
    };
    const isHealthy = Object.values(status.checks).every(s => s === "UP");
    res.status(isHealthy ? 200 : 503).json(status);
  } catch (err) {
    res.status(503).json({ status: "DOWN", error: err.message });
  }
});

connectMongo();

app.listen(config.port, () => {
  console.log(`IMS Backend running on port ${config.port}`);
});