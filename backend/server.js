import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// On Vercel / AWS Lambda the platform imports this module and invokes the
// exported app per-request — it must NOT open its own port listener there.
const isServerless = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
);

if (!isServerless) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() =>
      app.listen(PORT, () =>
        console.log(`🍷  API running on http://localhost:${PORT}`)
      )
    )
    .catch((err) => {
      console.error("❌  Startup failed:", err.message);
      process.exit(1);
    });
}

// Vercel/Lambda entry point:
export default app;
