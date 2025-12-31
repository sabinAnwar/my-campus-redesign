import { Laptop, BarChart3, GraduationCap } from "lucide-react";
import type { BenefitTool as Tool } from "~/types/benefits";

export const TRANSLATIONS = {
  de: {
    backToDashboard: "Zurück zum Dashboard",
    exclusiveFor: "Exklusiv für IU Studierende",
    title: "Student Benefits Hub",
    subtitle: (n: number) => `Zugriff auf ${n}+ Premium-Tools und Services.`,
    featuredTools: "Featured Tools",
    searchPlaceholder: "Tools durchsuchen...",
    allCategories: "Alle Kategorien",
    tools: "Tools",
    open: "Öffnen",
    support: "Support",
    alternative: "Alternative",
    regularlyUpdated: "Regelmäßig aktualisiert",
    lastUpdated: "Zuletzt aktualisiert:",
    categories: {
      productivity: "Produktivität & Software",
      research: "Forschung & Datenbanken",
      learning: "Lernen & Upskilling",
    },
    toolDescriptions: {
      office365: "Word, Excel, PowerPoint, Teams – gratis mit IU-Mail.",
      azure: "Cloud-Services testen ohne Kreditkarte.",
      matlab: "Campuslizenz für MATLAB & Simulink.",
      linkedin: "Kurse via IU SSO freischalten.",
      statista: "Zugriff über LIS/OpenAthens.",
      knovel: "Video-Anleitungen für Knovel.",
      beck: "Kurzvideo zur Rechtsdatenbank.",
      nautos: "Normendatenbank – häufige Fragen.",
      research: "Unipark, WISO, IEEE, Knovel, Elicit.",
      google: "Kostenlose Digital- und KI-Trainings.",
      udemy: "Rabattierte Kurse für Tech & Business.",
      bootcamp: "Programmieren lernen für IU-Studierende.",
      learnApp: "Skripte, Videos, Tests & Karteikarten.",
      speexx: "DE/EN/FR/IT/ES – sofort starten, keine ECTS.",
    },
  },
  en: {
    backToDashboard: "Back to Dashboard",
    exclusiveFor: "Exclusive for IU Students",
    title: "Student Benefits Hub",
    subtitle: (n: number) => `Access to ${n}+ premium tools and services.`,
    featuredTools: "Featured Tools",
    searchPlaceholder: "Search tools...",
    allCategories: "All Categories",
    tools: "Tools",
    open: "Open",
    support: "Support",
    alternative: "Alternative",
    regularlyUpdated: "Regularly Updated",
    lastUpdated: "Last updated:",
    categories: {
      productivity: "Productivity & Software",
      research: "Research & Databases",
      learning: "Learning & Upskilling",
    },
    toolDescriptions: {
      office365: "Word, Excel, PowerPoint, Teams – free with IU email.",
      azure: "Test cloud services without a credit card.",
      matlab: "Campus license for MATLAB & Simulink.",
      linkedin: "Unlock courses via IU SSO.",
      statista: "Access via LIS/OpenAthens.",
      knovel: "Video tutorials for Knovel.",
      beck: "Short video about the legal database.",
      nautos: "Standards database – FAQs.",
      research: "Unipark, WISO, IEEE, Knovel, Elicit.",
      google: "Free digital and AI training.",
      udemy: "Discounted courses for Tech & Business.",
      bootcamp: "Learn programming for IU students.",
      learnApp: "Scripts, videos, tests & flashcards.",
      speexx: "DE/EN/FR/IT/ES – start immediately, no ECTS.",
    },
  },
};

export const getToolCategories = (
  t: typeof TRANSLATIONS.de
): {
  title: string;
  icon: any;
  color: string;
  gradient: string;
  tools: Tool[];
}[] => [
  {
    title: t.categories.productivity,
    icon: Laptop,
    color: "blue",
    gradient: "from-iu-blue to-iu-purple",
    tools: [
      {
        name: "Microsoft Office 365",
        description: t.toolDescriptions.office365,
        url: "https://www.office.com/",
        support: "https://support.microsoft.com/de-DE",
        logo: { text: "O365", bg: "bg-iu-blue" },
        featured: true,
      },
      {
        name: "Azure for Students (100€)",
        description: t.toolDescriptions.azure,
        url: "https://azure.microsoft.com/de-de/free/students/",
        logo: { text: "AZ", bg: "bg-iu-purple" },
      },
      {
        name: "MathWorks MATLAB",
        description: t.toolDescriptions.matlab,
        url: "https://de.mathworks.com/academia/tah-portal/iubh-internationale-hochschule-31521908.html",
        logo: { text: "ML", bg: "bg-iu-orange" },
      },
      {
        name: "LinkedIn Learning",
        description: t.toolDescriptions.linkedin,
        url: "https://auth.iu.org/samlp/mLktF8EpyrPwZPqPsr8oJAuvxmYfj1LB",
        logo: { text: "Li", bg: "bg-iu-blue" },
        featured: true,
      },
    ],
  },
  {
    title: t.categories.research,
    icon: BarChart3,
    color: "emerald",
    gradient: "from-iu-green to-iu-blue",
    tools: [
      {
        name: "Statista Premium",
        description: t.toolDescriptions.statista,
        url: "https://connect.openathens.net/statista.com/6ca2c067-1dee-4791-b1700d4d57d005ba/auth/rcv/saml2/post",
        logo: { text: "S", bg: "bg-iu-green" },
        featured: true,
      },
      {
        name: "Knovel Tutorials",
        description: t.toolDescriptions.knovel,
        url: "https://www.elsevier.support/knovel/answer/where-can-i-find-video-tutorials-for-knovel",
        logo: { text: "K", bg: "bg-iu-blue" },
      },
      {
        name: "Beck-Online Intro",
        description: t.toolDescriptions.beck,
        url: "https://www.youtube.com/watch?v=zP-uzpxHSjw",
        logo: { text: "B", bg: "bg-iu-orange" },
      },
      {
        name: "Nautos FAQ",
        description: t.toolDescriptions.nautos,
        url: "https://nautos-de.eu1.proxy.openathens.net/2RO/faq#persoenliche_einstellung",
        logo: { text: "N", bg: "bg-slate-600" },
      },
      {
        name: "Research Tutorials",
        description: t.toolDescriptions.research,
        url: "https://www.youtube.com/watch?v=oShRg-BPA-0&list=PLCWHRfa4mbG1Nsqd4D7iT-HVP28EGVq_5",
        logo: { text: "RT", bg: "bg-iu-purple" },
      },
    ],
  },
  {
    title: t.categories.learning,
    icon: GraduationCap,
    color: "violet",
    gradient: "from-iu-purple to-iu-pink",
    tools: [
      {
        name: "Google Zukunftswerkstatt",
        description: t.toolDescriptions.google,
        url: "https://grow.google/intl/de/",
        logo: { text: "G", bg: "bg-iu-green" },
      },
      {
        name: "Udemy Deals",
        description: t.toolDescriptions.udemy,
        url: "https://www.udemy.com/",
        logo: { text: "U", bg: "bg-iu-pink" },
      },
      {
        name: "IU Bootcamp",
        description: t.toolDescriptions.bootcamp,
        url: "https://mycampus-classic.iu.org/course/view.php?id=4510",
        alt: "https://programmieren-starten.de/",
        logo: { text: "BC", bg: "bg-iu-blue" },
        featured: true,
      },
      {
        name: "IU Learn App",
        description: t.toolDescriptions.learnApp,
        url: "#",
        logo: { text: "Learn", bg: "bg-iu-blue" },
      },
      {
        name: "Speexx Sprachkurse",
        description: t.toolDescriptions.speexx,
        url: "https://portal.speexx.com/",
        logo: { text: "SPX", bg: "bg-iu-red" },
      },
    ],
  },
];

export const categoryBadge: any = {
  blue: "bg-iu-blue/10 text-iu-blue border-iu-blue/20",
  emerald: "bg-iu-green/10 text-iu-green border-iu-green/20",
  violet: "bg-iu-purple/10 text-iu-purple border-iu-purple/20",
  amber: "bg-iu-orange/10 text-iu-orange border-iu-orange/20",
  lime: "bg-iu-green/10 text-iu-green border-iu-green/20",
};
