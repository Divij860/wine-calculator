import FermentationLog from "../models/FermentationLog.js";
import Batch from "../models/Batch.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc   List logs for a batch
// @route  GET /api/batches/:batchId/logs
export const getLogs = asyncHandler(async (req, res) => {
  const logs = await FermentationLog.find({ batch: req.params.batchId }).sort({
    day: 1,
    createdAt: 1,
  });
  res.json(logs);
});

// @desc   Add a daily reading to a batch
// @route  POST /api/batches/:batchId/logs
export const addLog = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.batchId);
  if (!batch) {
    res.status(404);
    throw new Error("Batch not found");
  }
  const log = await FermentationLog.create({
    ...req.body,
    batch: req.params.batchId,
  });
  res.status(201).json(log);
});

// @desc   Delete a reading
// @route  DELETE /api/batches/:batchId/logs/:logId
export const deleteLog = asyncHandler(async (req, res) => {
  const log = await FermentationLog.findOneAndDelete({
    _id: req.params.logId,
    batch: req.params.batchId,
  });
  if (!log) {
    res.status(404);
    throw new Error("Log not found");
  }
  res.json({ message: "Log deleted", id: req.params.logId });
});
