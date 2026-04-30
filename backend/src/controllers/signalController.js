import express from "express";
import { enqueueSignal } from "../queue/producer.js";

const router = express.Router();

import Signal from "../models/signalModel.js";

router.post("/", async (req, res) => {
  const signal = req.body;

  await enqueueSignal(signal);

  res.json({
    message: "Signal queued successfully",
    data: signal
  });
});

router.get("/:component_id", async (req, res) => {
  try {
    const signals = await Signal.find({ 
      component_id: req.params.component_id 
    }).sort({ created_at: -1 }).limit(100);
    
    res.json(signals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;