import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    batchName: { type: String, required: true },
    records: [
      {
        studentId: { type: String, required: true },
        studentName: { type: String, required: true },
        status: { type: String, enum: ["P", "A", "L", "V"], default: "P" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
