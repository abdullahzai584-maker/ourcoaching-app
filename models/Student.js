import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNo: { type: String, default: "" },
    phone: { type: String, default: "" },
    parentPhone: { type: String, default: "" },
    batchName: { type: String, default: "General" },
    feeAmount: { type: Number, required: true, default: 3500 },
    feeStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
    paidMonth: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);
