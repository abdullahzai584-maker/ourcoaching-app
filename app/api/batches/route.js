import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Batch from "@/models/Batch";

export async function GET() {
  try {
    await connectDB();
    const batches = await Batch.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, batches });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const name = String(body.name || "").trim();
    if (!name) return NextResponse.json({ ok: false, error: "Batch name required hai" }, { status: 400 });
    const batch = await Batch.create({
      name,
      timing: String(body.timing || "16:00-17:30").trim(),
      monthlyFee: Number(body.monthlyFee) || 3500,
      minAttendance: Number(body.minAttendance) || 75,
    });
    return NextResponse.json({ ok: true, batch }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
