import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Batch from "../models/Batch.js";
import FermentationLog from "../models/FermentationLog.js";

// Default limits mirror the frontend's src/lib/limits.js starter values.
const defaultLimits = {
  ethylAlcohol: { min: 8, max: 15 },
  volatileAcid: { min: null, max: 1.5 },
  arsenic: { min: null, max: 0.2 },
  copper: { min: null, max: 5 },
  lead: { min: null, max: 0.2 },
  cadmium: { min: null, max: 1.5 },
  ochratoxin: { min: null, max: 2 },
  totalSO2: { min: null, max: 200 },
};

const run = async () => {
  try {
    await connectDB();
    await Batch.deleteMany({ lot: "CW-2026-001" });

    const batch = await Batch.create({
      product: "Carrot Wine — Batch CW-001",
      fruit: "Carrot (Daucus carota)",
      lot: "CW-2026-001",
      startDate: "2026-07-01",
      day: "9",
      analyst: "QC Lab",
      notes: "Sample seeded batch. EC-1118 yeast, 22°Bx start must.",
      matrix: {
        ethylAlcohol: {
          value: "8.50",
          dataStatus: "Measured",
          confidence: 100,
          source: "Calculated from OG/FG (hydrometer)",
        },
        volatileAcid: {
          value: "0.42",
          dataStatus: "Measured",
          confidence: 100,
          source: "Steam distillation + titration",
        },
      },
      limits: defaultLimits,
    });

    const days = [
      { day: 0, brix: 22, sg: 1.092, ph: 4.1, temperature: 24, abv: 0 },
      { day: 3, brix: 16, sg: 1.066, ph: 3.9, temperature: 25, abv: 3.3 },
      { day: 6, brix: 10, sg: 1.038, ph: 3.7, temperature: 25, abv: 6.6 },
      { day: 9, brix: 6, sg: 1.02, ph: 3.6, temperature: 24, abv: 8.5 },
    ];
    await FermentationLog.insertMany(days.map((d) => ({ ...d, batch: batch._id })));

    console.log(`🌱  Seeded batch ${batch._id} with ${days.length} logs.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

run();
