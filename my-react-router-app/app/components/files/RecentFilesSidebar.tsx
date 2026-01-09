import React from "react";
import { Search } from "lucide-react";

interface RecentFilesSidebarProps {
  t: any;
  recentTerms: string[];
  onSearch: (term: string) => void;
  onClearTerms: () => void;
}

export function RecentFilesSidebar({
  t,
  recentTerms,
  onSearch,
  onClearTerms,
}: RecentFilesSidebarProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Search Results / Tags */}
      <section className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
        <h3 className="text-sm font-black text-foreground uppercase tracking-wider mb-6 flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white">
            <Search className="h-4 w-4" />
          </div>
          {t.recentSearchTerms}
        </h3>

        {recentTerms.length === 0 ? (
          <p className="text-xs text-neutral-700 italic">
            {t.noSearchTerms}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recentTerms.map((term) => (
              <button
                key={term}
                onClick={() => onSearch(term)}
                className="px-3 py-1.5 bg-muted hover:bg-muted/80 text-muted-foreground text-xs font-bold rounded-lg transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              onClick={onClearTerms}
              className="text-[10px] text-neutral-700 hover:text-red-500 font-bold uppercase mt-2 w-full text-left ml-1"
            >
              {t.clear}
            </button>
          </div>
        )}
      </section>

      {/* Quick Link Card */}
      <div className="bg-gradient-to-br from-iu-blue to-iu-purple rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xl shadow-iu-blue/20">
        <h3 className="font-black text-lg mb-2">{t.needHelp}</h3>
        <p className="text-blue-100 text-xs leading-relaxed mb-4">
          {t.needHelpDesc}
        </p>
        <button
          onClick={() => (window.location.href = "/info-center")}
          className="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-black transition-colors backdrop-blur-sm"
        >
          {t.openInfoCenter}
        </button>
      </div>
    </div>
  );
}
