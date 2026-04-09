import { useState, useMemo } from "react";

const SUBJECTS = ["Mathematics", "Physics", "Chemistry", "English", "Computer Science"];

const GRADE_SCALE = [
  { min: 90, grade: "A+", gpa: 4.0, color: "#00c896" },
  { min: 80, grade: "A",  gpa: 3.7, color: "#2dd4bf" },
  { min: 70, grade: "B+", gpa: 3.3, color: "#60a5fa" },
  { min: 60, grade: "B",  gpa: 3.0, color: "#818cf8" },
  { min: 50, grade: "C",  gpa: 2.0, color: "#f59e0b" },
  { min: 40, grade: "D",  gpa: 1.0, color: "#fb923c" },
  { min: 0,  grade: "F",  gpa: 0.0, color: "#f43f5e" },
];

function getGradeInfo(marks) {
  return GRADE_SCALE.find(g => marks >= g.min) || GRADE_SCALE[GRADE_SCALE.length - 1];
}

function calcResult(subjects) {
  const total = Object.values(subjects).reduce((a, b) => a + Number(b), 0);
  const avg = total / SUBJECTS.length;
  const gradeInfo = getGradeInfo(avg);
  const passed = Object.values(subjects).every(m => Number(m) >= 40);
  return { total, avg: avg.toFixed(1), ...gradeInfo, status: passed ? "PASS" : "FAIL" };
}

const DEMO_STUDENTS = [
  { id: 1, name: "Aanya Sharma", rollNo: "CS001", class: "12-A", subjects: { Mathematics: 92, Physics: 88, Chemistry: 85, English: 90, "Computer Science": 95 } },
  { id: 2, name: "Rohan Mehta",  rollNo: "CS002", class: "12-A", subjects: { Mathematics: 74, Physics: 68, Chemistry: 72, English: 80, "Computer Science": 85 } },
  { id: 3, name: "Priya Nair",   rollNo: "CS003", class: "12-B", subjects: { Mathematics: 55, Physics: 48, Chemistry: 50, English: 62, "Computer Science": 58 } },
  { id: 4, name: "Dev Kapoor",   rollNo: "CS004", class: "12-B", subjects: { Mathematics: 38, Physics: 42, Chemistry: 35, English: 55, "Computer Science": 60 } },
];

export default function App() {
  const [students, setStudents] = useState(DEMO_STUDENTS);
  const [view, setView] = useState("dashboard"); // dashboard | add | list | result
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [form, setForm] = useState({ name: "", rollNo: "", class: "", subjects: Object.fromEntries(SUBJECTS.map(s => [s, ""])) });
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function resetForm() {
    setForm({ name: "", rollNo: "", class: "", subjects: Object.fromEntries(SUBJECTS.map(s => [s, ""])) });
    setFormError("");
    setEditingStudent(null);
  }

  function handleEdit(student) {
    setForm({ name: student.name, rollNo: student.rollNo, class: student.class, subjects: { ...student.subjects } });
    setEditingStudent(student.id);
    setView("add");
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.rollNo.trim() || !form.class.trim()) {
      setFormError("Please fill in all student details.");
      return;
    }
    for (const s of SUBJECTS) {
      const v = Number(form.subjects[s]);
      if (form.subjects[s] === "" || isNaN(v) || v < 0 || v > 100) {
        setFormError(`Enter valid marks (0–100) for ${s}.`);
        return;
      }
    }
    if (!editingStudent) {
      const exists = students.find(s => s.rollNo.toLowerCase() === form.rollNo.toLowerCase());
      if (exists) { setFormError("Roll number already exists."); return; }
    }
    const subjectMarks = Object.fromEntries(SUBJECTS.map(s => [s, Number(form.subjects[s])]));
    if (editingStudent) {
      setStudents(prev => prev.map(s => s.id === editingStudent ? { ...s, name: form.name, rollNo: form.rollNo, class: form.class, subjects: subjectMarks } : s));
      showToast("Student updated successfully!");
    } else {
      setStudents(prev => [...prev, { id: Date.now(), name: form.name, rollNo: form.rollNo, class: form.class, subjects: subjectMarks }]);
      showToast("Student added successfully!");
    }
    resetForm();
    setView("list");
  }

  function handleDelete(id) {
    setStudents(prev => prev.filter(s => s.id !== id));
    setDeleteConfirm(null);
    if (selectedStudent?.id === id) { setSelectedStudent(null); setView("list"); }
    showToast("Student deleted.", "error");
  }

  const filtered = useMemo(() => students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.class.toLowerCase().includes(searchQuery.toLowerCase())
  ), [students, searchQuery]);

  const stats = useMemo(() => {
    const results = students.map(s => calcResult(s.subjects));
    const passed = results.filter(r => r.status === "PASS").length;
    const avgs = results.map(r => parseFloat(r.avg));
    const topScore = Math.max(...avgs);
    const topStudent = students[avgs.indexOf(topScore)];
    return { total: students.length, passed, failed: students.length - passed, topStudent, topScore: topScore.toFixed(1) };
  }, [students]);

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "'DM Sans', sans-serif", color: "#e2e8f0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0a0f1e; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        .nav-btn { background: none; border: none; padding: 10px 18px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; transition: all 0.2s; color: #94a3b8; }
        .nav-btn:hover { background: #1e293b; color: #e2e8f0; }
        .nav-btn.active { background: #1e40af; color: #fff; }
        .card { background: #111827; border: 1px solid #1e293b; border-radius: 16px; padding: 24px; }
        .input { width: 100%; background: #0f172a; border: 1px solid #1e293b; border-radius: 10px; padding: 11px 14px; color: #e2e8f0; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border 0.2s; }
        .input:focus { border-color: #3b82f6; }
        .input::placeholder { color: #475569; }
        .btn { padding: 11px 24px; border-radius: 10px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; transition: all 0.2s; }
        .btn-primary { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: #fff; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(59,130,246,0.4); }
        .btn-danger { background: #7f1d1d; color: #fca5a5; }
        .btn-danger:hover { background: #991b1b; }
        .btn-ghost { background: #1e293b; color: #94a3b8; }
        .btn-ghost:hover { background: #273549; color: #e2e8f0; }
        .student-row { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; transition: all 0.2s; cursor: pointer; }
        .student-row:hover { border-color: #3b82f6; background: #111827; transform: translateX(2px); }
        .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .mark-bar { height: 6px; border-radius: 3px; transition: width 0.6s ease; }
        .stat-card { background: #111827; border: 1px solid #1e293b; border-radius: 16px; padding: 20px 24px; }
        .avatar { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; font-family: 'Syne', sans-serif; flex-shrink: 0; }
        .subject-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #1e293b; }
        .subject-row:last-child { border-bottom: none; }
        .toast { position: fixed; bottom: 24px; right: 24px; padding: 14px 20px; border-radius: 12px; font-size: 14px; font-weight: 500; z-index: 999; animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; display: flex; align-items: center; justify-content: center; }
        .modal { background: #111827; border: 1px solid #1e293b; border-radius: 16px; padding: 28px; width: 360px; }
        label { display: block; font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
      `}</style>

      {/* HEADER */}
      <header style={{ background: "#0d1424", borderBottom: "1px solid #1e293b", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg,#1d4ed8,#7c3aed)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎓</div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, color: "#f1f5f9" }}>ResultPro</span>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {[["dashboard","📊 Dashboard"],["list","👥 Students"],["add","➕ Add Student"]].map(([v,label]) => (
            <button key={v} className={`nav-btn${view===v||( v==="add"&&editingStudent&&view==="add")?" active":""}`} onClick={() => { if(v!=="add") resetForm(); setView(v); }}>{label}</button>
          ))}
        </nav>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Dashboard</h1>
            <p style={{ color: "#64748b", marginBottom: 28 }}>Overview of all student results</p>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Students", value: stats.total, icon: "👥", color: "#3b82f6" },
                { label: "Passed", value: stats.passed, icon: "✅", color: "#10b981" },
                { label: "Failed", value: stats.failed, icon: "❌", color: "#f43f5e" },
                { label: "Top Avg", value: stats.topScore + "%", icon: "🏆", color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} className="stat-card">
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Top student */}
            {stats.topStudent && (
              <div className="card" style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 20 }}>
                <div style={{ fontSize: 40 }}>🏆</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: "#f59e0b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Top Performer</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800 }}>{stats.topStudent.name}</div>
                  <div style={{ color: "#64748b", fontSize: 14 }}>{stats.topStudent.rollNo} · Class {stats.topStudent.class}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: "#10b981" }}>{stats.topScore}%</div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>Average Score</div>
                </div>
              </div>
            )}

            {/* All students summary */}
            <div className="card">
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>All Students</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {students.length === 0 && <div style={{ color: "#475569", textAlign: "center", padding: 20 }}>No students yet. Add one!</div>}
                {students.map(s => {
                  const r = calcResult(s.subjects);
                  const initials = s.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
                  const colors = ["#1d4ed8","#7c3aed","#059669","#b45309","#be185d"];
                  const bg = colors[s.id % colors.length];
                  return (
                    <div key={s.id} className="student-row" onClick={() => { setSelectedStudent(s); setView("result"); }}>
                      <div className="avatar" style={{ background: bg }}>{initials}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                        <div style={{ color: "#64748b", fontSize: 13 }}>{s.rollNo} · Class {s.class}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 700, color: r.color, fontSize: 18 }}>{r.avg}%</div>
                        <span className="badge" style={{ background: r.status==="PASS"?"#052e16":"#450a0a", color: r.status==="PASS"?"#10b981":"#f43f5e" }}>{r.status}</span>
                      </div>
                      <span className="badge" style={{ background: "#1e293b", color: r.color, fontSize: 14, padding: "4px 12px" }}>{r.grade}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STUDENT LIST */}
        {view === "list" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800 }}>Students</h1>
                <p style={{ color: "#64748b", marginTop: 4 }}>{students.length} students enrolled</p>
              </div>
              <button className="btn btn-primary" onClick={() => { resetForm(); setView("add"); }}>+ Add Student</button>
            </div>

            <input className="input" placeholder="🔍  Search by name, roll no, or class..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: 20 }} />

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.length === 0 && <div className="card" style={{ textAlign: "center", color: "#475569", padding: 40 }}>No students found.</div>}
              {filtered.map(s => {
                const r = calcResult(s.subjects);
                const initials = s.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
                const colors = ["#1d4ed8","#7c3aed","#059669","#b45309","#be185d"];
                const bg = colors[s.id % colors.length];
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12 }}>
                    <div className="avatar" style={{ background: bg }}>{initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                      <div style={{ color: "#64748b", fontSize: 13 }}>{s.rollNo} · Class {s.class}</div>
                    </div>
                    <div style={{ textAlign: "right", marginRight: 16 }}>
                      <div style={{ fontWeight: 700, color: r.color }}>{r.avg}%</div>
                      <span className="badge" style={{ background: r.status==="PASS"?"#052e16":"#450a0a", color: r.status==="PASS"?"#10b981":"#f43f5e" }}>{r.status}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="btn btn-ghost" style={{ padding: "8px 14px" }} onClick={() => { setSelectedStudent(s); setView("result"); }}>View</button>
                      <button className="btn btn-ghost" style={{ padding: "8px 14px" }} onClick={() => handleEdit(s)}>Edit</button>
                      <button className="btn btn-danger" style={{ padding: "8px 14px" }} onClick={() => setDeleteConfirm(s.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADD / EDIT FORM */}
        {view === "add" && (
          <div style={{ maxWidth: 640 }}>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
              {editingStudent ? "Edit Student" : "Add New Student"}
            </h1>
            <p style={{ color: "#64748b", marginBottom: 28 }}>Fill in student details and subject marks</p>

            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 16 }}>Student Information</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label>Full Name</label>
                  <input className="input" placeholder="e.g. Priya Sharma" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
                </div>
                <div>
                  <label>Roll Number</label>
                  <input className="input" placeholder="e.g. CS005" value={form.rollNo} onChange={e => setForm(f => ({...f, rollNo: e.target.value}))} />
                </div>
                <div>
                  <label>Class / Section</label>
                  <input className="input" placeholder="e.g. 12-A" value={form.class} onChange={e => setForm(f => ({...f, class: e.target.value}))} />
                </div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 16 }}>Subject Marks <span style={{ color: "#475569", fontWeight: 400, fontSize: 13 }}>(out of 100)</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {SUBJECTS.map(sub => (
                  <div key={sub} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{sub}</div>
                    <input
                      className="input"
                      type="number" min="0" max="100"
                      placeholder="0–100"
                      value={form.subjects[sub]}
                      onChange={e => setForm(f => ({...f, subjects: {...f.subjects, [sub]: e.target.value}}))}
                      style={{ width: 100 }}
                    />
                    {form.subjects[sub] !== "" && !isNaN(Number(form.subjects[sub])) && (
                      <span style={{ width: 36, textAlign: "center", fontWeight: 700, color: getGradeInfo(Number(form.subjects[sub])).color }}>
                        {getGradeInfo(Number(form.subjects[sub])).grade}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {formError && (
              <div style={{ background: "#450a0a", border: "1px solid #7f1d1d", borderRadius: 10, padding: "12px 16px", color: "#fca5a5", fontSize: 14, marginBottom: 16 }}>
                ⚠️ {formError}
              </div>
            )}

            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn btn-primary" onClick={handleSubmit} style={{ flex: 1 }}>
                {editingStudent ? "Update Student" : "Add Student"}
              </button>
              <button className="btn btn-ghost" onClick={() => { resetForm(); setView("list"); }}>Cancel</button>
            </div>
          </div>
        )}

        {/* RESULT VIEW */}
        {view === "result" && selectedStudent && (() => {
          const s = students.find(st => st.id === selectedStudent.id) || selectedStudent;
          const r = calcResult(s.subjects);
          const initials = s.name.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase();
          const colors = ["#1d4ed8","#7c3aed","#059669","#b45309","#be185d"];
          const bg = colors[s.id % colors.length];
          return (
            <div>
              <button className="btn btn-ghost" style={{ marginBottom: 24, padding: "8px 16px" }} onClick={() => setView("list")}>← Back</button>

              {/* Header */}
              <div className="card" style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 20 }}>
                <div className="avatar" style={{ background: bg, width: 60, height: 60, fontSize: 22, borderRadius: 14 }}>{initials}</div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800 }}>{s.name}</h2>
                  <div style={{ color: "#64748b", fontSize: 14 }}>{s.rollNo} · Class {s.class}</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 800, color: r.color, lineHeight: 1 }}>{r.grade}</div>
                  <div style={{ color: "#64748b", fontSize: 13 }}>Grade</div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: r.color }}>{r.avg}%</div>
                  <span className="badge" style={{ background: r.status==="PASS"?"#052e16":"#450a0a", color: r.status==="PASS"?"#10b981":"#f43f5e", fontSize: 13 }}>{r.status}</span>
                </div>
              </div>

              {/* Summary stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Total Marks", value: `${r.total} / ${SUBJECTS.length * 100}` },
                  { label: "Average Score", value: `${r.avg}%` },
                  { label: "GPA", value: r.gpa.toFixed(1) },
                ].map(item => (
                  <div key={item.label} className="stat-card" style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: r.color }}>{item.value}</div>
                    <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Subject breakdown */}
              <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Subject-wise Marks</div>
                {SUBJECTS.map(sub => {
                  const marks = s.subjects[sub];
                  const gi = getGradeInfo(marks);
                  return (
                    <div key={sub} className="subject-row">
                      <div style={{ width: 160, fontSize: 14, fontWeight: 500 }}>{sub}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ background: "#0f172a", borderRadius: 4, height: 8, overflow: "hidden" }}>
                          <div className="mark-bar" style={{ width: `${marks}%`, background: gi.color }} />
                        </div>
                      </div>
                      <div style={{ width: 48, textAlign: "right", fontWeight: 700 }}>{marks}</div>
                      <span className="badge" style={{ background: "#1e293b", color: gi.color, width: 36, textAlign: "center" }}>{gi.grade}</span>
                      <span style={{ width: 60, textAlign: "right", fontSize: 13, color: marks >= 40 ? "#10b981" : "#f43f5e" }}>{marks >= 40 ? "✓ Pass" : "✗ Fail"}</span>
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 12 }}>
                <button className="btn btn-primary" onClick={() => handleEdit(s)}>✏️ Edit Result</button>
                <button className="btn btn-danger" onClick={() => setDeleteConfirm(s.id)}>🗑 Delete Student</button>
              </div>
            </div>
          );
        })()}
      </main>

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Delete Student?</div>
            <div style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>This action cannot be undone. All data for this student will be permanently removed.</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => handleDelete(deleteConfirm)}>Yes, Delete</button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast" style={{ background: toast.type === "success" ? "#052e16" : "#450a0a", border: `1px solid ${toast.type === "success" ? "#10b981" : "#f43f5e"}`, color: toast.type === "success" ? "#10b981" : "#fca5a5" }}>
          {toast.type === "success" ? "✅" : "🗑️"} {toast.msg}
        </div>
      )}
    </div>
  );
}
