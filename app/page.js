"use client";

import { useEffect, useState } from "react";

export default function CoachingPortalPage() {
  const [tab, setTab] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [batchName, setBatchName] = useState("Matric Science");
  const [feeAmount, setFeeAmount] = useState("3500");

  const [newBatchName, setNewBatchName] = useState("");
  const [newBatchTiming, setNewBatchTiming] = useState("16:00–17:30");
  const [newBatchFee, setNewBatchFee] = useState("3500");

  const todayStr = new Date().toISOString().slice(0, 10);
  const [attDate, setAttDate] = useState(todayStr);
  const [attBatch, setAttBatch] = useState("Matric Science");
  const [attMap, setAttMap] = useState({});

  async function loadAllData() {
    setLoading(true);
    try {
      const [sRes, bRes] = await Promise.all([
        fetch("/api/students", { cache: "no-store" }),
        fetch("/api/batches", { cache: "no-store" }),
      ]);
      const sJson = await sRes.json();
      const bJson = await bRes.json();
      if (sJson.ok) setStudents(sJson.students || []);
      if (bJson.ok) {
        const list = bJson.batches || [];
        setBatches(list);
        if (list.length > 0) {
          setBatchName((prev) => prev || list[0].name);
          setAttBatch((prev) => prev || list[0].name);
        }
      }
    } catch (err) {
      setStatusMsg("Data load error: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  async function handleAddStudent(e) {
    e.preventDefault();
    setStatusMsg("");
    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        rollNo,
        phone,
        parentPhone,
        batchName,
        feeAmount: Number(feeAmount),
        feeStatus: "Pending",
      }),
    });
    const json = await res.json();
    if (!json.ok) {
      setStatusMsg("Error: " + json.error);
      return;
    }
    setName("");
    setRollNo("");
    setPhone("");
    setParentPhone("");
    setStatusMsg("Student MongoDB mein save ho gaya!");
    await loadAllData();
  }

  async function toggleFeeStatus(student) {
    const nextStatus = student.feeStatus === "Paid" ? "Pending" : "Paid";
    const res = await fetch(`/api/students/${student._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feeStatus: nextStatus }),
    });
    const json = await res.json();
    if (json.ok) {
      setStatusMsg(`${student.name} ki fee ${nextStatus} mark ho gayi.`);
      await loadAllData();
    }
  }

  async function handleDeleteStudent(id) {
    const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.ok) {
      setStatusMsg("Student delete ho gaya.");
      await loadAllData();
    }
  }

  async function handleAddBatch(e) {
    e.preventDefault();
    const res = await fetch("/api/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newBatchName,
        timing: newBatchTiming,
        monthlyFee: Number(newBatchFee),
      }),
    });
    const json = await res.json();
    if (json.ok) {
      setNewBatchName("");
      setStatusMsg("Naya batch save ho gaya!");
      await loadAllData();
    }
  }

  async function handleSaveAttendance() {
    const batchStudents = students.filter((s) => s.batchName === attBatch);
    const records = batchStudents.map((s) => ({
      studentId: s._id,
      studentName: s.name,
      status: attMap[s._id] || "P",
    }));
    const res = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: attDate,
        batchName: attBatch,
        records,
      }),
    });
    const json = await res.json();
    if (json.ok) {
      setStatusMsg(`Attendance (${attBatch} - ${attDate}) save ho gayi!`);
    }
  }

  const totalStudents = students.length;
  const paidCount = students.filter((s) => s.feeStatus === "Paid").length;
  const pendingCount = students.filter((s) => s.feeStatus !== "Paid").length;
  const collectedFee = students
    .filter((s) => s.feeStatus === "Paid")
    .reduce((sum, s) => sum + Number(s.feeAmount || 0), 0);
  const pendingFee = students
    .filter((s) => s.feeStatus !== "Paid")
    .reduce((sum, s) => sum + Number(s.feeAmount || 0), 0);

  return (
    <div style={{ maxWidth: 1050, margin: "0 auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>OurCoaching Portal (Next.js + MongoDB)</h1>
      <p style={{ color: "#64748b" }}>Students, Batches, Attendance &amp; Fees Management</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setTab("dashboard")}>Dashboard</button>
        <button onClick={() => setTab("students")}>Students &amp; Fees</button>
        <button onClick={() => setTab("attendance")}>Attendance</button>
        <button onClick={() => setTab("batches")}>Batches</button>
      </div>

      {statusMsg && (
        <div style={{ padding: 10, marginBottom: 14, background: "#eef2ff", borderRadius: 8 }}>
          {statusMsg}
        </div>
      )}

      {loading ? (
        <p>Loading MongoDB data...</p>
      ) : tab === "dashboard" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 14 }}>
            <div>Total Students</div>
            <b style={{ fontSize: 22 }}>{totalStudents}</b>
          </div>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 14 }}>
            <div>Paid Students</div>
            <b style={{ fontSize: 22 }}>{paidCount}</b>
          </div>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 14 }}>
            <div>Pending Students</div>
            <b style={{ fontSize: 22 }}>{pendingCount}</b>
          </div>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 14 }}>
            <div>Collected Fee</div>
            <b style={{ fontSize: 22 }}>Rs. {collectedFee}</b>
          </div>
          <div style={{ border: "1px solid #cbd5e1", borderRadius: 10, padding: 14 }}>
            <div>Pending Fee</div>
            <b style={{ fontSize: 22 }}>Rs. {pendingFee}</b>
          </div>
        </div>
      ) : tab === "students" ? (
        <div>
          <form onSubmit={handleAddStudent} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
            <input placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="Roll No" value={rollNo} onChange={(e) => setRollNo(e.target.value)} />
            <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input placeholder="Parent WhatsApp" value={parentPhone} onChange={(e) => setParentPhone(e.target.value)} />
            <input placeholder="Batch Name" value={batchName} onChange={(e) => setBatchName(e.target.value)} />
            <input type="number" placeholder="Fee (PKR)" value={feeAmount} onChange={(e) => setFeeAmount(e.target.value)} required />
            <button type="submit">Add Student</button>
          </form>

          <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Batch</th>
                <th>Parent</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.rollNo || "–"}</td>
                  <td>{s.batchName}</td>
                  <td>{s.parentPhone || "–"}</td>
                  <td>Rs. {s.feeAmount}</td>
                  <td>{s.feeStatus}</td>
                  <td>
                    <button onClick={() => toggleFeeStatus(s)}>
                      {s.feeStatus === "Paid" ? "Mark Pending" : "Mark Paid"}
                    </button>{" "}
                    <button onClick={() => handleDeleteStudent(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : tab === "attendance" ? (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            <input type="date" value={attDate} onChange={(e) => setAttDate(e.target.value)} />
            <input value={attBatch} onChange={(e) => setAttBatch(e.target.value)} placeholder="Batch Name" />
            <button onClick={handleSaveAttendance}>Save Attendance</button>
          </div>

          {students
            .filter((s) => !attBatch || s.batchName === attBatch)
            .map((s) => (
              <div key={s._id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #e2e8f0" }}>
                <span>{s.name} ({s.batchName})</span>
                <select
                  value={attMap[s._id] || "P"}
                  onChange={(e) => setAttMap((prev) => ({ ...prev, [s._id]: e.target.value }))}
                >
                  <option value="P">Present (P)</option>
                  <option value="A">Absent (A)</option>
                  <option value="L">Late (L)</option>
                  <option value="V">Leave (V)</option>
                </select>
              </div>
            ))}
        </div>
      ) : (
        <div>
          <form onSubmit={handleAddBatch} style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            <input placeholder="Batch Name" value={newBatchName} onChange={(e) => setNewBatchName(e.target.value)} required />
            <input placeholder="Timing" value={newBatchTiming} onChange={(e) => setNewBatchTiming(e.target.value)} />
            <input type="number" placeholder="Monthly Fee" value={newBatchFee} onChange={(e) => setNewBatchFee(e.target.value)} />
            <button type="submit">Add Batch</button>
          </form>

          <ul>
            {batches.map((b) => (
              <li key={b._id}>
                <b>{b.name}</b> — {b.timing} — Rs. {b.monthlyFee}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}