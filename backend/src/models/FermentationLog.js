import mongoose from "mongoose";

const fermentationLogSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true,
    },
    day: { type: Number, default: null },
    date: { type: String, default: "" },
    brix: { type: Number, default: null },
    sg: { type: Number, default: null },
    ph: { type: Number, default: null },
    temperature: { type: Number, default: null },
    abv: { type: Number, default: null },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("FermentationLog", fermentationLogSchema);
