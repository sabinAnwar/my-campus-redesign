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

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-12">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border p-6 hover:scale-[1.02] transition-all duration-300 group"
        >
          <div
            className={`h-10 w-10 rounded-2xl bg-${stat.color}/10 flex items-center justify-center border border-${stat.color}/20 mb-4 group-hover:scale-110 transition-transform`}
          >
            <stat.icon className={`h-5 w-5 text-${stat.color}`} />
          </div>
          <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">
            {stat.label}
          </div>
          <div className="text-3xl font-bold text-foreground">{stat.val}</div>
        </div>
      ))}
    </div>
  );
}
