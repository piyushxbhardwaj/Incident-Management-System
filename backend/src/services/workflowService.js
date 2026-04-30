import { pool } from "../config/postgres.js";
import { WorkItemContext } from "./workItemState.js";

// 🔥 Update status
export const updateStatus = async (id, status, rca = null) => {
  // 1. Fetch current work item to check state
  const currentResult = await pool.query("SELECT * FROM work_items WHERE id = $1", [id]);
  if (currentResult.rows.length === 0) {
    throw new Error("Work Item not found");
  }
  const workItem = currentResult.rows[0];

  // 2. Validate transition using State Pattern
  WorkItemContext.validateTransition(workItem, status, rca);

  // 3. Perform update
  let query;
  let values;

  if (status === "CLOSED") {
    query = `
      UPDATE work_items
      SET status = $1, rca = $2, end_time = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *;
    `;
    values = [status, rca, id];
  } else {
    query = `
      UPDATE work_items
      SET status = $1
      WHERE id = $2
      RETURNING *;
    `;
    values = [status, id];
  }

  const result = await pool.query(query, values);
  return result.rows[0];
};

// 🔥 MTTR function
export const getMTTR = async (id) => {
  const result = await pool.query(
    `SELECT EXTRACT(EPOCH FROM (end_time - start_time)) AS mttr 
     FROM work_items WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};