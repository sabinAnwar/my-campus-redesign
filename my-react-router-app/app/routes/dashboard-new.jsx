import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast } from "../lib/toast";

const TRANSLATIONS = {
  de: {
    overview: "Übersicht",
    practicePhase: "Praxisphase",
    learningPlan: "Lernplan",
    exams: "Prüfungen",
    resources: "Ressourcen",
    messages: "Nachrichten",
    calendar: "Kalender",
    infoSessions: "Info Sessions",
    logout: "Abmelden",
    settings: "Einstellungen",
    quickAccess: "Schnellzugriff",
    newMessages: "Neue Nachrichten",
    noMessages: "Keine neuen Nachrichten",
    upcomingSessions: "Kommende Sessions",
    noSessions: "Keine Sessions geplant",
    thisWeek: "Diese Woche",
    modules: "Module",
    tasks: "Aufgaben",
    progress: "Fortschritt",
    submissions: "Abgaben diese Woche",
    examsThis: "Klausuren ausstehend",
    nextExam: "Nächste: 22. Nov",
    welcomeBack: "Willkommen zurück",
    manageStudies: "Verwalte dein Dual-Studium an einem zentralen Ort",
    online: "Online",
    hybrid: "Hybrid",
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    work: "Arbeit",
    course: "Kurs",
    home: "Home",
    events: "Termine",
    rooms: "Räume",
    files: "Dateien",
    upload: "Upload",
    support: "Support",
  },
  en: {
    overview: "Overview",
    practicePhase: "Practice Phase",
    learningPlan: "Learning Plan",
    exams: "Exams",
    resources: "Resources",
    messages: "Messages",
    calendar: "Calendar",
    infoSessions: "Info Sessions",
    logout: "Logout",
    settings: "Settings",
    quickAccess: "Quick Access",
    newMessages: "New Messages",
    noMessages: "No new messages",
    upcomingSessions: "Upcoming Sessions",
    noSessions: "No sessions scheduled",
    thisWeek: "This Week",
    modules: "Modules",
    tasks: "Tasks",
    progress: "Progress",
    submissions: "Submissions this week",
    examsThis: "Exams pending",
    nextExam: "Next: Nov 22",
    welcomeBack: "Welcome back",
    manageStudies: "Manage your dual degree studies in one place",
    online: "Online",
    hybrid: "Hybrid",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    work: "Work",
    course: "Course",
    home: "Home",
    events: "Events",
    rooms: "Rooms",
    files: "Files",
    upload: "Upload",
    support: "Support",
  },
};

export default function Dashboard() {
  const [language, setLanguage] = useState("de");
  const [showMessages, setShowMessages] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  // Mock data
  const messages = [
    {
      id: 1,
      sender: "Prof. Dr. Sarah Schmidt",
      subject: language === "de" ? "Vorlesungsfolien hochgeladen" : "Lecture slides uploaded",
      preview: language === "de" ? "Die neuen Folien für die nächste Woche..." : "New slides for next week...",
      time: language === "de" ? "vor 2 Std." : "2h ago",
      unread: true,
    },
    {
      id: 2,
      sender: "Markus Weber",
      subject: language === "de" ? "Projektfortschritt besprochen" : "Project progress discussed",
      preview: language === "de" ? "Gutes Feedback zum aktuellen Sprint..." : "Good feedback on current sprint...",
      time: language === "de" ? "vor 1 Tag" : "1d ago",
      unread: false,
    },
  ];

  const infoSessions = [
    {
      id: 1,
      title: language === "de" ? "Karriere im Dual-Studium" : "Career in Dual Degree",
      date: "2025-11-15",
      time: "14:00",
      type: "online",
    },
    {
      id: 2,
      title: language === "de" ? "Praxisphase Tipps & Tricks" : "Practice Phase Tips & Tricks",
      date: "2025-11-20",
      time: "16:00",
      type: "hybrid",
    },
  ];

  const weekDays = language === "de" 
    ? [t.monday, t.tuesday, t.wednesday, t.thursday, t.friday]
    : [t.monday, t.tuesday, t.wednesday, t.thursday, t.friday];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user || { name: "Student" });
        } else if (response.status === 401) {
          navigate("/login");
        } else {
          setUser({ name: "Student" });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser({ name: "Student" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      navigate("/logout");
    } catch (err) {
      showErrorToast("Error logging out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-semibold">
            {language === "de" ? "Laden..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      {/* Professional Header */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">IU</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-blue-900">IU Portal</h1>
                <p className="text-xs text-blue-600 font-semibold">👔 Dual Degree</p>
              </div>
            </div>

            {/* Center: User Greeting */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900">
                  {user?.name || "Student"}
                </p>
                <p className="text-xs text-slate-500">
                  {language === "de" ? "Dual Student" : "Dual Student"}
                </p>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2">
              {/* Messages Button */}
              <button
                onClick={() => setShowMessages(!showMessages)}
                className="relative p-2 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                title={t.messages}
              >
                💬
                {messages.some(m => m.unread) && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Language Select */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded-lg border border-slate-200 transition cursor-pointer"
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition"
              >
                {t.logout}
              </button>
            </div>
          </div>

          {/* Messages Dropdown */}
          {showMessages && (
            <div className="border-t border-blue-100 bg-gradient-to-br from-blue-50 to-white py-4 -mx-4 -mb-4 px-4 mb-4">
              <h3 className="font-bold text-blue-900 mb-3 text-sm">{t.newMessages}</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map(msg => (
                    <div key={msg.id} className={`p-3 rounded-lg border cursor-pointer transition hover:shadow-md ${
                      msg.unread ? 'bg-blue-100 border-blue-300' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-slate-900">{msg.sender}</p>
                          <p className="text-xs text-slate-700">{msg.subject}</p>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{msg.preview}</p>
                        </div>
                        <span className="text-xs text-slate-500 ml-2 whitespace-nowrap">{msg.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">{t.noMessages}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1">
            <Link
              to="/dashboard"
              className="px-4 py-3 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 whitespace-nowrap"
            >
              📊 {t.home}
            </Link>
            <Link
              to="/events"
              className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-200 transition whitespace-nowrap"
            >
              📅 {t.events}
            </Link>
            <Link
              to="/room-booking"
              className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-200 transition whitespace-nowrap"
            >
              🏛️ {t.rooms}
            </Link>
            <Link
              to="/files/recent"
              className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-200 transition whitespace-nowrap"
            >
              📁 {t.files}
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome & Quick Info Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Welcome Card */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-8 shadow-lg">
            <h2 className="text-3xl font-black mb-2">
              {t.welcomeBack}, {user?.name || "Student"}! 👋
            </h2>
            <p className="text-blue-100 mb-6">
              {t.manageStudies}
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 border border-white/30">
                <p className="text-sm text-blue-100">{t.modules}</p>
                <p className="text-3xl font-black mt-2">6</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 border border-white/30">
                <p className="text-sm text-blue-100">{t.tasks}</p>
                <p className="text-3xl font-black mt-2">3</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 border border-white/30">
                <p className="text-sm text-blue-100">{t.progress}</p>
                <p className="text-3xl font-black mt-2">68%</p>
              </div>
            </div>
          </div>

          {/* Info Sessions Card */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
            <h3 className="font-bold text-blue-900 mb-4 flex items-center gap-2 text-lg">
              📚 {t.infoSessions}
            </h3>
            <div className="space-y-3">
              {infoSessions.slice(0, 2).map(session => (
                <div key={session.id} className="text-sm bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="font-semibold text-blue-900">{session.title}</p>
                  <p className="text-xs text-slate-600 mt-2">
                    📅 {session.date} • 🕐 {session.time}
                  </p>
                  <p className="text-xs text-blue-600 mt-2 font-semibold">
                    {session.type === "online" ? "🌐 " + t.online : "🏛️ " + t.hybrid}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar & Schedule Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Calendar */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-blue-100 p-6">
            <h3 className="font-bold text-blue-900 mb-5 text-lg">📅 {t.thisWeek}</h3>
            <div className="grid grid-cols-5 gap-3">
              {weekDays.map((day, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200 text-center">
                  <p className="text-xs font-bold text-blue-900 mb-3">{day}</p>
                  <div className="space-y-2">
                    {idx % 2 === 0 && (
                      <div className="h-7 bg-blue-300 rounded text-xs flex items-center justify-center font-semibold text-blue-900">
                        {t.work}
                      </div>
                    )}
                    {idx % 3 === 0 && (
                      <div className="h-7 bg-green-300 rounded text-xs flex items-center justify-center font-semibold text-green-900">
                        {t.course}
                      </div>
                    )}
                    {idx % 2 === 1 && (
                      <div className="h-7 bg-orange-300 rounded text-xs flex items-center justify-center font-semibold text-orange-900">
                        Praxis
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 space-y-4">
            <div>
              <p className="text-sm text-slate-600 font-semibold">{t.submissions}</p>
              <p className="text-3xl font-black text-blue-600 mt-2">2</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-3">
                <div className="bg-blue-600 h-2 rounded-full" style={{width: "40%"}}></div>
              </div>
            </div>
            <div className="border-t border-slate-200 pt-4">
              <p className="text-sm text-slate-600 font-semibold">{t.examsThis}</p>
              <p className="text-3xl font-black text-orange-600 mt-2">3</p>
              <p className="text-xs text-slate-500 mt-2">📅 {t.nextExam}</p>
            </div>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">⚡ {t.quickAccess}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="#"
              className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-5 border border-blue-200 hover:border-blue-400 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">🏢</div>
              <h4 className="font-bold text-blue-900">{t.practicePhase}</h4>
            </Link>
            <Link
              to="#"
              className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-5 border border-green-200 hover:border-green-400 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">📚</div>
              <h4 className="font-bold text-green-900">{t.learningPlan}</h4>
            </Link>
            <Link
              to="#"
              className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-5 border border-orange-200 hover:border-orange-400 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">📝</div>
              <h4 className="font-bold text-orange-900">{t.exams}</h4>
            </Link>
            <Link
              to="#"
              className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-lg p-5 border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition text-center"
            >
              <div className="text-3xl mb-2">🔗</div>
              <h4 className="font-bold text-indigo-900">{t.resources}</h4>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
