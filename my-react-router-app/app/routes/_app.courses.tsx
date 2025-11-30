import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User as UserIcon,
  CalendarDays,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { saveRecentCourse } from "../lib/recentCourses";
import { TRANSLATIONS, getCourseConfig } from "../data/coursesConfig";
import { useLanguage } from "~/contexts/LanguageContext";

export const loader = async () => {
  return null;
};

export default function Courses() {
  const { language } = useLanguage();
  const [listFilter, setListFilter] = useState("active"); // active | completed
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];
  const courses = getCourseConfig(language);
  const heroText = language === "de"
    ? "Verwalte und überwache deine Kurse"
    : "Manage and track your courses";

  // Function to handle course selection and track it
  const handleCourseClick = (course: any) => {
    // Save to recently visited courses
    saveRecentCourse({
      id: course.id,
      name: course.title,
      studiengang: course.studiengang || "Wirtschaftsinformatik",
      semester: course.semester,
      color: course.color || "blue",
    });

    // Navigate to course detail page
    navigate(`/courses/${course.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
            {t.modules || t.myCourses}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {heroText}
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {(() => {
            const activeCount = courses.filter((c) => c.active).length;
            const completedCount = courses.filter(
              (c) => !c.active || c.progress >= 100
            ).length;
            return (
              <>
                <button
                  onClick={() => setListFilter("active")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    listFilter === "active"
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/40"
                  }`}
                >
                  {language === "de" ? "Aktiv" : "Active"} ({activeCount})
                </button>
                <button
                  onClick={() => setListFilter("completed")}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    listFilter === "completed"
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/40"
                  }`}
                >
                  {language === "de" ? "Abgeschlossen" : "Completed"} (
                  {completedCount})
                </button>
              </>
            );
          })()}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-auto p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            title={language === "de" ? "Aktualisieren" : "Refresh"}
          >
            ↻
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {courses
            .filter((c) =>
              listFilter === "active"
                ? c.active
                : !c.active || c.progress >= 100
            )
            .map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col"
              >
                {/* Top Border Line */}
                <div
                  className={`h-1 w-full rounded-t-xl ${
                    course.color === "blue"
                      ? "bg-blue-500"
                      : course.color === "purple"
                        ? "bg-purple-500"
                        : course.color === "green"
                          ? "bg-emerald-500"
                          : course.color === "orange"
                            ? "bg-orange-500"
                            : course.color === "pink"
                              ? "bg-pink-500"
                              : "bg-slate-400"
                  }`}
                />

                <div className="p-5 flex flex-col h-full">
                  {/* Header: Status */}
                  <div className="flex items-center justify-end mb-3">
                    {course.active && (
                      <span className="text-[10px] px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 uppercase tracking-wider">
                        {language === "de" ? "Aktiv" : "Active"}
                      </span>
                    )}
                    {!course.active && course.progress >= 100 && (
                      <span className="text-[10px] px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 uppercase tracking-wider">
                        {language === "de" ? "Fertig" : "Done"}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:underline mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Meta Info */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {course.startDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <UserIcon className="h-3 w-3" />
                      {course.instructor}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
                    {course.description}
                  </p>

                  {/* Progress Bar */}
                  {course.active && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
                        <span>
                          {language === "de" ? "Fortschritt" : "Progress"}
                        </span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            course.color === "blue"
                              ? "bg-blue-500"
                              : course.color === "purple"
                                ? "bg-purple-500"
                                : course.color === "green"
                                  ? "bg-emerald-500"
                                  : course.color === "orange"
                                    ? "bg-orange-500"
                                    : course.color === "pink"
                                      ? "bg-pink-500"
                                      : "bg-slate-400"
                          }`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer Action */}
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50">
                    <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                      {language === "de" ? "Kurs öffnen" : "Open Course"}
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-full text-white shadow-sm ${
                          course.color === "blue"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : course.color === "purple"
                              ? "bg-gradient-to-r from-purple-500 to-purple-600"
                              : course.color === "green"
                                ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                                : course.color === "orange"
                                  ? "bg-gradient-to-r from-orange-500 to-orange-600"
                                  : course.color === "pink"
                                    ? "bg-gradient-to-r from-pink-500 to-pink-600"
                                    : "bg-gradient-to-r from-slate-500 to-slate-600"
                        }`}
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>

                    {/* Magic Credits Badge */}
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-lg shadow-cyan-500/20 backdrop-blur-md border border-white/10 ${
                        course.color === "blue"
                          ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white"
                          : course.color === "purple"
                            ? "bg-gradient-to-br from-purple-500 to-fuchsia-400 text-white"
                            : course.color === "green"
                              ? "bg-gradient-to-br from-emerald-500 to-teal-400 text-white"
                              : course.color === "orange"
                                ? "bg-gradient-to-br from-orange-500 to-amber-400 text-white"
                                : course.color === "pink"
                                  ? "bg-gradient-to-br from-pink-500 to-rose-400 text-white"
                                  : "bg-gradient-to-br from-slate-600 to-slate-500 text-white"
                      }`}
                    >
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                      <span className="text-xs font-black tracking-wide">
                        {course.credits} CP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
