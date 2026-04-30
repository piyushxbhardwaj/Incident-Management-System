import { WorkItemContext } from "../services/workItemState.js";

async function runTests() {
  console.log("🧪 Running RCA Validation Tests...");

  const mockWorkItem = { status: "RESOLVED" };
  const validRca = { root_cause: "Bug in code", fix_applied: "Reverted commit" };
  const invalidRca = { root_cause: "Bug" };

  // Test 1: Valid transition to CLOSED
  try {
    const status = WorkItemContext.validateTransition(mockWorkItem, "CLOSED", validRca);
    if (status !== "CLOSED") throw new Error("Expected CLOSED status");
    console.log("✅ Test 1 Passed: Valid RCA accepted.");
  } catch (err) {
    console.error("❌ Test 1 Failed:", err.message);
  }

  // Test 2: Invalid transition to CLOSED (missing fields)
  try {
    WorkItemContext.validateTransition(mockWorkItem, "CLOSED", invalidRca);
    console.error("❌ Test 2 Failed: Accepted invalid RCA.");
  } catch (err) {
    if (err.message.includes("mandatory")) {
      console.log("✅ Test 2 Passed: Rejected incomplete RCA.");
    } else {
      console.error("❌ Test 2 Failed with wrong error:", err.message);
    }
  }

  // Test 3: Invalid state transition
  try {
    WorkItemContext.validateTransition({ status: "CLOSED" }, "INVESTIGATING", null);
    console.error("❌ Test 3 Failed: Allowed illegal transition from CLOSED to INVESTIGATING.");
  } catch (err) {
    console.log("✅ Test 3 Passed: Caught illegal state transition.");
  }
}

runTests();
