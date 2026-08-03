import express from "express";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./config/db.js";
import batchRoutes from "./routes/batchRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json({ limit: "2mb" }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Friendly root route so the base URL isn't a bare 404.
app.get("/", (req, res) =>
  res.json({
    service: "fruit-wine-compliance-api",
    status: "running",
    docs: "See /api/health and /api/batches",
  })
);

// Health check — must work even if the DB is down, so it comes BEFORE the gate.
app.get("/api/health", (req, res) =>
  res.json({
    status: "ok",
    service: "fruit-wine-compliance-api",
    time: new Date().toISOString(),
  })
);

// Ensure a (cached) DB connection before any data route. Required for
// serverless, where the app is imported without a startup listener.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Feature routes
app.use("/api/batches", batchRoutes);

// 404 + centralised error handler (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;