import React from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";

interface CurriculumCourseCardProps {
  course: any;
  isCompleted: boolean;
  isCurrent: boolean;
  t: any;
}

export function CurriculumCourseCard({
  course,
  isCompleted,
  isCurrent,
  t,
}: CurriculumCourseCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
        isCompleted
          ? "bg-iu-blue/5 border-iu-blue/20 hover:border-iu-blue/40"
          : isCurrent
            ? "bg-iu-blue/5 border-iu-blue/20 hover:border-iu-blue/40 shadow-xl shadow-iu-blue/5"
            : "bg-card/40 border-border hover:border-iu-blue/30"
      }`}
    >
      <div className="p-5 sm:p-8">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div
            className={`p-2.5 sm:p-3 rounded-xl ${
              isCompleted
                ? "bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white"
                : "bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white"
            }`}
          >
            <BookOpen size={20} />
          </div>
          {isCompleted ? (
            <div className="flex items-center gap-2 bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={12} />
              {t.completed}
            </div>
          ) : isCurrent ? (
            <div className="flex items-center gap-2 bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              <Clock size={12} />
              {t.inProgress}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-muted text-muted-foreground px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
              <ChevronRight size={12} />
              {t.upcoming}
            </div>
          )}
        </div>

        <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 leading-tight group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
          {course.title}
        </h3>
        <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 sm:mb-6">
          {course.code}
        </p>

        <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Award size={14} className="text-iu-blue dark:text-white" />
            <span className="text-xs sm:text-sm font-black text-foreground">
              {course.credits} ECTS
            </span>
          </div>
          <button className="p-2 hover:bg-iu-blue/10 dark:hover:bg-iu-blue rounded-lg transition-colors text-iu-blue dark:text-white">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
