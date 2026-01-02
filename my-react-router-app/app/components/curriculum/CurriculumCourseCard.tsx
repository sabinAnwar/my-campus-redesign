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
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div
            className={`p-3 rounded-xl ${
              isCompleted
                ? "bg-iu-blue/10 text-iu-blue dark:text-iu-blue"
                : "bg-iu-blue/10 text-iu-blue"
            }`}
          >
            <BookOpen size={24} />
          </div>
          {isCompleted ? (
            <div className="flex items-center gap-2 bg-iu-blue/10 text-iu-blue dark:text-iu-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <CheckCircle2 size={12} />
              {t.completed}
            </div>
          ) : isCurrent ? (
            <div className="flex items-center gap-2 bg-iu-blue/10 text-iu-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Clock size={12} />
              {t.inProgress}
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-muted text-muted-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <ChevronRight size={12} />
              {t.upcoming}
            </div>
          )}
        </div>

        <h3 className="text-xl font-black text-foreground mb-2 leading-tight group-hover:text-iu-blue transition-colors">
          {course.title}
        </h3>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
          {course.code}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Award size={14} className="text-iu-blue" />
            <span className="text-sm font-black text-foreground">
              {course.credits} ECTS
            </span>
          </div>
          <button className="p-2 hover:bg-iu-blue/10 rounded-lg transition-colors text-iu-blue">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
