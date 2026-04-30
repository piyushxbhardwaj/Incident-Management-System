import IORedis from "ioredis";

const redis = new IORedis({
  host: "localhost",   // 🔥 IMPORTANT FIX
  port: 6379
});

export default redis;