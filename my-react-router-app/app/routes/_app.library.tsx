import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Library,
  BookOpen,
  Search,
  ExternalLink,
  Download,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  BookMarked,
  FileText,
  Database,
  Newspaper,
  GraduationCap,
  Lightbulb,
  Users,
  HelpCircle,
  ChevronRight,
  Star,
  Bookmark,
  Play,
  FileQuestion,
  Wifi,
  Laptop,
  Printer,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

export const loader = async () => null;

const TRANSLATIONS = {
  de: {
    heroKicker: "Bibliothek & Informationsdienste",
    heroTitle: "Deine Wissensquelle",
    heroSubtitle: "Zugang zu Millionen von Büchern, Zeitschriften und Datenbanken für dein Studium",
    searchPlaceholder: "Nach Büchern, Artikeln oder Ressourcen suchen...",
    quickAccess: "Schnellzugriff",
    databases: "Datenbanken",
    ebooks: "E-Books",
    journals: "Zeitschriften",
    tutorials: "Tutorials",
    services: "Unsere Services",
    openingHours: "Öffnungszeiten",
    contact: "Kontakt",
    location: "Standort",
    onlineResources: "Online-Ressourcen",
    researchHelp: "Recherchehilfe",
    borrowing: "Ausleihe & Rückgabe",
    workspaces: "Arbeitsplätze",
    printing: "Drucken & Scannen",
    wifi: "WLAN Zugang",
    laptopLoan: "Laptop-Ausleihe",
    studyRooms: "Lernräume",
    popularDatabases: "Beliebte Datenbanken",
    featuredResources: "Empfohlene Ressourcen",
    helpGuides: "Hilfe & Anleitungen",
    askLibrarian: "Frag einen Bibliothekar",
    monday: "Montag",
    tuesday: "Dienstag",
    wednesday: "Mittwoch",
    thursday: "Donnerstag",
    friday: "Freitag",
    saturday: "Samstag",
    sunday: "Sonntag",
    closed: "Geschlossen",
    accessNow: "Jetzt zugreifen",
    learnMore: "Mehr erfahren",
    viewAll: "Alle anzeigen",
    newResources: "Neue Ressourcen",
    myLibrary: "Meine Bibliothek",
    savedItems: "Gespeicherte Artikel",
    loanHistory: "Ausleihhistorie",
    reservations: "Reservierungen",
  },
  en: {
    heroKicker: "Library & Information Services",
    heroTitle: "Your Knowledge Source",
    heroSubtitle: "Access millions of books, journals and databases for your studies",
    searchPlaceholder: "Search for books, articles or resources...",
    quickAccess: "Quick Access",
    databases: "Databases",
    ebooks: "E-Books",
    journals: "Journals",
    tutorials: "Tutorials",
    services: "Our Services",
    openingHours: "Opening Hours",
    contact: "Contact",
    location: "Location",
    onlineResources: "Online Resources",
    researchHelp: "Research Help",
    borrowing: "Borrowing & Returns",
    workspaces: "Workspaces",
    printing: "Printing & Scanning",
    wifi: "WiFi Access",
    laptopLoan: "Laptop Loan",
    studyRooms: "Study Rooms",
    popularDatabases: "Popular Databases",
    featuredResources: "Featured Resources",
    helpGuides: "Help & Guides",
    askLibrarian: "Ask a Librarian",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    closed: "Closed",
    accessNow: "Access Now",
    learnMore: "Learn More",
    viewAll: "View All",
    newResources: "New Resources",
    myLibrary: "My Library",
    savedItems: "Saved Items",
    loanHistory: "Loan History",
    reservations: "Reservations",
  },
};

// Database resources
const DATABASES = [
  {
    id: "ebsco",
    name: "EBSCO Discovery",
    description: "Umfassende wissenschaftliche Datenbank",
    descriptionEn: "Comprehensive academic database",
    url: "https://search.ebscohost.com/login.aspx?profile=eds&authtype=sso&custid=s6068579&profile=eds&groupid=main",
    icon: Database,
    color: "blue",
    featured: true,
  },
  {
    id: "springer",
    name: "Springer Link",
    description: "Wissenschaftliche Bücher und Zeitschriften",
    descriptionEn: "Scientific books and journals",
    url: "https://link.springer.com/",
    icon: BookOpen,
    color: "emerald",
    featured: true,
  },
  {
    id: "jstor",
    name: "JSTOR",
    description: "Digitale Bibliothek für akademische Zeitschriften",
    descriptionEn: "Digital library for academic journals",
    url: "https://www.jstor.org/",
    icon: FileText,
    color: "purple",
    featured: true,
  },
  {
    id: "statista",
    name: "Statista",
    description: "Statistiken und Marktdaten",
    descriptionEn: "Statistics and market data",
    url: "https://www.statista.com/",
    icon: Database,
    color: "orange",
    featured: false,
  },
  {
    id: "wiso",
    name: "WISO",
    description: "Wirtschafts- und Sozialwissenschaften",
    descriptionEn: "Business and social sciences",
    url: "https://www.wiso-net.de/",
    icon: Newspaper,
    color: "rose",
    featured: false,
  },
  {
    id: "scopus",
    name: "Scopus",
    description: "Abstracts und Zitationsdatenbank",
    descriptionEn: "Abstracts and citation database",
    url: "https://www.scopus.com/",
    icon: Search,
    color: "cyan",
    featured: false,
  },
];

// Services
const SERVICES = [
  {
    id: "research",
    icon: Search,
    color: "blue",
    titleDe: "Recherchehilfe",
    titleEn: "Research Help",
    descDe: "Unterstützung bei der Literaturrecherche",
    descEn: "Support for literature research",
  },
  {
    id: "borrowing",
    icon: BookMarked,
    color: "emerald",
    titleDe: "Ausleihe",
    titleEn: "Borrowing",
    descDe: "Bücher und Medien ausleihen",
    descEn: "Borrow books and media",
  },
  {
    id: "workspaces",
    icon: Users,
    color: "purple",
    titleDe: "Arbeitsplätze",
    titleEn: "Workspaces",
    descDe: "Einzel- und Gruppenarbeitsplätze",
    descEn: "Individual and group workspaces",
  },
  {
    id: "printing",
    icon: Printer,
    color: "orange",
    titleDe: "Drucken & Scannen",
    titleEn: "Printing & Scanning",
    descDe: "Druck- und Scan-Services",
    descEn: "Print and scan services",
  },
  {
    id: "wifi",
    icon: Wifi,
    color: "cyan",
    titleDe: "WLAN",
    titleEn: "WiFi",
    descDe: "Kostenloses WLAN auf dem Campus",
    descEn: "Free WiFi on campus",
  },
  {
    id: "laptop",
    icon: Laptop,
    color: "rose",
    titleDe: "Laptop-Ausleihe",
    titleEn: "Laptop Loan",
    descDe: "Laptops für die Arbeit vor Ort",
    descEn: "Laptops for on-site work",
  },
];

// Tutorials and guides
const TUTORIALS = [
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
];

export default function LibraryPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to EBSCO search with query
      window.open(
        `https://search.ebscohost.com/login.aspx?direct=true&scope=site&type=0&site=eds-live&lang=de&authtype=sso&custid=s6068579&groupid=main&bquery=${encodeURIComponent(searchQuery)}`,
        "_blank"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section - Premium Design */}
        <div className="relative overflow-hidden rounded-3xl mb-8">
          {/* Background with multiple layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.3)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.2)_0%,_transparent_50%)]" />
          
          {/* Animated floating shapes */}
          <div className="absolute top-10 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-pink-400/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl" />
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          
          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            {/* Top badge */}
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                <Library className="h-7 w-7 text-white" />
              </div>
              <div className="px-4 py-1.5 bg-white/15 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-white/90 text-sm font-bold uppercase tracking-widest">
                  {t.heroKicker}
                </span>
              </div>
            </div>
            
            {/* Main heading with gradient text effect */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 drop-shadow-lg">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 leading-relaxed">
              {t.heroSubtitle}
            </p>

            {/* Premium Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl">
              <div className="relative group">
                {/* Glow effect on focus */}
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
                
                <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
                  <Search className="absolute left-5 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-14 pr-36 py-5 text-slate-900 dark:text-white bg-transparent placeholder-slate-400 dark:placeholder-slate-500 border-0 focus:ring-0 text-base"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden sm:inline">{language === "de" ? "Suchen" : "Search"}</span>
                  </button>
                </div>
              </div>
              
              {/* Quick search tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["EBSCO", "Springer", "JSTOR", "E-Books"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(tag)}
                    className="px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Database, label: t.databases, color: "blue", count: DATABASES.length },
            { icon: BookOpen, label: t.ebooks, color: "emerald", count: "50k+" },
            { icon: Newspaper, label: t.journals, color: "purple", count: "10k+" },
            { icon: Play, label: t.tutorials, color: "orange", count: TUTORIALS.length },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 bg-${item.color}-100 dark:bg-${item.color}-900/30`}>
                <item.icon className={`h-6 w-6 text-${item.color}-600 dark:text-${item.color}-400`} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-1">{item.label}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.count} {language === "de" ? "verfügbar" : "available"}</p>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Popular Databases */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.popularDatabases}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{language === "de" ? "Deine wichtigsten Recherche-Tools" : "Your essential research tools"}</p>
                </div>
                <button className="text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                  {t.viewAll} <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DATABASES.filter(db => db.featured).map((db) => (
                  <a
                    key={db.id}
                    href={db.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all"
                  >
                    <div className={`p-3 rounded-lg bg-${db.color}-100 dark:bg-${db.color}-900/30 group-hover:scale-110 transition-transform`}>
                      <db.icon className={`h-5 w-5 text-${db.color}-600 dark:text-${db.color}-400`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">{db.name}</h3>
                        <ExternalLink className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {language === "de" ? db.description : db.descriptionEn}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* More databases */}
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {DATABASES.filter(db => !db.featured).map((db) => (
                    <a
                      key={db.id}
                      href={db.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                    >
                      {db.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{t.services}</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {SERVICES.map((service) => (
                  <div
                    key={service.id}
                    className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/10 dark:hover:to-purple-900/10 transition-all cursor-pointer"
                  >
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3 bg-${service.color}-100 dark:bg-${service.color}-900/30 group-hover:scale-110 transition-transform`}>
                      <service.icon className={`h-5 w-5 text-${service.color}-600 dark:text-${service.color}-400`} />
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                      {language === "de" ? service.titleDe : service.titleEn}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {language === "de" ? service.descDe : service.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutorials Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t.helpGuides}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{language === "de" ? "Lerne, unsere Ressourcen optimal zu nutzen" : "Learn to make the most of our resources"}</p>
                </div>
              </div>

              <div className="space-y-3">
                {TUTORIALS.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="group flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50 dark:hover:bg-violet-900/10 transition-all cursor-pointer"
                  >
                    <div className={`p-3 rounded-lg ${tutorial.type === "video" ? "bg-rose-100 dark:bg-rose-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}>
                      {tutorial.type === "video" ? (
                        <Play className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                      ) : (
                        <FileQuestion className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {language === "de" ? tutorial.titleDe : tutorial.titleEn}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {tutorial.type === "video" ? "Video" : "Guide"} · {tutorial.duration}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-violet-500 transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Opening Hours */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <Clock className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{t.openingHours}</h3>
              </div>

              <div className="space-y-2">
                {[
                  { day: t.monday, hours: "08:00 - 22:00" },
                  { day: t.tuesday, hours: "08:00 - 22:00" },
                  { day: t.wednesday, hours: "08:00 - 22:00" },
                  { day: t.thursday, hours: "08:00 - 22:00" },
                  { day: t.friday, hours: "08:00 - 20:00" },
                  { day: t.saturday, hours: "10:00 - 18:00" },
                  { day: t.sunday, hours: t.closed },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                  >
                    <span className="text-sm text-slate-600 dark:text-slate-400">{item.day}</span>
                    <span className={`text-sm font-medium ${item.hours === t.closed ? "text-rose-500" : "text-slate-900 dark:text-white"}`}>
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <HelpCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{t.askLibrarian}</h3>
              </div>

              <div className="space-y-3">
                <a
                  href="mailto:bibliothek@iu.org"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                >
                  <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">bibliothek@iu.org</span>
                </a>
                <a
                  href="tel:+4930123456789"
                  className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors"
                >
                  <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">+49 30 123 456 789</span>
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:underline"
                >
                  {language === "de" ? "Alle Kontaktmöglichkeiten" : "All contact options"} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">{t.location}</h3>
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 h-32 mb-3 flex items-center justify-center">
                <Globe className="h-8 w-8 text-slate-400" />
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400">
                IU Campus Bibliothek<br />
                Juri-Gagarin-Ring 152<br />
                99084 Erfurt
              </p>
            </div>

            {/* My Library */}
            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <Bookmark className="h-6 w-6" />
                <h3 className="font-bold">{t.myLibrary}</h3>
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="text-sm">{t.savedItems}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">12</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="text-sm">{t.loanHistory}</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <span className="text-sm">{t.reservations}</span>
                  <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">2</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
