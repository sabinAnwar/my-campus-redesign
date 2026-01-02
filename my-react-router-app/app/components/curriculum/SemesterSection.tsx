import React from "react";
import { CurriculumCourseCard } from "./CurriculumCourseCard";

interface SemesterSectionProps {
  semesterName: string;
  courses: any[];
  userMarks: any[];
  currentSemester: number;
  t: any;
}

export function SemesterSection({
  semesterName,
  courses,
  userMarks,
  currentSemester,
  t,
}: SemesterSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 px-4">
        <div className="h-1 w-12 bg-iu-blue rounded-full" />
        <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">
          {semesterName}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const isCompleted = userMarks?.some(
            (m: any) => m.course === course.titleDE && m.value <= 4.0
          );
          const isCurrent = currentSemester === parseInt(semesterName);

          return (
            <CurriculumCourseCard
              key={course.id}
              course={course}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              t={t}
            />
          );
        })}
      </div>
    </div>
  );
}
