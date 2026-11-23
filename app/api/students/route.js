import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function GET() {
  try {
    await connectDB();
    const students = await Student.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, students });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const name = String(body.name || "").trim();
    const feeAmount = Number(body.feeAmount);
    if (!name || Number.isNaN(feeAmount) || feeAmount < 0) {
      return NextResponse.json({ ok: false, error: "Valid student name aur feeAmount zaroori hai" }, { status: 400 });
    }
    const student = await Student.create({
      name,
      rollNo: String(body.rollNo || "").trim(),
      phone: String(body.phone || "").trim(),
      parentPhone: String(body.parentPhone || "").trim(),
      batchName: String(body.batchName || "General").trim(),
      feeAmount,
      feeStatus: body.feeStatus === "Paid" ? "Paid" : "Pending",
      paidMonth: body.feeStatus === "Paid" ? new Date().toISOString().slice(0, 7) : "",
    });
    return NextResponse.json({ ok: true, student }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
