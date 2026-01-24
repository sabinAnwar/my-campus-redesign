import React from "react";
import { CurriculumCourseCard } from "./CurriculumCourseCard";
import { COURSE_META } from "~/config/module-handbook";

interface SemesterSectionProps {
  semesterName: string;
  courses: any[];
  userMarks: any[];
  currentSemester: number;
  completedCourseIds?: Set<number>;
  t: any;
}

export function SemesterSection({
  semesterName,
  courses,
  userMarks,
  currentSemester,
  completedCourseIds,
  t,
}: SemesterSectionProps) {
  // Helper function to find the grade for a course
  const findGradeForCourse = (course: any): number | null => {
    if (!userMarks || userMarks.length === 0) return null;
    
    const candidates = [
      course.name,
      course.name_de,
      course.name_en,
      course.code,
      course.title,
    ]
      .filter(Boolean)
      .map((value: string) => value.toLowerCase());

    const matchingMark = userMarks.find((m: any) => {
      if (typeof m?.course !== "string") return false;
      return candidates.includes(m.course.toLowerCase());
    });

    return matchingMark?.value ?? null;
  };

  // Helper function to get course type (Pflicht/Wahl)
  const getCourseType = (course: any): "Pflicht" | "Wahl" | null => {
    const meta = COURSE_META[course.code];
    return meta?.type || null;
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex items-center gap-3 sm:gap-4 px-2 sm:px-4">
        <div className="h-1 w-12 bg-iu-blue rounded-full" />
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight uppercase">
          {t.semester || "Semester"} {semesterName}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course) => {
          const grade = findGradeForCourse(course);
          const hasPassedGrade = grade !== null && grade <= 4.0;
          
          const isCompleted = completedCourseIds
            ? completedCourseIds.has(course.id)
            : hasPassedGrade;
          const isCurrent = currentSemester === Number(semesterName);
          const courseType = getCourseType(course);

          return (
            <CurriculumCourseCard
              key={course.id}
              course={course}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              grade={grade}
              courseType={courseType}
              t={t}
            />
          );
        })}
      </div>
    </div>
  );
}
