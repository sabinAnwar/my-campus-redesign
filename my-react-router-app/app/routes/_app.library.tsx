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
import {
  TRANSLATIONS,
  DATABASES,
  SERVICES,
  TUTORIALS,
} from "~/constants/library";

// Icon mapping for dynamic rendering
const ICON_MAP = {
  Database,
  BookOpen,
  FileText,
  Newspaper,
  Search,
  BookMarked,
  Users,
  Printer,
  Wifi,
  Laptop,
};

export const loader = async () => null;

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
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <Library size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.heroKicker}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <div className="mb-12">
        <form onSubmit={handleSearch} className="relative group max-w-3xl">
          {/* Glow effect on focus */}

          
          <div className="relative flex items-center bg-card/80 backdrop-blur-xl rounded-[1.5rem] border border-border shadow-lg overflow-hidden">
            <Search className="absolute left-6 h-6 w-6 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-16 pr-44 py-6 text-foreground bg-transparent placeholder-muted-foreground border-0 focus:ring-0 text-lg font-bold"
            />
            <button
              type="submit"
              className="absolute right-3 px-8 py-4 bg-iu-blue hover:bg-iu-blue/90 text-white font-black rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 uppercase tracking-widest text-sm"
            >
              <Search className="h-5 w-5" />
              <span className="hidden sm:inline">
                {language === "de" ? "Suchen" : "Search"}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-6 ml-2">
            {["EBSCO", "Springer", "JSTOR", "E-Books"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="px-4 py-1.5 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:border-iu-blue/50 transition-all uppercase tracking-wider"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>
      </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: Database,
              label: t.databases,
              color: "iu-blue",
              count: DATABASES.length,
            },
            {
              icon: BookOpen,
              label: t.ebooks,
              color: "iu-green",
              count: "50k+",
            },
            {
              icon: Newspaper,
              label: t.journals,
              color: "iu-purple",
              count: "10k+",
            },
            {
              icon: Play,
              label: t.tutorials,
              color: "iu-orange",
              count: TUTORIALS.length,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border p-8 shadow-2xl hover:shadow-iu-blue/10 transition-all cursor-pointer hover:-translate-y-2"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-${item.color}/10 group-hover:scale-110 transition-transform duration-500`}
              >
                <item.icon className={`h-8 w-8 text-${item.color}`} />
              </div>
              <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">
                {item.label}
              </h3>
              <p className="text-sm text-muted-foreground font-bold">
                {item.count} {language === "de" ? "verfügbar" : "available"}
              </p>
              <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/30 group-hover:text-iu-blue group-hover:translate-x-2 transition-all duration-500" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Popular Databases */}
            <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-iu-blue/10 rounded-2xl">
                    <Database className="h-8 w-8 text-iu-blue" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                      {t.popularDatabases}
                    </h2>
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">
                      {language === "de"
                        ? "Deine wichtigsten Recherche-Tools"
                        : "Your essential research tools"}
                    </p>
                  </div>
                </div>
                <button className="px-6 py-2 bg-iu-blue/10 text-iu-blue font-black rounded-full hover:bg-iu-blue hover:text-white transition-all text-sm uppercase tracking-widest flex items-center gap-2">
                  {t.viewAll} <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {DATABASES.filter((db) => db.featured).map((db) => (
                  <a
                    key={db.id}
                    href={db.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-5 p-6 rounded-3xl border border-border/50 hover:border-iu-blue/50 hover:bg-iu-blue/5 transition-all duration-300"
                  >
                    <div
                      className={`p-4 rounded-2xl bg-iu-blue/10 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <db.icon className={`h-6 w-6 text-iu-blue`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-black text-foreground group-hover:text-iu-blue transition-colors">
                          {db.name}
                        </h3>
                        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                      </div>
                      <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                        {language === "de" ? db.description : db.descriptionEn}
                      </p>
                    </div>
                  </a>
                ))}
              </div>

              {/* More databases */}
              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="flex flex-wrap gap-3">
                  {DATABASES.filter((db) => !db.featured).map((db) => (
                    <a
                      key={db.id}
                      href={db.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black bg-muted/50 text-muted-foreground hover:bg-iu-blue/10 hover:text-iu-blue transition-all hover:scale-105 uppercase tracking-widest"
                    >
                      {db.name}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Grid */}
            <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-iu-purple/10 rounded-2xl">
                  <Users className="h-8 w-8 text-iu-purple" />
                </div>
                <h2 className="text-3xl font-black text-foreground tracking-tight">
                  {t.services}
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {SERVICES.map((service) => (
                  <div
                    key={service.id}
                    className="group p-6 rounded-3xl border border-border/50 hover:border-iu-blue/50 hover:bg-iu-blue/5 transition-all duration-300 cursor-pointer"
                  >
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 bg-${service.color}/10 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <service.icon
                        className={`h-7 w-7 text-${service.color}`}
                      />
                    </div>
                    <h3 className="font-black text-foreground text-base mb-2 group-hover:text-iu-blue transition-colors">
                      {language === "de" ? service.titleDe : service.titleEn}
                    </h3>
                    <p className="text-xs text-muted-foreground font-bold leading-relaxed">
                      {language === "de" ? service.descDe : service.descEn}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutorials Section */}
            <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-iu-orange/10 rounded-2xl">
                    <Lightbulb className="h-8 w-8 text-iu-orange" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-foreground tracking-tight">
                      {t.helpGuides}
                    </h2>
                    <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">
                      {language === "de"
                        ? "Lerne, unsere Ressourcen optimal zu nutzen"
                        : "Learn to make the most of our resources"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {TUTORIALS.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="group flex items-center gap-6 p-6 rounded-3xl border border-border/50 hover:border-iu-blue/50 hover:bg-iu-blue/5 transition-all duration-300 cursor-pointer"
                  >
                    <div
                      className={`p-4 rounded-2xl ${tutorial.type === "video" ? "bg-iu-red/10" : "bg-iu-blue/10"} group-hover:scale-110 transition-transform duration-500`}
                    >
                      {tutorial.type === "video" ? (
                        <Play className="h-6 w-6 text-iu-red" />
                      ) : (
                        <FileQuestion className="h-6 w-6 text-iu-blue" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-foreground group-hover:text-iu-blue transition-colors">
                        {language === "de"
                          ? tutorial.titleDe
                          : tutorial.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">
                        {tutorial.type === "video" ? "Video" : "Guide"} ·{" "}
                        {tutorial.duration}
                      </p>
                    </div>
                    <ChevronRight className="h-6 w-6 text-muted-foreground/30 group-hover:text-iu-blue group-hover:translate-x-2 transition-all duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Opening Hours */}
            <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-iu-blue/10">
                  <Clock className="h-6 w-6 text-iu-blue" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">
                  {t.openingHours}
                </h3>
              </div>

              <div className="space-y-4">
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
                    className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                  >
                    <span className="text-sm text-muted-foreground font-black uppercase tracking-widest">
                      {item.day}
                    </span>
                    <span
                      className={`text-sm font-black ${item.hours === t.closed ? "text-iu-red" : "text-foreground"}`}
                    >
                      {item.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-iu-green/10">
                  <HelpCircle className="h-6 w-6 text-iu-green" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">
                  {t.askLibrarian}
                </h3>
              </div>

              <div className="space-y-4">
                <a
                  href="mailto:bibliothek@iu.org"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-iu-blue/10 transition-all duration-300"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <Mail className="h-5 w-5 text-iu-blue" />
                  </div>
                  <span className="text-sm text-foreground font-black tracking-tight">
                    bibliothek@iu.org
                  </span>
                </a>
                <a
                  href="tel:+4930123456789"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-muted/50 hover:bg-iu-blue/10 transition-all duration-300"
                >
                  <div className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <Phone className="h-5 w-5 text-iu-blue" />
                  </div>
                  <span className="text-sm text-foreground font-black tracking-tight">
                    +49 30 123 456 789
                  </span>
                </a>
              </div>

              <div className="mt-8 pt-6 border-t border-border/50">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-black text-iu-blue hover:text-iu-blue/80 transition-colors uppercase tracking-widest"
                >
                  {language === "de"
                    ? "Alle Kontaktmöglichkeiten"
                    : "All contact options"}{" "}
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Location */}
            <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-iu-blue/10">
                  <MapPin className="h-6 w-6 text-iu-blue" />
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tight">
                  {t.location}
                </h3>
              </div>

              <div className="rounded-3xl overflow-hidden bg-muted/50 h-40 mb-6 flex items-center justify-center border border-border/50 relative group">
                <div className="absolute inset-0 bg-iu-blue/5 group-hover:bg-iu-blue/10 transition-colors" />
                <Globe className="h-12 w-12 text-iu-blue/40 group-hover:scale-110 transition-transform duration-700" />
              </div>

              <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                <span className="text-foreground font-black block mb-1">
                  IU Campus Bibliothek
                </span>
                Juri-Gagarin-Ring 152
                <br />
                99084 Erfurt
              </p>
            </div>

            {/* My Library */}
            <div className="bg-gradient-to-br from-iu-blue to-iu-purple rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Bookmark className="h-32 w-32" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                    <Bookmark className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">
                    {t.myLibrary}
                  </h3>
                </div>

                <div className="space-y-4">
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-black uppercase tracking-widest text-xs group/btn">
                    <span>{t.savedItems}</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full group-hover/btn:bg-white group-hover/btn:text-iu-blue transition-colors">
                      12
                    </span>
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-black uppercase tracking-widest text-xs group/btn">
                    <span>{t.loanHistory}</span>
                    <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/10 hover:bg-white/20 transition-all font-black uppercase tracking-widest text-xs group/btn">
                    <span>{t.reservations}</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full group-hover/btn:bg-white group-hover/btn:text-iu-blue transition-colors">
                      2
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
