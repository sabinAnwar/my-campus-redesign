import React from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  type LucideIcon,
} from "lucide-react";

export type FilterType = "current" | "failed" | "completed" | "all";

export interface FilterTab {
  id: FilterType;
  label: string;
  icon: LucideIcon;
  count: number;
}

interface CourseFiltersProps {
  t: any;
  listFilter: FilterType;
  setListFilter: (filter: FilterType) => void;
  coursesWithStatus: any[];
  currentSemester: number;
}

export function CourseFilters({
  t,
  listFilter,
  setListFilter,
  coursesWithStatus,
  currentSemester,
}: CourseFiltersProps) {
  const tabs: FilterTab[] = [
    {
      id: "current",
      label: t.currentSemesterTab,
      icon: Clock,
      count: coursesWithStatus.filter(
        (c) => c.semesterNumber === currentSemester,
      ).length,
    },
    {
      id: "completed",
      label: t.completedTab,
      icon: CheckCircle2,
      count: coursesWithStatus.filter((c) => c.status === "passed").length,
    },
    {
      id: "failed",
      label: t.failedTab,
      icon: XCircle,
      count: coursesWithStatus.filter((c) => c.status === "failed").length,
    },
    {
      id: "all",
      label: t.allModulesTab,
      icon: Filter,
      count: coursesWithStatus.length,
    },
  ];

  return (
    <div className="filter-tabs-scroll mb-4 sm:mb-6 md:mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setListFilter(tab.id)}
          className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs md:text-sm transition-all whitespace-nowrap border ${
            listFilter === tab.id
              ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 shadow-xl"
              : "bg-card text-foreground border-border hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50"
          }`}
        >
          <tab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">
            {tab.id === "current"
              ? t.currentMobile
              : tab.id === "completed"
                ? t.completedMobile
                : tab.id === "failed"
                  ? t.failedMobile
                  : t.allMobile}
          </span>
          <span
            className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[11px] font-bold ${listFilter === tab.id ? "bg-white/20 text-foreground dark:text-white" : "bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-white"}`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
}
