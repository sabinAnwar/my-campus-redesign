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
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Loading...</p>
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
  const stats = [
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
      label: "Abgabefristen",
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

  // Upcoming classes today
  const todayClasses = [
    {
      id: 1,
      title: "Webentwicklung - Vorlesung",
      time: "10:00 - 11:30",
      location: "Hörsaal A1",
      type: "Vorlesung",
      professor: "Prof. Dr. Schmidt",
      color: "blue",
    },
    {
      id: 2,
      title: "Datenbankdesign - Seminar",
      time: "14:00 - 15:00",
      location: "Seminarraum B2",
      type: "Seminar",
      professor: "Prof. Dr. Müller",
      color: "purple",
    },
    {
      id: 3,
      title: "Mathematik - Übung",
      time: "16:00 - 17:30",
      location: "Raum C3",
      type: "Übung",
      professor: "Dr. Weber",
      color: "green",
    },
  ];

  // Calculate days until deadline
  const calculateDaysLeft = (dueDateString) => {
    const dueDate = new Date(dueDateString.split('.').reverse().join('-'));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Upcoming assignments - Wissenschaftliche Arbeiten
  const upcomingAssignments = [
    {
      id: 1,
      title: "Hausarbeit: Digitale Transformation im E-Commerce",
      course: "E-Commerce",
      dueDate: "15.11.2025",
      type: "Hausarbeit",
      pages: "15-20 Seiten",
      priority: "high",
      completed: false,
    },
    {
      id: 2,
      title: "Seminararbeit: Datenbankmodellierung für große Unternehmen",
      course: "Datenbankdesign",
      dueDate: "18.11.2025",
      type: "Seminararbeit",
      pages: "20-25 Seiten",
      priority: "medium",
      completed: false,
    },
    {
      id: 3,
      title: "Projektarbeit: Entwicklung eines Algorithmus für Routenoptimierung",
      course: "Algorithmen und Datenstrukturen",
      dueDate: "20.11.2025",
      type: "Projektarbeit",
      pages: "25-30 Seiten",
      priority: "medium",
      completed: false,
    },
    {
      id: 4,
      title: "Hausarbeit: Webentwicklung mit modernen Frameworks",
      course: "Webentwicklung",
      dueDate: "12.11.2025",
      type: "Hausarbeit",
      pages: "12-15 Seiten",
      priority: "high",
      completed: false,
    },
    {
      id: 5,
      title: "Forschungsarbeit: Künstliche Intelligenz in der Wirtschaftsinformatik",
      course: "Wirtschaftsinformatik",
      dueDate: "25.11.2025",
      type: "Forschungsarbeit",
      pages: "30-35 Seiten",
      priority: "medium",
      completed: false,
    },
  ].map(assignment => {
    const daysLeft = calculateDaysLeft(assignment.dueDate);
    // Auto-adjust priority based on days left
    let autoPriority = assignment.priority;
    if (daysLeft < 0) {
      autoPriority = "high"; // Overdue
    } else if (daysLeft <= 3) {
      autoPriority = "high"; // Urgent
    } else if (daysLeft <= 7) {
      autoPriority = "medium"; // Soon
    }
    
    return {
      ...assignment,
      daysLeft,
      priority: autoPriority,
    };
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  // Recent files
  const recentFiles = [
    { id: 1, name: "HTML_Basics.pdf", course: "Webentwicklung", type: "pdf", accessed: "Heute, 09:30" },
    { id: 2, name: "SQL_Queries.pdf", course: "Datenbankdesign", type: "pdf", accessed: "Gestern, 14:20" },
    { id: 3, name: "JavaScript_Tutorial.zip", course: "Webentwicklung", type: "zip", accessed: "Gestern, 16:45" },
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
      description: "On October 30, 2025, the front desk at Campus Würzburg will be unstaffed.",
    },
  ];

  // Quick actions
  const quickActions = [
    { label: "Kurse", icon: BookOpen, link: "/courses", color: "blue" },
    { label: "Stundenplan", icon: CalendarDays, link: "/courses/schedule", color: "purple" },
    { label: "Abgabefristen", icon: CheckSquare, link: "/tasks", color: "orange" },
    { label: "Nachrichten", icon: MessageSquare, link: "/messages", color: "green" },
    { label: "Dateien", icon: FileSearch, link: "/files/recent", color: "indigo" },
    { label: "Events", icon: Calendar, link: "/events", color: "pink" },
  ];

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 mt-4">
          <div className="flex-1">
            <h1 className="text-[36px] font-bold text-black leading-tight mb-2">
              {getGreeting()}, {user?.name ? user.name.split(" ")[0] : "Student"} 👋
            </h1>
            <p className="text-gray-700 text-sm font-medium">
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
              blue: "from-blue-50 via-indigo-50 to-blue-100",
              orange: "from-orange-50 via-amber-50 to-orange-100",
              purple: "from-purple-50 via-pink-50 to-purple-100",
              green: "from-green-50 via-emerald-50 to-green-100",
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
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.bgGradient} text-white shadow-lg`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm ${textClasses[stat.color]}`}>
                    {stat.change}
                  </span>
                </div>
                <div className={`text-3xl font-bold ${textClasses[stat.color]} mb-1`}>{stat.value}</div>
                <div className="text-sm text-slate-700 font-medium">{stat.label}</div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Today's Schedule */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <CalendarDays className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Heute</h2>
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
                          ? "bg-white/80 border-blue-500"
                          : cls.color === "purple"
                          ? "bg-white/80 border-purple-500"
                          : "bg-white/80 border-green-500"
                      } hover:shadow-md transition-shadow backdrop-blur-sm`}
                    >
                      <div className={`p-2 rounded-lg bg-white ${
                        cls.color === "blue" ? "text-blue-600" :
                        cls.color === "purple" ? "text-purple-600" :
                        "text-green-600"
                      }`}>
                        <Clock className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 text-sm">{cls.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                            cls.color === "blue" ? "bg-blue-100 text-blue-700" :
                            cls.color === "purple" ? "bg-purple-100 text-purple-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {cls.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
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
                <div className="text-center py-8 text-slate-500">
                  <CalendarDays className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Keine Termine für heute</p>
                </div>
              )}
            </div>

            {/* Upcoming Assignments */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <CheckSquare className="h-5 w-5 text-orange-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Bevorstehende Abgabefristen</h2>
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
                        ? "bg-red-50 border-red-300"
                        : "bg-white/80 border-orange-200"
                    } hover:shadow-md transition-shadow backdrop-blur-sm`}
                  >
                    <button
                      onClick={() => {
                        // Toggle completion
                      }}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {assignment.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-sm">{assignment.title}</h3>
                        {assignment.priority === "high" && (
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-600">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Dringend
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-2">
                        <span className="font-medium">{assignment.course}</span>
                        <span>•</span>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold">
                          {assignment.type}
                        </span>
                        {assignment.pages && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500">{assignment.pages}</span>
                          </>
                        )}
                        <span className="flex items-center gap-1 ml-auto">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="font-medium">Fällig: {assignment.dueDate}</span>
                        </span>
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          assignment.daysLeft < 0 ? "bg-red-100 text-red-700" :
                          assignment.daysLeft === 0 ? "bg-red-200 text-red-800" :
                          assignment.daysLeft <= 3 ? "bg-orange-100 text-orange-700" :
                          assignment.daysLeft <= 7 ? "bg-yellow-100 text-yellow-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {assignment.daysLeft < 0 ? `${Math.abs(assignment.daysLeft)} Tage überfällig!` :
                          assignment.daysLeft === 0 ? "Heute fällig!" :
                          assignment.daysLeft === 1 ? "Morgen fällig!" :
                          `${assignment.daysLeft} Tage`}
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
                  <h2 className="text-lg font-bold text-black">Turnitin Abgaben</h2>
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
                        <h3 className="font-bold text-black text-sm mb-1">{submission.title}</h3>
                        <p className="text-xs text-gray-600">{submission.course}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${
                        submission.status === "submitted" 
                          ? "bg-gray-100 text-gray-800 border-gray-300" 
                          : "bg-white text-gray-700 border-gray-400"
                      }`}>
                        {submission.status === "submitted" ? "Abgegeben" : "Ausstehend"}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-200">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-600" />
                          <span className="text-xs font-semibold text-gray-700">Abgabefrist</span>
                        </div>
                        <p className="text-sm font-bold text-black">{submission.dueDate}</p>
                        <p className={`text-xs mt-1 font-medium ${
                          submission.daysUntilDue <= 3 ? "text-orange-500" : "text-gray-500"
                        }`}>
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
                          <span className="text-xs font-semibold text-gray-700">Korrektur</span>
                        </div>
                        <p className="text-sm font-bold text-black">{submission.correctionDate}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {submission.daysUntilCorrection} Tage nach Abgabe
                        </p>
                      </div>
                    </div>

                    {submission.status === "submitted" && submission.similarity !== undefined && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-700">Turnitin Ähnlichkeit:</span>
                          <span className={`text-sm font-bold px-2 py-1 rounded border-2 ${
                            submission.similarity < 15
                              ? "bg-green-50/50 text-green-600 border-green-300"
                              : submission.similarity < 30
                              ? "bg-orange-50/50 text-orange-600 border-orange-300"
                              : "bg-red-50/50 text-red-600 border-red-300"
                          }`}>
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
                  <div className="p-2 rounded-lg bg-indigo-100">
                    <Bell className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Aktuelles</h2>
                </div>
                <Link
                  to="/news"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
                >
                  Alle anzeigen
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {news.map((item, i) => (
                  <div
                    key={i}
                    className={`relative rounded-2xl p-5 border-2 hover:shadow-lg transition-all duration-300 group ${
                      i === 0 
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" 
                        : "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                        i === 0 ? "bg-blue-400" : "bg-purple-400"
                      }`}
                    />
                    <div className="absolute top-3 right-4 flex flex-col gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold">
                        {item.category}
                      </span>
                      {item.featured && (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-semibold text-slate-800 mb-2 pr-20">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-2 text-xs text-slate-600">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{item.date}</span>
                      </div>
                      <button className="mt-4 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold hover:bg-white transition-colors inline-flex items-center gap-1 shadow-sm">
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
            <div className="bg-gradient-to-br from-slate-50 to-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Schnellzugriff</h2>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, idx) => {
                  const colorClasses = {
                    blue: {
                      border: "hover:border-blue-500 dark:hover:border-blue-400",
                      bg: "bg-blue-100 dark:bg-blue-900/30",
                      text: "text-blue-600 dark:text-blue-400",
                    },
                    purple: {
                      border: "hover:border-purple-500 dark:hover:border-purple-400",
                      bg: "bg-purple-100 dark:bg-purple-900/30",
                      text: "text-purple-600 dark:text-purple-400",
                    },
                    orange: {
                      border: "hover:border-orange-500 dark:hover:border-orange-400",
                      bg: "bg-orange-100 dark:bg-orange-900/30",
                      text: "text-orange-600 dark:text-orange-400",
                    },
                    green: {
                      border: "hover:border-green-500 dark:hover:border-green-400",
                      bg: "bg-green-100 dark:bg-green-900/30",
                      text: "text-green-600 dark:text-green-400",
                    },
                    indigo: {
                      border: "hover:border-indigo-500 dark:hover:border-indigo-400",
                      bg: "bg-indigo-100 dark:bg-indigo-900/30",
                      text: "text-indigo-600 dark:text-indigo-400",
                    },
                    pink: {
                      border: "hover:border-pink-500 dark:hover:border-pink-400",
                      bg: "bg-pink-100 dark:bg-pink-900/30",
                      text: "text-pink-600 dark:text-pink-400",
                    },
                  };
                  const classes = colorClasses[action.color] || colorClasses.blue;
                  
                  return (
                    <Link
                      key={idx}
                      to={action.link}
                      className={`group p-4 rounded-xl border-2 border-slate-200 bg-white ${classes.border} hover:shadow-lg transition-all duration-200`}
                    >
                      <div className={`p-2 rounded-lg ${classes.bg} w-fit mb-2 group-hover:scale-110 transition-transform`}>
                        <action.icon className={`h-5 w-5 ${classes.text}`} />
                      </div>
                      <div className="text-xs font-semibold text-slate-900">{action.label}</div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Recent Files */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Zuletzt verwendet</h2>
                <Link
                  to="/files/recent"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Alle
                </Link>
              </div>
              <div className="space-y-3">
                {recentFiles.map((file) => (
                  <Link
                    key={file.id}
                    to="/files/recent"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/80 hover:bg-white transition-colors group backdrop-blur-sm"
                  >
                    <div className="p-2 rounded-lg bg-indigo-100">
                      <FileText className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600">
                        {file.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {file.course} • {file.accessed}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                  <div className="h-full bg-white rounded-full" style={{ width: "72%" }} />
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
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="h-12 w-16 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0 flex items-center justify-center shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-slate-900 mb-2">
                    STUDIEN EMPFEHLEN
                  </div>
                  <p className="text-xs text-slate-600 mb-4">
                    Empfehle die IU und erhalte{" "}
                    <span className="font-bold text-amber-600">bis zu 200€</span> als Dankeschön!
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm">
                    Bonus abholen
                  </button>
                </div>
              </div>
            </div>

            {/* Exam Guide */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl p-6 shadow-sm">
              <div className="text-sm font-bold text-slate-900 mb-4">
                Prüfungs-Guide
              </div>
              <div className="h-32 rounded-xl bg-gradient-to-br from-orange-200 to-amber-300 mb-4 shadow-inner" />
              <p className="text-xs text-slate-600">
                Hier findest Du alle relevanten Infos zu Deinen Prüfungen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
