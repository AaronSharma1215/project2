export const VIOLET = "#6D4AFF";
export const CORAL = "#FF6B4A";

export const STATUS = {
  good: { label: "Working well", text: "text-[#5433C7]", bg: "bg-[#EDE8FF]", dot: "bg-[#6D4AFF]" },
  mixed: { label: "Mixed", text: "text-[#6B6A78]", bg: "bg-[#EEEDF2]", dot: "bg-[#9A98A8]" },
  attention: { label: "Needs attention", text: "text-[#C7502F]", bg: "bg-[#FFE8E1]", dot: "bg-[#FF6B4A]" },
};

export function StatusPill({ status }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-transform hover:scale-105 ${s.bg} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function Hero({ eyebrow, title, subtitle, stat, statLabel }) {
  return (
    <div
      className="hero-sheen rounded-2xl p-6 text-white sm:p-8"
      style={{ backgroundImage: `linear-gradient(120deg, ${VIOLET} 0%, #8B5CF6 35%, ${CORAL} 100%)` }}
    >
      <div className="flex items-center justify-between gap-6">
        <div>
          <div className="text-xs font-medium uppercase tracking-wide text-white/70">{eyebrow}</div>
          <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">{title}</h1>
          <p className="mt-1 text-sm text-white/80">{subtitle}</p>
        </div>
        {stat != null && (
          <div className="hidden shrink-0 rounded-xl bg-white/15 px-5 py-3 text-center backdrop-blur sm:block">
            <div className="text-3xl font-semibold">{stat}</div>
            <div className="text-xs text-white/80">{statLabel}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Heatmap({ values }) {
  const color = (v) => (v >= 4 ? VIOLET : v === 3 ? "#B79CFF" : CORAL);
  return (
    <div className="flex gap-1.5">
      {values.map((v, i) => (
        <div
          key={i}
          className="h-6 w-6 cursor-default rounded-md transition-transform duration-150 hover:scale-125"
          style={{ backgroundColor: color(v), opacity: 0.4 + v * 0.12 }}
          title={`Week ${i + 1}: ${v}/5`}
        />
      ))}
    </div>
  );
}

export function Sidebar({ role, navItems }) {
  const roles = ["student", "teacher", "admin"];
  return (
    <aside className="hidden w-60 shrink-0 flex-col bg-[#14131F] p-5 text-[#D9D6CC] sm:flex">
      <div className="flex items-center gap-2 text-sm font-medium text-white">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg"
          style={{ backgroundImage: `linear-gradient(135deg, ${VIOLET}, ${CORAL})` }}
        >
          🦻
        </span>
        Hearing accommodations
      </div>

      <div className="mt-8 space-y-1">
        <div className="px-1 pb-2 text-xs text-[#8B8A94]">Viewing as</div>
        {roles.map((r) => (
          <a
            key={r}
            href={`/${r}`}
            className={`block w-full rounded-md px-3 py-2 text-left text-sm capitalize transition-all ${
              role === r ? "text-white shadow-sm" : "text-[#B5B2C0] hover:bg-[#1F1E2C] hover:text-white"
            }`}
            style={role === r ? { backgroundImage: `linear-gradient(90deg, ${VIOLET}, #8B5CF6)` } : undefined}
          >
            {r}
          </a>
        ))}
      </div>

      <div className="mt-8 space-y-1 text-sm text-[#8B8A94]">
        {navItems.map((i) => (
          <div key={i} className="cursor-default rounded-md px-3 py-2 transition-colors hover:bg-[#1F1E2C] hover:text-white">
            {i}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8 text-xs text-[#6F6E80]">
        {/* TODO: show the real signed-in user once Supabase auth is wired up */}
        Mock data · no auth yet
      </div>
    </aside>
  );
}
