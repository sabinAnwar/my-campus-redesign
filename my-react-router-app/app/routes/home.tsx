import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "../lib/auth";

type Language = "de" | "en";

interface Translation {
  welcomeBack: string;
  dashboard: string;
  logout: string;
  login: string;
  courses: string;
  courseOverview: string;
  courseOverviewDesc: string;
  submissions: string;
  submissionsDesc: string;
  viewAll: string;
  noCoursesYet: string;
  turnitin: string;
  similarityScore: string;
  status: string;
  dueDate: string;
  submitted: string;
  pending: string;
  language: string;
}

const TRANSLATIONS: Record<Language, Translation> = {
  de: {
    welcomeBack: "Willkommen zurück",
    dashboard: "Dashboard",
    logout: "Abmelden",
    login: "Anmelden",
    courses: "Kurse",
    courseOverview: "Kursübersicht",
    courseOverviewDesc: "Sehen Sie alle Ihre Kurse mit Turnitin-Integration",
    submissions: "Anträge",
    submissionsDesc: "Verwalten Sie Ihre eingereichten Anträge",
    viewAll: "Alle anzeigen",
    noCoursesYet: "Noch keine Kurse",
    turnitin: "Turnitin",
    similarityScore: "Ähnlichkeitsscore",
    status: "Status",
    dueDate: "Abgabefrist",
    submitted: "Eingereicht",
    pending: "Ausstehend",
    language: "Sprache",
  },
  en: {
    welcomeBack: "Welcome back",
    dashboard: "Dashboard",
    logout: "Logout",
    login: "Login",
    courses: "Courses",
    courseOverview: "Course Overview",
    courseOverviewDesc: "View all your courses with Turnitin integration",
    submissions: "Submissions",
    submissionsDesc: "Manage your submitted assignments",
    viewAll: "View all",
    turnitin: "Turnitin",
    similarityScore: "Similarity Score",
    status: "Status",
    dueDate: "Due Date",
    submitted: "Submitted",
    pending: "Pending",
    language: "Language",
    noCoursesYet: ""
  },
};

export const loader = async () => {
  return null;
};

type User = {
  name?: string;
  username?: string;
  // add other properties if needed
};

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<Language>("de");
  const [activeTab, setActiveTab] = useState("overview");
  const t = TRANSLATIONS[language];

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getUser();
      if (!currentUser) {
        // Don't redirect - show login form on same page
        return;
      }
      setUser(currentUser);
    };
    checkAuth();
  }, [navigate]);

  // Mock course data with Turnitin info
  const courses = [
    {
      id: 1,
      name: language === "de" ? "Webentwicklung" : "Web Development",
      code: "WEB101",
      assignments: [
        {
          id: 1,
          title:
            language === "de" ? "Projekt 1: React App" : "Project 1: React App",
          dueDate: "2025-11-15",
          status: "submitted",
          turnitinScore: 12,
          submittedDate: "2025-11-14",
        },
      ],
    },
    {
      id: 2,
      name: language === "de" ? "Datenbankdesign" : "Database Design",
      code: "DB101",
      assignments: [
        {
          id: 1,
          title: language === "de" ? "ER-Diagramm" : "ER Diagram",
          dueDate: "2025-11-22",
          status: "pending",
          turnitinScore: null,
        },
      ],
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* Left Panel */}
        <div className="relative flex flex-col bg-slate-50">
          {/* Top Row: Logo + Language */}
          <div className="flex items-center justify-between px-8 pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded bg-slate-900 text-white flex items-center justify-center font-black">
                iu
              </div>
              <div className="text-[10px] leading-tight text-slate-800">
                <div className="font-extrabold tracking-wide">
                  INTERNATIONALE
                </div>
                <div className="-mt-1 font-extrabold tracking-wide">
                  HOCHSCHULE
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
              <button
                onClick={() => setLanguage("de")}
                className={`${language === "de" ? "underline" : "opacity-70 hover:opacity-100"}`}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`${language === "en" ? "underline" : "opacity-70 hover:opacity-100"}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Centered Content */}
          <div className="flex-1 flex items-center">
            <div className="px-8 md:px-16 lg:px-20 w-full">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
                {language === "de" ? "Los geht's." : "Let's go."}
              </h1>
              <p className="text-xl md:text-2xl text-slate-700 font-semibold mb-10">
                {language === "de"
                  ? "Willkommen bei myCampus!"
                  : "Welcome to myCampus!"}
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-black text-white font-bold text-base hover:opacity-90 transition"
              >
                {language === "de" ? "Anmelden" : "Sign in"}
              </Link>
            </div>
          </div>

          {/* Footer Links */}
          <div className="px-8 md:px-16 lg:px-20 pb-8 text-[11px] text-slate-600 space-x-6">
            <a href="#" className="hover:underline">
              Cookies
            </a>
            <a href="#" className="hover:underline">
              Datenschutz
            </a>
            <a href="#" className="hover:underline">
              Impressum
            </a>
            <a href="#" className="hover:underline">
              Login für Mitarbeiter
            </a>
            <div className="mt-4 text-[10px]">
              Copyright © 2025 IU International University – Alle Rechte
              vorbehalten.
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div
          className="hidden lg:block relative"
          style={{
            backgroundImage: "url(/iu-students-football.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">IU</span>
              </div>
              <span className="font-bold text-lg text-blue-900">IU Portal</span>
            </div>

            <nav className="hidden md:flex space-x-6">
              <Link
                to="/dashboard"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {t.dashboard}
              </Link>
              <Link
                to="#"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                {t.courses}
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
            
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-3 py-2 border border-blue-200 rounded-lg bg-white text-gray-700 font-medium hover:border-blue-400 transition"
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>
              <Link
                to="/login?logout=true"
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition"
              >
                {t.logout}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            {t.welcomeBack}, {user.name || user.username}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {language === "de"
              ? "Verwalten Sie Ihre Kurse, Anträge und Einsendungen"
              : "Manage your courses, submissions, and assignments"}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4 border-b border-blue-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === "overview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
            >
              📚 {t.courseOverview}
            </button>
            <button
              onClick={() => setActiveTab("submissions")}
              className={`px-4 py-3 font-semibold border-b-2 transition ${
                activeTab === "submissions"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
            >
              📤 {t.submissions}
            </button>
          </div>
        </div>

        {/* Tab Content - Course Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <p className="text-gray-600">{t.courseOverviewDesc}</p>
            {courses.length > 0 ? (
              <div className="grid gap-6">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl shadow-md border border-blue-100 p-6 hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-blue-900">
                          {course.name}
                        </h3>
                        <p className="text-gray-600">{course.code}</p>
                      </div>
                    </div>

                    {/* Assignments with Turnitin */}
                    <div className="space-y-3">
                      {course.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-blue-900">
                                {assignment.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {t.dueDate}: {assignment.dueDate}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                assignment.status === "submitted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {assignment.status === "submitted"
                                ? t.submitted
                                : t.pending}
                            </span>
                          </div>

                          {/* Turnitin Score */}
                          {assignment.turnitinScore !== null && (
                            <div className="bg-white rounded-lg p-3 border border-blue-200 mt-3">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-700">
                                  {t.turnitin} {t.similarityScore}:
                                </span>
                                <span
                                  className={`font-bold text-lg ${
                                    assignment.turnitinScore < 15
                                      ? "text-green-600"
                                      : assignment.turnitinScore < 30
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {assignment.turnitinScore}%
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {language === "de"
                                  ? "Eingereicht: "
                                  : "Submitted: "}
                                {assignment.submittedDate}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-blue-50 rounded-xl p-8 text-center border border-blue-200">
                <p className="text-gray-600">{t.noCoursesYet}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab Content - Submissions */}
        {activeTab === "submissions" && (
          <div className="space-y-6">
            <p className="text-gray-600">{t.submissionsDesc}</p>
            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <div className="space-y-4">
                {courses.flatMap((course) =>
                  course.assignments.map((assignment) => (
                    <div
                      key={`${course.id}-${assignment.id}`}
                      className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex-1">
                        <p className="font-bold text-blue-900">{course.name}</p>
                        <p className="text-sm text-gray-600">
                          {assignment.title}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        {assignment.turnitinScore !== null && (
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Turnitin</p>
                            <p
                              className={`text-lg font-bold ${
                                assignment.turnitinScore < 15
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {assignment.turnitinScore}%
                            </p>
                          </div>
                        )}
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            assignment.status === "submitted"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {assignment.status === "submitted"
                            ? t.submitted
                            : t.pending}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
