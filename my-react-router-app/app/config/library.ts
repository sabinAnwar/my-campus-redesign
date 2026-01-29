// Re-export translations from the centralized translations service
export { TRANSLATIONS } from "~/services/translations/library";

//
// Library Data (Featured/Commonly used)
//

export const DATABASES = [
  {
    "id": "statista",
    "name": "Statista",
    "url": "https://www.statista.com/",
    "icon": "BarChart3",
    "color": "iu-blue",
    "featured": true,
    "description": "Das führende Statistik-Portal für Marktdaten, Branchenberichte und digitale Trends.",
    "descriptionEn": "The leading statistics portal for market data, industry reports, and digital trends."
  },
  {
    "id": "wiso",
    "name": "WISO",
    "url": "https://www.wiso-net.de/",
    "icon": "Database",
    "color": "iu-pink",
    "featured": true,
    "description": "Die größte Datenbank für deutschsprachige Literatur in den Wirtschafts- und Sozialwissenschaften.",
    "descriptionEn": "The largest database for German-language literature in economic and social sciences."
  },
  {
    "id": "ebsco-discovery",
    "name": "EBSCO Discovery",
    "url": "https://search.ebscohost.com/login.aspx?profile=eds&authtype=sso&custid=s6068579",
    "icon": "Search",
    "color": "iu-blue",
    "featured": true,
    "description": "Durchsuche Millionen von Artikeln, E-Books und Journals über eine zentrale Suchmaske.",
    "descriptionEn": "Search millions of articles, E-books, and journals through a central search interface."
  },
  {
    "id": "springer-link",
    "name": "SpringerLink",
    "url": "https://link.springer.com/",
    "icon": "BookOpen",
    "color": "iu-green",
    "featured": true,
    "description": "Eines der weltweit führenden Online-Portale für wissenschaftliche, technische und medizinische Fachliteratur.",
    "descriptionEn": "One of the world's leading online portals for scientific, technical, and medical academic literature."
  },
  {
    "id": "linkedin-learning",
    "name": "LinkedIn Learning",
    "url": "https://www.linkedin.com/learning",
    "icon": "Play",
    "color": "iu-blue",
    "featured": true,
    "description": "Greifen Sie auf über 16.000 Expertenkurse zu, um Ihre Software-, Kreativ- und Geschäftsfähigkeiten zu entwickeln.",
    "descriptionEn": "Access over 16,000 expert-led courses to develop your software, creative, and business skills."
  },
  {
    "id": "beck-online",
    "name": "Beck-Online",
    "url": "https://beck-online.beck.de/",
    "icon": "Gavel",
    "color": "iu-orange",
    "featured": true,
    "description": "Die führende Datenbank für Rechtsinformationen mit Kommentaren, Handbüchern und Gesetzen.",
    "descriptionEn": "The leading database for legal information including commentaries, handbooks, and laws."
  }
];

export const SERVICES = [
  {
    id: "wifi",
    icon: "Wifi",
    color: "iu-blue",
    titleDe: "Bibliotheks-WLAN",
    titleEn: "Library WiFi",
    descDe: "Kostenloses WLAN auf dem gesamten Campus",
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
] as const;
