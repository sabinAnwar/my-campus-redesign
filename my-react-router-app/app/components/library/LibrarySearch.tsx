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
        <div className="relative flex items-center bg-card/80 backdrop-blur-xl rounded-[1.5rem] border border-border shadow-lg overflow-hidden">
          <Search className="absolute left-6 h-6 w-6 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-16 pr-44 py-6 text-foreground bg-transparent placeholder-muted-foreground border-0 focus:ring-0 text-lg font-bold"
          />
          <button
            type="submit"
            className="absolute right-3 px-8 py-4 bg-iu-blue hover:bg-iu-blue/90 text-white font-black rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 uppercase tracking-widest text-sm"
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
              className="px-4 py-1.5 bg-card border border-border rounded-full text-xs font-bold text-muted-foreground hover:text-foreground hover:border-iu-blue/50 transition-all uppercase tracking-wider"
            >
              {tag}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
