import type { NavKey } from "~/types/navigation";

export const SHELL_TRANSLATIONS: Record<
  "de" | "en",
  {
    programTitle: string;
    campus: string;
    nav: Record<NavKey, string>;
    menu: {
      settings: string;
      curriculum: string;
      moduleHandbook: string;
      studentId: string;
      certificates: string;
      transcript: string;
      immatriculation: string;
      logout: string;
      online: string;
      student: string;
    };
    search: {
      placeholder: string;
      results: string;
      noResults: string;
      categories: {
        courses: string;
        documents: string;
        faq: string;
        library: string;
        grades: string;
        account: string;
      };
      items: {
        examRegulations: string;
        moduleHandbook: string;
        faq: string;
        library: string;
        transcript: string;
        performanceOverview: string;
        studentId: string;
      };
    };
  }
> = {
  de: {
    programTitle: "DS WINFO Wirtschaftsinformatik",
    campus: "Campus Hamburg",
    nav: {
      dashboard: "Dashboard",
      courseSchedule: "Kursplan",
      courses: "Meine Kurse",
      recentFiles: "Zuletzt besucht",
      tasks: "Aufgaben & Abgaben",
      praxisReport: "Praxisbericht",
      infoCenter: "Info Center",
      benefits: "Vorteile für Studierende",
      socialMedia: "Social Media & Campus",
      news: "News & Updates",
      faq: "Hilfe & FAQ",
      studyOrg: "Studienorganisation",
      library: "Bibliothek & Services",
      lernassistent: "KI Lernassistent",
      contact: "Kontakt",
      roomBooking: "Raumbuchung",
    },
    menu: {
      settings: "Einstellungen",
      curriculum: "Studienplan",
      moduleHandbook: "Modulhandbuch",
      studentId: "Studentenausweis",
      certificates: "Bescheinigungen",
      transcript: "Transkript",
      immatriculation: "Immatrikulationsbescheinigung",
      logout: "Abmelden",
      online: "Online",
      student: "Studierender",
    },
    search: {
      placeholder: "Nach allem suchen...",
      results: "Ergebnisse",
      noResults: "Nichts gefunden für",
      categories: {
        courses: "Kurse",
        documents: "Dokumente",
        faq: "FAQ",
        library: "Bibliothek",
        grades: "Noten",
        account: "Konto",
      },
      items: {
        examRegulations: "Prüfungsordnung",
        moduleHandbook: "Modulhandbuch",
        faq: "Häufig gestellte Fragen (FAQ)",
        library: "Bibliothek / Library",
        transcript: "Notenübersicht (Transcript)",
        performanceOverview: "Notenverwaltung / Leistungsübersicht",
        studentId: "Studentenausweis",
      },
    },
  },
  en: {
    programTitle: "DS WINFO Business Informatics",
    campus: "Hamburg Campus",
    nav: {
      dashboard: "Dashboard",
      courseSchedule: "Course Schedule",
      courses: "My Courses",
      recentFiles: "Recently Visited",
      tasks: "Tasks & Assignments",
      praxisReport: "Practical Report",
      infoCenter: "Info Center",
      benefits: "Student Benefits",
      socialMedia: "Social Media & Campus",
      news: "News & Updates",
      faq: "Help & FAQ",
      studyOrg: "Study Organization",
      library: "Library & Services",
      lernassistent: "AI Learning Assistant",
      contact: "Contact",
      roomBooking: "Room Booking",
    },
    menu: {
      settings: "Settings",
      curriculum: "Curriculum",
      moduleHandbook: "Module Handbook",
      studentId: "Student ID",
      certificates: "Certificates",
      transcript: "Transcript",
      immatriculation: "Enrollment Certificate",
      logout: "Logout",
      online: "Online",
      student: "Student",
    },
    search: {
      placeholder: "Search for anything...",
      results: "Results",
      noResults: "No results for",
      categories: {
        courses: "Courses",
        documents: "Documents",
        faq: "FAQ",
        library: "Library",
        grades: "Grades",
        account: "Account",
      },
      items: {
        examRegulations: "Exam Regulations",
        moduleHandbook: "Module Handbook",
        faq: "Frequently Asked Questions (FAQ)",
        library: "Library",
        transcript: "Transcript of Records",
        performanceOverview: "Performance Overview",
        studentId: "Student ID Card",
      },
    },
  },
};
