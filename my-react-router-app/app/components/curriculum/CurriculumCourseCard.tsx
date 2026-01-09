import React from "react";
import { Link } from "react-router";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  XCircle,
  GraduationCap,
  Bookmark,
} from "lucide-react";

interface CurriculumCourseCardProps {
  course: any;
  isCompleted: boolean;
  isCurrent: boolean;
  grade?: number | null;
  courseType?: "Pflicht" | "Wahl" | null;
  t: any;
}

export function CurriculumCourseCard({
  course,
  isCompleted,
  isCurrent,
  grade,
  courseType,
  t,
}: CurriculumCourseCardProps) {
  // Determine pass/fail status based on German grading (≤4.0 = passed)
  const isPassed = grade !== null && grade !== undefined && grade <= 4.0;
  const isFailed = grade !== null && grade !== undefined && grade > 4.0;
  const hasGrade = grade !== null && grade !== undefined;

  // Status styling
  const getStatusStyles = () => {
    if (isFailed) {
      return "bg-red-500/10 border-red-500/30 hover:border-red-500/50";
    }
    if (isCompleted || isPassed) {
      return "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40";
    }
    if (isCurrent) {
      return "bg-iu-blue/5 border-iu-blue/20 hover:border-iu-blue/40 shadow-xl shadow-iu-blue/5";
    }
    return "bg-card/40 border-border hover:border-iu-blue/30";
  };

  // Grade badge colors
  const getGradeBadgeStyles = () => {
    if (!hasGrade) return "bg-foreground text-background";
    if (grade <= 1.5) return "bg-emerald-900 text-white";
    if (grade <= 2.5) return "bg-green-900 text-white";
    if (grade <= 3.5) return "bg-amber-900 text-white";
    if (grade <= 4.0) return "bg-orange-900 text-white";
    return "bg-red-900 text-white";
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${getStatusStyles()}`}
    >
      {/* Course Type Badge (Pflicht/Vertiefung) */}
      {courseType && (
        <div className="absolute top-4 right-4">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${
              courseType === "Pflicht"
                ? "bg-iu-blue text-white"
                : "bg-purple-700 text-white"
            }`}
          >
            {courseType === "Pflicht" ? (
              <Bookmark size={10} />
            ) : (
              <GraduationCap size={10} />
            )}
            {courseType === "Pflicht" ? t.mandatory || "Pflicht" : t.elective || "Vertiefung"}
          </div>
        </div>
      )}

      <div className="p-5 sm:p-8">
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <div
            className={`p-2.5 sm:p-3 rounded-xl ${
              isPassed || isCompleted
                ? "bg-emerald-900 text-white"
                : isFailed
                  ? "bg-red-900 text-white"
                  : "bg-iu-blue text-white"
            }`}
          >
            <BookOpen size={20} />
          </div>
          
          {/* Status Badge */}
          <div className="flex flex-col items-end gap-2">
            {hasGrade ? (
              <>
                {/* Grade Display */}
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-black ${getGradeBadgeStyles()}`}
                >
                  {grade.toFixed(1)}
                </div>
                {/* Pass/Fail Status */}
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${
                    isPassed
                      ? "bg-emerald-900 text-white"
                      : "bg-red-900 text-white"
                  }`}
                >
                  {isPassed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  {isPassed ? t.passed || "Bestanden" : t.notPassed || "Nicht bestanden"}
                </div>
              </>
            ) : isCurrent ? (
              <div className="flex items-center gap-2 bg-iu-blue text-white px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                <Clock size={12} />
                {t.inProgress}
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-foreground text-background px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                <ChevronRight size={12} />
                {t.noGrade || "Keine Note"}
              </div>
            )}
          </div>
        </div>

        <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 leading-tight group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
          {course.title}
        </h3>
        <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 sm:mb-6">
          {course.code}
        </p>

        <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Award size={14} className="text-foreground" />
            <span className="text-xs sm:text-sm font-black text-foreground">
              {course.credits} ECTS
            </span>
          </div>
          <Link 
            to={`/courses/${course.id}`}
            className="p-2 hover:bg-iu-blue/10 dark:hover:bg-iu-blue rounded-lg transition-colors text-foreground"
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
