import express from "express";
import {
  getBatches,
  getBatch,
  createBatch,
  updateBatch,
  deleteBatch,
} from "../controllers/batchController.js";
import validateObjectId from "../middlewares/validateObjectId.js";
import logRoutes from "./logRoutes.js";

const router = express.Router();

// Nested fermentation-log routes: /api/batches/:batchId/logs
router.use("/:batchId/logs", validateObjectId("batchId"), logRoutes);

router.route("/").get(getBatches).post(createBatch);

router
  .route("/:id")
  .get(validateObjectId(), getBatch)
  .put(validateObjectId(), updateBatch)
  .delete(validateObjectId(), deleteBatch);

export default router;
