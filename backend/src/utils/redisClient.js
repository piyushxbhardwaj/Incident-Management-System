import Redis from "ioredis";
import { config } from "../config/index.js";

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

export default redis;