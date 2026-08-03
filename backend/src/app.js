import express from "express";
import cors from "cors";
import morgan from "morgan";

import batchRoutes from "./routes/batchRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "2mb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Health check
app.get("/api/health", (req, res) =>
  res.json({
    status: "ok",
    service: "fruit-wine-compliance-api",
    time: new Date().toISOString(),
  })
);

// Feature routes
app.use("/api/batches", batchRoutes);

// 404 + centralised error handler (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
