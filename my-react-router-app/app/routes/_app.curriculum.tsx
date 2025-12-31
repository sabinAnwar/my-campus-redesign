import React, { useMemo } from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
  Layout,
  GraduationCap,
  BarChart3,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { useLoaderData } from "react-router-dom";
import { getCourseConfig } from "../data/coursesConfig";

import type { CurriculumMark as Mark } from "~/types/curriculum";


export const loader = async ({ request }: { request: Request }) => {
  const user = await getUserFromRequest(request);
  let userId = user?.id;

  if (!userId) {
    const sabin = await prisma.user.findUnique({
      where: { email: "sabin.elanwar@iu-study.org" },
      select: { id: true },
    });
    userId = sabin?.id;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      marks: true,
      studiengang: true,
    },
  });

  return { user: dbUser };
};

const TRANSLATIONS = {
  de: {
    title: "Studienplan",
    subtitle: "Curriculum & Module",
    description:
      "Deine akademische Reise im Überblick. Verfolge deinen Fortschritt und plane deine kommenden Semester.",
    totalECTS: "Gesamt ECTS",
    completedECTS: "Erreichte ECTS",
    currentSemester: "Aktuelles Semester",
    progress: "Studienfortschritt",
    semester: "Semester",
    module: "Modul",
    credits: "Credits",
    status: "Status",
    completed: "Abgeschlossen",
    upcoming: "Bevorstehend",
    inProgress: "In Bearbeitung",
    searchPlaceholder: "Module suchen...",
  },
  en: {
    title: "Study Plan",
    subtitle: "Curriculum & Modules",
    description:
      "Your academic journey at a glance. Track your progress and plan your upcoming semesters.",
    totalECTS: "Total ECTS",
    completedECTS: "Earned ECTS",
    currentSemester: "Current Semester",
    progress: "Study Progress",
    semester: "Semester",
    module: "Module",
    credits: "Credits",
    status: "Status",
    completed: "Completed",
    upcoming: "Upcoming",
    inProgress: "In Progress",
    searchPlaceholder: "Search modules...",
  },
};

export default function CurriculumPage() {
  const { language } = useLanguage();
  const { user } = useLoaderData<typeof loader>();
  const t = TRANSLATIONS[language];

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

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <Layout size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.subtitle}
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
              <GraduationCap size={16} />
              <span>{userProgram}</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-w-[300px]">
            <div className="flex items-center gap-4 mb-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                {t.progress}
              </span>
            </div>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-foreground">
                {stats.percent}%
              </span>
              <span className="text-muted-foreground font-bold mb-1 text-sm">
                {stats.completed} / {stats.total} ECTS
              </span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-iu-blue transition-all duration-1000"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            label: t.totalECTS,
            val: stats.total,
            icon: Award,
            color: "iu-blue",
            bg: "bg-iu-blue",
          },
          {
            label: t.completedECTS,
            val: stats.completed,
            icon: CheckCircle2,
            color: "iu-green",
            bg: "bg-iu-green",
          },
          {
            label: t.currentSemester,
            val: stats.current,
            icon: Calendar,
            color: "iu-purple",
            bg: "bg-iu-purple",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border p-10 shadow-2xl hover:shadow-iu-blue/10 transition-all duration-500 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <stat.icon className="h-24 w-24" />
            </div>
            <div className="relative z-10">
              <div
                className={`p-4 rounded-2xl ${stat.bg}/10 w-fit mb-6 group-hover:scale-110 transition-transform duration-500`}
              >
                <stat.icon className={`h-8 w-8 text-${stat.color}`} />
              </div>
              <p className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">
                {stat.label}
              </p>
              <p className="text-5xl font-black text-foreground tracking-tight">
                {stat.val}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CURRICULUM SECTIONS */}
      <div className="space-y-12 pb-20">
        {semesters.map(([semesterName, courses], idx) => (
          <div key={semesterName} className="space-y-6">
            <div className="flex items-center gap-4 px-4">
              <div className="h-1 w-12 bg-iu-blue rounded-full" />
              <h2 className="text-3xl font-black text-foreground tracking-tight uppercase">
                {semesterName}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, cIdx) => {
                const isCompleted = user?.marks?.some(
                  (m: any) => m.course === course.titleDE && m.value <= 4.0
                );
                const isCurrent = user?.semester === parseInt(semesterName);

                return (
                  <div
                    key={course.id}
                    className={`group relative overflow-hidden rounded-[2rem] border transition-all duration-500 ${
                      isCompleted
                        ? "bg-iu-blue/5 border-iu-blue/20 hover:border-iu-blue/40"
                        : isCurrent
                          ? "bg-iu-blue/5 border-iu-blue/20 hover:border-iu-blue/40 shadow-xl shadow-iu-blue/5"
                          : "bg-card/40 border-border hover:border-iu-blue/30"
                    }`}
                  >
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div
                          className={`p-3 rounded-xl ${
                            isCompleted
                              ? "bg-iu-blue/10 text-iu-blue dark:text-iu-blue"
                              : "bg-iu-blue/10 text-iu-blue"
                          }`}
                        >
                          <BookOpen size={24} />
                        </div>
                        {isCompleted ? (
                          <div className="flex items-center gap-2 bg-iu-blue/10 text-iu-blue dark:text-iu-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <CheckCircle2 size={12} />
                            {t.completed}
                          </div>
                        ) : isCurrent ? (
                          <div className="flex items-center gap-2 bg-iu-blue/10 text-iu-blue px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <Clock size={12} />
                            {t.inProgress}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 bg-muted text-muted-foreground px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            <ChevronRight size={12} />
                            {t.upcoming}
                          </div>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-foreground mb-2 leading-tight group-hover:text-iu-blue transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6">
                        {course.code}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Award size={14} className="text-iu-blue" />
                          <span className="text-sm font-black text-foreground">
                            {course.credits} ECTS
                          </span>
                        </div>
                        <button className="p-2 hover:bg-iu-blue/10 rounded-lg transition-colors text-iu-blue">
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
