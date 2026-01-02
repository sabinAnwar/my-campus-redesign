import React from "react";
import { Search, X } from "lucide-react";

interface RecentFilesSearchProps {
  t: any;
  query: string;
  setQuery: (q: string) => void;
  onSearch: () => void;
}

export function RecentFilesSearch({
  t,
  query,
  setQuery,
  onSearch,
}: RecentFilesSearchProps) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 mb-10 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
      <div className="flex gap-4 items-center">
        <Search className="h-5 w-5 text-neutral-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={t.searchPlaceholder}
          className="flex-1 outline-none bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 text-base"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
          >
            <X className="h-4 w-4 text-neutral-400" />
          </button>
        )}
      </div>
    </div>
  );
}
