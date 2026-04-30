import pkg from "pg";
const { Pool } = pkg;
import { config } from "./index.js";

export const pool = new Pool({
  host: config.postgres.host,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  port: 5432,
});