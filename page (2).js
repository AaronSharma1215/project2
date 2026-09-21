"use client";
import { useState } from "react";
import { VIOLET, CORAL, StatusPill, Hero, Sidebar } from "../../components/ui";

// MOCK — replace with a Supabase query joined through teacher_students:
// supabase.from("teacher_students").select("student_id, profiles(full_name)").eq("teacher_id", me)
const teacherStudents = [
  { initials: "MR", name: "Maya R.", cls: "Algebra II, Period 3", accs: ["Preferential seating", "Written instructions"], status: "attention" },
  { initials: "JP", name: "Jon P.", cls: "Algebra II, Period 3", accs: ["Captions for videos"], status: "good" },
  { initials: "SK", name: "Sana K.", cls: "Algebra II, Period 5", accs: ["FM system", "Preferential seating"], status: "mixed" },
];

const GUIDANCE = {
  "Preferential seating": "Seat the student with a clear view of you and the board.",
  "Written instructions": "Post directions in addition to saying them aloud.",
  "Captions for videos": "Turn on captions for any video or audio clip you play.",
  "FM system": "Wear the provided microphone from the start of class.",
};

export default function TeacherPage() {
  const [selected, setSelected] = useState(teacherStudents[0]);
  const navItems = ["My students", "Accommodations", "Resources"];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role="teacher" navItems={navItems} />
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Hero
            eyebrow="Teacher view"
            title="My students"
            subtitle="Students with hearing-related accommodations in your classes"
            stat={teacherStudents.length}
            statLabel="students"
          />
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            <div className="space-y-2">
              {teacherStudents.map((s, idx) => (
                <button
                  key={s.name}
                  onClick={() => setSelected(s)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all hover:-translate-y-0.5 ${
                    selected.name === s.name
                      ? "border-transparent bg-gradient-to-r from-[#EDE8FF] to-[#FFE8E1] shadow-sm"
                      : "border-[#ECEAF5] bg-white hover:border-[#D8D2FF]"
                  }`}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-medium text-white"
                    style={{ backgroundImage: `linear-gradient(135deg, ${idx % 2 ? CORAL : VIOLET}, ${idx % 2 ? VIOLET : CORAL})` }}
                  >
                    {s.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-[#8B8A80]">{s.cls}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{selected.name}</h2>
                <StatusPill status={selected.status} />
              </div>
              <p className="mt-1 text-sm text-[#8B8A80]">{selected.cls}</p>
              <h3 className="mt-5 text-sm font-medium text-[#6B6A78]">Accommodations and what to do</h3>
              <div className="mt-3 space-y-3">
                {selected.accs.map((a) => (
                  <div key={a} className="rounded-lg bg-gradient-to-br from-[#FAF9FF] to-white p-3 transition-transform hover:-translate-y-0.5">
                    <div className="text-sm font-medium">{a}</div>
                    <div className="mt-1 text-xs text-[#8B8A80]">{GUIDANCE[a] || "Apply consistently across class activities."}</div>
                  </div>
                ))}
              </div>
              <label className="mt-5 flex items-center gap-2 text-sm text-[#3A392F]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#C7CBC8] accent-[#6D4AFF]" defaultChecked />
                Accommodations implemented this week
              </label>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
