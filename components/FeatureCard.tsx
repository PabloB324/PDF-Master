import Link from "next/link";

export type AccentColor = "blue" | "violet" | "cyan" | "emerald" | "amber" | "orange" | "teal" | "rose";

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color?: AccentColor;
}

const COLOR_MAP: Record<AccentColor, { icon: string; glow: string; border: string }> = {
  blue:    { icon: "bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20",    glow: "group-hover:shadow-blue-500/10",   border: "group-hover:border-blue-500/40" },
  violet:  { icon: "bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20", glow: "group-hover:shadow-violet-500/10", border: "group-hover:border-violet-500/40" },
  cyan:    { icon: "bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20",    glow: "group-hover:shadow-cyan-500/10",   border: "group-hover:border-cyan-500/40" },
  emerald: { icon: "bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20", glow: "group-hover:shadow-emerald-500/10", border: "group-hover:border-emerald-500/40" },
  amber:   { icon: "bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20", glow: "group-hover:shadow-amber-500/10",  border: "group-hover:border-amber-500/40" },
  orange:  { icon: "bg-orange-500/10 text-orange-400 group-hover:bg-orange-500/20", glow: "group-hover:shadow-orange-500/10", border: "group-hover:border-orange-500/40" },
  teal:    { icon: "bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20",   glow: "group-hover:shadow-teal-500/10",   border: "group-hover:border-teal-500/40" },
  rose:    { icon: "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20",   glow: "group-hover:shadow-rose-500/10",   border: "group-hover:border-rose-500/40" },
};

export function FeatureCard({ href, title, description, icon, color = "blue" }: FeatureCardProps) {
  const c = COLOR_MAP[color];

  return (
    <Link
      href={href}
      className={[
        "group flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-5",
        "transition-all duration-300",
        "hover:-translate-y-0.5 hover:shadow-lg",
        c.glow,
        c.border,
      ].join(" ")}
    >
      <div className={`flex size-10 items-center justify-center rounded-xl transition-colors duration-300 ${c.icon}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
      </div>
      <div className="mt-auto flex items-center gap-1 text-xs font-medium text-slate-600 group-hover:text-slate-400 transition-colors duration-300">
        Abrir
        <svg xmlns="http://www.w3.org/2000/svg" className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </div>
    </Link>
  );
}
