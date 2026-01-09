import type { LucideIcon } from "lucide-react";
import { FileText, Award, BookOpen, Calendar } from "lucide-react";

//
// TYPES
//

export interface NavigationCard {
  to: string;
  titleKey: "applicationManagement" | "gradeManagement" | "specializationSelection" | "examRegistration";
  descKey: "applicationManagementDesc" | "gradeManagementDesc" | "specializationSelectionDesc" | "examRegistrationDesc";
  icon: LucideIcon;
  gradient: string;
  iconBg: string;
  iconColor: string;
  hoverBorder: string;
  glow: string;
}

export interface QuickLink {
  titleKey: string;
  descKey: string;
  linkKey: string;
  to: string;
  color: string;
}

//
// NAVIGATION CARDS CONFIG
//

export const NAVIGATION_CARDS: NavigationCard[] = [
  {
    to: "/antragsverwaltung",
    titleKey: "applicationManagement",
    descKey: "applicationManagementDesc",
    icon: FileText,
    gradient: "from-iu-blue/40 to-teal-500/40",
    iconBg: "bg-iu-blue/20 dark:bg-iu-blue",
    iconColor: "text-iu-blue dark:text-white",
    hoverBorder: "hover:border-iu-blue/60",
    glow: "group-hover:bg-iu-blue/15",
  },
  {
    to: "/notenverwaltung",
    titleKey: "gradeManagement",
    descKey: "gradeManagementDesc",
    icon: Award,
    gradient: "from-blue-600/40 to-indigo-600/40",
    iconBg: "bg-blue-600/20 dark:bg-blue-600",
    iconColor: "text-blue-600 dark:text-white",
    hoverBorder: "hover:border-blue-600/60",
    glow: "group-hover:bg-blue-600/15",
  },
  {
    to: "/vertiefungswahl",
    titleKey: "specializationSelection",
    descKey: "specializationSelectionDesc",
    icon: BookOpen,
    gradient: "from-violet-600/40 to-purple-600/40",
    iconBg: "bg-violet-600/20 dark:bg-violet-600",
    iconColor: "text-violet-600 dark:text-white",
    hoverBorder: "hover:border-violet-600/60",
    glow: "group-hover:bg-violet-600/15",
  },
  {
    to: "/klausuranmeldung",
    titleKey: "examRegistration",
    descKey: "examRegistrationDesc",
    icon: Calendar,
    gradient: "from-amber-600/40 to-orange-600/40",
    iconBg: "bg-amber-600/20 dark:bg-amber-600",
    iconColor: "text-amber-600 dark:text-white",
    hoverBorder: "hover:border-amber-600/60",
    glow: "group-hover:bg-amber-600/15",
  },
];

//
// QUICK LINKS CONFIG
//

export const QUICK_LINKS: QuickLink[] = [
  {
    titleKey: "helpSupport",
    descKey: "helpSupportDesc",
    linkKey: "toSupport",
    to: "/contact",
    color: "text-iu-blue dark:text-iu-blue-light",
  },
  {
    titleKey: "deadlines",
    descKey: "deadlinesDesc",
    linkKey: "openCalendar",
    to: "/courses/schedule",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    titleKey: "documents",
    descKey: "documentsDesc",
    linkKey: "toCertificates",
    to: "/certificates/immatriculation",
    color: "text-violet-600 dark:text-violet-400",
  },
];
