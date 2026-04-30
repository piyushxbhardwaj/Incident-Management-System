import { useEffect, useState } from "react";
import { getSignals, updateStatus } from "../api";
import { toast } from "react-hot-toast";


const IncidentDetail = ({ incident }) => {
  const [signals, setSignals] = useState([]);
  const [rca, setRca] = useState({
    category: "Software Bug",
    root_cause: "",
    fix_applied: "",
    prevention_steps: "",
    incident_start: incident.start_time ? new Date(incident.start_time).toISOString().slice(0, 16) : "",
    incident_end: new Date().toISOString().slice(0, 16)
  });


  useEffect(() => {
    loadSignals();
  }, [incident]);

  const loadSignals = async () => {
    try {
      const res = await getSignals(incident.component_id);
      setSignals(res.data);
    } catch (err) {
      toast.error("Failed to load raw signals");
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateStatus(incident.id, newStatus, newStatus === "CLOSED" ? rca : null);
      toast.success(`Incident status updated to ${newStatus}!`);
      setTimeout(() => window.location.reload(), 1000); 
    } catch (err) {
      toast.error(err.response?.data?.error || "Error updating status");
    }
  };


  const handleRcaChange = (field, value) => {
    setRca(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
      <h2>📄 Incident Detail: {incident.component_id}</h2>
      <div style={{ marginBottom: "20px" }}>
        <p><b>Status:</b> <span style={{ color: incident.status === "OPEN" ? "red" : "orange" }}>{incident.status}</span></p>
        <p><b>Severity:</b> {incident.severity || "P2"}</p>
        <p><b>Started:</b> {new Date(incident.start_time).toLocaleString()}</p>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => handleUpdateStatus("INVESTIGATING")}>Start Investigating</button>
        <button onClick={() => handleUpdateStatus("RESOLVED")}>Mark Resolved</button>
      </div>

      <h3>📊 Raw Signals (from NoSQL)</h3>
      <div style={{ maxHeight: "200px", overflowY: "auto", background: "#eee", padding: "10px", borderRadius: "4px" }}>
        {signals.length > 0 ? signals.map((s, i) => (
          <div key={i} style={{ fontSize: "12px", borderBottom: "1px solid #ccc", padding: "4px 0" }}>
            [{new Date(s.created_at).toLocaleTimeString()}] <b>{s.severity}</b>: {s.message}
          </div>
        )) : <p>No signals found.</p>}
      </div>

      <hr />

      <h3>🧠 Mandatory RCA Form</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <label style={{ flex: 1 }}>
            <b>Incident Start:</b><br />
            <input 
              type="datetime-local" 
              value={rca.incident_start} 
              onChange={(e) => handleRcaChange("incident_start", e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
          <label style={{ flex: 1 }}>
            <b>Incident End:</b><br />
            <input 
              type="datetime-local" 
              value={rca.incident_end} 
              onChange={(e) => handleRcaChange("incident_end", e.target.value)}
              style={{ width: "100%", padding: "8px" }}
            />
          </label>
        </div>

        <label>

          <b>Root Cause Category:</b><br />
          <select 
            value={rca.category} 
            onChange={(e) => handleRcaChange("category", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option>Software Bug</option>
            <option>Infrastructure Failure</option>
            <option>Human Error</option>
            <option>Capacity/Scaling</option>
            <option>Third Party Issue</option>
          </select>
        </label>

        <label>
          <b>Detailed Root Cause:</b><br />
          <textarea
            value={rca.root_cause}
            onChange={(e) => handleRcaChange("root_cause", e.target.value)}
            placeholder="Explain what exactly went wrong..."
            style={{ width: "100%", height: "60px", padding: "8px" }}
          />
        </label>

        <label>
          <b>Fix Applied:</b><br />
          <textarea
            value={rca.fix_applied}
            onChange={(e) => handleRcaChange("fix_applied", e.target.value)}
            placeholder="How was it fixed?"
            style={{ width: "100%", height: "60px", padding: "8px" }}
          />
        </label>

        <label>
          <b>Prevention Steps:</b><br />
          <textarea
            value={rca.prevention_steps}
            onChange={(e) => handleRcaChange("prevention_steps", e.target.value)}
            placeholder="How to prevent this in future?"
            style={{ width: "100%", height: "60px", padding: "8px" }}
          />
        </label>

        <button 
          onClick={() => handleUpdateStatus("CLOSED")}
          style={{ background: "#d32f2f", color: "white", padding: "10px", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          ✅ Submit RCA & Close Incident
        </button>
      </div>
    </div>
  );
};

export default IncidentDetail;