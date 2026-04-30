import { useEffect, useState } from "react";
import axios from "axios";

const DashboardStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stats");

        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "20px", background: "#333", color: "white", padding: "15px", borderRadius: "8px" }}>
      <div><b>Total Incidents:</b> {stats.reduce((acc, curr) => acc + parseInt(curr.count), 0)}</div>
      {stats.map(s => (
        <div key={s.status}><b>{s.status}:</b> {s.count}</div>
      ))}
    </div>
  );
};

export default DashboardStats;
