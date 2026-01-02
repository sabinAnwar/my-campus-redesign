import React from "react";
import { Award, CheckCircle2, Calendar, type LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  val: number;
  icon: LucideIcon;
  color: string;
  bg: string;
}

interface CurriculumStatsProps {
  stats: {
    total: number;
    completed: number;
    current: number;
  };
  t: any;
}

export function CurriculumStats({ stats, t }: CurriculumStatsProps) {
  const statItems: StatItem[] = [
    {
      label: t.totalECTS,
      val: stats.total,
      icon: Award,
      color: "iu-blue",
      bg: "bg-iu-blue",
    },
    {
      label: t.completedECTS,
      val: stats.completed,
      icon: CheckCircle2,
      color: "iu-green",
      bg: "bg-iu-green",
    },
    {
      label: t.currentSemester,
      val: stats.current,
      icon: Calendar,
      color: "iu-purple",
      bg: "bg-iu-purple",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {statItems.map((stat, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border p-10 shadow-2xl hover:shadow-iu-blue/10 transition-all duration-500 hover:-translate-y-2"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
            <stat.icon className="h-24 w-24" />
          </div>
          <div className="relative z-10">
            <div
              className={`p-4 rounded-2xl ${stat.bg}/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-500`}
            >
              <stat.icon className={`h-8 w-8 text-${stat.color}`} />
            </div>
            <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
              {stat.label}
            </p>
            <p className="text-5xl font-black text-foreground tracking-tight">
              {stat.val}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
