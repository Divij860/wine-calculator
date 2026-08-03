import mongoose from "mongoose";

/** One cell of the compliance matrix (embedded, keyed by parameter id). */
const matrixEntrySchema = new mongoose.Schema(
  {
    value: { type: String, default: "" },
    dataStatus: { type: String, enum: ["Measured", "Predicted", ""], default: "" },
    confidence: { type: Number, default: null },
    source: { type: String, default: "" },
  },
  { _id: false }
);

/** Editable statutory limit for a parameter (embedded, keyed by parameter id). */
const limitSchema = new mongoose.Schema(
  {
    min: { type: Number, default: null },
    max: { type: Number, default: null },
  },
  { _id: false }
);

const batchSchema = new mongoose.Schema(
  {
    product: { type: String, required: [true, "Product name is required"], trim: true },
    fruit: { type: String, default: "", trim: true },
    lot: { type: String, default: "", trim: true, index: true },
    startDate: { type: String, default: "" },
    day: { type: String, default: "" },
    analyst: { type: String, default: "" },
    notes: { type: String, default: "" },

    // Flexible key/value maps keyed by the 16 parameter ids.
    matrix: { type: Map, of: matrixEntrySchema, default: {} },
    limits: { type: Map, of: limitSchema, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Batch", batchSchema);
