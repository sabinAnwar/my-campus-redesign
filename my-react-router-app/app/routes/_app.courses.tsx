import React, { useState, useMemo } from "react";
import { useNavigate, useLoaderData, useLocation, Outlet } from "react-router-dom";
import {
  User as UserIcon,
  CalendarDays,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  GraduationCap,
  Search,
} from "lucide-react";
import { saveRecentCourse } from "../lib/recentCourses";
import { TRANSLATIONS, getCourseConfig } from "../data/coursesConfig";
import { useLanguage } from "~/contexts/LanguageContext";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import type { CoursesLoaderData as LoaderData } from "~/types/course";

// Loader for courses page - Unified loader
export const loader = async ({ request }: { request: Request }) => {
  try {
    let user = await getUserFromRequest(request);

    // FALLBACK: If no user from session, use Sabin Elanwar
    if (!user) {
      const fallbackUser = await prisma.user.findUnique({
        where: { email: "sabin.elanwar@iu-study.org" },
      });
      if (fallbackUser) {
        user = fallbackUser;
      }
    }

    if (!user) {
      return {
        userStudiengang: null,
        marks: [],
        currentSemester: 1,
        dbCourses: [],
      };
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        studiengang: true,
        marks: true,
      },
    });

    if (!dbUser) {
      return {
        userStudiengang: null,
        marks: [],
        currentSemester: 1,
        dbCourses: [],
      };
    }

    const userStudiengang =
      dbUser.studiengang?.name || dbUser.studyProgram || null;

    // Fetch courses from DB for this user's program
    let dbCourses: any[] = [];
    if (dbUser.studiengang?.id) {
      dbCourses = await prisma.course.findMany({
        where: { studiengangId: dbUser.studiengang.id },
        orderBy: { semester: "asc" },
      });
    } else if (userStudiengang) {
      const s = await prisma.studiengang.findUnique({
        where: { name: userStudiengang },
      });
      if (s) {
        dbCourses = await prisma.course.findMany({
          where: { studiengangId: s.id },
          orderBy: { semester: "asc" },
        });
      }
    }

    return {
      userStudiengang,
      marks: dbUser.marks || [],
      currentSemester: dbUser.semester || 1,
      userId: user.id,
      dbCourses,
    };
  } catch (error) {
    console.error("❌ [Courses Loader] Error:", error);
    return {
      userStudiengang: null,
      marks: [],
      currentSemester: 1,
      userId: undefined,
      dbCourses: [],
    };
  }
};

export default function Courses() {
  const location = useLocation();
  const isIndex =
    location.pathname === "/courses" || location.pathname === "/courses/";

  if (!isIndex) {
    return <Outlet />;
  }

  return <CoursesList />;
}

function CoursesList() {
  const { language } = useLanguage();
  const { userStudiengang, marks, currentSemester, userId, dbCourses } =
    useLoaderData() as LoaderData;

  const [listFilter, setListFilter] = useState<
    "current" | "failed" | "completed" | "all"
  >("current");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const coursesSource = useMemo(() => {
    return dbCourses.map((c: any) => ({
      id: c.id,
      title: c.name,
      titleDE: c.name,
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
      description:
        c.description ||
        (language === "de"
          ? "Keine Beschreibung verfügbar."
          : "No description available."),
      instructor: c.instructor || "TBD",
      startDate: c.startDate || "TBD",
    }));
  }, [dbCourses, language, userStudiengang, currentSemester]);

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
      const mark = marks.find(
        (m: any) => m.course === (course.titleDE || course.title)
      );
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

  const getStatusStyles = (status: string, active: boolean) => {
    if (status === "passed")
      return "bg-iu-blue/10 text-iu-blue border-iu-blue/20";
    if (status === "failed")
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    if (active) return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
      {/* Header Section */}
      <header className="mb-6 sm:mb-8 md:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 md:gap-8">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
                {t.modules || t.myCourses}
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {language === "de"
                ? "Verwalte und überwache deinen akademischen Fortschritt."
                : "Manage and track your academic progress."}
            </p>

            {userStudiengang && (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-xs sm:text-sm font-bold w-fit flex-wrap">
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {userStudiengang}
                </span>
                <span className="ml-1 sm:ml-2">
                  {language === "de"
                    ? `${currentSemester}. Sem.`
                    : `Sem. ${currentSemester}`}
                </span>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-96">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-iu-blue/20 to-blue-500/20 rounded-[1.2rem] blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative">
              <Search className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder={
                  language === "de" ? "Modul suchen..." : "Search module..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 sm:pl-12 md:pl-14 pr-4 sm:pr-6 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-card/50 backdrop-blur-xl border border-border focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all outline-none font-bold text-xs sm:text-sm shadow-sm hover:shadow-md"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="filter-tabs-scroll mb-4 sm:mb-6 md:mb-8">
        {[
          {
            id: "current",
            label:
              language === "de" ? "AKTUELLES SEMESTER" : "CURRENT SEMESTER",
            icon: Clock,
            count: coursesWithStatus.filter(
              (c) => c.semesterNumber === currentSemester
            ).length,
          },
          {
            id: "completed",
            label: language === "de" ? "ABGESCHLOSSEN" : "COMPLETED",
            icon: CheckCircle2,
            count: coursesWithStatus.filter((c) => c.status === "passed")
              .length,
          },
          {
            id: "failed",
            label: language === "de" ? "NICHT BESTANDEN" : "FAILED",
            icon: XCircle,
            count: coursesWithStatus.filter((c) => c.status === "failed")
              .length,
          },
          {
            id: "all",
            label: language === "de" ? "ALLE MODULE" : "ALL MODULES",
            icon: Filter,
            count: coursesWithStatus.length,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setListFilter(tab.id as any)}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs md:text-sm transition-all whitespace-nowrap border ${
              listFilter === tab.id
                ? "bg-iu-blue text-white border-iu-blue shadow-lg shadow-iu-blue/20"
                : "bg-card/50 text-muted-foreground border-border hover:border-iu-blue/50 hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">
              {tab.id === "current"
                ? "AKTUELL"
                : tab.id === "completed"
                  ? "FERTIG"
                  : tab.id === "failed"
                    ? "OFFEN"
                    : "ALLE"}
            </span>
            <span
              className={`ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] ${listFilter === tab.id ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"}`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {filteredCourses.map((course: any) => (
          <div
            key={course.id}
            onClick={() => handleCourseClick(course)}
            className="group relative flex flex-col rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-iu-blue/50 hover:shadow-2xl hover:shadow-iu-blue/10 cursor-pointer"
          >
            {/* Progress Bar at Top */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
              <div
                className="h-full bg-iu-blue progress-bar"
                style={{ width: `${course.progress}%` }}
              />
            </div>

            <div className="p-4 sm:p-5 md:p-8 flex flex-col h-full">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  {course.semester}
                </span>
                <div
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(course.status, course.active)}`}
                >
                  {course.status === "passed"
                    ? language === "de"
                      ? `✓ ${course.markValue?.toFixed(1)}`
                      : `✓ ${course.markValue?.toFixed(1)}`
                    : course.status === "failed"
                      ? language === "de"
                        ? "Wdh."
                        : "Retry"
                      : course.active
                        ? language === "de"
                          ? "Aktiv"
                          : "Active"
                        : language === "de"
                          ? "Offen"
                          : "Open"}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 group-hover:text-iu-blue transition-colors line-clamp-2 leading-tight">
                {course.title}
              </h3>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <CalendarDays className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-iu-blue flex-shrink-0" />
                  <span className="truncate">{course.startDate}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <UserIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-iu-blue flex-shrink-0" />
                  <span className="truncate">{course.instructor}</span>
                </div>
              </div>

              {/* Description - hidden on mobile */}
              <p className="hidden sm:block text-xs sm:text-sm text-muted-foreground line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 md:mb-8 flex-grow leading-relaxed">
                {course.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 sm:pt-4 md:pt-6 border-t border-border mt-auto">
                <div className="flex items-center gap-1.5 sm:gap-2 text-iu-blue font-bold text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest">
                  <span className="hidden sm:inline">
                    {language === "de" ? "Kurs öffnen" : "Open Course"}
                  </span>
                  <span className="sm:hidden">
                    {language === "de" ? "Öffnen" : "Open"}
                  </span>
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-2 transition-transform" />
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-bold">
                    {course.credits} CP
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-12 sm:py-16 md:py-20 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-dashed border-border bg-card/30 backdrop-blur-sm">
          <div className="inline-flex p-3 sm:p-4 rounded-full bg-muted mb-3 sm:mb-4">
            <Search className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
          </div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
            {language === "de" ? "Keine Kurse gefunden" : "No courses found"}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            {language === "de"
              ? "Versuche es mit einem anderen Filter."
              : "Try adjusting your filters."}
          </p>
        </div>
      )}
    </div>
  );
}
