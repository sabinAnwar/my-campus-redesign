import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import {
  User as UserIcon,
  CalendarDays,
  ClipboardList,
  Layers,
  FolderOpen,
  PencilLine,
  MessageSquare,
  BookOpen,
  Book,
  GraduationCap,
  Presentation,
  Rss,
  FileText,
  Headphones,
  Users,
  ClipboardCheck,
  Plus,
  Minus,
  Play,
  Video,
} from "lucide-react";

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
  const [expandedSections, setExpandedSections] = useState({});
  const [listFilter, setListFilter] = useState("active"); // active | completed
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

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
      description:
        language === "de"
          ? "Grundlagen der modernen Webentwicklung mit React, HTML, CSS und JavaScript"
          : "Fundamentals of modern web development with React, HTML, CSS and JavaScript",
      progress: 75,
      active: true,
      modules: [
        {
          id: 1,
          title: "HTML & CSS Grundlagen",
          status: "completed",
          topics: 3,
        },
        {
          id: 2,
          title: "JavaScript Essentials",
          status: "completed",
          topics: 4,
        },
        { id: 3, title: "React Komponenten", status: "inProgress", topics: 5 },
        { id: 4, title: "State Management", status: "notStarted", topics: 4 },
        { id: 5, title: "API Integration", status: "notStarted", topics: 3 },
      ],
      resources: [
        {
          id: 1,
          type: "video",
          title: "Einführung in React",
          duration: "45 min",
          url: "#",
        },
        {
          id: 2,
          type: "video",
          title: "Components & Props",
          duration: "52 min",
          url: "#",
        },
        {
          id: 3,
          type: "script",
          title: "React Handbook.pdf",
          size: "3.2 MB",
          url: "#",
        },
        {
          id: 4,
          type: "script",
          title: "Best Practices.pdf",
          size: "1.8 MB",
          url: "#",
        },
        {
          id: 5,
          type: "file",
          title: "Projektvorlagen.zip",
          size: "12 MB",
          teacher: "Prof. Schmidt",
          url: "#",
        },
      ],
      assignments: [
        {
          id: 1,
          title:
            language === "de"
              ? "Projektarbeit: React App"
              : "Project: React App",
          dueDate: "20.01.2025",
          status: "submitted",
          submissions: [
            {
              date: "18.01.2025",
              grade: "1.3",
              similarity: 12,
              feedback:
                language === "de"
                  ? "Sehr gute Umsetzung!"
                  : "Excellent implementation!",
            },
          ],
        },
        {
          id: 2,
          title:
            language === "de"
              ? "Quiz: JavaScript Grundlagen"
              : "Quiz: JavaScript Basics",
          dueDate: "15.01.2025",
          status: "graded",
          submissions: [
            {
              date: "14.01.2025",
              grade: "1.7",
              similarity: null,
              feedback: language === "de" ? "Gut beantwortet" : "Well answered",
            },
          ],
        },
        {
          id: 3,
          title:
            language === "de"
              ? "Hausaufgabe: State Management"
              : "Homework: State Management",
          dueDate: "22.01.2025",
          status: "pending",
          submissions: [],
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
          status: "active",
        },
        {
          id: 2,
          title:
            language === "de"
              ? "Problem mit State Update"
              : "Issue with State Update",
          author: "Anna Schmidt",
          replies: 3,
          views: 28,
          lastPost: "14.01.2025",
          status: "active",
        },
        {
          id: 3,
          title:
            language === "de"
              ? "Beste Praktiken für Props"
              : "Best Practices for Props",
          author: "Prof. Dr. Sarah Schmidt",
          replies: 12,
          views: 156,
          lastPost: "10.01.2025",
          status: "pinned",
        },
      ],
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
      description:
        language === "de"
          ? "Design und Implementierung von relationalen Datenbanken mit SQL"
          : "Design and implementation of relational databases with SQL",
      progress: 60,
      active: true,
      modules: [
        {
          id: 1,
          title: "Datenbank Grundlagen",
          status: "completed",
          topics: 3,
        },
        { id: 2, title: "SQL Grundlagen", status: "completed", topics: 5 },
        { id: 3, title: "Normalisierung", status: "inProgress", topics: 4 },
        { id: 4, title: "Indexierung", status: "notStarted", topics: 3 },
      ],
      resources: [
        {
          id: 1,
          type: "video",
          title: "SQL SELECT Statements",
          duration: "38 min",
          url: "#",
        },
        {
          id: 2,
          type: "video",
          title: "JOIN Operations",
          duration: "55 min",
          url: "#",
        },
        {
          id: 3,
          type: "script",
          title: "SQL Reference.pdf",
          size: "2.5 MB",
          url: "#",
        },
        {
          id: 4,
          type: "file",
          title: "Sample Database.sql",
          size: "5.3 MB",
          teacher: "Prof. Müller",
          url: "#",
        },
      ],
      assignments: [
        {
          id: 1,
          title:
            language === "de" ? "ER-Diagramm Projekt" : "ER Diagram Project",
          dueDate: "25.01.2025",
          status: "pending",
          submissions: [],
        },
      ],
      forumTopics: [
        {
          id: 1,
          title:
            language === "de"
              ? "Normalformen Erklärung"
              : "Explaining Normal Forms",
          author: "Prof. Dr. Thomas Müller",
          replies: 8,
          views: 73,
          lastPost: "16.01.2025",
          status: "pinned",
        },
      ],
    },
    // Additional Active Courses
    {
      id: 3,
      code: "ALGO201",
      title:
        language === "de"
          ? "Algorithmen, Datenstrukturen und..."
          : "Algorithms, Data Structures and...",
      instructor: "Prof. Dr. Meier",
      credits: 5,
      semester: "Sommersemester 2025",
      startDate: "01.04.2025",
      endDate: "31.07.2025",
      description:
        language === "de"
          ? "Grundlagen effizienter Algorithmen und Datenstrukturen"
          : "Core algorithms and data structures",
      progress: 40,
      active: true,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
    {
      id: 4,
      code: "ECOM301",
      title: "E-Commerce",
      instructor: "Prof. Dr. Wagner",
      credits: 5,
      semester: "Sommersemester 2025",
      startDate: "01.04.2025",
      endDate: "31.07.2025",
      description:
        language === "de"
          ? "Online-Handel, Plattformen, Payment und Recht"
          : "Online commerce, platforms, payment and law",
      progress: 55,
      active: true,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
    {
      id: 5,
      code: "PRJ601",
      title: language === "de" ? "Praxisprojekt VI" : "Practical Project VI",
      instructor: "Projektbetreuungsteam",
      credits: 10,
      semester: "Sommersemester 2025",
      startDate: "01.04.2025",
      endDate: "31.07.2025",
      description:
        language === "de"
          ? "Praxisnahes Projekt mit Unternehmenspartnern"
          : "Hands-on project with industry partner",
      progress: 20,
      active: true,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
    {
      id: 6,
      code: "PUF401",
      title:
        language === "de"
          ? "Personal- und Unternehmensführung"
          : "People and Corporate Management",
      instructor: "Prof. Dr. Richter",
      credits: 5,
      semester: "Sommersemester 2025",
      startDate: "01.04.2025",
      endDate: "31.07.2025",
      description:
        language === "de"
          ? "Führung, Organisation und Change Management"
          : "Leadership, organization and change",
      progress: 15,
      active: true,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
    // Completed/Inactive Courses
    {
      id: 7,
      code: "ENTR201",
      title:
        language === "de"
          ? "Unternehmensgründung und..."
          : "Entrepreneurship and...",
      instructor: "Prof. Dr. Keller",
      credits: 5,
      semester: "Wintersemester 2023/24",
      startDate: "01.10.2023",
      endDate: "31.01.2024",
      description:
        language === "de"
          ? "Ideen, Businessplan und Finanzierung"
          : "Ideas, business plan and funding",
      progress: 100,
      active: false,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
    {
      id: 8,
      code: "MATH101",
      title:
        language === "de"
          ? "Mathematik Grundlagen"
          : "Mathematics Fundamentals",
      instructor: "Prof. Dr. König",
      credits: 5,
      semester: "Wintersemester 2023/24",
      startDate: "01.10.2023",
      endDate: "31.01.2024",
      description:
        language === "de"
          ? "Lineare Algebra, Analysis, Stochastik"
          : "Linear Algebra, Calculus, Probability",
      progress: 100,
      active: false,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
    {
      id: 9,
      code: "BWL101",
      title:
        language === "de" ? "BWL Grundlagen" : "Business Administration Basics",
      instructor: "Prof. Dr. Hahn",
      credits: 5,
      semester: "Sommersemester 2024",
      startDate: "01.04.2024",
      endDate: "31.07.2024",
      description:
        language === "de"
          ? "Betriebswirtschaftliche Grundbegriffe"
          : "Basic business concepts",
      progress: 100,
      active: false,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
    {
      id: 10,
      code: "STAT201",
      title: "Statistik",
      instructor: "Prof. Dr. Braun",
      credits: 5,
      semester: "Sommersemester 2024",
      startDate: "01.04.2024",
      endDate: "31.07.2024",
      description:
        language === "de"
          ? "Deskriptive und induktive Statistik"
          : "Descriptive and inferential statistics",
      progress: 100,
      active: false,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
    {
      id: 11,
      code: "ENG101",
      title:
        language === "de" ? "Wissenschaftliches Arbeiten" : "Academic Writing",
      instructor: "Prof. Dr. Fischer",
      credits: 5,
      semester: "Wintersemester 2023/24",
      startDate: "01.10.2023",
      endDate: "31.01.2024",
      description:
        language === "de"
          ? "Methodik und Zitieren"
          : "Methodology and citations",
      progress: 100,
      active: false,
      modules: [],
      resources: [],
      assignments: [],
      forumTopics: [],
    },
  ];

  if (!selectedCourse) {
    // List view styled closer to IU card grid
    return (
      <AppShell>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-[34px] font-semibold text-slate-900 mb-6">
            {t.modules || t.myCourses}
          </h1>

          {/* Filter pills */}
          <div className="flex items-center gap-3 mb-8">
            {(() => {
              const activeCount = courses.filter((c) => c.active).length;
              const completedCount = courses.filter(
                (c) => !c.active || c.progress >= 100
              ).length;
              return (
                <>
                  <button
                    onClick={() => setListFilter("active")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      listFilter === "active"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {language === "de" ? "Aktiv" : "Active"} ({activeCount})
                  </button>
                  <button
                    onClick={() => setListFilter("completed")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      listFilter === "completed"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-800"
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
              className="ml-1 p-2 rounded-full hover:bg-slate-100"
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
                  onClick={() => setSelectedCourse(course)}
                  className="cursor-pointer rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow transition overflow-hidden bg-white"
                >
                  <div className="h-36 w-full bg-gradient-to-br from-slate-200 to-slate-300" />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-1">
                      <div className="text-xs font-semibold text-slate-500">
                        {course.code}
                      </div>
                      {course.active ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                          Aktiv
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {language === "de" ? "Abgeschlossen" : "Completed"}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
                      <UserIcon className="h-3.5 w-3.5" /> {course.instructor}
                    </p>

                    {course.progress > 0 && (
                      <>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-900"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />{" "}
                            {course.startDate} - {course.endDate}
                          </span>
                          <span className="font-semibold">
                            {course.progress}%
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </AppShell>
    );
  }

  const course = selectedCourse;

  return (
    <AppShell>
      <div className="bg-gradient-to-br from-white via-blue-50 to-slate-50">
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
                  <h1 className="text-lg font-black text-blue-900">
                    {course.code}: {course.title}
                  </h1>
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
                { id: "overview", icon: ClipboardList, label: t.overview },
                { id: "resources", icon: FolderOpen, label: t.resources },
                { id: "videos", icon: Video, label: t.videos },
                { id: "assignments", icon: PencilLine, label: t.assignments },
                { id: "forum", icon: MessageSquare, label: t.forum },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-600 hover:text-blue-600"
                  }`}
                >
                  <tab.icon className="inline-block -mt-0.5 mr-1.5 h-4 w-4" />{" "}
                  {tab.label}
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
                  <p className="text-slate-600 text-sm font-semibold mb-1">
                    {t.credits}
                  </p>
                  <p className="text-2xl font-black text-blue-900">
                    {course.credits}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-green-200 shadow-sm">
                  <p className="text-slate-600 text-sm font-semibold mb-1">
                    {t.progress}
                  </p>
                  <p className="text-2xl font-black text-green-600">
                    {course.progress}%
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-orange-200 shadow-sm">
                  <p className="text-slate-600 text-sm font-semibold mb-1">
                    {t.semester}
                  </p>
                  <p className="text-lg font-black text-orange-600">W24/25</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
                <h3 className="text-xl font-black text-slate-900 mb-4">
                  {t.courseDescription}
                </h3>
                <p className="text-slate-600 mb-4">{course.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {t.startDate}
                    </p>
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

          {/* Resources Tab - Expandable Sections */}
          {activeTab === "resources" && (
            <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-200">
            {(() => {
              const courseSections = [
                {
                  id: "skripte",
                  label: "Skripte",
                  icon: FileText,
                  items: course.resources?.filter(r => r.type === "script").map(s => ({
                    id: s.id,
                    title: s.title,
                    url: s.url,
                    size: s.size,
                    type: "script"
                  })) || [],
                  defaultExpanded: false
                },
                {
                  id: "basisliteratur",
                  label: "Basisliteratur",
                  icon: Book,
                  items: [
                    { id: 1, title: "Hartmann, Peter (2019): Mathematik für Informatiker. Ein praxisbezogenes Lehrbuch", type: "book", url: "#" }
                  ],
                  defaultExpanded: true // Expanded by default as shown in image
                },
                {
                  id: "weiterfuehrende-literatur",
                  label: "Weiterführende Literatur",
                  icon: BookOpen,
                  items: [],
                  defaultExpanded: false
                },
                {
                  id: "repetitorium",
                  label: "Repetitorium",
                  icon: GraduationCap,
                  items: [],
                  defaultExpanded: false
                },
                {
                  id: "foliensaetze",
                  label: "Foliensätze",
                  icon: Presentation,
                  items: [],
                  defaultExpanded: false
                },
                {
                  id: "course-feed",
                  label: "Course Feed®",
                  icon: Rss,
                  items: [],
                  defaultExpanded: false
                },
                {
                  id: "musterklausur",
                  label: "Musterklausur",
                  icon: ClipboardCheck,
                  items: [],
                  defaultExpanded: false
                },
                {
                  id: "podcasts",
                  label: "Podcasts",
                  icon: Headphones,
                  items: [],
                  defaultExpanded: false
                },
                {
                  id: "dokumente-tutorium",
                  label: "Dokumente Tutorium",
                  icon: Users,
                  items: [],
                  defaultExpanded: false
                },
                {
                  id: "online-tests",
                  label: "Online Tests und Evaluation",
                  icon: ClipboardList,
                  items: [],
                  defaultExpanded: false
                }
              ];

              return courseSections.map((section) => {
                const isExpanded = expandedSections[section.id] !== undefined 
                  ? expandedSections[section.id] 
                  : section.defaultExpanded;

                return (
                  <div key={section.id} className="p-0">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition text-left"
                    >
                      <span className="text-sm font-medium text-slate-900">
                        {section.label}
                      </span>
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <Minus className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Plus className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-3 bg-slate-50">
                        {section.items.length > 0 ? (
                          <div className="space-y-1 mt-2">
                            {section.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-start gap-2 py-2 px-3 hover:bg-white rounded cursor-pointer"
                              >
                                <FileText className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <a
                                  href={item.url || "#"}
                                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  {item.title}
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 mt-2 py-2">
                            Noch keine Einträge
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === "videos" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 mb-6">
                🎥 {t.videos}
              </h3>
              <div className="space-y-2">
                {course.resources
                  ?.filter((r) => r.type === "video")
                  .map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">
                          {resource.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          ⏱️ {resource.duration}
                        </p>
                      </div>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded hover:bg-blue-200">
                        ▶️ {language === "de" ? "Abspielen" : "Play"}
                      </button>
                    </div>
                  ))}
                {(!course.resources || course.resources.filter((r) => r.type === "video").length === 0) && (
                  <p className="text-slate-500 text-center py-8">
                    Noch keine Videos verfügbar
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 mb-6">
                ✍️ {t.assignments}
              </h3>
              {course.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white rounded-lg p-6 border border-blue-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">
                        {assignment.title}
                      </h4>
                      <p className="text-sm text-slate-600">
                        📅 {assignment.dueDate}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        assignment.status === "submitted"
                          ? "bg-green-100 text-green-700"
                          : assignment.status === "graded"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {assignment.status === "submitted"
                        ? t.submitted
                        : assignment.status === "graded"
                          ? t.graded
                          : t.pending}
                    </span>
                  </div>

                  {assignment.submissions.length > 0 ? (
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      {assignment.submissions.map((sub, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-900">
                              {t.submitted}: {sub.date}
                            </p>
                            {sub.grade && (
                              <p className="text-lg font-bold text-blue-600">
                                {t.grade}: {sub.grade}
                              </p>
                            )}
                          </div>
                          {sub.similarity !== null && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-slate-600">
                                Turnitin:
                              </span>
                              <span
                                className={`text-sm font-bold px-2 py-1 rounded ${
                                  sub.similarity < 15
                                    ? "bg-green-100 text-green-700"
                                    : sub.similarity < 30
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-red-100 text-red-700"
                                }`}
                              >
                                {sub.similarity}%
                              </span>
                            </div>
                          )}
                          <p className="text-sm text-slate-600">
                            {t.feedback}: {sub.feedback}
                          </p>
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
                <h3 className="text-xl font-black text-slate-900">
                  💬 {t.forum}
                </h3>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800">
                  + {t.createTopic}
                </button>
              </div>

              {course.forumTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`rounded-lg p-4 border hover:shadow-md transition cursor-pointer ${
                    topic.status === "pinned"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-white border-blue-100"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {topic.status === "pinned" && <span>📌</span>}
                        <h4 className="font-bold text-slate-900">
                          {topic.title}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600">
                        👤 {topic.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 text-sm text-slate-500">
                    <span>
                      💬 {topic.replies} {t.replies}
                    </span>
                    <span>
                      👁️ {topic.views} {t.views}
                    </span>
                    <span>📅 {topic.lastPost}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AppShell>
  );
}
