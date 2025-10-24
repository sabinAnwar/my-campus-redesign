import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showErrorToast } from "../lib/toast";

const TABS = [
  { name: "Studienplan", icon: "📚" },
  { name: "Klausuren", icon: "📝" },
  { name: "Bibliothek", icon: "🏛️" },
  { name: "FAQ", icon: "❓" },
  { name: "News", icon: "📰" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Studienplan");
  const [faqOpen, setFaqOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Try to fetch user data from session
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user", {
          credentials: "include",
        });

        console.log("User API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("User data loaded:", data);
          setUser(data.user || { name: "Student" });
        } else if (response.status === 401) {
          // User not authenticated, redirect to login
          console.log("User not authenticated, redirecting to login");
          navigate("/login");
        } else {
          // Other error
          console.log("User API error:", response.status);
          setUser({ name: "Student" }); // Fallback
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setUser({ name: "Student" }); // Fallback
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-semibold">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Top Banner - Premium */}
      <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-center py-3 text-sm font-semibold shadow-lg">
        🎓 Willkommen zum IU Student Portal • Alles an einem Ort verwalten
      </div>

      {/* Premium Header */}
      <header className="bg-white sticky top-0 z-50 flex items-center justify-between px-8 py-6 shadow-xl border-b-2 border-slate-200">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg blur opacity-30"></div>
            <div className="relative h-12 w-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">iu</span>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">
              IU Student Portal
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Dual Degree Excellence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* User Info */}
          <div className="text-right hidden md:block">
            <p className="text-base font-bold text-slate-900">
              👋 {user?.name || "Student"}
            </p>
            <p className="text-xs text-slate-500">
              {user?.email || "student@iu-study.org"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg transition shadow-md border border-slate-200">
              ⚙️ Einstellungen
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition shadow-md border border-red-200"
            >
              🚪 Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white px-8 py-12 shadow-xl">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Welcome */}
            <div className="md:col-span-2">
              <h2 className="text-5xl font-black mb-4 leading-tight">
                Hi,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  {user?.name || "Student"}
                </span>
                ! 🎓
              </h2>
              <p className="text-xl text-slate-200 mb-6 font-semibold">
                Herzlich willkommen zu deinem Studien-Dashboard. Hier hast du
                Zugriff auf alle wichtigen Informationen und Tools.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                  <p className="text-slate-300 text-sm font-semibold">
                    Aktive Module
                  </p>
                  <p className="text-3xl font-black mt-1">6</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
                  <p className="text-slate-300 text-sm font-semibold">
                    Kommende Klausuren
                  </p>
                  <p className="text-3xl font-black mt-1">3</p>
                </div>
              </div>
            </div>

            {/* Featured Card */}
            <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur rounded-2xl p-6 border border-cyan-300/30 flex flex-col justify-between">
              <div>
                <p className="text-cyan-100 text-sm font-semibold uppercase tracking-wide">
                  ⭐ Premium Feature
                </p>
                <h3 className="text-2xl font-black mt-2 mb-3">Studienplan</h3>
                <p className="text-slate-100 text-sm mb-4">
                  Dein personalisierter Studienplan mit allen Modulen und
                  Deadlines.
                </p>
              </div>
              <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition shadow-lg w-full">
                Zum Studienplan →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Improved */}
      <nav className="bg-white shadow-md border-b-2 border-slate-200 sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            <Link
              to="/dashboard"
              className="py-4 px-2 font-bold text-slate-900 border-b-4 border-slate-900 hover:text-slate-700 transition whitespace-nowrap"
            >
              📊 Dashboard
            </Link>
            <Link
              to="/events"
              className="py-4 px-2 font-semibold text-slate-600 hover:text-slate-900 border-b-4 border-transparent hover:border-slate-300 transition whitespace-nowrap"
            >
              📅 Termine
            </Link>
            <Link
              to="/room-booking"
              className="py-4 px-2 font-semibold text-slate-600 hover:text-slate-900 border-b-4 border-transparent hover:border-slate-300 transition whitespace-nowrap"
            >
              🏛️ Räume
            </Link>
            <Link
              to="/files"
              className="py-4 px-2 font-semibold text-slate-600 hover:text-slate-900 border-b-4 border-transparent hover:border-slate-300 transition whitespace-nowrap"
            >
              📁 Dateien
            </Link>
            <Link
              to="/teacher-upload"
              className="py-4 px-2 font-semibold text-slate-600 hover:text-slate-900 border-b-4 border-transparent hover:border-slate-300 transition whitespace-nowrap"
            >
              📤 Upload
            </Link>
            <Link
              to="/contact"
              className="py-4 px-2 font-semibold text-slate-600 hover:text-slate-900 border-b-4 border-transparent hover:border-slate-300 transition whitespace-nowrap"
            >
              💬 Support
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        {/* Tabbed Interface - Improved */}
        <div className="mb-8">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b-2 border-slate-200">
            {TABS.map((tab) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`px-6 py-3 rounded-t-xl font-bold text-base whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.name
                    ? "bg-slate-900 text-white border-b-4 border-cyan-500 shadow-lg"
                    : "bg-white text-slate-600 hover:text-slate-900 border-b-2 border-slate-200 hover:border-slate-400"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content - Enhanced */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
            {activeTab === "Studienplan" && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">📚</span>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">
                      Studienplan
                    </h2>
                    <p className="text-slate-600 font-semibold">
                      Dein Studienplan mit allen Modulen und Fortschritt
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-4">
                        Aktive Module (6)
                      </h3>
                      <div className="space-y-3">
                        {[
                          "Wirtschaftsinformatik",
                          "Webentwicklung",
                          "Datenbankdesign",
                          "Cloud Computing",
                          "UI/UX Design",
                          "Project Management",
                        ].map((module, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-400 hover:shadow-md transition"
                          >
                            <span className="font-semibold text-slate-900">
                              {module}
                            </span>
                            <span className="text-xs font-bold bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full">
                              Aktiv
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-300">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      Fortschritt
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700">
                            Gesamtfortschritt
                          </span>
                          <span className="text-sm font-bold text-slate-900">
                            62%
                          </span>
                        </div>
                        <div className="w-full bg-slate-300 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full"
                            style={{ width: "62%" }}
                          ></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">
                          Nächster Milestone
                        </p>
                        <p className="font-bold text-slate-900">
                          70% - Halbzeit
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          8% bis zur nächsten Stufe
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Klausuren" && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">📝</span>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">
                      Klausuren (Exams)
                    </h2>
                    <p className="text-slate-600 font-semibold">
                      Deine kommenden und bisherigen Prüfungen
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Upcoming Exams */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      📅 Kommende Klausuren
                    </h3>
                    <div className="space-y-3">
                      {[
                        {
                          date: "15. Nov 2025",
                          name: "Webentwicklung",
                          time: "10:00 - 12:00",
                          room: "Raum 201",
                        },
                        {
                          date: "22. Nov 2025",
                          name: "Datenbankdesign",
                          time: "14:00 - 16:00",
                          room: "Raum 305",
                        },
                        {
                          date: "29. Nov 2025",
                          name: "Cloud Computing",
                          time: "09:00 - 11:00",
                          room: "Raum 101",
                        },
                      ].map((exam, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-2 border-orange-300"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-slate-900 text-lg">
                                {exam.name}
                              </h4>
                              <p className="text-sm text-slate-700 font-semibold">
                                {exam.date}
                              </p>
                            </div>
                            <span className="bg-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                              Bevorstehend
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">
                            ⏰ {exam.time}
                          </p>
                          <p className="text-sm text-slate-700">
                            📍 {exam.room}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Request */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      🔍 Einsicht in Klausuren
                    </h3>
                    <p className="text-slate-700 mb-4">
                      Melde dich hier an, um deine Klausurarbeiten und Feedback
                      einzusehen.
                    </p>
                    <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-lg">
                      Einsicht beantragen
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Bibliothek" && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">🏛️</span>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">
                      Bibliothek
                    </h2>
                    <p className="text-slate-600 font-semibold">
                      Zugang zu Lehrmaterialien und Ressourcen
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border-2 border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">
                      📚 Verfügbare Ressourcen
                    </h3>
                    <div className="space-y-3">
                      {[
                        { icon: "📖", name: "E-Books", count: "1,200+" },
                        {
                          icon: "📄",
                          name: "Forschungsarbeiten",
                          count: "3,500+",
                        },
                        { icon: "🎥", name: "Video-Tutorials", count: "850+" },
                        { icon: "🔬", name: "Fachdatenbanken", count: "25+" },
                      ].map((resource, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3 bg-white rounded-lg border border-slate-200"
                        >
                          <span className="font-semibold text-slate-900">
                            {resource.icon} {resource.name}
                          </span>
                          <span className="text-xs font-bold bg-slate-200 text-slate-700 px-3 py-1 rounded-full">
                            {resource.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">
                        🔍 Recherche
                      </h3>
                      <input
                        type="text"
                        placeholder="Nach Büchern, Papieren suchen..."
                        className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:border-purple-400 focus:outline-none font-semibold"
                      />
                    </div>

                    <a
                      href="https://www.iu.de/bibliothek/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition shadow-lg text-center"
                    >
                      🌐 Zur Online-Bibliothek
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "FAQ" && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">❓</span>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">
                      Häufig Gestellte Fragen
                    </h2>
                    <p className="text-slate-600 font-semibold">
                      Finde schnell Antworten auf deine Fragen
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      q: "Wie greife ich auf meinen Studienplan zu?",
                      a: 'Du findest deinen Studienplan im Tab "Studienplan" oben. Dort siehst du alle deine Module und deinen Fortschritt.',
                    },
                    {
                      q: "Wo finde ich meine Klausurtermine?",
                      a: 'Alle Klausurtermine sind im Tab "Klausuren" aufgelistet. Du erhältst auch eine E-Mail-Benachrichtigung 2 Wochen vor der Prüfung.',
                    },
                    {
                      q: "Wie beantrage ich Einsicht in meine Klausuren?",
                      a: 'Gehe zum Tab "Klausuren" und klicke auf "Einsicht beantragen". Dein Antrag wird dann geprüft.',
                    },
                    {
                      q: "Wer ist mein Ansprechpartner bei Fragen?",
                      a: 'Du erreichst unseren Support über den "Support"-Link in der Navigation oder per Email an support@iu-study.org',
                    },
                  ].map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg overflow-hidden border-2 border-slate-200 hover:border-slate-400 transition"
                    >
                      <button
                        onClick={() => setFaqOpen(faqOpen === idx ? -1 : idx)}
                        className="w-full px-6 py-4 text-left font-bold text-slate-900 hover:bg-slate-100 transition flex justify-between items-center"
                      >
                        {faq.q}
                        <span
                          className={`transition ${faqOpen === idx ? "rotate-180" : ""}`}
                        >
                          ▼
                        </span>
                      </button>
                      {faqOpen === idx && (
                        <div className="px-6 py-4 bg-white border-t-2 border-slate-200 text-slate-700">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "News" && (
              <div className="animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">📰</span>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900">
                      Aktuelle News
                    </h2>
                    <p className="text-slate-600 font-semibold">
                      Die neuesten Updates aus deinem Studium
                    </p>
                  </div>
                </div>

                <div className="grid gap-6">
                  {[
                    {
                      title: "🆕 Neues Modul: Künstliche Intelligenz",
                      desc: "Ab nächstem Semester verfügbar • 6 ECTS",
                      date: "20. Oktober 2025",
                      icon: "🤖",
                    },
                    {
                      title: "⏰ Klausurreviews offen",
                      desc: "Bis 15. November können Einsichten beantragt werden",
                      date: "18. Oktober 2025",
                      icon: "📋",
                    },
                    {
                      title: "📚 Bibliothek erweitert Öffnungszeiten",
                      desc: "Während der Prüfungsphase bis 21:00 Uhr geöffnet",
                      date: "15. Oktober 2025",
                      icon: "🕒",
                    },
                    {
                      title: "🎓 Absolventen-Event",
                      desc: "Netzwerken mit Alumni und erfolgreichen Absolventen",
                      date: "10. Oktober 2025",
                      icon: "🎉",
                    },
                  ].map((news, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border-2 border-slate-200 hover:border-blue-400 hover:shadow-lg transition"
                    >
                      <div className="flex gap-4">
                        <span className="text-3xl">{news.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-900 text-lg mb-2">
                            {news.title}
                          </h4>
                          <p className="text-slate-700 mb-2">{news.desc}</p>
                          <p className="text-xs text-slate-500 font-semibold">
                            {news.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="mt-12 mb-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">
            ⚡ Schnellzugriff
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/events"
              className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border-2 border-blue-300 hover:border-blue-400 hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-black text-slate-900 mb-2">Termine</h3>
              <p className="text-sm text-slate-700">Vorlesungen & Seminare</p>
            </Link>

            <Link
              to="/room-booking"
              className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border-2 border-purple-300 hover:border-purple-400 hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-3">🏛️</div>
              <h3 className="font-black text-slate-900 mb-2">Raumbuchung</h3>
              <p className="text-sm text-slate-700">Hamburg Standorte</p>
            </Link>

            <Link
              to="/files"
              className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-6 border-2 border-green-300 hover:border-green-400 hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-3">📁</div>
              <h3 className="font-black text-slate-900 mb-2">Dateien</h3>
              <p className="text-sm text-slate-700">Materialien & Dokumente</p>
            </Link>

            <Link
              to="/teacher-upload"
              className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl p-6 border-2 border-orange-300 hover:border-orange-400 hover:shadow-lg transition text-center"
            >
              <div className="text-4xl mb-3">📤</div>
              <h3 className="font-black text-slate-900 mb-2">Upload</h3>
              <p className="text-sm text-slate-700">Kursmaterialien</p>
            </Link>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Support Card */}
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl shadow-lg p-8 border-2 border-cyan-300">
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                💬 Benötigen Sie Hilfe?
              </h3>
              <p className="text-slate-700 mb-6 font-semibold">
                Kontaktieren Sie unseren Support-Team für Fragen oder Probleme.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg"
              >
                Support Kontaktieren →
              </Link>
            </div>

            {/* Quick Links Card */}
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl shadow-lg p-8 border-2 border-orange-300">
              <h3 className="text-2xl font-black text-slate-900 mb-3">
                🔗 Wichtige Links
              </h3>
              <div className="flex flex-col gap-3">
                <a
                  href="https://iu.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-2"
                >
                  🌐 IU Website
                </a>
                <a
                  href="https://www.iu.de/campus/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-2"
                >
                  📚 Campus Portal
                </a>
                <a
                  href="https://www.iu.de/bibliothek/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 font-bold flex items-center gap-2"
                >
                  🏛️ Online Bibliothek
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}