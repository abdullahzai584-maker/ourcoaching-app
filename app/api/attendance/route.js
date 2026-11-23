import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const batchName = searchParams.get("batchName");
    const query = {};
    if (date) query.date = date;
    if (batchName) query.batchName = batchName;
    const items = await Attendance.find(query).sort({ date: -1 }).lean();
    return NextResponse.json({ ok: true, attendance: items });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const date = String(body.date || "").trim();
    const batchName = String(body.batchName || "").trim();
    const records = Array.isArray(body.records) ? body.records : [];
    if (!date || !batchName) {
      return NextResponse.json({ ok: false, error: "Date aur batchName zaroori hai" }, { status: 400 });
    }
    const saved = await Attendance.findOneAndUpdate(
      { date, batchName },
      { date, batchName, records },
      { upsert: true, new: true }
    );
    return NextResponse.json({ ok: true, attendance: saved }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
