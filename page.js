"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { VIOLET, CORAL, StatusPill, Hero, Sidebar } from "../../components/ui";

// MOCK — replace with aggregate Supabase queries, e.g.:
// supabase.from("profiles").select("*", { count: "exact" }).eq("role", "student")
const adminStats = { supported: 34, openIssues: 7, flagged: 3 };
const issuesByCategory = [
  { name: "Captions", value: 12 },
  { name: "Seating", value: 5 },
  { name: "Noise", value: 9 },
  { name: "Other", value: 4 },
];
const flagged = [
  { initials: "MR", name: "Maya R.", cls: "Algebra II, Period 3", status: "attention" },
  { initials: "SK", name: "Sana K.", cls: "Algebra II, Period 5", status: "mixed" },
];

export default function AdminPage() {
  const navItems = ["Dashboard", "Students", "Staff", "Reports"];
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role="admin" navItems={navItems} />
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <Hero eyebrow="Admin view" title="School accessibility overview" subtitle="Aggregated, anonymized signal across the building" />
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[#ECEAF5] bg-white p-5 transition-transform hover:-translate-y-0.5">
              <div className="text-3xl font-semibold" style={{ color: VIOLET }}>{adminStats.supported}</div>
              <div className="mt-1 text-xs text-[#8B8A80]">Students supported</div>
            </div>
            <div className="rounded-2xl border border-[#ECEAF5] bg-white p-5 transition-transform hover:-translate-y-0.5">
              <div className="flex items-center gap-2">
                <span className="live-dot h-2 w-2 rounded-full" style={{ backgroundColor: CORAL }} />
                <div className="text-3xl font-semibold" style={{ color: CORAL }}>{adminStats.openIssues}</div>
              </div>
              <div className="mt-1 text-xs text-[#8B8A80]">Open issues, live</div>
            </div>
            <div className="rounded-2xl border border-[#ECEAF5] bg-white p-5 transition-transform hover:-translate-y-0.5">
              <div className="text-3xl font-semibold text-[#9A98A8]">{adminStats.flagged}</div>
              <div className="mt-1 text-xs text-[#8B8A80]">Teachers flagged for training</div>
            </div>
          </div>
          <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
            <h2 className="text-sm font-medium text-[#6B6A78]">Open issues by category</h2>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={issuesByCategory} layout="vertical" margin={{ left: 10 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={VIOLET} />
                      <stop offset="100%" stopColor={CORAL} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid horizontal={false} stroke="#F1F0F5" />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12, fill: "#6B6A78" }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: "#FAF9FF" }} />
                  <Bar dataKey="value" fill="url(#barGrad)" radius={[0, 8, 8, 0]} barSize={18} animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
            <h2 className="text-sm font-medium text-[#6B6A78]">Students needing follow-up</h2>
            <div className="mt-3 divide-y divide-[#F1F0F5]">
              {flagged.map((s, idx) => (
                <div key={s.name} className="flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-[#FAF9FF]">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white"
                      style={{ backgroundImage: `linear-gradient(135deg, ${idx % 2 ? CORAL : VIOLET}, ${idx % 2 ? VIOLET : CORAL})` }}
                    >
                      {s.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{s.name}</div>
                      <div className="text-xs text-[#8B8A80]">{s.cls}</div>
                    </div>
                  </div>
                  <StatusPill status={s.status} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
