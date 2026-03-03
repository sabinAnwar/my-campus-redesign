import React, { useMemo, useState } from "react";
import { Database, ExternalLink, Search, ChevronLeft, X } from "lucide-react";
import { Link } from "react-router";
import { useLanguage } from "~/store/LanguageContext";
import { ALL_DATABASES } from "~/data/libraryPortals";
import { DynamicIcon } from "~/components/ui/DynamicIcon";
import { TRANSLATIONS } from "~/config/library";

export default function LibraryDatabasesPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDatabases = useMemo(() => {
    if (!searchQuery.trim()) return ALL_DATABASES;
    const q = searchQuery.toLowerCase();
    return ALL_DATABASES.filter(
      (db) =>
        db.name.toLowerCase().includes(q) ||
        (db.description && db.description.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  const grouped = useMemo(() => {
    const groups: { [key: string]: typeof ALL_DATABASES } = {};
    const sorted = [...filteredDatabases].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    sorted.forEach((db) => {
      const firstChar = db.name.charAt(0).toUpperCase();
      const letter = /^[A-Z]$/.test(firstChar) ? firstChar : "#";
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(db);
    });
    return groups;
  }, [filteredDatabases]);

  const alphabet = Object.keys(grouped).sort();

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 fade-in animate-in">
      {/* Header with Back Button */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link
            to="/library"
            className="p-3 rounded-2xl bg-card border border-border hover:bg-muted transition-colors group shadow-sm"
            aria-label="Back to Library"
          >
            <ChevronLeft className="h-6 w-6 text-foreground group-hover:scale-110 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {t.databasesAZ}
            </h1>
            <p className="text-[10px] text-foreground font-black uppercase tracking-[0.2em] mt-1">
              {ALL_DATABASES.length} {t.resourcesAvailableCount}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPortals}
            className="w-full pl-12 pr-12 py-4 bg-card border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-iu-blue/10 transition-all shadow-xl placeholder:text-foreground/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Jump To */}
      {alphabet.length > 3 && (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-card rounded-[1.5rem] border border-border shadow-sm">
          <div className="px-3 py-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-foreground border-r border-border mr-2">
            <Search className="h-3 w-3" /> {t.jumpTo}
          </div>
          {alphabet.map((letter) => (
            <a
              key={letter}
              href={`#db-letter-${letter}`}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
            >
              {letter}
            </a>
          ))}
        </div>
      )}

      {/* Main List */}
      <div className="space-y-16">
        {alphabet.map((letter) => (
          <div
            key={letter}
            id={`db-letter-${letter}`}
            className="scroll-mt-32 animate-in fade-in slide-in-from-bottom-4"
          >
            <div className="flex items-center gap-6 mb-8">
              <span className="text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {letter}
              </span>
              <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-400 dark:from-slate-600 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {grouped[letter].map((db) => (
                <a
                  key={db.id}
                  href={db.url !== "#" ? db.url : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col p-8 rounded-[2rem] bg-card border border-border hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all shadow-sm hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-slate-100/50 dark:bg-slate-800/10 blur-[100px] rounded-full -mr-24 -mt-24 group-hover:bg-slate-200/50 dark:group-hover:bg-slate-800/20 transition-all" />

                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue group-hover:scale-110 transition-transform duration-500">
                      <DynamicIcon name={db.icon} className="h-6 w-6" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg text-[10px] font-black text-foreground group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-all">
                      PLATTFORM
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-foreground group-hover:translate-x-1 transition-transform mb-4 relative z-10 leading-tight">
                    {db.name}
                  </h3>

                  <p className="text-sm text-foreground font-medium leading-relaxed line-clamp-4 mb-6 relative z-10 transition-colors">
                    {language === "de" ? db.description : db.descriptionEn}
                  </p>

                  {db.description &&
                    db.description.includes("Inhalte sind nicht") && (
                      <div className="mt-auto relative z-10 flex items-center gap-2 px-4 py-2 bg-amber-200 text-amber-900 rounded-xl text-[10px] font-black uppercase tracking-wider self-start border border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700">
                        <span className="w-2 h-2 bg-amber-900 dark:bg-amber-100 rounded-full animate-pulse" />
                        {t.separateSearch}
                      </div>
                    )}
                </a>
              ))}
            </div>
          </div>
        ))}

        {alphabet.length === 0 && (
          <div className="text-center py-32 bg-card rounded-[3rem] border-2 border-dashed border-border animate-in fade-in">
            <div className="inline-flex p-8 bg-muted/50 rounded-full mb-8">
              <Search className="h-16 w-16 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-3">
              {t.noPortalsFound}
            </h3>
            <p className="text-muted-foreground font-bold">
              {t.tryDifferentSearch}
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-8 px-8 py-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black hover:scale-105 transition-all shadow-xl"
            >
              Search Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
