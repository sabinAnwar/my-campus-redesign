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
  const [selectedCourse, setSelectedCourse] = useState(null);
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
                  onClick={() => handleCourseClick(course)}
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
              {/* Exam Information Alert */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🔴</span>
                  <h3 className="text-lg font-black text-red-900">
                    {language === "de"
                      ? "Wichtig: Prüfungsinformation"
                      : "Important: Exam Information"}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      {language === "de" ? "Prüfungsdatum" : "Exam Date"}
                    </p>
                    <p className="text-xl font-black text-red-700">
                      {course.examDate || "15. Feb 2025"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      {language === "de" ? "Uhrzeit" : "Time"}
                    </p>
                    <p className="text-xl font-black text-red-700">
                      {course.examTime || "09:00 Uhr"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-red-200">
                    <p className="text-sm font-semibold text-slate-700 mb-1">
                      {language === "de" ? "Ort" : "Location"}
                    </p>
                    <p className="text-xl font-black text-red-700">
                      {course.examLocation || "Hörsaal H1"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
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

              {/* Tutor Information */}
              <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6">
                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                  👨‍🏫 {language === "de" ? "Dozent" : "Instructor"}
                </h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                    {course.instructor?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {course.instructor}
                    </p>
                    <p className="text-sm text-slate-600">
                      {language === "de" ? "Kursleiter" : "Course Instructor"}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900 mb-2">
                    {language === "de" ? "Kontakt" : "Contact"}
                  </p>
                  {course.instructorEmail && (
                    <a
                      href={`mailto:${course.instructorEmail}`}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline text-sm mb-2"
                    >
                      ✉️ {course.instructorEmail}
                    </a>
                  )}
                  {!course.instructorEmail && (
                    <p className="flex items-center gap-2 text-slate-500 text-sm">
                      ✉️{" "}
                      {language === "de"
                        ? "E-Mail nicht verfügbar"
                        : "Email not available"}
                    </p>
                  )}
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
                                    className="flex items-start gap-2 py-3 px-3 hover:bg-white rounded cursor-pointer border-b border-slate-200 last:border-b-0"
                                    onClick={handleFileClick}
                                  >
                                    {item.type === "podcast" ? (
                                      <Play className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                    ) : (
                                      <FileText className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                      <a
                                        href={item.url || "#"}
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-semibold"
                                      >
                                        {item.title}
                                      </a>
                                      <div className="flex items-center gap-4 mt-1">
                                        {item.duration && (
                                          <span className="text-xs text-slate-500">
                                            ⏱️ {item.duration}
                                          </span>
                                        )}
                                        {item.size && (
                                          <span className="text-xs text-slate-500">
                                            📦 {item.size}
                                          </span>
                                        )}
                                        {item.updatedDate && (
                                          <span className="text-xs text-slate-500">
                                            🔄{" "}
                                            {language === "de"
                                              ? "Aktualisiert:"
                                              : "Updated:"}{" "}
                                            {item.updatedDate}
                                          </span>
                                        )}
                                        {item.lastUpdated && (
                                          <span className="text-xs text-slate-500">
                                            ⏰{" "}
                                            {language === "de"
                                              ? "Zuletzt:"
                                              : "Last:"}{" "}
                                            {item.lastUpdated}
                                          </span>
                                        )}
                                      </div>
                                      {item.isExternal && (
                                        <span className="ml-2 text-xs text-slate-500">
                                          External tool
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
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
                        className="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition cursor-pointer flex items-center justify-between"
                        onClick={handleVideoClick}
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {resource.title}
                          </p>
                          <p className="text-sm text-slate-500">
                            ⏱️ {resource.duration}
                          </p>
                        </div>
                        <button
                          className="px-3 py-1 bg-blue-100 text-blue-700 font-semibold rounded hover:bg-blue-200"
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
                  <p className="text-slate-500 text-center py-8">
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
                <h3 className="text-lg font-black text-slate-900">
                  📰 Course Feed®
                </h3>
              </div>

              <div className="bg-white rounded-lg p-8 border border-slate-200 text-center max-w-md mx-auto">
                <h3 className="text-sm font-semibold text-slate-600 mb-4">
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
                <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                  {language === "de"
                    ? "Interagieren Sie mit Ihren Online-Tutoren und Mitstudierenden, stellen Sie Fragen und nehmen Sie an Live-Lehrveranstaltungen teil."
                    : "Interact with your online tutors and fellow students, ask questions and participate in live teaching events."}
                </p>

                {/* Sign Up Button */}
                <button className="w-full px-6 py-3 bg-slate-900 text-white font-semibold rounded hover:bg-slate-800 transition">
                  {language === "de" ? "Anmelden" : "Sign up"}
                </button>
              </div>
            </div>
          )}

          {/* Abgabe (Submissions) Tab */}
          {activeTab === "abgabe" && (
            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-900 mb-6">
                ✍️ {language === "de" ? "Abgabe" : "Submissions"}
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

          {/* Online Tests & Evaluationen Tab */}
          {activeTab === "online-tests" && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-900 mb-6">
                📋{" "}
                {language === "de"
                  ? "Online Tests & Evaluationen"
                  : "Online Tests & Evaluations"}
              </h3>

              {/* Exam Date Information Card */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-200 p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">📅</div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-red-900 mb-2">
                      {language === "de" ? "Prüfungstermin" : "Exam Date"}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {language === "de" ? "Datum" : "Date"}
                        </p>
                        <p className="text-lg font-black text-red-700">
                          {course.examDate || "15. Februar 2025"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {language === "de" ? "Uhrzeit" : "Time"}
                        </p>
                        <p className="text-lg font-black text-red-700">
                          {course.examTime || "09:00 - 11:00 Uhr"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded border border-red-200">
                      <p className="text-sm text-slate-700">
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
                  <div className="bg-white rounded-lg border border-slate-200">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                      <h4 className="font-black text-slate-900">
                        🧪 {language === "de" ? "Online Tests" : "Online Tests"}
                      </h4>
                    </div>
                    {onlineTests.length > 0 ? (
                      <div className="divide-y divide-slate-200">
                        {onlineTests.map((test) => (
                          <div
                            key={test.id}
                            className="p-6 hover:bg-slate-50 transition"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-bold text-slate-900 mb-1">
                                  {test.title}
                                </h5>
                                <p className="text-sm text-slate-600">
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
                              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
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
                      <div className="p-6 text-center text-slate-500">
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
                  <div className="bg-white rounded-lg border border-slate-200 mt-6">
                    <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                      <h4 className="font-black text-slate-900">
                        ⭐ {language === "de" ? "Evaluationen" : "Evaluations"}
                      </h4>
                    </div>
                    {evaluations.length > 0 ? (
                      <div className="divide-y divide-slate-200">
                        {evaluations.map((evaluation) => (
                          <div
                            key={evaluation.id}
                            className="p-6 hover:bg-slate-50 transition"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h5 className="font-bold text-slate-900 mb-1">
                                  {evaluation.title}
                                </h5>
                                <p className="text-sm text-slate-600">
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
                              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
                            >
                              📝{" "}
                              {language === "de" ? "Teilnehmen" : "Participate"}
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-500">
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
                className="bg-white rounded-lg border border-blue-100 overflow-hidden"
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
