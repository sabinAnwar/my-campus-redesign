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

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
  "iu-blue": {
    bg: "bg-iu-blue/10 dark:bg-iu-blue",
    border: "border-iu-blue/20 dark:border-iu-blue",
    text: "text-iu-blue dark:text-white",
  },
  "iu-orange": {
    bg: "bg-iu-orange/10 dark:bg-iu-orange",
    border: "border-iu-orange/20 dark:border-iu-orange",
    text: "text-iu-orange dark:text-white",
  },
  "orange-500": {
    bg: "bg-iu-orange/10 dark:bg-iu-orange",
    border: "border-iu-orange/20 dark:border-iu-orange",
    text: "text-iu-orange dark:text-white",
  },
  "purple-500": {
    bg: "bg-iu-purple/10 dark:bg-iu-purple",
    border: "border-iu-purple/20 dark:border-iu-purple",
    text: "text-iu-purple dark:text-white",
  },
  "iu-purple": {
    bg: "bg-iu-purple/10 dark:bg-iu-purple",
    border: "border-iu-purple/20 dark:border-iu-purple",
    text: "text-iu-purple dark:text-white",
  },
  "pink-500": {
    bg: "bg-iu-pink/10 dark:bg-iu-pink",
    border: "border-iu-pink/20 dark:border-iu-pink",
    text: "text-iu-pink dark:text-white",
  },
  "slate-400": {
    bg: "bg-muted dark:bg-muted",
    border: "border-border",
    text: "text-muted-foreground",
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
            className="bg-card/50 backdrop-blur-xl rounded-3xl border border-border p-6 hover:scale-[1.02] transition-all duration-300 group"
          >
            <div
              className={`h-10 w-10 rounded-2xl ${colors.bg} flex items-center justify-center border ${colors.border} mb-4 group-hover:scale-110 transition-transform`}
            >
              <stat.icon className={`h-5 w-5 ${colors.text}`} />
            </div>
            <div className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">
              {stat.label}
            </div>
            <div className="text-3xl font-bold text-foreground">{stat.val}</div>
          </div>
        );
      })}
    </div>
  );
}

