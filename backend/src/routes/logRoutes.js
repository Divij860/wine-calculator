import express from "express";
import { getLogs, addLog, deleteLog } from "../controllers/logController.js";
import validateObjectId from "../middlewares/validateObjectId.js";

// mergeParams lets this nested router read :batchId from the parent.
const router = express.Router({ mergeParams: true });

router.route("/").get(getLogs).post(addLog);
router.route("/:logId").delete(validateObjectId("logId"), deleteLog);

export default router;
