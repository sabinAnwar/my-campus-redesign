import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { saveRecentCourse } from "~/utils/recentCourses";
import type { FilterType } from "~/features/courses/CourseFilters";

interface UseCourseListParams {
  dbCourses: any[];
  userStudiengang: string | null;
  marks: any[];
  currentSemester: number;
  userId: number | undefined;
  language: string;
  t: any;
}

export function useCoursesList({
  dbCourses,
  userStudiengang,
  marks,
  currentSemester,
  userId,
  language,
  t,
}: UseCourseListParams) {
  const [listFilter, setListFilter] = useState<FilterType>("current");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const coursesSource = useMemo(() => {
    return dbCourses.map((c: any) => {
      // Use language-specific name, fallback to name
      const displayName = language === "de" 
        ? (c.name_de || c.name) 
        : (c.name_en || c.name);
      
      return {
        id: c.id,
        code: c.code,
        title: displayName,
        titleDE: c.name_de || c.name,
        titleEN: c.name_en || c.name,
        credits: c.credits,
        semesterNumber: c.semester,
        semester:
          language === "de"
            ? `${c.semester}. Semester`
            : `${c.semester}${c.semester === 1 ? "st" : c.semester === 2 ? "nd" : c.semester === 3 ? "rd" : "th"} Semester`,
        studiengang: userStudiengang,
        color: c.color || "cyan",
        active: c.semester === currentSemester,
        progress:
          c.semester < currentSemester
            ? 100
            : c.semester === currentSemester
              ? 45
              : 0,
        description: c.description || t.noDescription,
        instructor: c.instructor || "TBD",
        startDate: c.startDate || "TBD",
      };
    });
  }, [dbCourses, language, userStudiengang, currentSemester, t]);

  const needsFiltering = dbCourses.length === 0;

  const coursesWithStatus = useMemo(() => {
    let baseList = coursesSource;

    if (needsFiltering && userStudiengang) {
      baseList = baseList.filter((c: any) => {
        if (!c.studiengang) return false;
        const userProgram = (userStudiengang || "")
          .toLowerCase()
          .replace(/\(.*\)/, "")
          .trim();
        const courseProgram = c.studiengang
          .toLowerCase()
          .replace(/\(.*\)/, "")
          .trim();
        return userProgram === courseProgram;
      });
    }

    return baseList.map((course: any) => {
      const courseKeys = [
        course.title,
        course.titleDE,
        course.titleEN,
        course.code,
      ]
        .filter(Boolean)
        .map((value: string) => value.toLowerCase());
      const mark = marks.find((m: any) => {
        if (typeof m?.course !== "string") return false;
        return courseKeys.includes(m.course.toLowerCase());
      });
      let status: "open" | "passed" | "failed" = "open";
      if (mark) {
        status = mark.value <= 4.0 ? "passed" : "failed";
      }
      return { ...course, status, markValue: mark?.value };
    });
  }, [coursesSource, userStudiengang, marks, needsFiltering]);

  const filteredCourses = useMemo(() => {
    let result = coursesWithStatus;

    if (searchQuery) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.titleDE?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (listFilter) {
      case "current":
        result = result.filter(
          (c: any) => c.semesterNumber === currentSemester
        );
        break;
      case "failed":
        result = result.filter((c: any) => c.status === "failed");
        break;
      case "completed":
        result = result.filter((c: any) => c.status === "passed");
        break;
    }
    return result;
  }, [coursesWithStatus, listFilter, currentSemester, searchQuery]);

  const handleCourseClick = (course: any) => {
    saveRecentCourse(
      {
        id: course.id,
        name: course.title,
        studiengang: course.studiengang || "Wirtschaftsinformatik",
        semester: course.semester,
        color: course.color || "cyan",
      },
      userId
    );
    navigate(`/courses/${course.id}`);
  };

  return {
    listFilter,
    setListFilter,
    searchQuery,
    setSearchQuery,
    coursesWithStatus,
    filteredCourses,
    handleCourseClick,
  };
}
