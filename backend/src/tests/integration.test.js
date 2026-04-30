import axios from "axios";
import { pool } from "../config/postgres.js";

const API_URL = "http://localhost:5000/api/signals";
const API_KEY = "IMS_SUPER_SECRET_KEY";

async function runIntegrationTest() {
  console.log("🧪 Running Full Integration Test...");

  const componentId = `TEST_COMP_${Date.now()}`;

  // 1. Send 105 signals (cross the 100 threshold)
  console.log(`📡 Sending 105 signals for ${componentId}...`);
  for (let i = 0; i < 105; i++) {
    await axios.post(API_URL, {
      component_id: componentId,
      severity: "P0",
      message: "Test signal"
    }, {
      headers: { "x-api-key": API_KEY }
    });
  }

  // 2. Wait for worker to process
  console.log("⏳ Waiting 5s for async processing...");
  await new Promise(r => setTimeout(r, 5000));

  // 3. Verify Work Item in Postgres
  console.log("🔎 Verifying Work Item in DB...");
  const res = await pool.query("SELECT * FROM work_items WHERE component_id = $1", [componentId]);
  
  if (res.rowCount > 0) {
    console.log("✅ SUCCESS: Work Item created correctly.");
    console.log(`   Incident ID: ${res.rows[0].id}, Status: ${res.rows[0].status}`);
  } else {
    console.error("❌ FAILURE: Work Item was not created.");
    process.exit(1);
  }

  await pool.end();
}

runIntegrationTest();
