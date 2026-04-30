import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  host: "localhost",   // ✅ FIXED
  port: 5432,
  user: "postgres",
  password: "postgres",
  database: "postgres"
});