import express from "express";
import { updateWorkItemStatus } from "./workItemController.js";
import { getMTTR } from "../services/workflowService.js";
import { pool } from "../config/postgres.js";

const router = express.Router();

// ✅ THIS IS REQUIRED
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM work_items ORDER BY start_time DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// update status
router.put("/:id/status", updateWorkItemStatus);

// Aggregations (Timeseries / Stats)
router.get("/stats", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT status, COUNT(*) as count FROM work_items GROUP BY status"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MTTR
router.get("/:id/mttr", async (req, res) => {

  try {
    const result = await getMTTR(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;