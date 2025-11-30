import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import FirstSemesterOnboarding from "~/components/FirstSemesterOnboarding";

import {
  Calendar,
  BookOpen,
  CheckSquare,
  Clock,
  FileText,
  Bell,
  ArrowRight,
  Play,
  TrendingUp,
  AlertCircle,
  CalendarDays,
  GraduationCap,
  MessageSquare,
  FileSearch,
  BarChart3,
  Award,
  Zap,
  Target,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  MapPin,
  Users,
  DoorOpen,
  History,
  Library,
} from "lucide-react";
import { calculateDaysLeft } from "~/lib/tasksSample";
import { prisma } from "~/lib/prisma";
import { useLoaderData } from "react-router-dom";
import { ACTIVE_COURSES_COUNT } from "~/lib/coursesMeta";

type DashboardTask = {
  id: number;
  title: string;
  course: string;
  kind: "ABGABE" | "KLAUSUR";
  type: string;
  dueDate: string;
};

type DashboardNewsItem = {
  slug: string;
  title: string;
  date: string;
  category?: string | null;
  description?: string | null;
  featured?: boolean;
};

type DashboardLoaderData = {
  tasks: DashboardTask[];
  news: DashboardNewsItem[];
};

export const loader = async ({ request }: { request: Request }) => {
  let tasks: DashboardTask[] = [];
  let news: DashboardNewsItem[] = [];
  let tasksTotal = 0;

  try {
    const [rows, total] = await Promise.all([
      prisma.studentTask.findMany({
        orderBy: { dueDate: "asc" },
        take: 6,
      }),
      prisma.studentTask.count(),
    ]);
    tasks = rows.map(
      (t: {
        id: any;
        title: any;
        course: any;
        kind: any;
        type: any;
        dueDate: { toISOString: () => any };
      }) => ({
        id: t.id,
        title: t.title,
        course: t.course,
        kind: t.kind,
        type: t.type,
        dueDate: t.dueDate.toISOString(),
      })
    );
    tasksTotal = total;
  } catch {
    tasks = [];
    tasksTotal = 0;
  }

  try {
    const url = new URL(request.url);
    const res = await fetch(`${url.origin}/api/news?page=1&pageSize=4`);
    if (res.ok) {
      const data = await res.json();
      news = (data.items || []).map((n: any) => ({
        slug: n.slug,
        title: n.title,
        date: n.publishedAt
          ? new Date(n.publishedAt).toLocaleDateString("de-DE")
          : "",
        category: n.category ?? null,
        description: n.excerpt ?? null,
        featured: n.featured ?? false,
      }));
    }
  } catch {
    news = [];
  }

  return { tasks, news, tasksTotal };
};
import { getRecentCourses } from "~/lib/recentCourses";

export default function Dashboard() {
  const { tasks, news, tasksTotal } = useLoaderData() as DashboardLoaderData & {
    tasksTotal: number;
  };

  type User = { name: string; campusArea?: string } | null;
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  type RecentCourse = {
    id: string | number;
    name: string;
    studiengang?: string;
    semester?: string;
    visitedAt: number;
    color?: string;
  };
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🔍 Dashboard: Fetching user...");
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        console.log("📡 Dashboard: Response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Dashboard: User data received:", data);
          setUser(data.user || { name: "Student" });
          setLoading(false);
        } else if (response.status === 401) {
          console.log(
            "❌ Dashboard: User not authenticated (401), redirecting to login"
          );
          // Clear any stale cookies
          document.cookie =
            "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          document.cookie =
            "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          navigate("/login", { replace: true });
        } else {
          console.log("⚠️ Dashboard: Unexpected response, using default user");
          setUser({ name: "Student" });
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Dashboard: Error fetching user:", err);
        // On network error, redirect to login
        console.log("🔄 Dashboard: Network error, redirecting to login");
        navigate("/login", { replace: true });
      }
    };

    fetchUser();

    // Load recently visited courses
    setRecentCourses(getRecentCourses(6));
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 dark:text-slate-300">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  // Active course count (shared with courses page meta)
  const activeCourses = ACTIVE_COURSES_COUNT;

  // Stats
  const statsBase = [
    {
      label: "Aktive Kurse",
      value: String(activeCourses ?? 0),
      change: "+2",
      icon: BookOpen,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      link: "/courses",
    },
    {
      label: "Aufgaben",
      value: String(tasksTotal ?? 0),
      change: "5 fällig",
      icon: CheckSquare,
      color: "orange",
      bgGradient: "from-orange-500 to-orange-600",
      link: "/tasks",
    },
    {
      label: "Heute",
      value: "3",
      change: "Termine",
      icon: CalendarDays,
      color: "purple",
      bgGradient: "from-purple-500 to-purple-600",
      link: "/courses/schedule",
    },
    {
      label: "Fortschritt",
      value: "72%",
      change: "+5%",
      icon: TrendingUp,
      color: "green",
      bgGradient: "from-green-500 to-green-600",
      link: "/curriculum",
    },
  ];

  const bookingLink = user?.campusArea
    ? `/raumbuchung?campus=${encodeURIComponent(user.campusArea)}`
    : "/raumbuchung";

  const stats = [...statsBase];

  const campusStat = {
    label: "Campus",
    value: user?.campusArea || "Raumbuchung",
    change: "Räume",
    icon: DoorOpen,
    color: "blue",
    bgGradient: "from-cyan-500 to-blue-600",
    link: bookingLink,
  };

  // Upcoming classes today
  const todayClasses = [
    {
      id: 1,
      title: "Webentwicklung - Vorlesung",
      time: "10:00 - 11:30",
      location: "Hammerbrook",
      type: "Vorlesung",
      professor: "Prof. Dr. Schmidt",
      color: "blue",
    },
    {
      id: 2,
      title: "Datenbankdesign - Seminar",
      time: "14:00 - 15:00",
      location: "Waterloohain",
      type: "Seminar",
      professor: "Prof. Dr. Müller",
      color: "purple",
    },
    {
      id: 3,
      title: "Mathematik - Übung",
      time: "16:00 - 17:30",
      location: "Hamburg-Mitte",
      type: "Übung",
      professor: "Dr. Weber",
      color: "green",
    },
  ];

  // Upcoming assignments + exams overview (from DB tasks)
  const upcomingAssignments = [
    ...tasks.map((task) => {
      const daysLeft = calculateDaysLeft(task.dueDate);
      return {
        id: `task-${task.id}`,
        title: task.title,
        course: task.course,
        workType: task.type,
        kind:
          task.kind === "KLAUSUR"
            ? ("Klausurtermin" as const)
            : ("Abgabe" as const),
        dueDate: new Date(task.dueDate).toLocaleDateString("de-DE"),
        daysLeft,
        priority:
          task.kind === "KLAUSUR" ? ("high" as const) : ("medium" as const),
        completed: false,
      };
    }),
  ].sort((a, b) => a.daysLeft - b.daysLeft);

  // Quick actions
  const quickActions = [
    { label: "Kurse", icon: BookOpen, link: "/courses", color: "blue" },
    {
      label: "Stundenplan",
      icon: CalendarDays,
      link: "/courses/schedule",
      color: "purple",
    },
    {
      label: "Aufgaben",
      icon: CheckSquare,
      link: "/tasks",
      color: "orange",
    },
    {
      label: "Online Bibliothek",
      icon: Library,
      link: "https://search.ebscohost.com/login.aspx?profile=eds&authtype=sso&custid=s6068579&profile=eds&groupid=main",
      color: "green",
      external: true,
    },
    {
      label: "Raumbuchung",
      icon: DoorOpen,
      link: "/raumbuchung",
      color: "indigo",
    },
    {
      label: "Studentenausweis",
      icon: GraduationCap,
      link: "/student-id",
      color: "pink",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 mt-4">
        <div className="flex-1">
          <h1 className="text-[36px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 leading-tight mb-2">
            {getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Student"}{" "}
            👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Hier ist eine Übersicht über deinen Studienalltag.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              to="/benefits"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary/40 bg-primary/10 text-primary font-semibold hover:bg-primary/15 transition-colors"
            >
              Student Benefits anzeigen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Robot Section */}
        <div className="flex justify-center md:justify-end w-full md:w-auto">
          <div className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
            <iframe
              src="https://my.spline.design/genkubgreetingrobot-CBmqahXcuk8nIjmKWGDo53mA/"
              frameBorder="0"
              width="100%"
              height="100%"
              allow="autoplay; fullscreen"
              title="Spline robot"
              className="rounded-full pointer-events-none"
              style={{
                background: "black",
                transform: "scale(1.05)",
                overflow: "hidden",
              }}
            ></iframe>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const gradientClasses = {
            blue: "from-blue-500 to-indigo-600",
            orange: "from-orange-500 to-amber-600",
            purple: "from-purple-500 to-pink-600",
            green: "from-emerald-500 to-teal-600",
          };

          const bgClasses = {
            blue: "bg-blue-50/50 dark:bg-transparent border-blue-200 dark:border-blue-800",
            orange:
              "bg-orange-50/50 dark:bg-transparent border-orange-200 dark:border-orange-800",
            purple:
              "bg-purple-50/50 dark:bg-transparent border-purple-200 dark:border-purple-800",
            green:
              "bg-emerald-50/50 dark:bg-transparent border-emerald-200 dark:border-emerald-800",
          };

          const textClasses = {
            blue: "text-blue-700 dark:text-blue-300",
            orange: "text-orange-700 dark:text-orange-300",
            purple: "text-purple-700 dark:text-purple-300",
            green: "text-emerald-700 dark:text-emerald-300",
          };

          return (
            <Link
              key={idx}
              to={stat.link}
              className={`group relative overflow-hidden rounded-2xl border p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ${bgClasses[stat.color as keyof typeof bgClasses]}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${gradientClasses[stat.color as keyof typeof gradientClasses]} text-white shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full bg-white/80 dark:bg-black/20 border border-white/50 dark:border-white/10 backdrop-blur-sm ${textClasses[stat.color as keyof typeof textClasses]}`}
                >
                  {stat.change}
                </span>
              </div>
              <div
                className={`text-3xl font-black ${textClasses[stat.color as keyof typeof textClasses]} mb-1`}
              >
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.label}
              </div>

              {/* Bottom Edge Glow Effect - Matches user image */}
              <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/50" />
              <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] dark:via-white/80" />

              {/* Subtle background gradient blob */}
              <div
                className={`absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br ${gradientClasses[stat.color as keyof typeof gradientClasses]} opacity-5 blur-2xl rounded-full group-hover:opacity-10 transition-opacity`}
              />
            </Link>
          );
        })}
      </div>

      {/* Campus + News row under stats (4 equal cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Campus card */}
        <Link
          to={campusStat.link}
          className="group relative overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-transparent p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${campusStat.bgGradient} text-white shadow-lg group-hover:shadow-xl transition-shadow`}
            >
              <campusStat.icon className="h-6 w-6" />
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-white/80 dark:bg-black/20 border border-white/50 dark:border-white/10 backdrop-blur-sm text-blue-700 dark:text-blue-300">
              Räume
            </span>
          </div>
          <div className="text-2xl font-black text-blue-700 dark:text-blue-300 mb-1">
            Campus
          </div>
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {user?.campusArea || "Raumbuchung am Campus"}
          </div>

          {/* Bottom Edge Glow Effect */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/50" />
          <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] dark:via-white/80" />

          {/* Decorative gradient blob */}
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 blur-2xl rounded-full group-hover:opacity-20 transition-opacity" />
        </Link>

        {/* Up to 3 news cards, same size as stats */}
        {news.slice(0, 3).map((item, i) => (
          <Link
            key={item.slug ?? i}
            to={item.slug ? `/news/${encodeURIComponent(item.slug)}` : "/news"}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-transparent p-6 min-h-[150px] hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2 pr-4">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                  <Bell className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </p>
                  {item.category && (
                    <span className="mt-1 inline-flex items-center px-2 py-0.5 rounded bg-white/50 dark:bg-black/20 text-slate-700 dark:text-slate-300 text-[10px] font-semibold border border-indigo-100 dark:border-indigo-800">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium">
                <Calendar className="h-3.5 w-3.5" />
                <span>{item.date}</span>
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline decoration-2 underline-offset-2">
                Weiterlesen
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>

            {/* Bottom Edge Glow Effect */}
            <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent dark:via-white/50" />
            <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent blur-[2px] dark:via-white/80" />

            {/* Decorative gradient blob */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-5 blur-2xl rounded-full group-hover:opacity-15 transition-opacity" />
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white/60 backdrop-blur-md dark:bg-slate-950/60 border border-white/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                  <CalendarDays className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Heute
                </h2>
              </div>
              <Link
                to="/courses/schedule"
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1"
              >
                Alle anzeigen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {todayClasses.length > 0 ? (
              <div className="space-y-3">
                {todayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border-l-4 ${
                      cls.color === "blue"
                        ? "bg-blue-50/50 dark:bg-blue-950/30 border-blue-500"
                        : cls.color === "purple"
                          ? "bg-purple-50/50 dark:bg-purple-950/30 border-purple-500"
                          : "bg-green-50/50 dark:bg-green-950/30 border-green-500"
                    } hover:shadow-md transition-shadow`}
                  >
                    <div
                      className={`p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm ${
                        cls.color === "blue"
                          ? "text-blue-600"
                          : cls.color === "purple"
                            ? "text-purple-600"
                            : "text-green-600"
                      }`}
                    >
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {cls.title}
                        </h3>
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded ${
                            cls.color === "blue"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                              : cls.color === "purple"
                                ? "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                                : "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                          }`}
                        >
                          {cls.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-2 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {cls.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {cls.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {cls.professor}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">Keine Termine für heute</p>
              </div>
            )}
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-white/60 backdrop-blur-md dark:bg-slate-950/60 border border-white/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Bevorstehende Aufgaben
                </h2>
              </div>
              <Link
                to="/tasks"
                className="text-sm font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 inline-flex items-center gap-1"
              >
                Alle anzeigen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border ${
                    assignment.priority === "high"
                      ? "bg-red-50/50 border-red-200 dark:bg-red-950/20 dark:border-red-900/50"
                      : "bg-slate-50/50 border-slate-200 dark:bg-slate-900/30 dark:border-slate-800"
                  } hover:shadow-md transition-shadow`}
                >
                  <button
                    onClick={() => {
                      // Toggle completion
                    }}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {assignment.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
                    {/* Left column: task info */}
                    <div>
                      <div className="flex items-start gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                          {assignment.title}
                        </h3>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                        <span>{assignment.course}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold border border-slate-200 dark:border-slate-700">
                          {assignment.workType}
                        </span>
                      </div>
                    </div>

                    {/* Right column: due / exam date */}
                    <div className="text-right text-xs min-w-[120px]">
                      <div
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                          assignment.kind === "Klausurtermin"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        <Calendar className="h-3 w-3" />
                        <span>
                          {assignment.kind === "Klausurtermin"
                            ? "Klausurtermin"
                            : "Abgabe"}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {assignment.dueDate}
                      </div>
                      <div
                        className={`mt-1 font-bold ${
                          assignment.daysLeft === 0
                            ? "text-red-600 dark:text-red-400"
                            : assignment.daysLeft <= 3
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {assignment.daysLeft === 0
                          ? "Heute!"
                          : assignment.daysLeft < 0
                            ? "Überfällig"
                            : `In ${assignment.daysLeft} Tagen`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Zuletzt besuchte Kurse Section */}
          <div className="bg-white/60 backdrop-blur-md dark:bg-slate-950/60 border border-white/50 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 border border-blue-200 dark:bg-blue-900/50 dark:border-blue-800 text-blue-700 dark:text-blue-300">
                  <History className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Zuletzt besuchte Kurse
                </h2>
              </div>
              <Link
                to="/courses"
                className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1"
              >
                Alle Kurse
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentCourses.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 font-medium">
                    Noch keine Kurse besucht
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Öffne einen Kurs, um ihn hier zu sehen
                  </p>
                  <Link
                    to="/courses"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                  >
                    Kurse entdecken
                  </Link>
                </div>
              ) : (
                recentCourses.map((course) => {
                  const timeSince = Date.now() - course.visitedAt;
                  const hoursAgo = Math.floor(timeSince / (1000 * 60 * 60));
                  const daysAgo = Math.floor(timeSince / (1000 * 60 * 60 * 24));

                  let timeText = "Gerade eben";
                  if (hoursAgo < 1) {
                    const minutesAgo = Math.floor(timeSince / (1000 * 60));
                    timeText =
                      minutesAgo < 1 ? "Gerade eben" : `Vor ${minutesAgo} Min.`;
                  } else if (hoursAgo < 24) {
                    timeText = `Vor ${hoursAgo} Std.`;
                  } else if (daysAgo === 1) {
                    timeText = "Gestern";
                  } else if (daysAgo < 7) {
                    timeText = `Vor ${daysAgo} Tagen`;
                  } else {
                    timeText = new Date(course.visitedAt).toLocaleDateString(
                      "de-DE"
                    );
                  }

                  const colorClasses = {
                    blue: "bg-blue-50/50 border-blue-200 hover:border-blue-300 dark:bg-blue-950/30 dark:border-blue-800 dark:hover:border-blue-700",
                    purple:
                      "bg-purple-50/50 border-purple-200 hover:border-purple-300 dark:bg-purple-950/30 dark:border-purple-800 dark:hover:border-purple-700",
                    green:
                      "bg-green-50/50 border-green-200 hover:border-green-300 dark:bg-green-950/30 dark:border-green-800 dark:hover:border-green-700",
                    orange:
                      "bg-orange-50/50 border-orange-200 hover:border-orange-300 dark:bg-orange-950/30 dark:border-orange-800 dark:hover:border-orange-700",
                    pink: "bg-pink-50/50 border-pink-200 hover:border-pink-300 dark:bg-pink-950/30 dark:border-pink-800 dark:hover:border-pink-700",
                    indigo:
                      "bg-indigo-50/50 border-indigo-200 hover:border-indigo-300 dark:bg-indigo-950/30 dark:border-indigo-800 dark:hover:border-indigo-700",
                  };

                  const iconColorClasses = {
                    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
                    purple:
                      "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
                    green:
                      "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
                    orange:
                      "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
                    pink: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
                    indigo:
                      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
                  };

                  const courseQuery = new URLSearchParams({
                    selectedCourseId: String(course.id),
                  }).toString();

                  return (
                    <Link
                      key={course.id}
                      to={`/courses?${courseQuery}`}
                      className={`block border rounded-xl p-4 transition-all hover:shadow-md ${
                        colorClasses[
                          course.color as keyof typeof colorClasses
                        ] || colorClasses.blue
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            iconColorClasses[
                              course.color as keyof typeof iconColorClasses
                            ] || iconColorClasses.blue
                          }`}
                        >
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 truncate">
                            {course.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            {course.studiengang && (
                              <>
                                <span className="truncate">
                                  {course.studiengang}
                                </span>
                                {course.semester && <span>•</span>}
                              </>
                            )}
                            {course.semester && <span>{course.semester}</span>}
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span>{timeText}</span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-400 flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm dark:bg-slate-950/80 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              Schnellzugriff
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, idx) => {
                const colorClasses = {
                  blue: {
                    border: "hover:border-blue-500 dark:hover:border-blue-400",
                    bg: "bg-blue-100 dark:bg-blue-900/30",
                    text: "text-blue-600 dark:text-blue-400",
                  },
                  purple: {
                    border:
                      "hover:border-purple-500 dark:hover:border-purple-400",
                    bg: "bg-purple-100 dark:bg-purple-900/30",
                    text: "text-purple-600 dark:text-purple-400",
                  },
                  orange: {
                    border:
                      "hover:border-orange-500 dark:hover:border-orange-400",
                    bg: "bg-orange-100 dark:bg-orange-900/30",
                    text: "text-orange-600 dark:text-orange-400",
                  },
                  green: {
                    border:
                      "hover:border-green-500 dark:hover:border-green-400",
                    bg: "bg-green-100 dark:bg-green-900/30",
                    text: "text-green-600 dark:text-green-400",
                  },
                  indigo: {
                    border:
                      "hover:border-indigo-500 dark:hover:border-indigo-400",
                    bg: "bg-indigo-100 dark:bg-indigo-900/30",
                    text: "text-indigo-600 dark:text-indigo-400",
                  },
                  pink: {
                    border: "hover:border-pink-500 dark:hover:border-pink-400",
                    bg: "bg-pink-100 dark:bg-pink-900/30",
                    text: "text-pink-600 dark:text-pink-400",
                  },
                };
                type ColorKey = keyof typeof colorClasses;
                const colorKey: ColorKey =
                  (action.color as ColorKey) in colorClasses
                    ? (action.color as ColorKey)
                    : "blue";
                const classes = colorClasses[colorKey];

                // Use regular <a> tag for external links
                if (action.external) {
                  return (
                    <a
                      key={idx}
                      href={action.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 ${classes.border} hover:shadow-lg transition-all duration-200`}
                    >
                      <div
                        className={`p-2 rounded-lg ${classes.bg} w-fit mb-2 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className={`h-5 w-5 ${classes.text}`} />
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {action.label}
                      </div>
                    </a>
                  );
                } else {
                  return (
                    <Link
                      key={idx}
                      to={action.link}
                      className={`group p-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 ${classes.border} hover:shadow-lg transition-all duration-200`}
                    >
                      <div
                        className={`p-2 rounded-lg ${classes.bg} w-fit mb-2 group-hover:scale-110 transition-transform`}
                      >
                        <action.icon className={`h-5 w-5 ${classes.text}`} />
                      </div>
                      <div className="text-xs font-semibold text-slate-900 dark:text-white">
                        {action.label}
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          </div>

          {/* News Section (next to progress/campus cards) */}
          <div className="bg-white/40 backdrop-blur-xl dark:bg-slate-950/80 border border-white/40 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                  <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Aktuelles
                </h2>
              </div>
              <Link
                to="/news"
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 inline-flex items-center gap-1"
              >
                Alle anzeigen
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {news.map((item, i) => (
                <div
                  key={item.slug ?? i}
                  className="relative rounded-2xl p-4 border bg-white/40 backdrop-blur-xl dark:bg-slate-950/80 border-white/40 dark:border-slate-800 hover:shadow-lg transition-all duration-300 group"
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                      i === 0 ? "bg-blue-400" : "bg-purple-400"
                    }`}
                  />
                  <div className="mt-3 pr-2">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {item.title}
                      </p>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    {item.category && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold mb-1">
                        {item.category}
                      </span>
                    )}
                    {item.description && (
                      <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{item.date}</span>
                      </span>
                      {item.slug && (
                        <Link
                          to={`/news/${encodeURIComponent(item.slug)}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                        >
                          Weiterlesen
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white/40 backdrop-blur-xl dark:bg-slate-950/80 border border-white/40 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Studienfortschritt
              </h2>
            </div>
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  72%
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  abgeschlossen
                </span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: "72%" }}
                />
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              Du bist auf einem guten Weg! Weiter so! 🎉
            </p>
            <Link
              to="/curriculum"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
            >
              Details anzeigen <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Recommendation Card */}
          <div className="bg-white/40 backdrop-blur-xl dark:bg-slate-950/80 border border-white/40 dark:border-slate-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-16 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  STUDIEN EMPFEHLEN
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  Empfehle die IU und erhalte{" "}
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    bis zu 200€
                  </span>{" "}
                  als Dankeschön!
                </p>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm">
                  Bonus abholen
                </button>
              </div>
            </div>
          </div>

          {/* Exam Guide */}
          <div className="bg-white/40 backdrop-blur-xl dark:bg-slate-950/80 border border-white/40 dark:border-slate-800 rounded-2xl p-6">
            <div className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Prüfungs-Guide
            </div>
            <div className="h-32 rounded-xl bg-gradient-to-br from-orange-200 to-amber-300 dark:from-orange-900/30 dark:to-amber-900/30 mb-4" />
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Hier findest Du alle relevanten Infos zu Deinen Prüfungen.
            </p>
          </div>
        </div>
      </div>
      {/* Onboarding für Erstis - DEMO MODE */}
      <FirstSemesterOnboarding
        isFirstSemester={true}
        onComplete={() => {
          console.log("✅ Onboarding abgeschlossen!");
          localStorage.removeItem("iu_onboarding_completed"); // Für Demo: Immer wieder anzeigen
        }}
      />
    </div>
  );
}







