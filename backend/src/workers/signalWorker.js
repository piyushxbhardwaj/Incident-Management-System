import { connectMongo } from "../config/mongo.js";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import Signal from "../models/signalModel.js";
import { createWorkItem } from "../services/workItemService.js";
import { alertManager } from "../services/alertingStrategy.js";

await connectMongo();

const connection = new IORedis({ host: "localhost", port: 6379, maxRetriesPerRequest: null });
const redis = new IORedis({ host: "localhost", port: 6379 });

const worker = new Worker(
  "signals",
  async (job) => {
    const signal = job.data;

    try {
      // 1. Check for active work item for this component
      const activeKey = `active_incident:${signal.component_id}`;
      let workItemId = await redis.get(activeKey);

      if (!workItemId) {
        // 2. Debouncing logic: Count signals in 10s window
        const countKey = `count:${signal.component_id}`;
        const count = await redis.incr(countKey);
        
        if (count === 1) await redis.expire(countKey, 10);

        if (count >= 100) {
          // 3. Threshold reached -> Create Work Item
          const workItem = await createWorkItem(signal.component_id);
          workItemId = workItem.id;
          
          // Store active incident in Redis (expires after some time or manual clear)
          await redis.set(activeKey, workItemId, "EX", 3600); 
          await redis.del(countKey); // Reset count

          // 4. Alerting (Strategy Pattern)
          alertManager.alert(signal);
        }
      }

      // 5. Store signal in NoSQL and link to Work Item if exists
      await Signal.create({
        ...signal,
        work_item_id: workItemId ? parseInt(workItemId) : null
      });

    } catch (err) {
      console.error("❌ Worker error:", err);
    }
  },
  { 
    connection,
    settings: {
      backoffStrategies: {
        custom: (attemptsMade) => attemptsMade * 1000
      }
    }
  }
);


console.log("✅ IMS Signal Worker started...");