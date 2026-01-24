import React from "react";
import { ChevronDown, BookMarked } from "lucide-react";
import type { ExamCategoryCourse } from "~/types/exam-registration";

interface CourseCategoryListProps {
  t: any;
  filteredCategories: any[];
  expandedCategories: Set<string>;
  selectedCourses: Set<string>;
  toggleCategory: (catId: string) => void;
  toggleCourse: (courseId: string) => void;
}

export function CourseCategoryList({
  t,
  filteredCategories,
  expandedCategories,
  selectedCourses,
  toggleCategory,
  toggleCourse,
}: CourseCategoryListProps) {
  return (
    <div className="space-y-8">
      {filteredCategories.map((category, catIdx) => (
        <div
          key={category.id}
          className="animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: `${catIdx * 100}ms` }}
        >
          <button
            onClick={() => toggleCategory(category.id)}
            className="w-full flex items-center justify-between mb-6 group"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform`}
              >
                <category.icon size={24} />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-foreground">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground font-medium">
                  {category.description}
                </p>
              </div>
            </div>
            <div
              className={`p-2 rounded-full bg-muted/50 text-muted-foreground transition-transform duration-300 ${expandedCategories.has(category.id) ? "rotate-180" : ""}`}
            >
              <ChevronDown size={20} />
            </div>
          </button>

          {expandedCategories.has(category.id) && (
            <div className="grid sm:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-300">
              {category.courses.map((course: ExamCategoryCourse) => {
                const isSelected = selectedCourses.has(course.id);
                const isPassed = course.status === "passed";
                return (
                  <button
                    key={course.id}
                    disabled={isPassed}
                    onClick={() => toggleCourse(course.id)}
                    className={`group text-left p-6 rounded-[2rem] border transition-all duration-300 ${
                      isSelected
                        ? "bg-iu-blue border-iu-blue shadow-lg shadow-iu-blue/20"
                        : isPassed
                          ? "bg-muted/30 border-border opacity-60 cursor-not-allowed"
                          : "bg-card/50 backdrop-blur-xl border-border hover:border-iu-blue/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div
                        className={`p-2 rounded-xl ${isSelected ? "bg-white/20" : "bg-iu-blue/10"}`}
                      >
                        <BookMarked
                          size={18}
                          className={
                            isSelected ? "text-white" : "text-iu-blue"
                          }
                        />
                      </div>
                      {isPassed && (
                        <span className="px-3 py-1 rounded-full bg-iu-blue/20 text-iu-blue text-[10px] font-black uppercase tracking-widest border border-iu-blue/20">
                          {t.completed}
                        </span>
                      )}
                    </div>
                    <h4
                      className={`font-bold mb-2 leading-tight ${isSelected ? "text-white" : "text-foreground"}`}
                    >
                      {course.name}
                    </h4>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-bold ${isSelected ? "text-white" : "text-muted-foreground"}`}
                      >
                        {course.credits} ECTS
                      </span>
                      <span
                        className={`w-1 h-1 rounded-full ${isSelected ? "bg-white/30" : "bg-border"}`}
                      />
                      <span
                        className={`text-xs font-bold ${isSelected ? "text-white" : "text-muted-foreground"}`}
                      >
                        {course.type}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
