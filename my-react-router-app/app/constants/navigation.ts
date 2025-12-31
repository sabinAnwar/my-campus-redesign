import {
  Home,
  CalendarDays,
  BookOpen,
  FileSearch,
  CheckSquare,
  FolderOpen,
  Info,
  Gift,
  Instagram,
  Newspaper,
  HelpCircle,
  BookOpenCheck,
  Library,
  Brain,
  User as UserIcon,
} from "lucide-react";
import type { NavKey } from "~/types/navigation";

export const BASE_NAV_ITEMS: Array<{
  key: NavKey;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { to: "/dashboard", key: "dashboard", icon: Home },
  { to: "/courses/schedule", key: "courseSchedule", icon: CalendarDays },
  { to: "/courses", key: "courses", icon: BookOpen },
  { to: "/files/recent", key: "recentFiles", icon: FileSearch },
  { to: "/tasks", key: "tasks", icon: CheckSquare },
  { to: "/praxisbericht2", key: "praxisReport", icon: FolderOpen },
  { to: "/info-center", key: "infoCenter", icon: Info },
  { to: "/benefits", key: "benefits", icon: Gift },
  { to: "/social-media", key: "socialMedia", icon: Instagram },
  { to: "/news", key: "news", icon: Newspaper },
  { to: "/faq", key: "faq", icon: HelpCircle },
  { to: "/study-organization", key: "studyOrg", icon: BookOpenCheck },
  { to: "/library", key: "library", icon: Library },
  { to: "/lernassistent", key: "lernassistent", icon: Brain },
  { to: "/contact", key: "contact", icon: UserIcon },
];

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
      },
    },
  },
};
