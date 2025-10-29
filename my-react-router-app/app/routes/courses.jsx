import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TRANSLATIONS = {
  de: {
    courses: "Kurse",
    myCourses: "Meine Kurse",
    logout: "Abmelden",
    modules: "Module",
    forum: "Forum",
    turnitin: "Turnitin",
    resources: "Ressourcen",
    videos: "Videos",
    scripts: "Skripte",
    files: "Dateien",
    assignments: "Aufgaben",
    submissions: "Abgaben",
    overview: "Übersicht",
    courseDescription: "Kursbeschreibung",
    instructor: "Dozent",
    credits: "Credits",
    semester: "Semester",
    startDate: "Startdatum",
    endDate: "Enddatum",
    module: "Modul",
    topics: "Themen",
    completed: "Abgeschlossen",
    inProgress: "In Bearbeitung",
    notStarted: "Nicht gestartet",
    downloadFile: "Datei herunterladen",
    uploadAssignment: "Aufgabe einreichen",
    searchForum: "Forum durchsuchen",
    createTopic: "Neues Thema",
    newPost: "Neuer Beitrag",
    replies: "Antworten",
    views: "Aufrufe",
    lastPost: "Letzter Beitrag",
    yourSubmissions: "Deine Abgaben",
    grade: "Note",
    feedback: "Feedback",
    status: "Status",
    submitted: "Eingereicht",
    pending: "Ausstehend",
    graded: "Bewertet",
    similarity: "Ähnlichkeit",
    back: "Zurück",
    date: "Datum",
    teacher: "Lehrende",
  },
  en: {
    courses: "Courses",
    myCourses: "My Courses",
    logout: "Logout",
    modules: "Modules",
    forum: "Forum",
    turnitin: "Turnitin",
    resources: "Resources",
    videos: "Videos",
    scripts: "Scripts",
    files: "Files",
    assignments: "Assignments",
    submissions: "Submissions",
    overview: "Overview",
    courseDescription: "Course Description",
    instructor: "Instructor",
    credits: "Credits",
    semester: "Semester",
    startDate: "Start Date",
    endDate: "End Date",
    module: "Module",
    topics: "Topics",
    completed: "Completed",
    inProgress: "In Progress",
    notStarted: "Not Started",
    downloadFile: "Download File",
    uploadAssignment: "Submit Assignment",
    searchForum: "Search Forum",
    createTopic: "New Topic",
    newPost: "New Post",
    replies: "Replies",
    views: "Views",
    lastPost: "Last Post",
    yourSubmissions: "Your Submissions",
    grade: "Grade",
    feedback: "Feedback",
    status: "Status",
    submitted: "Submitted",
    pending: "Pending",
    graded: "Graded",
    similarity: "Similarity",
    back: "Back",
    date: "Date",
    teacher: "Teacher",
  },
};

export const loader = async () => {
  return null;
};

export default function Courses() {
  const [language, setLanguage] = useState("de");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const courses = [
    {
      id: 1,
      code: "WEB101",
      title: language === "de" ? "Webentwicklung" : "Web Development",
      instructor: "Prof. Dr. Sarah Schmidt",
      credits: 6,
      semester: "Wintersemester 2024/25",
      startDate: "01.10.2024",
      endDate: "31.01.2025",
      description: language === "de"
        ? "Grundlagen der modernen Webentwicklung mit React, HTML, CSS und JavaScript"
        : "Fundamentals of modern web development with React, HTML, CSS and JavaScript",
      progress: 75,
      active: true,
      modules: [
        { id: 1, title: "HTML & CSS Grundlagen", status: "completed", topics: 3 },
        { id: 2, title: "JavaScript Essentials", status: "completed", topics: 4 },
        { id: 3, title: "React Komponenten", status: "inProgress", topics: 5 },
        { id: 4, title: "State Management", status: "notStarted", topics: 4 },
        { id: 5, title: "API Integration", status: "notStarted", topics: 3 },
      ],
      resources: [
        { id: 1, type: "video", title: "Einführung in React", duration: "45 min", url: "#" },
        { id: 2, type: "video", title: "Components & Props", duration: "52 min", url: "#" },
        { id: 3, type: "script", title: "React Handbook.pdf", size: "3.2 MB", url: "#" },
        { id: 4, type: "script", title: "Best Practices.pdf", size: "1.8 MB", url: "#" },
        { id: 5, type: "file", title: "Projektvorlagen.zip", size: "12 MB", teacher: "Prof. Schmidt", url: "#" },
      ],
      assignments: [
        {
          id: 1,
          title: language === "de" ? "Projektarbeit: React App" : "Project: React App",
          dueDate: "20.01.2025",
          status: "submitted",
          submissions: [
            { date: "18.01.2025", grade: "1.3", similarity: 12, feedback: language === "de" ? "Sehr gute Umsetzung!" : "Excellent implementation!" }
          ]
        },
        {
          id: 2,
          title: language === "de" ? "Quiz: JavaScript Grundlagen" : "Quiz: JavaScript Basics",
          dueDate: "15.01.2025",
          status: "graded",
          submissions: [
            { date: "14.01.2025", grade: "1.7", similarity: null, feedback: language === "de" ? "Gut beantwortet" : "Well answered" }
          ]
        },
        {
          id: 3,
          title: language === "de" ? "Hausaufgabe: State Management" : "Homework: State Management",
          dueDate: "22.01.2025",
          status: "pending",
          submissions: []
        },
      ],
      forumTopics: [
        {
          id: 1,
          title: language === "de" ? "Frage zu Hooks" : "Question about Hooks",
          author: "Max Mustermann",
          replies: 5,
          views: 42,
          lastPost: "15.01.2025",
          status: "active"
        },
        {
          id: 2,
          title: language === "de" ? "Problem mit State Update" : "Issue with State Update",
          author: "Anna Schmidt",
          replies: 3,
          views: 28,
          lastPost: "14.01.2025",
          status: "active"
        },
        {
          id: 3,
          title: language === "de" ? "Beste Praktiken für Props" : "Best Practices for Props",
          author: "Prof. Dr. Sarah Schmidt",
          replies: 12,
          views: 156,
          lastPost: "10.01.2025",
          status: "pinned"
        },
      ]
    },
    {
      id: 2,
      code: "DB101",
      title: language === "de" ? "Datenbankdesign" : "Database Design",
      instructor: "Prof. Dr. Thomas Müller",
      credits: 6,
      semester: "Wintersemester 2024/25",
      startDate: "01.10.2024",
      endDate: "31.01.2025",
      description: language === "de"
        ? "Design und Implementierung von relationalen Datenbanken mit SQL"
        : "Design and implementation of relational databases with SQL",
      progress: 60,
      active: true,
      modules: [
        { id: 1, title: "Datenbank Grundlagen", status: "completed", topics: 3 },
        { id: 2, title: "SQL Grundlagen", status: "completed", topics: 5 },
        { id: 3, title: "Normalisierung", status: "inProgress", topics: 4 },
        { id: 4, title: "Indexierung", status: "notStarted", topics: 3 },
      ],
      resources: [
        { id: 1, type: "video", title: "SQL SELECT Statements", duration: "38 min", url: "#" },
        { id: 2, type: "video", title: "JOIN Operations", duration: "55 min", url: "#" },
        { id: 3, type: "script", title: "SQL Reference.pdf", size: "2.5 MB", url: "#" },
        { id: 4, type: "file", title: "Sample Database.sql", size: "5.3 MB", teacher: "Prof. Müller", url: "#" },
      ],
      assignments: [
        {
          id: 1,
          title: language === "de" ? "ER-Diagramm Projekt" : "ER Diagram Project",
          dueDate: "25.01.2025",
          status: "pending",
          submissions: []
        },
      ],
      forumTopics: [
        {
          id: 1,
          title: language === "de" ? "Normalformen Erklärung" : "Explaining Normal Forms",
          author: "Prof. Dr. Thomas Müller",
          replies: 8,
          views: 73,
          lastPost: "16.01.2025",
          status: "pinned"
        },
      ]
    },
  ];

  if (!selectedCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <Link to="/dashboard" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-black text-sm">IU</span>
                </div>
                <div>
                  <h1 className="text-lg font-black text-blue-900">IU Portal</h1>
                  <p className="text-xs text-blue-600">{t.myCourses}</p>
                </div>
              </Link>

              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 text-sm bg-slate-100 text-slate-900 rounded-lg border border-slate-200 cursor-pointer"
                >
                  <option value="de">DE</option>
                  <option value="en">EN</option>
                </select>
                <button
                  onClick={() => navigate("/logout")}
                  className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
                >
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-3xl font-black text-blue-900 mb-8">📚 {t.myCourses}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => (
              <div
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className={`rounded-xl shadow-md border transition cursor-pointer p-6 ${
                  course.active
                    ? "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300 hover:shadow-lg hover:border-blue-400"
                    : "bg-white border-blue-100 hover:shadow-lg hover:border-blue-300"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-blue-600">{course.code}</p>
                      {course.active && (
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                          ✅ {language === "de" ? "Aktiv" : "Active"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">{course.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">{course.credits} {language === "de" ? "Credits" : "Credits"}</p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm mb-4">{course.description}</p>

                <p className="text-xs text-slate-500 mb-3">👨‍🏫 {course.instructor}</p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-600">{t.progress}</span>
                    <span className="text-xs font-bold text-blue-600">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2 text-xs text-slate-500 mb-4 pb-4 border-b border-slate-200">
                  <span>📅 {course.startDate} - {course.endDate}</span>
                </div>

                <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition">
                  {language === "de" ? "Öffnen" : "Open"} →
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const course = selectedCourse;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-2 hover:bg-blue-50 rounded-lg transition"
              >
                ← {t.back}
              </button>
              <div>
                <h1 className="text-lg font-black text-blue-900">{course.code}: {course.title}</h1>
                <p className="text-xs text-blue-600">{course.instructor}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-100 text-slate-900 rounded-lg border border-slate-200 cursor-pointer"
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>
              <button
                onClick={() => navigate("/logout")}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto space-x-1">
            {[
              { id: "overview", icon: "📋", label: t.overview },
              { id: "modules", icon: "📚", label: t.modules },
              { id: "resources", icon: "📁", label: t.resources },
              { id: "assignments", icon: "✍️", label: t.assignments },
              { id: "forum", icon: "💬", label: t.forum },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-600 hover:text-blue-600"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                <p className="text-slate-600 text-sm font-semibold mb-1">{t.credits}</p>
                <p className="text-2xl font-black text-blue-900">{course.credits}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                <p className="text-slate-600 text-sm font-semibold mb-1">{t.progress}</p>
                <p className="text-2xl font-black text-green-600">{course.progress}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                <p className="text-slate-600 text-sm font-semibold mb-1">{t.semester}</p>
                <p className="text-lg font-black text-orange-600">W24/25</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
              <h3 className="text-xl font-black text-slate-900 mb-4">{t.courseDescription}</h3>
              <p className="text-slate-600 mb-4">{course.description}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{t.startDate}</p>
                  <p className="text-slate-600">{course.startDate}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{t.endDate}</p>
                  <p className="text-slate-600">{course.endDate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modules Tab */}
        {activeTab === "modules" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 mb-6">📚 {t.modules}</h3>
            {course.modules.map(module => (
              <div
                key={module.id}
                className="bg-white rounded-lg p-6 border border-blue-100 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100">
                      <span className={`text-lg ${
                        module.status === "completed" ? "✅" :
                        module.status === "inProgress" ? "⏳" : "⭕"
                      }`}></span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{module.title}</h4>
                      <p className="text-xs text-slate-500">{module.topics} {t.topics}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    module.status === "completed" ? "bg-green-100 text-green-700" :
                    module.status === "inProgress" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                  }`}>
                    {module.status === "completed" ? t.completed :
                     module.status === "inProgress" ? t.inProgress : t.notStarted}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 mb-6">📁 {t.resources}</h3>

            {/* Videos */}
            <div>
              <h4 className="font-bold text-lg text-slate-900 mb-4">🎥 {t.videos}</h4>
              <div className="space-y-2">
                {course.resources.filter(r => r.type === "video").map(resource => (
                  <div key={resource.id} className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition cursor-pointer flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{resource.title}</p>
                      <p className="text-sm text-slate-500">⏱️ {resource.duration}</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded hover:bg-blue-200">
                      ▶️ {language === "de" ? "Abspielen" : "Play"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Scripts */}
            <div>
              <h4 className="font-bold text-lg text-slate-900 mb-4">📄 {t.scripts}</h4>
              <div className="space-y-2">
                {course.resources.filter(r => r.type === "script").map(resource => (
                  <div key={resource.id} className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition cursor-pointer flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{resource.title}</p>
                      <p className="text-sm text-slate-500">📦 {resource.size}</p>
                    </div>
                    <button className="px-3 py-1 bg-green-100 text-green-700 font-semibold rounded hover:bg-green-200">
                      ⬇️ {t.downloadFile}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Files from Teachers */}
            <div>
              <h4 className="font-bold text-lg text-slate-900 mb-4">📥 {language === "de" ? "Dateien von Lehrenden" : "Files from Teachers"}</h4>
              <div className="space-y-2">
                {course.resources.filter(r => r.type === "file").map(resource => (
                  <div key={resource.id} className="bg-white rounded-lg p-4 border border-orange-100 hover:shadow-md transition cursor-pointer flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{resource.title}</p>
                      <p className="text-sm text-slate-500">👨‍🏫 {resource.teacher} • 📦 {resource.size}</p>
                    </div>
                    <button className="px-3 py-1 bg-orange-100 text-orange-700 font-semibold rounded hover:bg-orange-200">
                      ⬇️ {t.downloadFile}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === "assignments" && (
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 mb-6">✍️ {t.assignments}</h3>
            {course.assignments.map(assignment => (
              <div key={assignment.id} className="bg-white rounded-lg p-6 border border-blue-100">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{assignment.title}</h4>
                    <p className="text-sm text-slate-600">📅 {assignment.dueDate}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    assignment.status === "submitted" ? "bg-green-100 text-green-700" :
                    assignment.status === "graded" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {assignment.status === "submitted" ? t.submitted :
                     assignment.status === "graded" ? t.graded : t.pending}
                  </span>
                </div>

                {assignment.submissions.length > 0 ? (
                  <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                    {assignment.submissions.map((sub, idx) => (
                      <div key={idx}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-slate-900">{t.submitted}: {sub.date}</p>
                          {sub.grade && <p className="text-lg font-bold text-blue-600">{t.grade}: {sub.grade}</p>}
                        </div>
                        {sub.similarity !== null && (
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-slate-600">Turnitin:</span>
                            <span className={`text-sm font-bold px-2 py-1 rounded ${
                              sub.similarity < 15 ? "bg-green-100 text-green-700" :
                              sub.similarity < 30 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                            }`}>
                              {sub.similarity}%
                            </span>
                          </div>
                        )}
                        <p className="text-sm text-slate-600">{t.feedback}: {sub.feedback}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                    ⬆️ {t.uploadAssignment}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Forum Tab */}
        {activeTab === "forum" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900">💬 {t.forum}</h3>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800">
                + {t.createTopic}
              </button>
            </div>

            {course.forumTopics.map(topic => (
              <div
                key={topic.id}
                className={`rounded-lg p-4 border hover:shadow-md transition cursor-pointer ${
                  topic.status === "pinned" ? "bg-yellow-50 border-yellow-200" : "bg-white border-blue-100"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {topic.status === "pinned" && <span>📌</span>}
                      <h4 className="font-bold text-slate-900">{topic.title}</h4>
                    </div>
                    <p className="text-sm text-slate-600">👤 {topic.author}</p>
                  </div>
                </div>

                <div className="flex gap-6 text-sm text-slate-500">
                  <span>💬 {topic.replies} {t.replies}</span>
                  <span>👁️ {topic.views} {t.views}</span>
                  <span>📅 {topic.lastPost}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
