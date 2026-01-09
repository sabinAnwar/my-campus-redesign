import { useMemo, useState } from "react";
import type { Module, ModuleHandbookLoaderData } from "~/types/module-handbook";
import { COURSE_META } from "~/constants/module-handbook";

interface UseModuleHandbookParams {
  courses: ModuleHandbookLoaderData["courses"];
  marks: ModuleHandbookLoaderData["marks"];
  currentSemester: number;
  t: any;
  language: "de" | "en";
}

export function useModuleHandbook({
  courses,
  marks,
  currentSemester,
  t,
  language,
}: UseModuleHandbookParams) {
  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");

  const modules = useMemo<Module[]>(() => {
    const fallbackMeta = {
      ects: 5,
      exam: t.klausur,
      type: "Pflicht" as const,
      workload: 150,
      skills: [t.generalCompetencies],
    };

    return courses.map((course) => {
      const meta = COURSE_META[course.code] || fallbackMeta;
      const semester =
        Number.isFinite(course.semester) && course.semester > 0
          ? course.semester
          : 1;
      const courseNames = [
        course.name,
        course.name_de,
        course.name_en,
        course.code,
      ]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase());
      const hasPassingMark = marks.some(
        (mark) =>
          typeof mark.course === "string" &&
          courseNames.includes(mark.course.toLowerCase()) &&
          mark.value <= 4.0
      );
      const status = hasPassingMark ? "abgeschlossen" : "laufend";
      return {
        code: course.code,
        title:
          language === "de"
            ? course.name_de || course.name
            : course.name_en || course.name,
        semester,
        ects: Number.isFinite(course.credits) ? course.credits : meta.ects,
        type: meta.type,
        exam: meta.exam,
        workload: meta.workload,
        status,
        skills: meta.skills || [t.generalCompetencies],
        description:
          course.description ||
          meta.description ||
          t.noDescription,
      };
    });
  }, [courses, currentSemester, language, marks, t]);

  const ectsCompleted = useMemo(
    () =>
      modules.reduce((sum, mod) => {
        const isCompleted = mod.status === "abgeschlossen";
        return sum + (isCompleted ? mod.ects : 0);
      }, 0),
    [modules]
  );
  const ectsTotal = 180;

  const filteredModules = useMemo(() => {
    if (semesterFilter === "all") return modules;
    return modules.filter((m) => m.semester === semesterFilter);
  }, [modules, semesterFilter]);

  const semesterOptions = useMemo(() => {
    const values = Array.from(new Set(modules.map((m) => m.semester))).sort(
      (a, b) => a - b
    );
    return values.length ? values : [1];
  }, [modules]);

  const currentSemesterModules = useMemo(
    () => modules.filter((m) => m.semester === currentSemester) || [],
    [currentSemester, modules]
  );

  return {
    semesterFilter,
    setSemesterFilter,
    modules,
    ectsCompleted,
    ectsTotal,
    filteredModules,
    semesterOptions,
    currentSemesterModules,
  };
}
