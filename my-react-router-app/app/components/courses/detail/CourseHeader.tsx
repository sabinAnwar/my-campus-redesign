import { BookOpen } from "lucide-react";
import type { Course } from "~/types/courseDetail";
import { PageHeader } from "~/components/shared/PageHeader";

interface CourseHeaderProps {
  course: Course;
  language: string;
  onBack: () => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  cyan: { bg: "bg-cyan-500/10 dark:bg-cyan-500", text: "text-cyan-500 dark:text-white" },
  rose: { bg: "bg-rose-500/10 dark:bg-rose-500", text: "text-rose-500 dark:text-white" },
  blue: { bg: "bg-iu-blue", text: "text-white" },
  amber: { bg: "bg-amber-500/10 dark:bg-amber-500", text: "text-amber-500 dark:text-white" },
  emerald: { bg: "bg-emerald-500/10 dark:bg-emerald-500", text: "text-emerald-500 dark:text-white" },
  violet: { bg: "bg-violet-500/10 dark:bg-violet-500", text: "text-violet-500 dark:text-white" },
};

export function CourseHeader({ course, language, onBack }: CourseHeaderProps) {
  const colorKey = course?.color || "iu-blue";
  const colorConfig = COLOR_MAP[colorKey] || {
    bg: "bg-iu-blue",
    text: "text-white",
  };
  const iconBg = colorConfig.bg;
  const iconColor = colorConfig.text;

  // Get bilingual course title
  const displayTitle = language === "de"
    ? (course?.name_de || course?.title || course?.name || "Course")
    : (course?.name_en || course?.title || course?.name || "Course");

  return (
    <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/40 -mx-4 sm:-mx-6 lg:-mx-8 -mt-4 sm:-mt-6 transition-all duration-300 mb-2 sm:mb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-5">
        <PageHeader
          icon={BookOpen}
          aria-hidden="true"
          title={displayTitle}
          subtitle=""
          onBack={onBack}
          backLabel={language === "de" ? "Zurück zu Kursen" : "Back to Courses"}

          iconBg={iconBg}
          iconColor={iconColor}
          className="!mb-0" // Remove bottom margin since it's in a sticky container
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-iu-blue/5 border border-iu-blue/10">
              <div className="w-2 h-2 rounded-full bg-iu-blue animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-foreground">
                {course.progress || 0}%{" "}
                {language === "de" ? "Abgeschlossen" : "Completed"}
              </span>
            </div>
            <div 
              className="flex-1 w-24 sm:w-32 h-1.5 bg-muted/30 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={course.progress || 0}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={language === "de" ? "Kursfortschritt" : "Course progress"}
            >
              <div
                className="h-full bg-iu-blue progress-bar transition-all duration-1000 ease-out"
                style={{ width: `${course.progress || 0}%` }}
              />
            </div>
          </div>
        </PageHeader>
      </div>
    </div>
  );
}
