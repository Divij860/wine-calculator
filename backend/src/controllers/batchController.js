import Batch from "../models/Batch.js";
import FermentationLog from "../models/FermentationLog.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// @desc   List all batches (summary fields only)
// @route  GET /api/batches
export const getBatches = asyncHandler(async (req, res) => {
  const batches = await Batch.find()
    .sort({ updatedAt: -1 })
    .select("product fruit lot day updatedAt createdAt");
  res.json(batches);
});

// @desc   Get a single batch (full document)
// @route  GET /api/batches/:id
export const getBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findById(req.params.id);
  if (!batch) {
    res.status(404);
    throw new Error("Batch not found");
  }
  res.json(batch);
});

// @desc   Create a batch
// @route  POST /api/batches
export const createBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.create(req.body);
  res.status(201).json(batch);
});

// @desc   Update a batch (full upsert of editable fields)
// @route  PUT /api/batches/:id
export const updateBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!batch) {
    res.status(404);
    throw new Error("Batch not found");
  }
  res.json(batch);
});

// @desc   Delete a batch and its fermentation logs
// @route  DELETE /api/batches/:id
export const deleteBatch = asyncHandler(async (req, res) => {
  const batch = await Batch.findByIdAndDelete(req.params.id);
  if (!batch) {
    res.status(404);
    throw new Error("Batch not found");
  }
  await FermentationLog.deleteMany({ batch: req.params.id });
  res.json({ message: "Batch and associated logs deleted", id: req.params.id });
});
