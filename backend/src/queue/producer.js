import { Queue } from "bullmq";
import IORedis from "ioredis";

// 🔥 Redis connection (FIX INCLUDED)
const connection = new IORedis({
  host: "localhost",
  port: 6379,
  maxRetriesPerRequest: null
});

// Create queue
const signalQueue = new Queue("signals", { connection });

// Function to add job to queue
export const enqueueSignal = async (signal) => {
  await signalQueue.add("signal-job", signal, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000
    }
  });
};