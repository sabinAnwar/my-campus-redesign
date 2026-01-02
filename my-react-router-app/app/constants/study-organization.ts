import type { LucideIcon } from "lucide-react";
import { FileText, Award, BookOpen, Calendar } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// NAVIGATION CARDS CONFIG
// ============================================================================

export const NAVIGATION_CARDS: NavigationCard[] = [
  {
    to: "/antragsverwaltung",
    titleKey: "applicationManagement",
    descKey: "applicationManagementDesc",
    icon: FileText,
    gradient: "from-iu-blue/20 to-teal-500/20",
    iconBg: "bg-iu-blue/10",
    iconColor: "text-iu-blue",
    hoverBorder: "hover:border-iu-blue/50",
    glow: "group-hover:bg-iu-blue/10",
  },
  {
    to: "/notenverwaltung",
    titleKey: "gradeManagement",
    descKey: "gradeManagementDesc",
    icon: Award,
    gradient: "from-blue-500/20 to-indigo-500/20",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    hoverBorder: "hover:border-blue-500/50",
    glow: "group-hover:bg-blue-500/10",
  },
  {
    to: "/vertiefungswahl",
    titleKey: "specializationSelection",
    descKey: "specializationSelectionDesc",
    icon: BookOpen,
    gradient: "from-violet-500/20 to-purple-500/20",
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    hoverBorder: "hover:border-violet-500/50",
    glow: "group-hover:bg-violet-500/10",
  },
  {
    to: "/klausuranmeldung",
    titleKey: "examRegistration",
    descKey: "examRegistrationDesc",
    icon: Calendar,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    hoverBorder: "hover:border-amber-500/50",
    glow: "group-hover:bg-amber-500/10",
  },
];

// ============================================================================
// QUICK LINKS CONFIG
// ============================================================================

export const QUICK_LINKS: QuickLink[] = [
  {
    titleKey: "helpSupport",
    descKey: "helpSupportDesc",
    linkKey: "toSupport",
    to: "/contact",
    color: "text-iu-blue",
  },
  {
    titleKey: "deadlines",
    descKey: "deadlinesDesc",
    linkKey: "openCalendar",
    to: "/courses/schedule",
    color: "text-blue-500",
  },
  {
    titleKey: "documents",
    descKey: "documentsDesc",
    linkKey: "toCertificates",
    to: "/certificates/immatriculation",
    color: "text-violet-500",
  },
];
