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
    <div className="space-y-8">
      {/* Search Results / Tags */}
      <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
          <Search className="h-4 w-4 text-neutral-400" />
          {t.recentSearchTerms}
        </h3>

        {recentTerms.length === 0 ? (
          <p className="text-xs text-neutral-500 italic">
            {t.noSearchTerms}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {recentTerms.map((term) => (
              <button
                key={term}
                onClick={() => onSearch(term)}
                className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs font-bold rounded-lg transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              onClick={onClearTerms}
              className="text-[10px] text-neutral-400 hover:text-red-500 font-bold uppercase mt-2 w-full text-left ml-1"
            >
              {t.clear}
            </button>
          </div>
        )}
      </section>

      {/* Quick Link Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/20">
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
