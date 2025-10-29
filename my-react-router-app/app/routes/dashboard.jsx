import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";

export async function loader() {
  return null;
}

export default function Dashboard() {
  const [language, setLanguage] = useState("de");
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const translations = {
    de: {
      welcome: "Willkommen zurück",
      overview: "Übersicht",
      courses: "Kurse",
      tasks: "Aufgaben",
      messages: "Nachrichten",
      settings: "Einstellungen",
      logout: "Abmelden",
      currentCourses: "Aktuelle Kurse",
      upcomingDeadlines: "Anstehende Fristen",
      recentMessages: "Neue Nachrichten",
      myProgress: "Mein Fortschritt",
      nextExam: "Nächste Prüfung",
      noMessages: "Keine neuen Nachrichten",
      grade: "Note",
      deadline: "Frist",
      submitted: "Eingereicht",
      pending: "Ausstehend",
      completed: "Abgeschlossen",
      inProgress: "In Bearbeitung",
      language: "Sprache",
      profile: "Profil",
    },
    en: {
      welcome: "Welcome back",
      overview: "Overview",
      courses: "Courses",
      tasks: "Tasks",
      messages: "Messages",
      settings: "Settings",
      logout: "Logout",
      currentCourses: "Current Courses",
      upcomingDeadlines: "Upcoming Deadlines",
      recentMessages: "Recent Messages",
      myProgress: "My Progress",
      nextExam: "Next Exam",
      noMessages: "No new messages",
      grade: "Grade",
      deadline: "Deadline",
      submitted: "Submitted",
      pending: "Pending",
      completed: "Completed",
      inProgress: "In Progress",
      language: "Language",
      profile: "Profile",
    },
  };

  const t = translations[language];

  // Mock data
  const courses = [
    {
      id: 1,
      name: "Softwareentwicklung",
      progress: 65,
      color: "from-blue-500 to-blue-600",
      icon: "💻",
    },
    {
      id: 2,
      name: "Datenbanken",
      progress: 80,
      color: "from-purple-500 to-purple-600",
      icon: "🗄️",
    },
    {
      id: 3,
      name: "Web-Technologien",
      progress: 45,
      color: "from-green-500 to-green-600",
      icon: "🌐",
    },
    {
      id: 4,
      name: "Projektmanagement",
      progress: 90,
      color: "from-orange-500 to-orange-600",
      icon: "📊",
    },
  ];

  const tasks = [
    {
      id: 1,
      title: "React Projekt abgeben",
      deadline: "2025-10-28",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      title: "Datenbank-Design Review",
      deadline: "2025-10-31",
      status: "inProgress",
      priority: "high",
    },
    {
      id: 3,
      title: "API Dokumentation",
      deadline: "2025-11-05",
      status: "pending",
      priority: "medium",
    },
    {
      id: 4,
      title: "Unit Tests schreiben",
      deadline: "2025-11-10",
      status: "inProgress",
      priority: "medium",
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Prof. Dr. Schmidt",
      subject: "Neue Vorlesungsfolien",
      time: "vor 2 Std.",
      unread: true,
    },
    {
      id: 2,
      sender: "Team Lead",
      subject: "Projektfortschritt besprochen",
      time: "vor 1 Tag",
      unread: false,
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get session token from localStorage as backup
        const sessionToken = localStorage.getItem("sessionToken");
        const headers = {};
        if (sessionToken) {
          headers["X-Session-Token"] = sessionToken;
          console.log("📤 Sending session token in header");
        }

        const response = await fetch("/api/user", {
          credentials: "include",
          headers,
        });
        console.log("📨 User API response status:", response.status);
        if (response.ok) {
          const data = await response.json();
          console.log("📨 User data:", data);
          setUser(data.user || { name: "Student" });
        } else if (response.status === 401) {
          console.log("⚠️ User not authenticated, redirecting to login");
          navigate("/login");
        } else {
          console.error("❌ User API error:", response.status);
          setUser({ name: "Student" });
        }
      } catch (err) {
        console.error("❌ Error fetching user:", err);
        setUser({ name: "Student" });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          darkMode
            ? "bg-gradient-to-br from-slate-900 to-slate-800"
            : "bg-gradient-to-br from-blue-50 to-cyan-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p
            className={`text-lg font-semibold ${darkMode ? "text-white" : "text-slate-700"}`}
          >
            {language === "de" ? "Laden..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  const handleLogout = () => navigate("/logout");

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        darkMode
          ? "bg-gray-950"
          : "bg-white"
      }`}
    >
      {/* Premium Top Navigation */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500 ${
          darkMode
            ? "bg-gray-900/70 border-gray-700/50 shadow-2xl shadow-black/20"
            : "bg-white/70 border-blue-100/50 shadow-2xl shadow-blue-900/10"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Premium */}
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300">
                <span className="text-white font-bold text-lg">IU</span>
              </div>
              <div>
                <h1
                  className={`font-bold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  StudyHub
                </h1>
              </div>
            </div>

            {/* Center: User - Premium */}
            <div
              className={`hidden md:flex items-center gap-3 px-4 py-2 rounded-full ${
                darkMode
                  ? "bg-gray-800/50 text-gray-300"
                  : "bg-blue-50/50 text-slate-700"
              }`}
            >
              <span className="text-lg">👤</span>
              <span className="text-sm font-semibold">
                {user?.name?.split(" ")[0] || "Student"}
              </span>
            </div>

            {/* Right: Controls - Premium */}
            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  darkMode
                    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === "de" ? "en" : "de")}
                className={`px-3 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 ${
                  darkMode
                    ? "bg-gray-800 text-white hover:bg-gray-700"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg"
                }`}
              >
                {language === "de" ? "EN" : "DE"}
              </button>

              {/* Messages */}
              <Link
                to="/messages"
                className={`p-2 rounded-xl transition-all duration-300 relative hover:scale-110 ${
                  darkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-blue-100 text-slate-600"
                }`}
                title={t.messages}
              >
                💬
                {messages.some((m) => m.unread) && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
                )}
              </Link>

              {/* Settings */}
              <Link
                to="/settings"
                className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
                  darkMode
                    ? "hover:bg-gray-800 text-gray-300"
                    : "hover:bg-blue-100 text-slate-600"
                }`}
                title={t.settings}
              >
                ⚙️
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/50`}
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Main Content */}
      <main className="w-full px-6 sm:px-8 lg:px-12 py-20">
        {/* Hero Header - Premium */}
        <div className="mb-20">
          <div className="relative">
            <div className="relative">
              <h2
                className={`text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r ${
                  darkMode
                    ? "from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    : "from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent"
                } drop-shadow-lg`}
              >
                {t.welcome}, {user?.name?.split(" ")[0] || "Student"}! 👋
              </h2>
              <p
                className={`text-2xl font-semibold ${darkMode ? "text-gray-300" : "text-slate-700"}`}
              >
                Dein persönliches Lernerlebnis wartet auf dich
              </p>
            </div>
          </div>
        </div>

        {/* Premium Stats Grid - Full Width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {[
            { label: "Aktive Kurse", value: "4", icon: "📚", color: "from-blue-600 to-cyan-600" },
            { label: "Anstehend", value: "3", icon: "📋", color: "from-purple-600 to-pink-600" },
            { label: "Abgeschlossen", value: "12", icon: "✅", color: "from-green-600 to-emerald-600" },
            { label: "Gesamtnote", value: "2.1", icon: "📊", color: "from-orange-600 to-red-600" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`group rounded-3xl shadow-2xl p-10 transition-all duration-500 hover:shadow-2xl hover:scale-105 cursor-pointer overflow-hidden relative ${
                darkMode
                  ? "bg-gray-800/60 border border-gray-700/50"
                  : "bg-white/80 border border-gray-100"
              }`}
            >
              <div className={`absolute -inset-full bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl`}></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <p
                    className={`text-lg font-semibold ${darkMode ? "text-gray-400" : "text-slate-600"}`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={`text-5xl lg:text-6xl font-bold mt-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                </div>
                <span className="text-7xl opacity-80 group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Main Grid - Full Width */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Courses & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Premium Courses Section */}
            <div
              className={`group rounded-3xl shadow-2xl p-12 transition-all duration-500 border overflow-hidden relative ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700/50 hover:border-purple-600/30"
                  : "bg-white/80 border-gray-100 hover:border-purple-300"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/5 group-hover:to-pink-600/5 transition-all duration-500`}></div>
              <div className="relative">
                <h3
                  className={`text-3xl lg:text-4xl font-bold mb-8 flex items-center gap-3 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  <span>📚</span> {t.currentCourses}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className={`group/card rounded-2xl p-7 border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600 hover:border-blue-500 hover:bg-gray-700"
                          : "bg-white border-blue-200 hover:border-blue-400 hover:shadow-lg"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <p className="text-5xl mb-3">{course.icon}</p>
                          <h4
                            className={`font-bold text-xl ${darkMode ? "text-white" : "text-slate-900"}`}
                          >
                            {course.name}
                          </h4>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                            course.progress >= 80
                              ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                              : course.progress >= 50
                                ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700"
                                : "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700"
                          }`}
                        >
                          {course.progress}%
                        </span>
                      </div>
                      <div
                        className={`h-4 rounded-full overflow-hidden ${darkMode ? "bg-gray-600" : "bg-gray-200"} shadow-inner`}
                      >
                        <div
                          className={`h-full bg-gradient-to-r ${course.color} rounded-full shadow-lg`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Premium Tasks Section */}
            <div
              className={`group rounded-3xl shadow-2xl p-12 transition-all duration-500 border overflow-hidden relative ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700/50 hover:border-pink-600/30"
                  : "bg-white/80 border-gray-100 hover:border-pink-300"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-pink-600/0 to-red-600/0 group-hover:from-pink-600/5 group-hover:to-red-600/5 transition-all duration-500`}></div>
              <div className="relative">
                <h3
                  className={`text-3xl lg:text-4xl font-bold mb-8 flex items-center gap-3 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  <span>⏰</span> {t.upcomingDeadlines}
                </h3>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`group/task p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                        darkMode
                          ? "bg-gray-700/50 border-gray-600 hover:border-pink-500 hover:bg-gray-700"
                          : "bg-white border-pink-200 hover:border-pink-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p
                            className={`font-semibold text-lg ${darkMode ? "text-white" : "text-slate-900"}`}
                          >
                            {task.title}
                          </p>
                          <p
                            className={`text-base mt-3 flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-slate-600"}`}
                          >
                            📅{" "}
                            {new Date(task.deadline).toLocaleDateString(
                              language === "de" ? "de-DE" : "en-US"
                            )}
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                              task.priority === "high"
                                ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-700"
                                : "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700"
                            }`}
                          >
                            {task.priority === "high" ? "🔴 Hoch" : "🟡 Mittel"}
                          </span>
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                              task.status === "completed"
                                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700"
                                : task.status === "inProgress"
                                  ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700"
                                  : "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700"
                            }`}
                          >
                            {task.status === "completed"
                              ? "✅ Fertig"
                              : task.status === "inProgress"
                                ? "⏳ Läuft"
                                : "⏹️ Offen"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Messages & Quick Links */}
          <div className="space-y-10">
            {/* Premium Messages Card */}
            <div
              className={`group rounded-3xl shadow-2xl p-12 transition-all duration-500 border overflow-hidden relative h-fit ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700/50 hover:border-cyan-600/30"
                  : "bg-white/80 border-gray-100 hover:border-cyan-300"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-cyan-600/0 to-blue-600/0 group-hover:from-cyan-600/5 group-hover:to-blue-600/5 transition-all duration-500`}></div>
              <div className="relative">
                <h3
                  className={`text-3xl lg:text-4xl font-bold mb-6 flex items-center gap-3 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  <span>💬</span> {t.recentMessages}
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-md ${
                          darkMode
                            ? "bg-gray-700/50 border-gray-600 hover:border-cyan-500"
                            : "bg-cyan-50 border-cyan-200 hover:border-cyan-400"
                        }`}
                      >
                        <div className="flex gap-3">
                          <span className={`text-lg ${msg.unread ? "animate-pulse" : ""}`}>
                            ●
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`font-semibold text-base ${darkMode ? "text-white" : "text-slate-900"}`}
                            >
                              {msg.sender}
                            </p>
                            <p
                              className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-slate-600"}`}
                            >
                              {msg.subject}
                            </p>
                            <p
                              className={`text-sm mt-2 ${darkMode ? "text-gray-500" : "text-slate-500"}`}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p
                      className={`text-base text-center py-6 ${darkMode ? "text-gray-400" : "text-slate-600"}`}
                    >
                      {t.noMessages}
                    </p>
                  )}
                </div>
                <Link
                  to="/messages"
                  className={`block mt-6 py-4 px-6 rounded-xl font-semibold text-center text-lg transition-all duration-300 hover:scale-105 bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/50`}
                >
                  Alle anzeigen →
                </Link>
              </div>
            </div>

            {/* Premium Quick Links */}
            <div
              className={`group rounded-3xl shadow-2xl p-12 transition-all duration-500 border overflow-hidden relative ${
                darkMode
                  ? "bg-gray-800/60 border-gray-700/50 hover:border-green-600/30"
                  : "bg-white/80 border-gray-100 hover:border-green-300"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-green-600/0 to-emerald-600/0 group-hover:from-green-600/5 group-hover:to-emerald-600/5 transition-all duration-500`}></div>
              <div className="relative">
                <h3
                  className={`text-3xl lg:text-4xl font-bold mb-6 flex items-center gap-3 ${darkMode ? "text-white" : "text-slate-900"}`}
                >
                  <span>⚡</span> Schnellzugriff
                </h3>
                <div className="space-y-4">
                  {[
                    { name: "Kurse", to: "/courses", icon: "📚" },
                    { name: "Aufgaben", to: "/tasks", icon: "📋" },
                    { name: "Nachrichten", to: "/messages", icon: "💬" },
                    { name: "Einstellungen", to: "/settings", icon: "⚙️" },
                  ].map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`group/link flex items-center p-5 rounded-xl transition-all duration-300 hover:shadow-md hover:translate-x-3 ${
                        darkMode
                          ? "bg-gray-700/50 text-white hover:bg-gray-600 border border-gray-600"
                          : "bg-green-50 text-slate-900 hover:bg-green-100 border border-green-200"
                      }`}
                    >
                      <span className="text-3xl mr-4 group-hover/link:scale-125 transition-transform duration-300">{link.icon}</span>
                      <span className="font-semibold text-lg">{link.name}</span>
                      <span className="ml-auto text-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-300">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
