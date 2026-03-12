import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  val: string | number;
  icon: LucideIcon;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> =
  {
    "iu-blue": {
      bg: "bg-iu-blue/10 dark:bg-iu-blue/20",
      border: "border-iu-blue/20 dark:border-iu-blue/30",
      text: "text-iu-blue dark:text-white",
    },
    "iu-blue-text": {
      bg: "bg-iu-blue/10 dark:bg-iu-blue/20",
      border: "border-iu-blue/20 dark:border-iu-blue/30",
      text: "text-iu-blue dark:text-white",
    },
    "iu-orange": {
      bg: "bg-iu-orange/10 dark:bg-iu-orange/20",
      border: "border-iu-orange/20 dark:border-iu-orange/30",
      text: "text-iu-orange dark:text-white",
    },
    "orange-500": {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      border: "border-amber-500/20 dark:border-amber-500/30",
      text: "text-amber-600 dark:text-amber-300",
    },
    "orange-900": {
      bg: "bg-amber-500/10 dark:bg-amber-500/20",
      border: "border-amber-500/20 dark:border-amber-500/30",
      text: "text-amber-600 dark:text-amber-300",
    },
    "purple-500": {
      bg: "bg-violet-500/10 dark:bg-violet-500/20",
      border: "border-violet-500/20 dark:border-violet-500/30",
      text: "text-violet-600 dark:text-violet-300",
    },
    "purple-900": {
      bg: "bg-violet-500/10 dark:bg-violet-500/20",
      border: "border-violet-500/20 dark:border-violet-500/30",
      text: "text-violet-600 dark:text-violet-300",
    },
    "iu-purple": {
      bg: "bg-violet-500/10 dark:bg-violet-500/20",
      border: "border-violet-500/20 dark:border-violet-500/30",
      text: "text-violet-600 dark:text-violet-300",
    },
    "pink-500": {
      bg: "bg-pink-500/10 dark:bg-pink-500/20",
      border: "border-pink-500/20 dark:border-pink-500/30",
      text: "text-pink-600 dark:text-pink-300",
    },
    "pink-900": {
      bg: "bg-pink-500/10 dark:bg-pink-500/20",
      border: "border-pink-500/20 dark:border-pink-500/30",
      text: "text-pink-600 dark:text-pink-300",
    },
    "slate-400": {
      bg: "bg-slate-500/10 dark:bg-slate-500/20",
      border: "border-slate-500/20 dark:border-slate-500/30",
      text: "text-slate-600 dark:text-slate-300",
    },
    "slate-900": {
      bg: "bg-slate-500/10 dark:bg-slate-500/20",
      border: "border-slate-500/20 dark:border-slate-500/30",
      text: "text-slate-600 dark:text-slate-300",
    },
  };

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-12">
      {stats.map((stat, i) => {
        const colors = COLOR_MAP[stat.color] || COLOR_MAP["iu-blue"];
        return (
          <div
            key={i}
            className="group relative overflow-hidden bg-card/40 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] border border-border p-5 sm:p-6 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500"
          >
            <div className="absolute top-0 right-0 p-3 opacity-[0.04] group-hover:scale-110 transition-transform duration-700">
              <stat.icon className="h-16 w-16" />
            </div>
            <div className="relative z-10">
              <div
                className={`h-9 w-9 rounded-xl ${colors.bg} flex items-center justify-center border ${colors.border} mb-3 group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={`h-4 w-4 ${colors.text}`} />
              </div>
              <div className="text-muted-foreground text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1">
                {stat.label}
              </div>
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                {stat.val}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
