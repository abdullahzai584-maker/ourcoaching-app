import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    timing: { type: String, default: "16:00-17:30" },
    monthlyFee: { type: Number, default: 3500 },
    minAttendance: { type: Number, default: 75 },
  },
  { timestamps: true }
);

export default mongoose.models.Batch || mongoose.model("Batch", BatchSchema);
