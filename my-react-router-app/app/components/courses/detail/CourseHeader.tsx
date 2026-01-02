import { BookOpen } from "lucide-react";
import type { Course } from "~/types/courseDetail";
import { PageHeader } from "~/components/shared/PageHeader";

interface CourseHeaderProps {
  course: Course;
  language: string;
  onBack: () => void;
}

const COLOR_MAP: Record<string, string> = {
  cyan: "bg-cyan-500/10 text-cyan-500",
  rose: "bg-rose-500/10 text-rose-500",
  blue: "bg-blue-500/10 text-blue-500",
  amber: "bg-amber-500/10 text-amber-500",
  emerald: "bg-emerald-500/10 text-emerald-500",
  violet: "bg-violet-500/10 text-violet-500",
};

export function CourseHeader({ course, language, onBack }: CourseHeaderProps) {
  const colorKey = course?.color || "iu-blue";
  const colorClass = COLOR_MAP[colorKey] || "bg-iu-blue/10 text-iu-blue";
  const [iconBg, iconColor] = colorClass.split(" ");

  return (
    <div className="sticky top-0 z-30 bg-background/90 backdrop-blur-xl border-b border-border/40 -mx-3 sm:-mx-4 md:-mx-6 lg:-mx-10 transition-all duration-300 mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <PageHeader
          icon={BookOpen}
          title={course?.title || course?.name || "Course"}
          subtitle={course?.instructor || ""}
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
            <div className="flex-1 w-24 sm:w-32 h-1.5 bg-muted/30 rounded-full overflow-hidden">
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

