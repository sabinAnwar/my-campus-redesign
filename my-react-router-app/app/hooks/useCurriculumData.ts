import { useMemo } from "react";
import { getCourseConfig } from "~/data/coursesConfig";

interface UseCurriculumDataParams {
  user: any;
  language: string;
}

export function useCurriculumData({ user, language }: UseCurriculumDataParams) {
  const allCourses = useMemo(() => getCourseConfig(language), [language]);

  const userProgram = user?.studyProgram || "Wirtschaftsinformatik (Dual)";

  const filteredCourses = useMemo(() => {
    return allCourses.filter((c) => {
      if (userProgram.includes("Wirtschaftsinformatik"))
        return c.studiengang === "Wirtschaftsinformatik";
      if (userProgram.includes("Informatik"))
        return c.studiengang === "Informatik";
      if (userProgram.includes("Marketing"))
        return c.studiengang === "Marketing";
      return c.studiengang === "Wirtschaftsinformatik"; // Default
    });
  }, [allCourses, userProgram]);

  const semesters = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredCourses.forEach((c) => {
      const sem = c.semester;
      if (!groups[sem]) groups[sem] = [];
      groups[sem].push(c);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [filteredCourses]);

  const stats = useMemo(() => {
    const total = filteredCourses.reduce(
      (acc: number, c: any) => acc + (c.credits || 0),
      0
    );
    const completed =
      user?.marks
        ?.filter((m: any) => m.value <= 4.0)
        .reduce((acc: number, m: any) => acc + (m.credits || 5), 0) || 0;
    return {
      total,
      completed,
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      current: user?.semester || 1,
    };
  }, [filteredCourses, user]);

  return {
    userProgram,
    semesters,
    stats,
    userMarks: user?.marks || [],
    currentSemester: user?.semester || 1,
  };
}
