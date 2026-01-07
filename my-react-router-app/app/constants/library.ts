// Re-export translations from the centralized translations service
export { TRANSLATIONS } from "~/services/translations/library";

// ============================================================================
// Library Data (Non-translatable static configuration)
// ============================================================================

export const DATABASES = [
  {
    id: "ebsco",
    name: "EBSCO Discovery",
    description: "Umfassende wissenschaftliche Datenbank",
    descriptionEn: "Comprehensive academic database",
    url: "https://search.ebscohost.com/login.aspx?profile=eds&authtype=sso&custid=s6068579&profile=eds&groupid=main",
    icon: "Database",
    color: "iu-blue",
    featured: true,
  },
  {
    id: "springer",
    name: "Springer Link",
    description: "Wissenschaftliche Bücher und Zeitschriften",
    descriptionEn: "Scientific books and journals",
    url: "https://link.springer.com/",
    icon: "BookOpen",
    color: "iu-green",
    featured: true,
  },
  {
    id: "jstor",
    name: "JSTOR",
    description: "Digitale Bibliothek für akademische Zeitschriften",
    descriptionEn: "Digital library for academic journals",
    url: "https://www.jstor.org/",
    icon: "FileText",
    color: "iu-purple",
    featured: true,
  },
  {
    id: "statista",
    name: "Statista",
    description: "Statistiken und Marktdaten",
    descriptionEn: "Statistics and market data",
    url: "https://www.statista.com/",
    icon: "Database",
    color: "iu-orange",
    featured: false,
  },
  {
    id: "wiso",
    name: "WISO",
    description: "Wirtschafts- und Sozialwissenschaften",
    descriptionEn: "Business and social sciences",
    url: "https://www.wiso-net.de/",
    icon: "Newspaper",
    color: "iu-pink",
    featured: false,
  },
  {
    id: "scopus",
    name: "Scopus",
    description: "Abstracts und Zitationsdatenbank",
    descriptionEn: "Abstracts and citation database",
    url: "https://www.scopus.com/",
    icon: "Search",
    color: "iu-blue",
    featured: false,
  },
];

export const SERVICES = [
  {
    id: "research",
    icon: "Search",
    color: "iu-blue",
    titleDe: "Recherchehilfe",
    titleEn: "Research Help",
    descDe: "Unterstützung bei der Literaturrecherche",
    descEn: "Support for literature research",
  },
  {
    id: "borrowing",
    icon: "BookMarked",
    color: "iu-green",
    titleDe: "Ausleihe",
    titleEn: "Borrowing",
    descDe: "Bücher und Medien ausleihen",
    descEn: "Borrow books and media",
  },
  {
    id: "workspaces",
    icon: "Users",
    color: "iu-purple",
    titleDe: "Arbeitsplätze",
    titleEn: "Workspaces",
    descDe: "Einzel- und Gruppenarbeitsplätze",
    descEn: "Individual and group workspaces",
  },
  {
    id: "printing",
    icon: "Printer",
    color: "iu-orange",
    titleDe: "Drucken & Scannen",
    titleEn: "Printing & Scanning",
    descDe: "Druck- und Scan-Services",
    descEn: "Print and scan services",
  },
  {
    id: "wifi",
    icon: "Wifi",
    color: "iu-blue",
    titleDe: "WLAN",
    titleEn: "WiFi",
    descDe: "Kostenloses WLAN auf dem Campus",
    descEn: "Free WiFi on campus",
  },
  {
    id: "laptop",
    icon: "Laptop",
    color: "iu-pink",
    titleDe: "Laptop-Ausleihe",
    titleEn: "Laptop Loan",
    descDe: "Laptops für die Arbeit vor Ort",
    descEn: "Laptops for on-site work",
  },
];

export const TUTORIALS = [
  {
    id: "literature-search",
    titleDe: "Literaturrecherche Grundlagen",
    titleEn: "Literature Search Basics",
    duration: "15 min",
    type: "video",
  },
  {
    id: "citation",
    titleDe: "Richtig Zitieren",
    titleEn: "Proper Citation",
    duration: "20 min",
    type: "video",
  },
  {
    id: "database-intro",
    titleDe: "Datenbanken nutzen",
    titleEn: "Using Databases",
    duration: "10 min",
    type: "guide",
  },
  {
    id: "ebook-access",
    titleDe: "E-Books herunterladen",
    titleEn: "Downloading E-Books",
    duration: "5 min",
    type: "guide",
  },
] as const;
