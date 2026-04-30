import { useState } from "react";
import IncidentList from "./components/IncidentList";
import IncidentDetail from "./components/IncidentDetail";
import DashboardStats from "./components/DashboardStats";

function App() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ padding: "20px" }}>
      <DashboardStats />
      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ width: "40%" }}>
          <IncidentList onSelect={setSelected} />
        </div>

        <div style={{ width: "60%" }}>
          {selected && <IncidentDetail incident={selected} />}
        </div>
      </div>
    </div>
  );
}


export default App;