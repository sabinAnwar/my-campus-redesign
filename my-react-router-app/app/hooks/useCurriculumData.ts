import { useMemo } from "react";
interface UseCurriculumDataParams {
  user: any;
  language: string;
}

export function useCurriculumData({ user, language }: UseCurriculumDataParams) {
  const userProgram = user?.major?.name || user?.study_program || "";
  const dbCourses = useMemo(() => user?.major?.courses ?? [], [user]);
  const courses = useMemo(
    () =>
      dbCourses.map((course: any) => ({
        id: course.id,
        code: course.code,
        title:
          language === "de"
            ? course.name_de || course.name
            : course.name_en || course.name,
        name: course.name,
        name_de: course.name_de,
        name_en: course.name_en,
        credits: course.credits ?? 5,
        semester: course.semester,
        color: course.color,
      })),
    [dbCourses, language]
  );

  const completedCourseIds = useMemo(() => {
    const ids = new Set<number>();
    const marks = user?.marks ?? [];
    courses.forEach((course: any) => {
      const names = [
        course.name,
        course.name_de,
        course.name_en,
        course.code,
        course.title,
      ]
        .filter(Boolean)
        .map((value: string) => value.toLowerCase());
      const match = marks.some(
        (m: any) =>
          typeof m.course === "string" &&
          names.includes(m.course.toLowerCase()) &&
          m.value <= 4.0
      );
      if (match) ids.add(course.id);
    });
    return ids;
  }, [courses, user]);

  const semesters = useMemo(() => {
    const groups: Record<string, any[]> = {};
    courses.forEach((c) => {
      const sem = String(c.semester);
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(c);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [courses]);

  const stats = useMemo(() => {
    const total = courses.reduce(
      (acc: number, c: any) => acc + (c.credits || 0),
      0
    );
    const completed = courses.reduce(
      (acc: number, c: any) =>
        completedCourseIds.has(c.id) ? acc + (c.credits || 0) : acc,
      0
    );
    return {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      current: user?.semester || 1,
    };
  }, [courses, completedCourseIds, user]);

  return {
    userProgram,
    semesters,
    stats,
    completedCourseIds,
    userMarks: user?.marks || [],
    currentSemester: user?.semester || 1,
  };
}
