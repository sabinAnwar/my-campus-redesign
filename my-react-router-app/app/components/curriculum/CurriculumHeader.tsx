import React from "react";
import { Layout, GraduationCap, BarChart3 } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface CurriculumHeaderProps {
  t: any;
  userProgram: string;
  stats: {
    total: number;
    completed: number;
    percent: number;
    current: number;
  };
}

export function CurriculumHeader({ t, userProgram, stats }: CurriculumHeaderProps) {
  return (
    <PageHeader
      icon={Layout}
      title={t.title}
      subtitle={t.subtitle}
      backTo="/dashboard"
      backLabel="Dashboard"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full lg:w-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 dark:border-iu-blue bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white text-xs sm:text-sm font-bold w-fit">
          <GraduationCap size={16} />
          <span>{userProgram}</span>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 sm:p-6 shadow-sm min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-4 mb-2">
            <BarChart3 className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              {t.progress}
            </span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-black text-foreground">
              {stats.percent}%
            </span>
            <span className="text-muted-foreground font-bold mb-1 text-sm">
              {stats.completed} / {stats.total} ECTS
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-iu-blue transition-all duration-1000"
              style={{ width: `${stats.percent}%` }}
            />
          </div>
        </div>
      </div>
    </PageHeader>
  );
}
