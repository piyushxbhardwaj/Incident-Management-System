import { config } from "../config/index.js";

export const apiKeyAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey && apiKey === process.env.INGESTION_API_KEY) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized: Invalid or missing API Key" });
};

export const mockJwtAuth = (req, res, next) => {
  // Simulating JWT check
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized: Valid Bearer token required" });
};
