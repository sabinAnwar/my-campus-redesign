export const TRANSLATIONS = {
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
    progress: "Fortschritt",
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
    progress: "Progress",
  },
};

export const getCourseConfig = (language: "de" | "en") => [
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
          "Stewart Jr., W. R. (2001): Chinese Postman problem. In: Gass, S. I/Harris, C. M. (Hrsg.): Encyclopedia of Operations Research & Management Science. Kluwer Academic Publishers, Boston, MA, S. 84–87.",
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
