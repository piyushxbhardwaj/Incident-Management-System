import { useEffect, useState } from "react";
import { getIncidents } from "../api";

const IncidentList = ({ onSelect }) => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    const res = await getIncidents();
    // Sort by Severity: P0 -> P1 -> P2
    const sorted = [...res.data].sort((a, b) => {
      const priority = { P0: 0, P1: 1, P2: 2 };
      return (priority[a.severity] || 2) - (priority[b.severity] || 2);
    });
    setIncidents(sorted);
  };

  const getSeverityColor = (sev) => {
    if (sev === "P0") return "#f44336";
    if (sev === "P1") return "#ff9800";
    return "#2196f3";
  };

  return (
    <div>
      <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        🚨 Live Incident Feed
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {incidents.length > 0 ? incidents.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              borderLeft: `5px solid ${getSeverityColor(item.severity)}`,
              background: "white",
              padding: "15px",
              borderRadius: "4px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = "translateX(5px)"}
            onMouseOut={(e) => e.currentTarget.style.transform = "translateX(0)"}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <b style={{ fontSize: "16px" }}>{item.component_id}</b>
              <span style={{ 
                background: getSeverityColor(item.severity), 
                color: "white", 
                padding: "2px 8px", 
                borderRadius: "10px",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                {item.severity || "P2"}
              </span>
            </div>
            <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
              Status: <b>{item.status}</b> | Started: {new Date(item.start_time).toLocaleTimeString()}
            </div>
          </div>
        )) : <p>No active incidents.</p>}
      </div>
    </div>
  );
};


export default IncidentList;