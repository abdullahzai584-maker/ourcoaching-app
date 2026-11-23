import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";

export async function PATCH(request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const body = await request.json();
    const updateFields = {};
    if (body.feeStatus === "Paid" || body.feeStatus === "Pending") {
      updateFields.feeStatus = body.feeStatus;
      updateFields.paidMonth = body.feeStatus === "Paid" ? new Date().toISOString().slice(0, 7) : "";
    }
    if (body.feeAmount !== undefined && !Number.isNaN(Number(body.feeAmount))) {
      updateFields.feeAmount = Number(body.feeAmount);
    }
    if (body.name !== undefined) updateFields.name = String(body.name).trim();
    if (body.batchName !== undefined) updateFields.batchName = String(body.batchName).trim();
    const updated = await Student.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updated) return NextResponse.json({ ok: false, error: "Student nahi mila" }, { status: 404 });
    return NextResponse.json({ ok: true, student: updated });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(_request, context) {
  try {
    await connectDB();
    const { id } = await context.params;
    const deleted = await Student.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ ok: false, error: "Student nahi mila" }, { status: 404 });
    return NextResponse.json({ ok: true, message: "Student deleted" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
