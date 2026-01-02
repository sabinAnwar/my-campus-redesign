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
    submitted: "Abgegeben",
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

// Course Description Translations - Maps German descriptions to English
export const COURSE_DESCRIPTION_TRANSLATIONS: Record<string, string> = {
  // Bachelorarbeit
  "Die Bachelorarbeit bildet den Abschluss des Studiums. In dieser wissenschaftlichen Arbeit weist der Studierende nach, dass er in der Lage ist, ein Problem aus seinem Fachgebiet selbstständig nach wissenschaftlichen Methoden zu bearbeiten.":
    "The Bachelor's thesis marks the completion of the degree. In this academic work, students demonstrate their ability to independently address a problem from their field of study using scientific methods.",
  
  // IT-Ethik / Ethik in der IT
  "Dieses Modul beleuchtet die ethischen Implikationen der Digitalisierung. Datenschutz, Algorithmen-Ethik und Verantwortung in der IT stehen im Fokus.":
    "This module explores the ethical implications of digitalization. Data privacy, algorithm ethics, and responsibility in IT are the main focus.",
  
  // E-Commerce
  "Dieses Modul vermittelt die Grundlagen und fortgeschrittenen Konzepte des elektronischen Handels. Themen sind Geschäftsmodelle, technologische Infrastruktur, E-Marketing und rechtliche Aspekte.":
    "This module covers the fundamentals and advanced concepts of electronic commerce. Topics include business models, technological infrastructure, e-marketing, and legal aspects.",
  
  // Praxisprojekt VII
  "Das letzte Praxisprojekt vor der Bachelorarbeit. Vertiefung der fachlichen Kenntnisse im Unternehmen und Vorbereitung auf die Thesis.":
    "The final practical project before the Bachelor's thesis. Deepening of professional knowledge in the company and preparation for the thesis.",
  
  // Einführung Wirtschaftsinformatik
  "Grundlegende Konzepte der Wirtschaftsinformatik, Informationssysteme und digitale Geschäftsprozesse.":
    "Fundamental concepts of business informatics, information systems, and digital business processes.",
  
  // Video Marketing
  "Strategien und Techniken für erfolgreiches Video-Marketing. Von der Konzeption bis zur Distribution.":
    "Strategies and techniques for successful video marketing. From conception to distribution.",
  
  // CRM
  "Customer Relationship Management: Strategien zur Kundenbindung und -pflege mit digitalen Tools.":
    "Customer Relationship Management: Strategies for customer retention and nurturing with digital tools.",
  
  // Generic Praxisprojekt
  "Praktische Anwendung des erlernten Wissens im Unternehmen.":
    "Practical application of acquired knowledge in the company.",
  
  // Programming
  "Grundlagen der Programmierung und Softwareentwicklung.":
    "Fundamentals of programming and software development.",
  
  // Databases
  "Entwurf, Implementierung und Verwaltung von Datenbanksystemen.":
    "Design, implementation, and management of database systems.",
  
  // Mathematics
  "Mathematische Grundlagen für Informatik und Wirtschaft.":
    "Mathematical foundations for computer science and business.",
  
  // Statistics
  "Statistische Methoden und Datenanalyse für die Wirtschaftsinformatik.":
    "Statistical methods and data analysis for business informatics.",
  
  // BWL
  "Grundlagen der Betriebswirtschaftslehre und Unternehmensführung.":
    "Fundamentals of business administration and corporate management.",
  
  // Software Engineering
  "Methoden und Werkzeuge der professionellen Softwareentwicklung.":
    "Methods and tools of professional software development.",
  
  // IT Security
  "Grundlagen der IT-Sicherheit, Kryptographie und Datenschutz.":
    "Fundamentals of IT security, cryptography, and data protection.",
  
  // Cloud Computing
  "Cloud-Technologien, Services und deren Anwendung in Unternehmen.":
    "Cloud technologies, services, and their application in enterprises.",
  
  // Web Development
  "Entwicklung moderner Webanwendungen mit aktuellen Technologien.":
    "Development of modern web applications using current technologies.",
  
  // Mobile App Development
  "Entwicklung von mobilen Anwendungen für iOS und Android.":
    "Development of mobile applications for iOS and Android.",
  
  // AI / KI
  "Grundlagen der Künstlichen Intelligenz und maschinelles Lernen.":
    "Fundamentals of Artificial Intelligence and machine learning.",
  
  // Data Science
  "Methoden und Werkzeuge der Datenanalyse und -visualisierung.":
    "Methods and tools for data analysis and visualization.",
  
  // Marketing
  "Grundlagen des Marketings und der Marktforschung.":
    "Fundamentals of marketing and market research.",
  
  // Marktforschung
  "Methoden und Techniken der empirischen Marktforschung.":
    "Methods and techniques of empirical market research.",
  
  // Brand Management
  "Strategien zur Entwicklung und Führung von Marken.":
    "Strategies for brand development and management.",
  
  // Content Marketing
  "Erstellung und Distribution von wertvollem Content für Zielgruppen.":
    "Creation and distribution of valuable content for target audiences.",
  
  // Social Media Marketing
  "Marketing-Strategien für soziale Medien und Plattformen.":
    "Marketing strategies for social media and platforms.",
};

// Helper function to get translated description
export const getTranslatedDescription = (description: string, language: "de" | "en"): string => {
  if (language === "de") return description;
  return COURSE_DESCRIPTION_TRANSLATIONS[description] || description;
};

// ALL COURSES CONFIGURATION - Synced with prisma/seed.js

export const getCourseConfig = (language: "de" | "en") => [
  // =================================================================================================
  // WIRTSCHAFTSINFORMATIK (Business Informatics)
  // =================================================================================================

  // Semester 1
  {
    id: 101, code: "WI101",
    title: language === "de" ? "Einführung Wirtschaftsinformatik" : "Intro to Business Informatics",
    titleDE: "Einführung Wirtschaftsinformatik",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Wirtschaftsinformatik", color: "blue", active: false, progress: 100,
  },
  {
    id: 102, code: "BWL101",
    title: language === "de" ? "Grundlagen BWL" : "Business Administration Basics",
    titleDE: "Grundlagen BWL",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Wirtschaftsinformatik", color: "purple", active: false, progress: 100,
  },
  {
    id: 103, code: "ACC101",
    title: language === "de" ? "Buchführung" : "Bookkeeping",
    titleDE: "Buchführung",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Wirtschaftsinformatik", color: "green", active: false, progress: 100,
  },
  {
    id: 104, code: "MATH101",
    title: language === "de" ? "Mathematik I" : "Mathematics I",
    titleDE: "Mathematik I",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Wirtschaftsinformatik", color: "orange", active: false, progress: 100,
  },
  {
    id: 105, code: "PRX101",
    title: language === "de" ? "Praxisprojekt I" : "Practical Project I",
    titleDE: "Praxisprojekt I",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Wirtschaftsinformatik", color: "pink", active: false, progress: 100,
  },

  // Semester 2
  {
    id: 201, code: "PROG101",
    title: language === "de" ? "Programmierung I" : "Programming I",
    titleDE: "Programmierung I",
    credits: 5, semester: language === "de" ? "2. Semester" : "2nd Semester",
    studiengang: "Wirtschaftsinformatik", color: "blue", active: false, progress: 100,
  },
  {
    id: 202, code: "COST101",
    title: language === "de" ? "Kostenrechnung" : "Cost Accounting",
    titleDE: "Kostenrechnung",
    credits: 5, semester: language === "de" ? "2. Semester" : "2nd Semester",
    studiengang: "Wirtschaftsinformatik", color: "purple", active: false, progress: 100,
  },
  {
    id: 203, code: "SCI101",
    title: language === "de" ? "Wissenschaftliches Arbeiten" : "Academic Work",
    titleDE: "Wissenschaftliches Arbeiten",
    credits: 5, semester: language === "de" ? "2. Semester" : "2nd Semester",
    studiengang: "Wirtschaftsinformatik", color: "green", active: false, progress: 100,
  },
  {
    id: 204, code: "STAT101",
    title: language === "de" ? "Statistik" : "Statistics",
    titleDE: "Statistik",
    credits: 5, semester: language === "de" ? "2. Semester" : "2nd Semester",
    studiengang: "Wirtschaftsinformatik", color: "orange", active: false, progress: 100,
  },
  {
    id: 205, code: "PRX102",
    title: language === "de" ? "Praxisprojekt II" : "Practical Project II",
    titleDE: "Praxisprojekt II",
    credits: 5, semester: language === "de" ? "2. Semester" : "2nd Semester",
    studiengang: "Wirtschaftsinformatik", color: "pink", active: false, progress: 100,
  },

    // Semester 3
  {
    id: 301, code: "DB101",
    title: language === "de" ? "Datenbanken" : "Databases",
    titleDE: "Datenbanken",
    credits: 5, semester: language === "de" ? "3. Semester" : "3rd Semester",
    studiengang: "Wirtschaftsinformatik", color: "blue", active: false, progress: 100,
  },
  {
    id: 302, code: "LAW101",
    title: language === "de" ? "Wirtschaftsprivatrecht" : "Business Law",
    titleDE: "Wirtschaftsprivatrecht",
    credits: 5, semester: language === "de" ? "3. Semester" : "3rd Semester",
    studiengang: "Wirtschaftsinformatik", color: "purple", active: false, progress: 100,
  },
  {
    id: 303, code: "ECON101",
    title: language === "de" ? "Volkswirtschaftslehre" : "Economics",
    titleDE: "Volkswirtschaftslehre",
    credits: 5, semester: language === "de" ? "3. Semester" : "3rd Semester",
    studiengang: "Wirtschaftsinformatik", color: "green", active: false, progress: 100,
  },
  {
    id: 304, code: "PROG102",
    title: language === "de" ? "Programmierung II" : "Programming II",
    titleDE: "Programmierung II",
    credits: 5, semester: language === "de" ? "3. Semester" : "3rd Semester",
    studiengang: "Wirtschaftsinformatik", color: "orange", active: false, progress: 100,
  },
  {
    id: 305, code: "PRX103",
    title: language === "de" ? "Praxisprojekt III" : "Practical Project III",
    titleDE: "Praxisprojekt III",
    credits: 5, semester: language === "de" ? "3. Semester" : "3rd Semester",
    studiengang: "Wirtschaftsinformatik", color: "pink", active: false, progress: 100,
  },

  // Semester 7
  {
    id: 701, code: "THESIS",
    title: language === "de" ? "Bachelorarbeit" : "Bachelor Thesis",
    titleDE: "Bachelorarbeit",
    credits: 10, semester: language === "de" ? "7. Semester" : "7th Semester",
    studiengang: "Wirtschaftsinformatik", color: "blue", active: true, progress: 0,
  },
  {
    id: 702, code: "KOLL101",
    title: language === "de" ? "Kolloquium" : "Colloquium",
    titleDE: "Kolloquium",
    credits: 5, semester: language === "de" ? "7. Semester" : "7th Semester",
    studiengang: "Wirtschaftsinformatik", color: "purple", active: true, progress: 0,
  },
  {
    id: 703, code: "ETHIK101",
    title: language === "de" ? "IT-Ethik" : "IT Ethics",
    titleDE: "IT-Ethik",
    credits: 5, semester: language === "de" ? "7. Semester" : "7th Semester",
    studiengang: "Wirtschaftsinformatik", color: "green", active: true, progress: 0,
  },
  {
    id: 705, code: "PRX107",
    title: language === "de" ? "Praxisprojekt VII" : "Practical Project VII",
    titleDE: "Praxisprojekt VII",
    credits: 5, semester: language === "de" ? "7. Semester" : "7th Semester",
    studiengang: "Wirtschaftsinformatik", color: "pink", active: true, progress: 0,
  },

  // =================================================================================================
  // MARKETING (Dual)
  // =================================================================================================

  // Semester 1
  {
    id: 1101, code: "MKTG101",
    title: language === "de" ? "Grundlagen Marketing" : "Marketing Basics",
    titleDE: "Grundlagen Marketing",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Marketing", color: "blue", active: false, progress: 100,
  },
  {
    id: 1102, code: "BWL101",
    title: language === "de" ? "BWL I" : "Business Admin I",
    titleDE: "BWL I",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Marketing", color: "purple", active: false, progress: 100,
  },
  {
    id: 1103, code: "MATH101",
    title: language === "de" ? "Wirtschaftsmathematik" : "Business Math",
    titleDE: "Wirtschaftsmathematik",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Marketing", color: "green", active: false, progress: 100,
  },
  {
    id: 1104, code: "DIG101",
    title: language === "de" ? "Digitale Business Modelle" : "Digital Business Models",
    titleDE: "Digitale Business Modelle",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Marketing", color: "orange", active: false, progress: 100,
  },
  {
    id: 1105, code: "PRX1101",
    title: language === "de" ? "Praxisprojekt I" : "Practical Project I",
    titleDE: "Praxisprojekt I",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Marketing", color: "pink", active: false, progress: 100,
  },

  // =================================================================================================
  // INFORMATIK (Dual)
  // =================================================================================================

  // Semester 1
  {
    id: 2101, code: "CS101",
    title: language === "de" ? "Einführung Informatik" : "Intro to CS",
    titleDE: "Einführung Informatik",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Informatik", color: "blue", active: false, progress: 100,
  },
  {
    id: 2102, code: "MATH101",
    title: language === "de" ? "Mathematik I" : "Calculus I",
    titleDE: "Mathematik I",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Informatik", color: "purple", active: false, progress: 100,
  },
  {
    id: 2103, code: "PROG101",
    title: language === "de" ? "Programmierung I" : "Programming I",
    titleDE: "Programmierung I",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Informatik", color: "green", active: false, progress: 100,
  },
  {
    id: 2104, code: "LOGIC101",
    title: language === "de" ? "Digitale Logik" : "Digital Logic",
    titleDE: "Digitale Logik",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Informatik", color: "orange", active: false, progress: 100,
  },
  {
    id: 2105, code: "PRX2101",
    title: language === "de" ? "Praxisprojekt I" : "Practical Project I",
    titleDE: "Praxisprojekt I",
    credits: 5, semester: language === "de" ? "1. Semester" : "1st Semester",
    studiengang: "Informatik", color: "pink", active: false, progress: 100,
  },
].map(c => ({...c, modules: [], resources: [], assignments: [], forumTopics: []}));
