import Link from "next/link";
import { VIOLET, CORAL } from "../components/ui";

const roles = [
  { href: "/student", label: "Student", desc: "My accommodations, issues, meeting prep, tools" },
  { href: "/teacher", label: "Teacher", desc: "Students in your classes and what to do for them" },
  { href: "/admin", label: "Administrator", desc: "School-wide accessibility overview" },
];

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <h1 className="text-center text-2xl font-semibold">Hearing Accommodations Platform</h1>
        <p className="mt-2 text-center text-sm text-[#6B6A78]">
          {/* TODO: replace with real Supabase auth (sign in, then redirect by role) */}
          Pick a dashboard to preview. No login yet, this is the pre-auth scaffold.
        </p>
        <div className="mt-8 space-y-3">
          {roles.map((r, idx) => (
            <Link
              key={r.href}
              href={r.href}
              className="block rounded-2xl border border-[#ECEAF5] bg-white p-5 transition-transform hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundImage: `linear-gradient(135deg, ${idx % 2 ? CORAL : VIOLET}, ${idx % 2 ? VIOLET : CORAL})` }}
                >
                  {r.label[0]}
                </span>
                <div>
                  <div className="text-sm font-medium">{r.label}</div>
                  <div className="text-xs text-[#8B8A80]">{r.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
