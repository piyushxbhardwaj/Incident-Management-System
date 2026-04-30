import { updateStatus } from "../services/workflowService.js";

export const updateWorkItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rca } = req.body;

    const result = await updateStatus(id, status, rca);

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};