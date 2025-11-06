import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppShell from "../components/AppShell";
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
} from "lucide-react";

export async function loader() {
  return null;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || { name: "Student" });
          setLoading(false);
        } else if (response.status === 401) {
          console.log("User not authenticated, redirecting to login");
          navigate("/login", { replace: true });
        } else {
          console.log("Could not fetch user, using default");
          setUser({ name: "Student" });
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        setUser({ name: "Student" });
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <AppShell>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
              Loading...
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  // Mock data - Stats
  const statsBase = [
    {
      label: "Aktive Kurse",
      value: "8",
      change: "+2",
      icon: BookOpen,
      color: "blue",
      bgGradient: "from-blue-500 to-blue-600",
      link: "/courses",
    },
    {
      label: "Aufgaben",
      value: "12",
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

  const stats = [
    ...statsBase,
    {
      label: "Raumbuchen",
      value: user?.campusArea || "Campus",
      change: "Räume",
      icon: DoorOpen,
      color: "blue",
      bgGradient: "from-cyan-500 to-blue-600",
      link: bookingLink,
    },
  ];

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

  // Upcoming assignments
  const upcomingAssignments = [
    {
      id: 1,
      title: "Hausarbeit: E-Commerce Analyse",
      course: "E-Commerce",
      dueDate: "15.11.2025",
      daysLeft: 3,
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Projekt: Datenbankmodellierung",
      course: "Datenbankdesign",
      dueDate: "18.11.2025",
      daysLeft: 6,
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      title:
        "Präsentation: Algorithmen",
      course: "Algorithmen",
      dueDate: "20.11.2025",
      daysLeft: 8,
      priority: "medium",
      completed: false,
    },
    {
      id: 4,
      title: "Quiz: Webentwicklung",
      course: "Webentwicklung",
      dueDate: "12.11.2025",
      daysLeft: 0,
      priority: "high",
      completed: false,
    },
  ];

  // Recent files
  const recentFiles = [
    {
      id: 1,
      name: "HTML_Basics.pdf",
      course: "Webentwicklung",
      type: "pdf",
      accessed: "Heute, 09:30",
    },
    {
      id: 2,
      name: "SQL_Queries.pdf",
      course: "Datenbankdesign",
      type: "pdf",
      accessed: "Gestern, 14:20",
    },
    {
      id: 3,
      name: "JavaScript_Tutorial.zip",
      course: "Webentwicklung",
      type: "zip",
      accessed: "Gestern, 16:45",
    },
  ];

  // News
  const news = [
    {
      title: "Upcoming Senate election at IU International University",
      date: "2.11.2025",
      category: "Academics",
      featured: true,
    },
    {
      title: "Information about the availability of the Campus",
      date: "2.11.2025",
      category: "Library",
      description:
        "On October 30, 2025, the front desk at Campus Würzburg will be unstaffed.",
    },
  ];

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
      label: "Nachrichten",
      icon: MessageSquare,
      link: "/messages",
      color: "green",
    },
    {
      label: "Dateien",
      icon: FileSearch,
      link: "/files/recent",
      color: "indigo",
    },
    { label: "Events", icon: Calendar, link: "/events", color: "pink" },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 mt-4">
          <div className="flex-1">
            <h1 className="text-[36px] font-bold text-slate-900 dark:text-white leading-tight mb-2">
              {getGreeting()},{" "}
              {user?.name ? user.name.split(" ")[0] : "Student"} 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Hier ist eine Übersicht über deinen Studienalltag.
            </p>
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
                  background: "transparent",
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
              blue: "from-blue-50 to-indigo-50",
              orange: "from-orange-50 to-amber-50",
              purple: "from-purple-50 to-pink-50",
              green: "from-green-50 to-emerald-50",
            };
            const borderClasses = {
              blue: "border-blue-200",
              orange: "border-orange-200",
              purple: "border-purple-200",
              green: "border-green-200",
            };
            const textClasses = {
              blue: "text-blue-700",
              orange: "text-orange-700",
              purple: "text-purple-700",
              green: "text-green-700",
            };

            return (
              <Link
                key={idx}
                to={stat.link}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradientClasses[stat.color]} border-2 ${borderClasses[stat.color]} p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} text-white shadow-lg`}
                  >
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm ${textClasses[stat.color]}`}
                  >
                    {stat.change}
                  </span>
                </div>
                <div
                  className={`text-3xl font-bold ${textClasses[stat.color]} mb-1`}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Heute</h2>
                </div>
                <Link
                  to="/courses/schedule"
                  className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1"
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
                          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                          : cls.color === "purple"
                            ? "bg-purple-50 dark:bg-purple-900/20 border-purple-500"
                            : "bg-green-50 dark:bg-green-900/20 border-green-500"
                      } hover:shadow-md transition-shadow`}
                    >
                      <div
                        className={`p-2 rounded-lg bg-white dark:bg-slate-800 ${
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
                          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                            {cls.title}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              cls.color === "blue"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : cls.color === "purple"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {cls.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-2">
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
                  <p className="text-sm">Keine Termine für heute</p>
                </div>
              )}
            </div>

            {/* Upcoming Assignments */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <CheckSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Bevorstehende Aufgaben
                  </h2>
                </div>
                <Link
                  to="/tasks"
                  className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 inline-flex items-center gap-1"
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
                        ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          {assignment.title}
                        </h3>
                        {assignment.priority === "high" && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-600 dark:text-red-400">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Dringend
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mt-2">
                        <span>{assignment.course}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          Fällig: {assignment.dueDate}
                        </span>
                        <span className={`font-semibold ${
                          assignment.daysLeft === 0 ? "text-red-600 dark:text-red-400" :
                          assignment.daysLeft <= 3 ? "text-orange-600 dark:text-orange-400" :
                          "text-slate-600 dark:text-slate-400"
                        }`}>
                          {assignment.daysLeft === 0 ? "Heute!" : `${assignment.daysLeft} Tage`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Turnitin Abgaben Section */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 border border-gray-300">
                    <FileText className="h-5 w-5 text-gray-700" />
                  </div>
                  <h2 className="text-lg font-bold text-black">
                    Turnitin Abgaben
                  </h2>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    title: "Hausarbeit: Digitale Transformation im E-Commerce",
                    course: "E-Commerce",
                    dueDate: "15.11.2025",
                    correctionDate: "22.11.2025",
                    status: "pending",
                    daysUntilDue: 3,
                    daysUntilCorrection: 10,
                  },
                  {
                    id: 2,
                    title: "Seminararbeit: Datenbankmodellierung",
                    course: "Datenbankdesign",
                    dueDate: "18.11.2025",
                    correctionDate: "25.11.2025",
                    status: "submitted",
                    similarity: 12,
                    daysUntilDue: 6,
                    daysUntilCorrection: 13,
                  },
                  {
                    id: 3,
                    title: "Projektarbeit: Algorithmus für Routenoptimierung",
                    course: "Algorithmen",
                    dueDate: "20.11.2025",
                    correctionDate: "27.11.2025",
                    status: "pending",
                    daysUntilDue: 8,
                    daysUntilCorrection: 15,
                  },
                ].map((submission) => (
                  <div
                    key={submission.id}
                    className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-sm mb-1">
                          {submission.title}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {submission.course}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold border ${
                          submission.status === "submitted"
                            ? "bg-gray-100 text-gray-800 border-gray-300"
                            : "bg-white text-gray-700 border-gray-400"
                        }`}
                      >
                        {submission.status === "submitted"
                          ? "Abgegeben"
                          : "Ausstehend"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-700">
                            Abgabefrist
                          </span>
                        </div>
                        <p className="text-sm font-bold text-black">
                          {submission.dueDate}
                        </p>
                        <p
                          className={`text-xs mt-1 font-medium ${
                            submission.daysUntilDue <= 3
                              ? "text-orange-500"
                              : "text-gray-500"
                          }`}
                        >
                          {submission.daysUntilDue <= 0
                            ? "Überfällig"
                            : submission.daysUntilDue === 1
                              ? "1 Tag verbleibend"
                              : `${submission.daysUntilDue} Tage verbleibend`}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CheckSquare className="h-3.5 w-3.5 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-700">
                            Korrektur
                          </span>
                        </div>
                        <p className="text-sm font-bold text-black">
                          {submission.correctionDate}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {submission.daysUntilCorrection} Tage nach Abgabe
                        </p>
                      </div>
                    </div>

                    {submission.status === "submitted" &&
                      submission.similarity !== undefined && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700">
                              Turnitin Ähnlichkeit:
                            </span>
                            <span
                              className={`text-sm font-bold px-2 py-1 rounded border-2 ${
                                submission.similarity < 15
                                  ? "bg-green-50/50 text-green-600 border-green-300"
                                  : submission.similarity < 30
                                    ? "bg-orange-50/50 text-orange-600 border-orange-300"
                                    : "bg-red-50/50 text-red-600 border-red-300"
                              }`}
                            >
                              {submission.similarity}%
                            </span>
                          </div>
                        </div>
                      )}

                    {submission.status === "pending" && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <button className="w-full py-2 px-4 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors border border-gray-800">
                          Abgabe vorbereiten
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* News Section */}
            <div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.map((item, i) => (
                  <div
                    key={i}
                    className="relative rounded-2xl p-5 border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                        i === 0 ? "bg-blue-400" : "bg-purple-400"
                      }`}
                    />
                    <div className="absolute top-3 right-4 flex flex-col gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                        {item.category}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2 pr-20">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{item.date}</span>
                      </div>
                      <button className="mt-4 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors inline-flex items-center gap-1">
                        Weiterlesen <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Schnellzugriff
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => {
                  const colorClasses = {
                    blue: {
                      border:
                        "hover:border-blue-500 dark:hover:border-blue-400",
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
                      border:
                        "hover:border-pink-500 dark:hover:border-pink-400",
                      bg: "bg-pink-100 dark:bg-pink-900/30",
                      text: "text-pink-600 dark:text-pink-400",
                    },
                  };
                  const classes =
                    colorClasses[action.color] || colorClasses.blue;

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
                })}
              </div>
            </div>

            {/* Recent Files */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Zuletzt verwendet
                </h2>
                <Link
                  to="/files/recent"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                >
                  Alle
                </Link>
              </div>
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <Link
                    key={file.id}
                    to="/files/recent"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700">
                      <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {file.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {file.course} • {file.accessed}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                  <Target className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold">Studienfortschritt</h2>
              </div>
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-3xl font-bold">72%</span>
                  <span className="text-sm opacity-90">abgeschlossen</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full"
                    style={{ width: "72%" }}
                  />
                </div>
              </div>
              <p className="text-sm opacity-90 mb-4">
                Du bist auf einem guten Weg! Weiter so! 🎉
              </p>
              <Link
                to="/curriculum"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-blue-600 text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Details anzeigen <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Recommendation Card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
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
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
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
      </div>
    </AppShell>
  );
}
