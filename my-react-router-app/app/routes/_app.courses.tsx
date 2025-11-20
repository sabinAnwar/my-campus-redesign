import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  User as UserIcon,
  CalendarDays,
  ClipboardList,
  Layers,
  FolderOpen,
  PencilLine,
  MessageSquare,
  BookOpen,
  ArrowRight,
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
  AlertCircle,
  Clock,
  MapPin,
  Mail,
  BarChart3,
  CheckCircle,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { saveRecentFile } from "../lib/recentFiles";
import { saveRecentCourse } from "../lib/recentCourses";

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
  const [searchParams] = useSearchParams();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState({});
  const [listFilter, setListFilter] = useState("active"); // active | completed
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Static course configuration
  const COURSES_CONFIG = [
    {
      id: 1,
      code: "WEB101",
      title: language === "de" ? "Webentwicklung" : "Web Development",
      instructor: "Prof. Dr. Sarah Schmidt",
      credits: 6,
      semester: "Wintersemester 2024/25",
      startDate: "01.10.2024",
      endDate: "31.01.2025",
      studiengang: "Wirtschaftsinformatik",
      color: "blue",
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
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/skript/React_Handbook.pdf",
        },
        {
          id: 4,
          type: "script",
          title: "Best Practices.pdf",
          size: "1.8 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/skript/Best_Practices.pdf",
        },
        {
          id: 5,
          type: "file",
          title: "Projektvorlagen.zip",
          size: "12 MB",
          teacher: "Prof. Schmidt",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/foliensaetze/Projektvorlagen.zip",
        },
        {
          id: 6,
          type: "onlineTest",
          title: "Quiz 1 - React Grundlagen.pdf",
          size: "1.2 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/tests/Quiz_1_React_Grundlagen.pdf",
        },
        {
          id: 7,
          type: "evaluation",
          title: "Selbstevaluation Modul 1.pdf",
          size: "0.8 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/tests/Selbstevaluation_Modul_1.pdf",
        },
        {
          id: 8,
          type: "test",
          title: "Online Test - JavaScript.pdf",
          size: "2.1 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/tests/Online_Test_JavaScript.pdf",
        },
        {
          id: 11,
          type: "podcast",
          title: "Web Dev Podcast - Episode 1",
          duration: "35 min",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Webentwicklung/podcasts/Web_Dev_Podcast_Episode_1.mp3",
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
      studiengang: "Wirtschaftsinformatik",
      color: "purple",
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
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Datenbanken/skript/SQL_Reference.pdf",
        },
        {
          id: 4,
          type: "file",
          title: "Sample Database.sql",
          size: "5.3 MB",
          teacher: "Prof. Müller",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Datenbanken/foliensaetze/Sample_Database.sql",
        },
        {
          id: 9,
          type: "onlineTest",
          title: "SQL Quiz - Grundlagen.pdf",
          size: "1.5 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Datenbanken/tests/SQL_Quiz_Grundlagen.pdf",
        },
        {
          id: 10,
          type: "evaluation",
          title: "Bewertungsbogen Normalisierung.pdf",
          size: "0.9 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Datenbanken/tests/Bewertungsbogen_Normalisierung.pdf",
        },
        {
          id: 12,
          type: "podcast",
          title: "Database Design Podcast",
          duration: "42 min",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/Datenbanken/podcasts/Database_Design_Podcast.mp3",
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
      studiengang: "Wirtschaftsinformatik",
      color: "green",
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
      studiengang: "Wirtschaftsinformatik",
      color: "orange",
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
      studiengang: "Wirtschaftsinformatik",
      color: "pink",
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
      resources: [
        // Videos
        {
          id: 115,
          type: "video",
          title: "Einführung Lineare Algebra",
          duration: "52 min",
          url: "#",
        },
        {
          id: 116,
          type: "video",
          title: "Analysis Grundlagen",
          duration: "45 min",
          url: "#",
        },
        {
          id: 117,
          type: "video",
          title: "Stochastik - Wahrscheinlichkeitsrechnung",
          duration: "38 min",
          url: "#",
        },
        // Scripts/PDFs - from public folder
        {
          id: 118,
          type: "script",
          title: "001-2024-0730_IMT102-01_Course_Book.pdf",
          size: "3.5 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/skript/001-2024-0730_IMT102-01_Course_Book.pdf",
        },

        // Podcasts - from public folder
        {
          id: 121,
          type: "podcast",
          title: "IMT102-01_Podcast_00.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_00.mp3",
        },
        {
          id: 122,
          type: "podcast",
          title: "IMT102-01_Podcast_01.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_01.mp3",
        },
        {
          id: 123,
          type: "podcast",
          title: "IMT102-01_Podcast_02.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_02.mp3",
        },
        {
          id: 124,
          type: "podcast",
          title: "IMT102-01_Podcast_03.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_03.mp3",
        },
        {
          id: 125,
          type: "podcast",
          title: "IMT102-01_Podcast_04.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_04.mp3",
        },
        {
          id: 126,
          type: "podcast",
          title: "IMT102-01_Podcast_05.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_05.mp3",
        },
        {
          id: 127,
          type: "podcast",
          title: "IMT102-01_Podcast_06.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_06.mp3",
        },
        {
          id: 128,
          type: "podcast",
          title: "IMT102-01_Podcast_07.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_07.mp3",
        },
        {
          id: 129,
          type: "podcast",
          title: "IMT102-01_Podcast_08.mp3",
          duration: "Podcast",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/podcasts/IMT102-01_Podcast_08.mp3",
        },
        // Musterklausuren - from public folder
        {
          id: 133,
          type: "musterklausur",
          title: "IMT102-01.pdf",
          size: "1.2 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01.pdf",
        },
        {
          id: 134,
          type: "musterklausur",
          title: "IMT102-01 Musterklausur 2.pdf",
          size: "1.3 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01 Musterklausur 2.pdf",
        },
        {
          id: 135,
          type: "musterklausur",
          title: "IMT102-01 MK3.pdf",
          size: "1.1 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01 MK3.pdf",
        },
        {
          id: 136,
          type: "musterklausur",
          title: "IMT102-01 Musterlösung.pdf",
          size: "1.4 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01 Musterlösung.pdf",
        },
        {
          id: 137,
          type: "musterklausur",
          title: "IMT102-01 Musterlösung 2.pdf",
          size: "1.2 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01 Musterlösung 2.pdf",
        },
        {
          id: 138,
          type: "musterklausur",
          title: "IMT102-01 MK3 Musterlösung.pdf",
          size: "1.5 MB",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/musterklausuren/IMT102-01 MK3 Musterlösung.pdf",
        },
        // Online Tests (Lektion 01-08)
        {
          id: 123,
          type: "onlineTest",
          title: "Online Test: Lektion 01.pdf",
          size: "1.2 MB",
          url: "#",
        },
        {
          id: 124,
          type: "onlineTest",
          title: "Online Test: Lektion 02.pdf",
          size: "1.1 MB",
          url: "#",
        },
        {
          id: 125,
          type: "onlineTest",
          title: "Online Test: Lektion 03.pdf",
          size: "1.3 MB",
          url: "#",
        },
        {
          id: 126,
          type: "onlineTest",
          title: "Online Test: Lektion 04.pdf",
          size: "1.4 MB",
          url: "#",
        },
        {
          id: 127,
          type: "onlineTest",
          title: "Online Test: Lektion 05.pdf",
          size: "1.2 MB",
          url: "#",
        },
        {
          id: 128,
          type: "onlineTest",
          title: "Online Test: Lektion 06.pdf",
          size: "1.5 MB",
          url: "#",
        },
        {
          id: 129,
          type: "onlineTest",
          title: "Online Test: Lektion 07.pdf",
          size: "1.3 MB",
          url: "#",
        },
        {
          id: 130,
          type: "onlineTest",
          title: "Online Test: Lektion 08.pdf",
          size: "1.4 MB",
          url: "#",
        },
        // Foliensätze - from public folder
        {
          id: 131,
          type: "file",
          title: "20220623_IMT102-01_Einheit2.pdf",
          size: "2.1 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/folien/20220623_IMT102-01_Einheit2.pdf",
        },
        {
          id: 132,
          type: "file",
          title: "IMT102-01_Einheit1.pdf",
          size: "1.8 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/folien/IMT102-01_Einheit1.pdf",
        },
        {
          id: 140,
          type: "file",
          title: "IMT102-01_Einheit3.pdf",
          size: "1.9 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/folien/IMT102-01_Einheit3.pdf",
        },
        {
          id: 141,
          type: "file",
          title: "IMT102-01_Einheit4.pdf",
          size: "2.0 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/folien/IMT102-01_Einheit4.pdf",
        },
        {
          id: 142,
          type: "file",
          title: "IMT102-01_Einheit5.pdf",
          size: "1.7 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/folien/IMT102-01_Einheit5.pdf",
        },
        {
          id: 143,
          type: "file",
          title: "IMT102-01_Einheit6.pdf",
          size: "2.2 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/folien/IMT102-01_Einheit6.pdf",
        },
        {
          id: 144,
          type: "file",
          title: "IMT102-01_Sechsteilung.pdf",
          size: "1.5 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/folien/IMT102-01_Sechsteilung.pdf",
        },
        {
          id: 145,
          type: "file",
          title: "Lineare Algebra.xlsx",
          size: "0.8 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/folien/Lineare Algebra.xlsx",
        },
        // Tutorium Dokumente - from public folder
        {
          id: 146,
          type: "file",
          title: "IMT102-01_Vorlesung_Lektion 1_Einführung in Matrizen.pdf",
          size: "1.3 MB",
          teacher: "Prof. Dr. König",
          url: "/uploads/studiengaenge/Wirtschaftsinformatik/MatheGrundlageI/toturium/IMT102-01_Vorlesung_Lektion 1_Einführung in Matrizen.pdf",
        },
        // Further Literature (existing)
        {
          id: 100,
          type: "furtherLiterature",
          title:
            "Ballard, G. et al. (2014): Communication Costs of Strassen's Matrix Multiplication. In: Communications of the ACM, 57. Jg., Heft 2, S. 107–114.",
          url: "#",
          isExternal: true,
        },
        {
          id: 101,
          type: "furtherLiterature",
          title:
            "Schramm, T. (2003): Mathematik lernen mit Computer und Algebrasystemen. In: c't – Magazin für Computertechnik, Heft 3, S. 170–172.",
          url: "#",
          isExternal: true,
        },
        {
          id: 102,
          type: "furtherLiterature",
          title:
            "Sparks, D. (2010): A method for Matrix Inversion. In: Civil Engineering, 18. Jg., Heft 6, S. 10–13.",
          url: "#",
          isExternal: true,
        },
        {
          id: 103,
          type: "furtherLiterature",
          title:
            "Eich-Soellner, E. (2010): Formelsammlung Wirtschaftsmathematik. 2. Auflage, Rudolf Haufe, Planegg.",
          url: "#",
          isExternal: true,
        },
        {
          id: 104,
          type: "furtherLiterature",
          title:
            "Kasyanov, V. N./Kasyanova, E. V. (2013): Information visualisation based on graph models. In: Enterprise Information Systems, 7. Jg., Heft 2, S. 187–197.",
          url: "#",
          isExternal: true,
        },
        {
          id: 105,
          type: "furtherLiterature",
          title:
            "Adelson-Velsky, G. M./Levner, E. (2002): Project Scheduling In And–Or Graphs. A Generalization of Dijkstra's Algorithm. In: Mathematics of Operations Research, 27. Jg., Heft 3, S. 504–517.",
          url: "#",
          isExternal: true,
        },
        {
          id: 106,
          type: "furtherLiterature",
          title:
            "Al-Naymat, G./Sakr, S. (2010): Graph indexing and querying. A review. In: International Journal of Web Information Systems, 6. Jg., Heft 2, S. 101–120.",
          url: "#",
          isExternal: true,
        },
        {
          id: 107,
          type: "furtherLiterature",
          title:
            "Stewart Jr., W. R. (2001): Chinese Postman problem. In: Gass, S. I./Harris, C. M. (Hrsg.): Encyclopedia of Operations Research & Management Science. Kluwer Academic Publishers, Boston, MA, S. 84–87.",
          url: "#",
          isExternal: true,
        },
        {
          id: 108,
          type: "furtherLiterature",
          title:
            "Schönberger, J. (2015): Synchronisation in Transportsystemen. Fahrzeugübergreifende Ablaufplanung für die Erfüllung komplexer Serviceanforderungen im Straßengüterverkehr. In: Industrie Management, 31. Jg., Heft 2, S. 15–18.",
          url: "#",
          isExternal: true,
        },
        {
          id: 109,
          type: "furtherLiterature",
          title:
            "Svestka, J. A./Huckfeldt, V. E. (1973): Computational Experience with an M-Salesman Traveling Salesman Algorithm. In: Management Science, 19. Jg., Heft 7, S. 790–799.",
          url: "#",
          isExternal: true,
        },
        {
          id: 110,
          type: "furtherLiterature",
          title:
            "Goyal, S. K. (1971): The tree development method for solving the travelling-salesman problem. In: International Journal of Production Research, 9. Jg., Heft 2, S. 239–246.",
          url: "#",
          isExternal: true,
        },
        {
          id: 111,
          type: "furtherLiterature",
          title:
            "Markl, V./Ramsak, F. (2001): Datenbanktechnik. Datenbankindexe in mehreren Dimensionen. In: c't – Magazin für Computertechnik, Heft 1, S. 174–179.",
          url: "#",
          isExternal: true,
        },
        {
          id: 112,
          type: "onlineTest",
          title: "Mathematik Test 1 - Lineare Algebra.pdf",
          size: "1.8 MB",
          url: "#",
        },
        {
          id: 113,
          type: "test",
          title: "Klausurvorbereitung - Analysis.pdf",
          size: "2.3 MB",
          url: "#",
        },
        {
          id: 114,
          type: "evaluation",
          title: "Selbsteinschätzung Mathematik.pdf",
          size: "0.7 MB",
          url: "#",
        },
      ],
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

  const courses = COURSES_CONFIG;

  // Function to handle course selection and track it
  const handleCourseClick = (course) => {
    setSelectedCourse(course);

    // Save to recently visited courses
    saveRecentCourse({
      id: course.id,
      name: course.title,
      studiengang: course.studiengang || "Wirtschaftsinformatik",
      semester: course.semester,
      color: course.color || "blue",
    });
  };

  // Preselect course if selectedCourseId is present in URL (from dashboard)
  useEffect(() => {
    const idParam = searchParams.get("selectedCourseId");
    if (!idParam) return;
    const id = Number(idParam);
    if (!Number.isFinite(id)) return;
    const found = courses.find((c) => c.id === id);
    if (found) {
      setSelectedCourse(found);
    }
  }, [searchParams]);

  if (!selectedCourse) {
    // List view styled closer to IU card grid
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19]">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">
                {t.modules || t.myCourses}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Verwalte und überwache deine Kurse
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              {(() => {
                const activeCount = courses.filter((c) => c.active).length;
                const completedCount = courses.filter(
                  (c) => !c.active || c.progress >= 100
                ).length;
                return (
                  <>
                    <button
                      onClick={() => setListFilter("active")}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        listFilter === "active"
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/40"
                      }`}
                    >
                      {language === "de" ? "Aktiv" : "Active"} ({activeCount})
                    </button>
                    <button
                      onClick={() => setListFilter("completed")}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        listFilter === "completed"
                          ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-cyan-50/40 dark:hover:bg-cyan-950/40"
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
                className="ml-auto p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
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
                    onClick={() => handleCourseClick(course)}
                    className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-sm group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col"
                  >
                    {/* Top Border Line */}
                    <div 
                      className={`h-1 w-full rounded-t-xl ${
                        course.color === "blue" ? "bg-blue-500" :
                        course.color === "purple" ? "bg-purple-500" :
                        course.color === "green" ? "bg-emerald-500" :
                        course.color === "orange" ? "bg-orange-500" :
                        course.color === "pink" ? "bg-pink-500" :
                        "bg-slate-400"
                      }`} 
                    />

                    <div className="p-5 flex flex-col h-full">
                      {/* Header: Status */}
                      <div className="flex items-center justify-end mb-3">
                        {course.active && (
                          <span className="text-[10px] px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800 uppercase tracking-wider">
                            {language === "de" ? "Aktiv" : "Active"}
                          </span>
                        )}
                         {!course.active && course.progress >= 100 && (
                          <span className="text-[10px] px-2 py-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800 uppercase tracking-wider">
                            {language === "de" ? "Fertig" : "Done"}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 group-hover:underline mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      {/* Meta Info */}
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 mb-3">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {course.startDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <UserIcon className="h-3 w-3" />
                          {course.instructor}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-grow">
                        {course.description}
                      </p>

                      {/* Progress Bar */}
                      {course.active && (
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-1">
                            <span>{language === "de" ? "Fortschritt" : "Progress"}</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                course.color === "blue" ? "bg-blue-500" :
                                course.color === "purple" ? "bg-purple-500" :
                                course.color === "green" ? "bg-emerald-500" :
                                course.color === "orange" ? "bg-orange-500" :
                                course.color === "pink" ? "bg-pink-500" :
                                "bg-slate-400"
                              }`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Footer Action */}
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/50">
                        <button
                          className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                        >
                          {language === "de" ? "Kurs öffnen" : "Open Course"}
                          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-white shadow-sm ${
                            course.color === "blue" ? "bg-gradient-to-r from-blue-500 to-blue-600" :
                            course.color === "purple" ? "bg-gradient-to-r from-purple-500 to-purple-600" :
                            course.color === "green" ? "bg-gradient-to-r from-emerald-500 to-emerald-600" :
                            course.color === "orange" ? "bg-gradient-to-r from-orange-500 to-orange-600" :
                            course.color === "pink" ? "bg-gradient-to-r from-pink-500 to-pink-600" :
                            "bg-gradient-to-r from-slate-500 to-slate-600"
                          }`}>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </button>

                        {/* Magic Credits Badge */}
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg shadow-lg shadow-cyan-500/20 backdrop-blur-md border border-white/10 ${
                             course.color === "blue" ? "bg-gradient-to-br from-blue-500 to-cyan-400 text-white" :
                             course.color === "purple" ? "bg-gradient-to-br from-purple-500 to-fuchsia-400 text-white" :
                             course.color === "green" ? "bg-gradient-to-br from-emerald-500 to-teal-400 text-white" :
                             course.color === "orange" ? "bg-gradient-to-br from-orange-500 to-amber-400 text-white" :
                             course.color === "pink" ? "bg-gradient-to-br from-pink-500 to-rose-400 text-white" :
                             "bg-gradient-to-br from-slate-600 to-slate-500 text-white"
                        }`}>
                          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                          <span className="text-xs font-black tracking-wide">{course.credits} CP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
   
    );
  }

  const course = selectedCourse;

  return (
   
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/20 dark:from-[#0b0f19] dark:via-[#0b0f19] dark:to-[#0b0f19]">
        {/* Header */}
        <header className="bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all duration-200 hover:text-cyan-600 dark:hover:text-cyan-400 text-slate-900 dark:text-slate-100"
                >
                  ← {t.back}
                </button>
                <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                  <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {course.code}: {course.title}
                  </h1>
                  <p className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold">
                    {course.instructor}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-2 text-sm bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-600 cursor-pointer hover:border-cyan-300 dark:hover:border-cyan-500 transition-all"
                >
                  <option value="de">DE</option>
                  <option value="en">EN</option>
                </select>
                <button
                  onClick={() => navigate("/logout")}
                  className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 rounded-lg border border-red-200 dark:border-red-900/50 transition-all duration-200"
                >
                  {t.logout}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto space-x-1">
              {[
                { id: "overview", icon: ClipboardList, label: t.overview },
                { id: "resources", icon: FolderOpen, label: t.resources },
                { id: "videos", icon: Video, label: t.videos },
                { id: "coursefeed", icon: Rss, label: "Course Feed®" },
                {
                  id: "abgabe",
                  icon: PencilLine,
                  label: language === "de" ? "Abgabe" : "Submissions",
                },
                {
                  id: "online-tests",
                  icon: ClipboardCheck,
                  label:
                    language === "de"
                      ? "Online Tests & Evaluationen"
                      : "Online Tests & Evaluations",
                },
                { id: "notes", icon: FileText, label: "Notizen" },
                { id: "forum", icon: MessageSquare, label: t.forum },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm"
                      : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Exam Information Alert */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-[#141824] dark:via-[#161c2a] dark:to-[#131826] rounded-2xl border-2 border-red-200 dark:border-red-700/60 p-8 shadow-xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <h3 className="text-2xl font-black text-red-900 dark:text-red-100">
                    {language === "de"
                      ? "Wichtig: Prüfungsinformation"
                      : "Important: Exam Information"}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-[#0f1724] rounded-xl p-6 border border-red-100 dark:border-red-800/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarDays className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <p className="text-xs uppercase tracking-wider font-semibold text-red-600 dark:text-red-400">
                        {language === "de" ? "Prüfungsdatum" : "Exam Date"}
                      </p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">
                      {course.examDate || "15. Feb 2025"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-[#0f1724] rounded-xl p-6 border border-red-100 dark:border-red-800/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <p className="text-xs uppercase tracking-wider font-semibold text-red-600 dark:text-red-400">
                        {language === "de" ? "Uhrzeit" : "Time"}
                      </p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">
                      {course.examTime || "09:00 Uhr"}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-[#0f1724] rounded-xl p-6 border border-red-100 dark:border-red-800/50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                      <p className="text-xs uppercase tracking-wider font-semibold text-red-600 dark:text-red-400">
                        {language === "de" ? "Ort" : "Location"}
                      </p>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-slate-100">
                      {course.examLocation || "Hörsaal H1"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-[#0d111a] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold uppercase tracking-wide">
                      {t.credits}
                    </p>
                    <BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <p className="text-4xl font-black text-cyan-600 dark:text-cyan-300">
                    {course.credits}
                  </p>
                </div>
                <div className="bg-white dark:bg-[#0d111a] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold uppercase tracking-wide">
                      {t.progress}
                    </p>
                    <BarChart3 className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <p className="text-4xl font-black text-cyan-600 dark:text-cyan-300">
                    {course.progress}%
                  </p>
                </div>
                <div className="bg-white dark:bg-[#0d111a] rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-semibold uppercase tracking-wide">
                      {t.semester}
                    </p>
                    <CalendarDays className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <p className="text-2xl font-black text-cyan-600 dark:text-cyan-300">
                    W24/25
                  </p>
                </div>
              </div>

              {/* Tutor Information */}
                <div className="bg-white dark:bg-[#0d121c] rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-8 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <GraduationCap className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
                  {language === "de" ? "Dozent" : "Instructor"}
                </h3>
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-cyan-600 dark:from-cyan-500 dark:to-cyan-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl flex-shrink-0 shadow-md">
                    {course.instructor?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {course.instructor}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                      {language === "de" ? "Kursleiter" : "Course Instructor"}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white dark:bg-[#0f1828] rounded-xl p-6 border border-cyan-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4 uppercase tracking-wide">
                    {language === "de" ? "Kontakt" : "Contact"}
                  </p>
                  {course.instructorEmail && (
                    <a
                      href={`mailto:${course.instructorEmail}`}
                      className="flex items-center gap-3 text-cyan-600 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 hover:underline font-semibold mb-3 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {course.instructorEmail}
                    </a>
                  )}
                  {!course.instructorEmail && (
                    <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                      <Mail className="h-4 w-4" />
                      {language === "de"
                        ? "E-Mail nicht verfügbar"
                        : "Email not available"}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-[#0d111a] rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 p-8 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-6">
                  {t.courseDescription}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed text-lg">
                  {course.description}
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-[#0f1828] rounded-xl p-6 border border-cyan-100 dark:border-slate-800">
                    <p className="text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                      {t.startDate}
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {course.startDate}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-[#0f1828] rounded-xl p-6 border border-cyan-100 dark:border-slate-800">
                    <p className="text-xs uppercase tracking-wider font-bold text-cyan-600 dark:text-cyan-400 mb-2">
                      {t.endDate}
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {course.endDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab - Expandable Sections */}
          {activeTab === "resources" && (
            <div className="bg-white dark:bg-[#0d121c] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden divide-y divide-slate-200 dark:divide-slate-800">
              {(() => {
                const courseSections = [
                  {
                    id: "skripte",
                    label: "Skripte",
                    icon: FileText,
                    items:
                      course.resources
                        ?.filter((r) => r.type === "script")
                        .map((s) => ({
                          id: s.id,
                          title: s.title,
                          url: s.url,
                          size: s.size,
                          type: "script",
                        })) || [],
                    defaultExpanded: false,
                  },
                  {
                    id: "basisliteratur",
                    label: "Basisliteratur",
                    icon: Book,
                    items: [
                      {
                        id: 1,
                        title:
                          "Hartmann, Peter (2019): Mathematik für Informatiker. Ein praxisbezogenes Lehrbuch",
                        type: "book",
                        url: "#",
                      },
                    ],
                    defaultExpanded: true, // Expanded by default as shown in image
                  },
                  {
                    id: "weiterfuehrende-literatur",
                    label: "Weiterführende Literatur",
                    icon: BookOpen,
                    items:
                      course.resources
                        ?.filter((r) => r.type === "furtherLiterature")
                        .map((lit) => ({
                          id: lit.id,
                          title: lit.title,
                          url: lit.url,
                          isExternal: lit.isExternal || false,
                          type: "literature",
                        })) || [],
                    defaultExpanded: false,
                  },
                  {
                    id: "repetitorium",
                    label: "Repetitorium",
                    icon: GraduationCap,
                    items: [],
                    defaultExpanded: false,
                  },
                  {
                    id: "foliensaetze",
                    label: "Foliensätze",
                    icon: Presentation,
                    items:
                      course.resources
                        ?.filter((r) => r.type === "file" && r.teacher)
                        .map((file) => ({
                          id: file.id,
                          title: file.title,
                          url: file.url,
                          size: file.size,
                          type: "file",
                          teacher: file.teacher,
                        })) || [],
                    defaultExpanded: false,
                  },
                  {
                    id: "musterklausur",
                    label: "Musterklausur",
                    icon: ClipboardCheck,
                    items:
                      course.resources
                        ?.filter((r) => r.type === "musterklausur")
                        .map((mk) => ({
                          id: mk.id,
                          title: mk.title,
                          url: mk.url,
                          size: mk.size,
                          type: "musterklausur",
                        })) || [],
                    defaultExpanded: false,
                  },
                  {
                    id: "podcasts",
                    label: "Podcasts",
                    icon: Headphones,
                    items:
                      course.resources
                        ?.filter((r) => r.type === "podcast")
                        .map((podcast) => ({
                          id: podcast.id,
                          title: podcast.title,
                          url: podcast.url,
                          duration: podcast.duration,
                          type: "podcast",
                        })) || [],
                    defaultExpanded: false,
                  },
                  {
                    id: "dokumente-tutorium",
                    label: "Dokumente Tutorium",
                    icon: Users,
                    items: [],
                    defaultExpanded: false,
                  },
                ];

                return courseSections.map((section) => {
                  const isExpanded =
                    expandedSections[section.id] !== undefined
                      ? expandedSections[section.id]
                      : section.defaultExpanded;

                  return (
                    <div key={section.id} className="p-0">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-cyan-50/30 dark:hover:bg-slate-800 transition-colors duration-300 text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <section.icon className="h-5 w-5 text-cyan-600 dark:text-cyan-300 group-hover:scale-110 transition-transform" />
                          <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                            {section.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isExpanded ? (
                            <Minus className="h-4 w-4 text-slate-500" />
                          ) : (
                            <Plus className="h-4 w-4 text-slate-500" />
                          )}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50">
                          {section.items.length > 0 ? (
                            <div className="space-y-2">
                              {section.items.map((item) => {
                                const handleFileClick = (e) => {
                                  e.preventDefault();

                                  // Detect file type from name and section
                                  let fileType = item.type;
                                  if (!fileType) {
                                    const fileName = item.title.toLowerCase();
                                    if (fileName.endsWith(".pdf")) {
                                      fileType = "pdf";
                                    } else if (
                                      fileName.endsWith(".xlsx") ||
                                      fileName.endsWith(".xls")
                                    ) {
                                      fileType = "excel";
                                    } else if (
                                      fileName.endsWith(".mp3") ||
                                      fileName.endsWith(".mp4") ||
                                      fileName.endsWith(".wav")
                                    ) {
                                      fileType = "podcast";
                                    } else if (section.id === "podcasts") {
                                      fileType = "podcast";
                                    } else if (section.id === "skripte") {
                                      fileType = "pdf";
                                    } else if (section.id === "foliensaetze") {
                                      fileType =
                                        fileName.endsWith(".xlsx") ||
                                        fileName.endsWith(".xls")
                                          ? "excel"
                                          : "pdf";
                                    } else {
                                      fileType = "file";
                                    }
                                  }

                                  // Track file as recently opened
                                  saveRecentFile(
                                    {
                                      id: item.id,
                                      name: item.title,
                                      type: fileType,
                                      url: item.url,
                                    },
                                    course.title, // course name
                                    null // studiengang
                                  );

                                  // Open file
                                  if (item.url && item.url !== "#") {
                                    window.open(
                                      item.url,
                                      "_blank",
                                      "noopener,noreferrer"
                                    );
                                  }
                                };

                                return (
                                  <div
                                    key={item.id}
                                    className="flex items-start gap-3 py-4 px-4 hover:bg-white dark:hover:bg-slate-800 rounded-lg cursor-pointer border border-transparent hover:border-cyan-200 dark:hover:border-cyan-700 transition-all duration-300 group"
                                    onClick={handleFileClick}
                                  >
                                    <div className="mt-1 p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-800/50 transition-colors">
                                      {item.type === "podcast" ? (
                                        <Play className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                                      ) : (
                                        <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-300" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <a
                                        href={item.url || "#"}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-sm text-cyan-600 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200 hover:underline font-semibold line-clamp-2 transition-colors"
                                      >
                                        {item.title}
                                      </a>
                                      <div className="flex items-center gap-4 mt-2 flex-wrap">
                                        {item.duration && (
                                          <span className="text-xs text-slate-500 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/70 px-2 py-1 rounded">
                                            ⏱️ {item.duration}
                                          </span>
                                        )}
                                        {item.size && (
                                          <span className="text-xs text-slate-500 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/70 px-2 py-1 rounded">
                                            📦 {item.size}
                                          </span>
                                        )}
                                        {item.updatedDate && (
                                          <span className="text-xs text-slate-500 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/70 px-2 py-1 rounded">
                                            🔄{" "}
                                            {language === "de"
                                              ? "Aktualisiert:"
                                              : "Updated:"}{" "}
                                            {item.updatedDate}
                                          </span>
                                        )}
                                        {item.lastUpdated && (
                                          <span className="text-xs text-slate-500 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/70 px-2 py-1 rounded">
                                            ⏰{" "}
                                            {language === "de"
                                              ? "Zuletzt:"
                                              : "Last:"}{" "}
                                            {item.lastUpdated}
                                          </span>
                                        )}
                                      </div>
                                      {item.isExternal && (
                                        <span className="ml-2 text-xs text-slate-500 dark:text-slate-300">
                                          External tool
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 py-2">
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
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                🎥 {t.videos}
              </h3>
              <div className="space-y-2">
                {course.resources
                  ?.filter((r) => r.type === "video")
                  .map((resource) => {
                    const handleVideoClick = () => {
                      // Track video as recently opened
                      saveRecentFile(
                        {
                          id: resource.id,
                          name: resource.title,
                          type: "video",
                          url: resource.url,
                          duration: resource.duration,
                        },
                        course.title, // course name
                        null // studiengang
                      );

                      // Open video
                      if (resource.url && resource.url !== "#") {
                        window.open(
                          resource.url,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
                    };

                    return (
                      <div
                        key={resource.id}
                        className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-blue-100 dark:border-slate-700 hover:shadow-md transition cursor-pointer flex items-center justify-between"
                        onClick={handleVideoClick}
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {resource.title}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-300">
                            ⏱️ {resource.duration}
                          </p>
                        </div>
                        <button
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 font-semibold rounded hover:bg-blue-200 dark:hover:bg-blue-900/60"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVideoClick();
                          }}
                        >
                          ▶️ {language === "de" ? "Abspielen" : "Play"}
                        </button>
                      </div>
                    );
                  })}
                {(!course.resources ||
                  course.resources.filter((r) => r.type === "video").length ===
                    0) && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                    Noch keine Videos verfügbar
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Course Feed Tab */}
          {activeTab === "coursefeed" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  📰 Course Feed®
                </h3>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-slate-200 dark:border-slate-700 text-center max-w-md mx-auto">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-4">
                  Course Feed®
                </h3>

                {/* Course Feed Image */}
                <div className="mb-6 flex justify-center">
                  <img
                    src="/course-feed.png"
                    alt="Course Feed"
                    className="w-48 h-40 object-contain"
                  />
                </div>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                  {language === "de"
                    ? "Interagieren Sie mit Ihren Online-Tutoren und Mitstudierenden, stellen Sie Fragen und nehmen Sie an Live-Lehrveranstaltungen teil."
                    : "Interact with your online tutors and fellow students, ask questions and participate in live teaching events."}
                </p>

                {/* Sign Up Button */}
                <button className="w-full px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded hover:bg-slate-800 dark:hover:bg-slate-100 transition">
                  {language === "de" ? "Anmelden" : "Sign up"}
                </button>
              </div>
            </div>
          )}

          {/* Abgabe (Submissions) Tab */}
          {activeTab === "abgabe" && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                ✍️ {language === "de" ? "Abgabe" : "Submissions"}
              </h3>
              {course.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-blue-100 dark:border-slate-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                        {assignment.title}
                      </h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
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
                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 space-y-3">
                      {assignment.submissions.map((sub, idx) => (
                        <div key={idx}>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                              {t.submitted}: {sub.date}
                            </p>
                            {sub.grade && (
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-300">
                                {t.grade}: {sub.grade}
                              </p>
                            )}
                          </div>
                          {sub.similarity !== null && (
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
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
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {t.feedback}: {sub.feedback}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <button className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800">
                      ⬆️ {t.uploadAssignment}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Online Tests & Evaluationen Tab */}
          {activeTab === "online-tests" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                📋{" "}
                {language === "de"
                  ? "Online Tests & Evaluationen"
                  : "Online Tests & Evaluations"}
              </h3>

              {/* Exam Date Information Card */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/30 rounded-lg border-2 border-red-200 dark:border-red-900/60 p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📅</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-red-900 dark:text-red-100 mb-2">
                      {language === "de" ? "Prüfungstermin" : "Exam Date"}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {language === "de" ? "Datum" : "Date"}
                        </p>
                        <p className="text-lg font-black text-red-700 dark:text-red-200">
                          {course.examDate || "15. Februar 2025"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {language === "de" ? "Uhrzeit" : "Time"}
                        </p>
                        <p className="text-lg font-black text-red-700 dark:text-red-200">
                          {course.examTime || "09:00 - 11:00 Uhr"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white dark:bg-slate-800 rounded border border-red-200 dark:border-red-800">
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        <span className="font-semibold">
                          ⚠️ {language === "de" ? "Ort:" : "Location:"}
                        </span>{" "}
                        {course.examLocation || "Hörsaal H1, Hauptgebäude"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Tests Section */}
              {(() => {
                const onlineTests =
                  course.resources?.filter(
                    (r) => r.type === "onlineTest" || r.type === "test"
                  ) || [];
                return (
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                      <h4 className="font-black text-slate-900 dark:text-slate-100">
                        🧪 {language === "de" ? "Online Tests" : "Online Tests"}
                      </h4>
                    </div>
                    {onlineTests.length > 0 ? (
                      <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {onlineTests.map((test) => (
                          <div
                            key={test.id}
                            className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                                  {test.title}
                                </h5>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                  ⏱️ {test.duration || "45 Minuten"}
                                </p>
                              </div>
                              <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                                {language === "de" ? "Verfügbar" : "Available"}
                              </span>
                            </div>
                            <a
                              href={test.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700/80 transition"
                            >
                              ▶️{" "}
                              {language === "de"
                                ? "Test starten"
                                : "Start Test"}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                        <p>
                          {language === "de"
                            ? "Keine Online Tests verfügbar"
                            : "No online tests available"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Evaluations Section */}
              {(() => {
                const evaluations =
                  course.resources?.filter((r) => r.type === "evaluation") ||
                  [];
                return (
                  <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 mt-6">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60">
                      <h4 className="font-black text-slate-900 dark:text-slate-100">
                        ⭐ {language === "de" ? "Evaluationen" : "Evaluations"}
                      </h4>
                    </div>
                    {evaluations.length > 0 ? (
                      <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {evaluations.map((evaluation) => (
                          <div
                            key={evaluation.id}
                            className="p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-1">
                                  {evaluation.title}
                                </h5>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                  {evaluation.description || language === "de"
                                    ? "Bitte bewerten Sie diesen Kurs"
                                    : "Please rate this course"}
                                </p>
                              </div>
                              <span className="text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                                {language === "de" ? "Umfrage" : "Survey"}
                              </span>
                            </div>
                            <a
                              href={evaluation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 dark:hover:bg-purple-700/80 transition"
                            >
                              📝{" "}
                              {language === "de" ? "Teilnehmen" : "Participate"}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500 dark:text-slate-400">
                        <p>
                          {language === "de"
                            ? "Keine Evaluationen verfügbar"
                            : "No evaluations available"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <div
                className="bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-700 overflow-hidden"
                style={{ height: "800px" }}
              >
                <iframe
                  src="https://study-scribe-83.lovable.app/"
                  title="Study Scribe - Note Taking"
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allow="camera; microphone; clipboard-read; clipboard-write"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          {/* Forum Tab */}
          {activeTab === "forum" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
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
                      ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800"
                      : "bg-white dark:bg-slate-800 border-blue-100 dark:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {topic.status === "pinned" && <span>📌</span>}
                        <h4 className="font-bold text-slate-900 dark:text-slate-100">
                          {topic.title}
                        </h4>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        👤 {topic.author}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-300">
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
  
  );
}
