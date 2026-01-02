import type { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  val: string | number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface GradesStatsGridProps {
  stats: StatItem[];
}

export function GradesStatsGrid({ stats }: GradesStatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card/60 backdrop-blur-xl border border-border p-4 sm:p-5 shadow-lg hover:shadow-iu-blue/10 transition-all duration-500 hover:-translate-y-1"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <stat.icon className="h-16 w-16 sm:h-20 sm:w-20" />
          </div>
          <div className="relative z-10">
            <div
              className={`p-2 sm:p-2.5 rounded-lg ${stat.bg}/10 w-fit mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-500`}
            >
              <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${stat.color}`} />
            </div>
            <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
              {stat.label}
            </p>
            <p className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {stat.val}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
