import React from "react";
import { useLoaderData, useLocation, Outlet } from "react-router-dom";
import { prisma } from "~/services/prisma";
import { getUserFromRequest } from "~/services/auth.server";
import { TRANSLATIONS } from "~/services/translations/courses";
import { useLanguage } from "~/store/LanguageContext";
import { useCoursesList } from "~/hooks/useCoursesList";
import type { CoursesLoaderData as LoaderData } from "~/types/course";

// Components
import { CoursesHeader } from "~/features/courses/CoursesHeader";
import { CourseFilters } from "~/features/courses/CourseFilters";
import { CourseCard } from "~/features/courses/CourseCard";
import { CoursesEmptyState } from "~/features/courses/CoursesEmptyState";

// Loader for courses page - Unified loader
export const loader = async ({ request }: { request: Request }) => {
  try {
    let user = await getUserFromRequest(request);

    // FALLBACK: If no user from session, use Demo Student
    if (!user) {
      const fallbackUser = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
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
        major: true,
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
      dbUser.major?.name || dbUser.study_program || null;

    // Fetch courses from DB for this user's program
    let dbCourses: any[] = [];
    if (dbUser.major?.id) {
      dbCourses = await prisma.course.findMany({
        where: { major_id: dbUser.major.id },
        orderBy: { semester: "asc" },
      });
    } else if (userStudiengang) {
      const s = await prisma.major.findUnique({
        where: { name: userStudiengang },
      });
      if (s) {
        dbCourses = await prisma.course.findMany({
          where: { major_id: s.id },
          orderBy: { semester: "asc" },
        });
      }
    }

    return {
      userStudiengang,
      marks: dbUser.marks || [],
      currentSemester: dbUser.semester || 1,
      user_id: user.id,
      dbCourses,
    };
  } catch (error) {
    console.error(" [Courses Loader] Error:", error);
    return {
      userStudiengang: null,
      marks: [],
      currentSemester: 1,
      user_id: undefined,
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
  const { userStudiengang, marks, currentSemester, user_id, dbCourses } =
    useLoaderData() as LoaderData;

  const t = TRANSLATIONS[language];

  const {
    listFilter,
    setListFilter,
    searchQuery,
    setSearchQuery,
    coursesWithStatus,
    filteredCourses,
    handleCourseClick,
  } = useCoursesList({
    dbCourses,
    userStudiengang,
    marks,
    currentSemester,
    userId: user_id,
    language,
    t,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <CoursesHeader
        t={t}
        language={language}
        userStudiengang={userStudiengang}
        currentSemester={currentSemester}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <CourseFilters
        t={t}
        listFilter={listFilter}
        setListFilter={setListFilter}
        coursesWithStatus={coursesWithStatus}
        currentSemester={currentSemester}
      />

      {/* Courses Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {filteredCourses.map((course: any) => (
          <CourseCard
            key={course.id}
            course={course}
            language={language}
            t={t}
            onClick={() => handleCourseClick(course)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && <CoursesEmptyState t={t} />}
    </div>
  );
}
