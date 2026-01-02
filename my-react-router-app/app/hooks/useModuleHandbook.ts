import { useMemo, useState } from "react";
import type { Module, ModuleHandbookLoaderData } from "~/types/module-handbook";
import { COURSE_META, userProfile } from "~/constants/module-handbook";

interface UseModuleHandbookParams {
  courses: ModuleHandbookLoaderData["courses"];
  t: any;
}

export function useModuleHandbook({ courses, t }: UseModuleHandbookParams) {
  const [semesterFilter, setSemesterFilter] = useState<number | "all">("all");

  const deriveSemesterFromCode = (code: string) => {
    const numericPart = code.split("-")[1]?.trim();
    const leadingDigit = numericPart ? parseInt(numericPart[0], 10) : NaN;
    return Number.isFinite(leadingDigit) && leadingDigit > 0 ? leadingDigit : 1;
  };

  const modules = useMemo<Module[]>(() => {
    const fallbackMeta = {
      ects: 5,
      exam: t.klausur,
      semester: 1,
      type: "Pflicht" as const,
      workload: 150,
      skills: [t.generalCompetencies],
      status: "geplant" as const,
    };

    return courses.map((course) => {
      const meta = COURSE_META[course.code] || fallbackMeta;
      const semester =
        meta.semester && Number.isFinite(meta.semester)
          ? meta.semester
          : deriveSemesterFromCode(course.code);
      const status =
        meta.status ??
        (semester <= userProfile.currentSemester ? "laufend" : "geplant");
      return {
        code: course.code,
        title: course.name,
        semester,
        ects: meta.ects,
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
  }, [courses, t]);

  const ectsCompleted = useMemo(
    () =>
      modules.reduce((sum, mod) => {
        const isCompleted = mod.semester < userProfile.currentSemester;
        const isRunning = mod.semester === userProfile.currentSemester;
        return sum + (isCompleted || isRunning ? mod.ects : 0);
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
    () =>
      modules.filter((m) => m.semester === userProfile.currentSemester) || [],
    [modules]
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
