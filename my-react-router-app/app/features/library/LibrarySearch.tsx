import React from "react";
import { Search } from "lucide-react";

interface LibrarySearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearch: (e: React.FormEvent) => void;
  placeholder: string;
  searchLabel: string;
}

export function LibrarySearch({
  searchQuery,
  setSearchQuery,
  onSearch,
  placeholder,
  searchLabel,
}: LibrarySearchProps) {
  const quickTags = ["EBSCO", "Springer", "JSTOR", "E-Books"];

  return (
    <div className="mb-12">
      <form onSubmit={onSearch} className="relative group max-w-3xl">
        <div className="relative flex flex-col sm:flex-row sm:items-center bg-card rounded-[1.5rem] border border-border shadow-lg overflow-hidden focus-within:ring-4 focus-within:ring-slate-100 dark:focus-within:ring-slate-800/20 transition-all">
          <Search className="absolute left-4 sm:left-6 h-5 w-5 sm:h-6 sm:w-6 text-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 sm:pl-16 pr-4 sm:pr-44 py-4 sm:py-6 text-foreground bg-transparent placeholder:text-foreground/60 border-0 focus:ring-0 text-base sm:text-lg font-black"
          />
          <button
            type="submit"
            className="static sm:absolute sm:right-3 mx-3 sm:mx-0 mb-3 sm:mb-0 px-6 sm:px-8 py-3 sm:py-4 bg-slate-900 dark:bg-slate-100 hover:bg-black dark:hover:bg-white text-white dark:text-slate-900 font-black rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center gap-3 uppercase tracking-widest text-xs sm:text-sm"
          >
            <Search className="h-5 w-5" />
            <span className="hidden sm:inline">{searchLabel}</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-6 ml-2">
          {quickTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSearchQuery(tag)}
              className="px-4 py-1.5 bg-card border border-border rounded-full text-xs font-black text-foreground hover:bg-muted hover:border-slate-400 transition-all uppercase tracking-wider"
            >
              {tag}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
