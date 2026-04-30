import axios from "axios";

const API_URL = "http://localhost:5000/api/signals";

const components = [
  { id: "RDBMS_CLUSTER_01", severity: "P0", message: "Connection timeout on primary" },
  { id: "API_GATEWAY_NY", severity: "P1", message: "Latency spike > 500ms" },
  { id: "CACHE_REDIS_01", severity: "P2", message: "Memory usage > 85%" }
];

async function sendSignals(component, count) {
  console.log(`🚀 Sending ${count} signals for ${component.id}...`);
  for (let i = 0; i < count; i++) {
    try {
      await axios.post(API_URL, {
        component_id: component.id,
        severity: component.severity,
        message: `${component.message} - Instance ${i}`
      }, {
        headers: { "x-api-key": "IMS_SUPER_SECRET_KEY" }
      });

      if (i % 20 === 0) console.log(`  Sent ${i} signals...`);
    } catch (err) {
      console.error(`  ❌ Error at ${i}: ${err.message}`);
    }
  }
  console.log(`✅ Finished sending signals for ${component.id}`);
}

async function runMock() {
  console.log("🔥 Starting IMS Stress Test...");
  
  // 1. Simulate 120 signals for RDBMS (should create 1 Work Item)
  await sendSignals(components[0], 120);

  // 2. Wait 2 seconds
  console.log("Waiting 2s...");
  await new Promise(r => setTimeout(r, 2000));

  // 3. Simulate 50 signals for API Gateway (should NOT create Work Item yet, threshold is 100)
  await sendSignals(components[1], 50);

  // 4. Simulate another 60 signals for API Gateway (should cross 100 threshold and create Work Item)
  await sendSignals(components[1], 60);

  console.log("🏁 Stress test complete. Check the dashboard!");
}

runMock();
