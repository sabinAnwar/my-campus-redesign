import React from "react";
import {
  User as UserIcon,
  CalendarDays,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { getTranslatedDescription } from "~/services/translations/courses";

interface CourseCardProps {
  course: any;
  language: string;
  t: any;
  onClick: () => void;
}

export function CourseCard({ course, language, t, onClick }: CourseCardProps) {
  const getStatusStyles = (status: string, active: boolean) => {
    if (status === "passed")
      return "bg-iu-blue text-white border-iu-blue";
    if (status === "failed")
      return "bg-iu-red text-white border-iu-red";
    if (active) return "bg-iu-orange text-white border-iu-orange";
    return "bg-slate-700 text-white border-slate-700 dark:bg-slate-600 dark:border-slate-600";
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 hover:shadow-2xl hover:shadow-slate-400/5 cursor-pointer"
    >
      {/* Progress Bar at Top */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
        <div
          className="h-full bg-iu-blue progress-bar"
          style={{ width: `${course.progress}%` }}
        />
      </div>

      <div className="p-4 sm:p-5 md:p-8 flex flex-col h-full">
        {/* Card Header */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
          <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-foreground uppercase tracking-widest">
            {course.semester}
          </span>
          <div
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(course.status, course.active)}`}
          >
            {course.status === "passed"
              ? language === "de"
                ? ` ${course.markValue?.toFixed(1)}`
                : ` ${course.markValue?.toFixed(1)}`
              : course.status === "failed"
                ? t.retry
                : course.active
                  ? t.active
                  : t.open}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:translate-x-1 transition-transform line-clamp-2 leading-tight">
          {course.title}
        </h3>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-foreground col-span-2">
            <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-iu-blue dark:text-white flex-shrink-0" />
            <span className="truncate">{course.startDate}</span>
          </div>
        </div>

        {/* Description - hidden on mobile */}
        <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 md:mb-8 flex-grow leading-relaxed">
          {getTranslatedDescription(course.description || "", language as "de" | "en")}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 md:pt-6 border-t border-border mt-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 text-foreground font-black text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest">
            <span className="hidden sm:inline">{t.openCourse}</span>
            <span className="sm:hidden">{t.openMobile}</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-2 transition-transform" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground border border-slate-300 dark:border-slate-700 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-500" />
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              {course.credits} CP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
