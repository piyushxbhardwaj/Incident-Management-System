import { pool } from "../config/postgres.js";

// 🔥 Create new incident
export const createWorkItem = async (component_id) => {
  try {
    const result = await pool.query(
      `INSERT INTO work_items (component_id, status, start_time)
       VALUES ($1, 'OPEN', CURRENT_TIMESTAMP)
       RETURNING *`,
      [component_id]
    );

    return result.rows[0];

  } catch (err) {
    console.error("Postgres error:", err);
    throw err; // important so worker knows failure
  }
};