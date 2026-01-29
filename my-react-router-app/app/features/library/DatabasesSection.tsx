import React, { useMemo, useState, useEffect, useRef } from "react";
import { Database, ExternalLink, ChevronRight, Search, X } from "lucide-react";
import { DynamicIcon } from "~/components/ui/DynamicIcon";

interface DatabaseItem {
  id: string;
  name: string;
  description: string;
  descriptionEn: string;
  url: string;
  icon: any;
  featured?: boolean;
  separate_search?: boolean;
}

interface DatabasesSectionProps {
  databases: DatabaseItem[];
  activeFilter: "databases" | "ebooks" | "journals" | "tutorials" | null;
  language: "de" | "en";
  title: string;
  subtitle: string;
  viewAllLabel: string;
}

export function DatabasesSection({
  databases,
  activeFilter,
  language,
  title,
  subtitle,
  viewAllLabel,
}: DatabasesSectionProps) {
  const [localSearch, setLocalSearch] = useState("");
  const sectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when filter changes
  useEffect(() => {
    if (activeFilter && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeFilter]);

  // Normalize filter
  const filteredDatabases = useMemo(() => {
    let list = databases;
    if (activeFilter && activeFilter !== "tutorials") {
      list = databases.filter(db => (db as any).type === activeFilter);
    }
    
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      list = list.filter(db => 
        db.name.toLowerCase().includes(q) || 
        db.description.toLowerCase().includes(q)
      );
    }
    
    return list;
  }, [databases, activeFilter, localSearch]);

  const featuredDatabases = filteredDatabases.filter((db) => db.featured);
  const otherDatabases = filteredDatabases.filter((db) => !db.featured);

  // Group by alphabetical order
  const groupedDatabases = useMemo(() => {
    const sorted = [...otherDatabases].sort((a, b) => a.name.localeCompare(b.name));
    const groups: { [key: string]: DatabaseItem[] } = {};
    
    sorted.forEach(db => {
      const firstChar = db.name.charAt(0).toUpperCase();
      const letter = /^[A-Z]$/.test(firstChar) ? firstChar : "#";
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(db);
    });
    
    return groups;
  }, [otherDatabases]);

  if (activeFilter === "tutorials") return null;

  const alphabet = Object.keys(groupedDatabases).sort();

  return (
    <div 
      ref={sectionRef}
      className="bg-white dark:bg-slate-950 backdrop-blur-xl rounded-[2.5rem] border border-slate-300/80 dark:border-slate-700 p-6 sm:p-10 shadow-2xl space-y-10 scroll-mt-10"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-300/70 dark:border-slate-700">
            <Database className="h-7 w-7 sm:h-8 sm:w-8 text-slate-900 dark:text-slate-100" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-slate-800 dark:text-slate-300 font-bold uppercase tracking-widest mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Local Search inside Section */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 dark:text-slate-300" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder={language === "de" ? "In dieser Kategorie suchen..." : "Search in this category..."}
            className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-300/70 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-600 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 transition-all"
          />
          {localSearch && (
            <button 
              onClick={() => setLocalSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X className="h-3 w-3 text-slate-700 dark:text-slate-300" />
            </button>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2">
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-300/70 dark:border-slate-700 px-3 py-1 rounded-full">
            {filteredDatabases.length} Resources
           </span>
        </div>
      </div>

      {/* Featured Grid - Only show if no search or if matches are featured */}
      {featuredDatabases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {featuredDatabases.map((db) => (
            <a
              key={db.id}
              href={db.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-3xl border border-slate-300/70 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 dark:bg-slate-800/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-slate-200 dark:group-hover:bg-slate-800/30 transition-all" />
              
              <div className="relative z-10 flex-shrink-0 p-3 sm:p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300/70 dark:border-slate-700 group-hover:scale-110 transition-transform duration-500">
                <DynamicIcon name={db.icon} className="h-5 w-5 sm:h-6 sm:w-6 text-slate-900 dark:text-slate-100" />
              </div>
              
              <div className="relative z-10 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:translate-x-1 transition-transform">
                    {db.name}
                  </h3>
                  <ExternalLink className="h-4 w-4 text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200 font-bold leading-relaxed line-clamp-2">
                  {language === "de" ? db.description : db.descriptionEn}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Alphabetical List */}
      {otherDatabases.length > 0 ? (
        <div className="pt-10 border-t border-slate-300/70 dark:border-slate-700">
          <div className="flex flex-col gap-8">
            {/* Jump To Bar - Only if many items */}
            {alphabet.length > 3 && (
              <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-100 dark:bg-slate-900 rounded-[1.5rem] border border-slate-300/70 dark:border-slate-700">
                <div className="px-3 py-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 border-r border-slate-300/70 dark:border-slate-700 mr-2">
                  <Search className="h-3 w-3" /> Jump to
                </div>
                {alphabet.map(letter => (
                  <a 
                    key={letter}
                    href={`#db-letter-${letter}`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black bg-slate-100 text-slate-900 border border-slate-300/80 shadow-sm hover:bg-slate-200 hover:text-slate-900 hover:border-slate-400 transition-all dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white dark:hover:border-slate-500"
                  >
                    {letter}
                  </a>
                ))}
              </div>
            )}

            {/* Groups */}
            <div className="space-y-10 group/list">
              {alphabet.map(letter => (
                <div key={letter} id={`db-letter-${letter}`} className="member-group space-y-4 scroll-mt-32">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                      {letter}
                    </span>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-400 dark:from-slate-500 to-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {groupedDatabases[letter].map(db => (
                      <a
                        key={db.id}
                        href={db.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col p-4 rounded-2xl border border-slate-300/70 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all group/item shadow-sm hover:shadow-md"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-sm font-black text-slate-900 dark:text-slate-100 group-hover/item:translate-x-1 transition-transform line-clamp-1">
                            {db.name}
                          </span>
                          <ExternalLink className="h-3 w-3 text-slate-700 dark:text-slate-300 opacity-60 group-hover/item:opacity-100" />
                        </div>
                        <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-relaxed line-clamp-3 font-bold">
                          {language === "de" ? db.description : db.descriptionEn}
                        </p>
                        {db.description.includes("Inhalte sind nicht") && (
                          <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100 text-[9px] font-black uppercase tracking-tighter border border-amber-300 dark:border-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-900 dark:bg-amber-100 animate-pulse" />
                            {language === "de" ? "Separate Suche" : "Separate Search"}
                          </div>
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : localSearch && (
        <div className="text-center py-20 px-6">
           <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-900 rounded-full mb-6 text-slate-700 dark:text-slate-300 border border-slate-300/70 dark:border-slate-700">
              <Search className="h-12 w-12" />
           </div>
           <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">Keine Ergebnisse</h3>
           <p className="text-slate-800 dark:text-slate-200 font-bold">
             Keine Ressourcen gefunden für "{localSearch}"
           </p>
           <button 
             onClick={() => setLocalSearch("")}
             className="mt-6 px-6 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
           >
             Suche zurücksetzen
           </button>
        </div>
      )}
    </div>
  );
}
