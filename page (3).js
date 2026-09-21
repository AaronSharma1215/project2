"use client";
import { useState } from "react";
import {
  Check, MessageSquareWarning, CalendarClock, BookOpen, GraduationCap, Sparkles,
  LayoutGrid, Mic, Mic2, FileText, RotateCcw, Megaphone, ListChecks, Volume2,
  Video, MessageSquare, Brain, Star, ChevronLeft, ChevronRight,
} from "lucide-react";
import { VIOLET, CORAL, StatusPill, Hero, Heatmap, Sidebar } from "../../components/ui";
import LiveCaptions from "../../components/LiveCaptions";
import TextToSpeech from "../../components/TextToSpeech";

// MOCK — replace with Supabase queries. See lib/supabaseClient.js for the pattern.
const student = {
  name: "Maya R.",
  grade: "10th grade, mock student account",
  planType: "504 Plan",
  accommodations: [
    { label: "Captions on all video content", note: "Any recorded or streamed media" },
    { label: "Preferential seating", note: "Clear view of teacher and board" },
    { label: "Written instructions", note: "In addition to spoken directions" },
    { label: "Reduced background noise", note: "When reasonably possible" },
  ],
  extendedAccommodations: [
    { label: "Extended time on tests", note: "1.5x time on quizzes and exams" },
    { label: "Note-taking support", note: "Copy of class notes or a peer note-taker" },
    { label: "Priority seating at assemblies", note: "Applies to all-school and pep events" },
    { label: "Access to written transcripts", note: "For any audio-only classroom content" },
  ],
  iepBenefits: [
    "Extended time (1.5x) on tests and quizzes",
    "Modified assignments when needed",
    "Priority scheduling for smaller class sizes",
    "Access to the school counselor for accommodation support",
    "Assistive technology provided at no cost",
    "Annual review meeting with the accommodation team",
  ],
  classes: [
    { name: "Biology", status: "good", note: "Captions consistent all week" },
    { name: "English", status: "mixed", note: "Group discussions are still hard to follow" },
    { name: "Algebra II", status: "attention", note: "Teacher often talks facing the board" },
    { name: "World History", status: "good", note: "No issues reported" },
  ],
  issues: [
    { cat: "Background noise", cls: "Algebra II", date: "Sep 4", status: "Open" },
    { cat: "Missing captions", cls: "English", date: "Sep 2", status: "Resolved" },
  ],
  checkins: [4, 5, 3, 4, 2, 4, 5, 3],
};

const STUDENT_FEATURES = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "accommodations", label: "My accommodations", icon: Check },
  { id: "classes", label: "Class by class", icon: GraduationCap },
  { id: "issues", label: "Report an issue", icon: MessageSquareWarning },
  { id: "meeting", label: "Meeting prep", icon: CalendarClock },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "tools", label: "Tools", icon: Sparkles },
];

// `live: true` = actually functional today. The rest are UI scaffolding.
const TOOLS = [
  { icon: Mic, name: "Live captioning", desc: "Converts classroom speech to real-time text", priority: 5, live: true },
  { icon: FileText, name: "Smart notes", desc: "Creates organized notes from a lecture or caption transcript", priority: 5 },
  { icon: RotateCcw, name: "\u201cI missed that\u201d", desc: "Student discreetly signals they didn't catch something", priority: 5, live: true },
  { icon: Megaphone, name: "Teacher broadcast", desc: "Teacher sends written announcements or instructions to students", priority: 4 },
  { icon: ListChecks, name: "Instruction converter", desc: "Turns spoken instructions into written, step-by-step instructions", priority: 4 },
  { icon: Volume2, name: "Audio enhancer", desc: "Improves speech clarity and reduces background noise where feasible", priority: 4 },
  { icon: Video, name: "Caption checker", desc: "Checks whether classroom videos have captions", priority: 3 },
  { icon: MessageSquare, name: "Text-to-speech", desc: "Reads written content aloud", priority: 3, live: true },
  { icon: Mic2, name: "Speech-to-text", desc: "Turns a student's speech into text when communicating", priority: 4 },
  { icon: Brain, name: "AI accessibility assistant", desc: "Answers accessibility-related questions and explains accommodations", priority: 4 },
];

const CALENDAR_MONTH = "October 2026";
const CALENDAR_WEEKS = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, 31, null],
];
const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function FeatureGrid({ active, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
      {STUDENT_FEATURES.map((f, idx) => {
        const Icon = f.icon;
        const isActive = active === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onSelect(f.id)}
            className={`flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition-all hover:-translate-y-1 ${
              isActive ? "bg-white shadow-md ring-2 ring-[#6D4AFF]/30" : "bg-white/60 hover:bg-white hover:shadow-sm"
            }`}
          >
            <span
              className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
              style={{ backgroundImage: `linear-gradient(135deg, ${idx % 2 ? CORAL : VIOLET}, ${idx % 2 ? VIOLET : CORAL})` }}
            >
              <Icon size={20} />
            </span>
            <span className="text-xs font-medium leading-tight text-[#3A392F]">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AccommodationsSection() {
  const [detailed, setDetailed] = useState(false);
  const all = detailed ? [...student.accommodations, ...student.extendedAccommodations] : student.accommodations;
  return (
    <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-[#6B6A78]">My accommodations</h2>
        <button
          onClick={() => setDetailed((d) => !d)}
          className="rounded-full px-3 py-1 text-xs font-medium text-white transition-transform active:scale-95 hover:brightness-110"
          style={{ backgroundImage: `linear-gradient(90deg, ${VIOLET}, ${CORAL})` }}
        >
          {detailed ? "Show less" : "View in detail"}
        </button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {all.map((a) => (
          <div key={a.label} className="rounded-lg bg-gradient-to-br from-[#F5F2FF] to-white p-3 transition-transform hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start gap-2">
              <Check size={16} className="mt-0.5 shrink-0 text-[#6D4AFF]" />
              <div>
                <div className="text-sm font-medium">{a.label}</div>
                <div className="text-xs text-[#8B8A80]">{a.note}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {detailed && (
        <div className="mt-5 rounded-xl bg-[#FAF9FF] p-4">
          <div className="text-sm font-medium text-[#3A392F]">{student.planType} benefits</div>
          <ul className="mt-2 space-y-1.5 text-sm text-[#5B5A52]">
            {student.iepBenefits.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <Check size={14} className="mt-1 shrink-0 text-[#6D4AFF]" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function ClassesSection() {
  return (
    <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
      <h2 className="text-sm font-medium text-[#6B6A78]">Class by class</h2>
      <div className="mt-3 divide-y divide-[#F1F0F5]">
        {student.classes.map((c) => (
          <div key={c.name} className="flex items-center justify-between rounded-lg px-2 py-3 transition-colors hover:bg-[#FAF9FF]">
            <div>
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-xs text-[#8B8A80]">{c.note}</div>
            </div>
            <StatusPill status={c.status} />
          </div>
        ))}
      </div>
      <div className="mt-5 border-t border-[#F1F0F5] pt-4">
        <h3 className="text-sm font-medium text-[#6B6A78]">Algebra II, weekly check-ins</h3>
        <p className="mt-1 text-xs text-[#8B8A80]">How well this week&apos;s accommodations worked, self-reported</p>
        <div className="mt-3"><Heatmap values={student.checkins} /></div>
      </div>
    </section>
  );
}

function IssuesSection() {
  return (
    <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <MessageSquareWarning size={16} className="text-[#FF6B4A]" />
        Report an issue
      </div>
      <div className="mt-3 space-y-2">
        {student.issues.map((i, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-lg bg-[#FAF9FF] px-3 py-2 text-sm">
            <span>{i.cat}, {i.cls}</span>
            <span className={i.status === "Open" ? "text-[#C7502F]" : "text-[#5433C7]"}>{i.status}</span>
          </div>
        ))}
      </div>
      <button
        className="mt-3 w-full rounded-lg py-2 text-sm font-medium text-white transition-transform active:scale-95 hover:brightness-110"
        style={{ backgroundImage: `linear-gradient(90deg, ${VIOLET}, ${CORAL})` }}
        onClick={() => alert("TODO: insert a row into the `issues` table in Supabase")}
      >
        Log a new issue
      </button>
    </section>
  );
}

function MeetingCalendar() {
  const [meetingDay, setMeetingDay] = useState(3);
  return (
    <div className="rounded-xl bg-[#FAF9FF] p-4">
      <div className="flex items-center justify-between">
        <button className="rounded-md p-1 text-[#9A98A8] transition-colors hover:bg-white hover:text-[#6D4AFF]"><ChevronLeft size={16} /></button>
        <div className="text-sm font-medium text-[#3A392F]">{CALENDAR_MONTH}</div>
        <button className="rounded-md p-1 text-[#9A98A8] transition-colors hover:bg-white hover:text-[#6D4AFF]"><ChevronRight size={16} /></button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] text-[#9A98A8]">
        {WEEKDAY_LABELS.map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {CALENDAR_WEEKS.flat().map((day, idx) => {
          if (day === null) return <div key={idx} />;
          const isMeeting = day === meetingDay;
          return (
            <button
              key={idx}
              onClick={() => setMeetingDay(day)}
              className={`aspect-square rounded-lg text-xs font-medium transition-all hover:-translate-y-0.5 ${isMeeting ? "text-white shadow-sm" : "text-[#3A392F] hover:bg-white"}`}
              style={isMeeting ? { backgroundImage: `linear-gradient(135deg, ${VIOLET}, ${CORAL})` } : undefined}
            >
              {day}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-[#8B8A80]">
        Next meeting: <span className="font-medium text-[#3A392F]">Oct {meetingDay}, 2026</span>, tap another date to change it
      </p>
    </div>
  );
}

function MeetingPrepSection() {
  return (
    <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <CalendarClock size={16} className="text-[#6D4AFF]" />Meeting prep
      </div>
      <div className="mt-3"><MeetingCalendar /></div>
      <ul className="mt-4 space-y-1.5 text-sm text-[#3A392F]">
        <li>What&apos;s working well right now?</li>
        <li>Which classes are still difficult?</li>
        <li>Anything to ask the team to change?</li>
      </ul>
    </section>
  );
}

function ResourcesSection() {
  const resources = [
    "What is an accommodation plan?",
    "Self-advocacy in the classroom",
    "Talking to a new teacher",
    "Transitioning between schools",
  ];
  return (
    <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
      <div className="flex items-center gap-2 text-sm font-medium">
        <BookOpen size={16} className="text-[#6D4AFF]" />Resources
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {resources.map((r) => (
          <div key={r} className="rounded-lg bg-[#FAF9FF] px-3 py-2 text-sm text-[#3A392F] transition-colors hover:bg-[#F1ECFF]">{r}</div>
        ))}
      </div>
    </section>
  );
}

function PriorityStars({ level }) {
  return (
    <div className="mt-2 flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} className={i < level ? "fill-[#FF6B4A] text-[#FF6B4A]" : "text-[#E4E2ED]"} />
      ))}
    </div>
  );
}

function ToolsSection() {
  return (
    <>
      {/* The two tools that actually work today */}
      <LiveCaptions />
      <TextToSpeech />

      <section className="rounded-2xl border border-[#ECEAF5] bg-white p-5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles size={16} className="text-[#FF6B4A]" />Full tool suite
        </div>
        <p className="mt-1 text-xs text-[#8B8A80]">
          Tools marked &ldquo;Working now&rdquo; run in the browser with no backend. The rest are
          scaffolded and need an API or database behind them.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TOOLS.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className={`rounded-xl bg-gradient-to-br from-[#FAF9FF] to-white p-3 transition-transform hover:-translate-y-0.5 hover:shadow-md ${
                  t.live ? "ring-1 ring-[#6D4AFF]/35" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundImage: `linear-gradient(135deg, ${idx % 2 ? CORAL : VIOLET}, ${idx % 2 ? VIOLET : CORAL})` }}
                  >
                    <Icon size={16} />
                  </span>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-[#8B8A80]">{t.desc}</div>
                    <PriorityStars level={t.priority} />
                    <span
                      className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        t.live ? "bg-[#EDE8FF] text-[#5433C7]" : "bg-[#EEEDF2] text-[#6B6A78]"
                      }`}
                    >
                      {t.live ? "Working now" : "Scaffolded"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default function StudentPage() {
  const [active, setActive] = useState("overview");
  const goodWeeks = student.checkins.filter((v) => v >= 4).length;
  const navItems = ["Overview", "My accommodations", "Report an issue", "Meeting prep", "Resources"];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role="student" navItems={navItems} />
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="mx-auto max-w-3xl space-y-6">
          <Hero
            eyebrow="Student view"
            title={`Hi, ${student.name.split(" ")[0]}`}
            subtitle={student.grade}
            stat={goodWeeks}
            statLabel="strong weeks / 8"
          />
          <FeatureGrid active={active} onSelect={setActive} />
          {active === "overview" && (
            <>
              <AccommodationsSection />
              <ClassesSection />
              <div className="grid gap-4 sm:grid-cols-2">
                <IssuesSection />
                <MeetingPrepSection />
              </div>
            </>
          )}
          {active === "accommodations" && <AccommodationsSection />}
          {active === "classes" && <ClassesSection />}
          {active === "issues" && <IssuesSection />}
          {active === "meeting" && <MeetingPrepSection />}
          {active === "resources" && <ResourcesSection />}
          {active === "tools" && <ToolsSection />}
        </div>
      </main>
    </div>
  );
}
