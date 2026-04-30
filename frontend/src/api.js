import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    Authorization: "Bearer MOCK_JWT_DASHBOARD_TOKEN"
  }
});


export const getIncidents = () => API.get("/work-items");
export const getSignals = (component_id) =>
  API.get(`/signals/${component_id}`);
export const updateStatus = (id, status, rca) =>
  API.put(`/work-items/${id}/status`, { status, rca });