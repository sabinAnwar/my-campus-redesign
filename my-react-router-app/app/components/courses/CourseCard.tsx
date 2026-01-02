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
      return "bg-iu-blue/10 text-iu-blue border-iu-blue/20";
    if (status === "failed")
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    if (active) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  };

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-iu-blue/50 hover:shadow-2xl hover:shadow-iu-blue/10 cursor-pointer"
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
          <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {course.semester}
          </span>
          <div
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(course.status, course.active)}`}
          >
            {course.status === "passed"
              ? language === "de"
                ? `✓ ${course.markValue?.toFixed(1)}`
                : `✓ ${course.markValue?.toFixed(1)}`
              : course.status === "failed"
                ? t.retry
                : course.active
                  ? t.active
                  : t.open}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:text-iu-blue transition-colors line-clamp-2 leading-tight">
          {course.title}
        </h3>

        {/* Meta Info */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-iu-blue flex-shrink-0" />
            <span className="truncate">{course.startDate}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
            <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-iu-blue flex-shrink-0" />
            <span className="truncate">{course.instructor}</span>
          </div>
        </div>

        {/* Description - hidden on mobile */}
        <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 md:mb-8 flex-grow leading-relaxed">
          {getTranslatedDescription(course.description || "", language)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 md:pt-6 border-t border-border mt-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 text-iu-blue font-bold text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest">
            <span className="hidden sm:inline">{t.openCourse}</span>
            <span className="sm:hidden">{t.openMobile}</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-2 transition-transform" />
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse" />
            <span className="text-[9px] sm:text-[10px] font-bold">
              {course.credits} CP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
