import type { ReactElement } from "react";
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, FileSearch, ArrowRight } from "lucide-react";

import type { SearchItem } from "~/hooks/useAppShellSearch";
import { useClickOutside } from "~/hooks/useClickOutside";

interface SearchBarProps {
  /** Current search query value */
  query: string;
  /** Callback when query changes */
  onQueryChange: (query: string) => void;
  /** Callback when search input receives focus */
  onFocus?: () => void;
  /** Filtered search results to display */
  results: SearchItem[];
  /** Translations for search UI */
  translations: {
    placeholder: string;
    results: string;
    noResults: string;
  };
}

export function SearchBar({
  query,
  onQueryChange,
  onFocus,
  results,
  translations,
}: SearchBarProps): ReactElement {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    setIsOpen(false);
  }, isOpen);

  // Reset selected index when results change or query is cleared
  useEffect(() => {
    setSelectedIndex(-1);
    if (query.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [results, query]);

  const handleResultClick = () => {
    onQueryChange(""); // Clear search on navigation
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < results.length ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0 && results[selectedIndex]) {
        e.preventDefault();
        navigate(results[selectedIndex].link);
        handleResultClick();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full min-w-[80px] sm:min-w-[160px] md:min-w-[220px] lg:min-w-[280px] max-w-full sm:max-w-[240px] md:max-w-md mx-1 sm:mx-2 md:mx-4 relative"
    >
      <div className="relative group">
        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-results"
          className="block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-2.5 sm:py-3 bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] md:text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:ring-4 focus:ring-iu-blue/20 focus:border-iu-blue transition-all shadow-sm truncate"
          placeholder={translations.placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
            onFocus?.();
          }}
          onKeyDown={handleKeyDown}
        />

        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-focus-within:text-iu-blue dark:group-focus-within:text-white transition-colors aria-hidden" />
        </div>

        {/* Results Dropdown */}
        {isOpen && query.trim() && (
          <div className="fixed sm:absolute left-2 right-2 sm:left-0 sm:right-0 top-20 sm:top-full mt-0 sm:mt-2 bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden z-[200] animate-in fade-in zoom-in-95 duration-200">
            {/* Results Header */}
            <div className="p-2 sm:p-3 border-b border-border bg-muted/30 flex justify-between items-center text-[10px] sm:text-xs font-bold text-iu-blue dark:text-white">
              <span>
                {results.length} {translations.results}
              </span>
            </div>

            {/* Results List */}
            <ul 
              id="search-results" 
              role="listbox" 
              className="max-h-[250px] sm:max-h-[300px] overflow-y-auto p-1.5 sm:p-2 space-y-0.5 sm:space-y-1 custom-scrollbar"
            >
              {results.length > 0 ? (
                results.map((result, index) => {
                  const ResultIcon = result.icon ?? FileSearch;
                  const isSelected = index === selectedIndex;
                  return (
                    <li key={result.id} role="option" aria-selected={isSelected}>
                      <Link
                        to={result.link}
                        onClick={handleResultClick}
                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg group/item transition-all border ${
                          isSelected 
                            ? "bg-iu-blue/10 border-iu-blue/20" 
                            : "hover:bg-iu-blue/10 border-transparent hover:border-iu-blue/20"
                        } cursor-pointer focus:outline-none`}
                      >
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg bg-background border transition-colors ${
                          isSelected ? "border-iu-blue/30 text-iu-blue" : "border-border text-muted-foreground group-hover/item:text-iu-blue dark:text-white"
                        }`}>
                          <ResultIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold sm:font-black uppercase tracking-tight truncate">
                            {result.title}
                          </div>
                          <div className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-wider sm:tracking-widest">
                            {result.category}
                          </div>
                        </div>

                        {/* Arrow Icon */}
                        <ArrowRight className={`h-3.5 w-3.5 sm:h-4 sm:w-4 transition-all text-iu-blue dark:text-white hidden sm:block ${
                          isSelected ? "opacity-100 translate-x-1" : "opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1"
                        }`} aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })
              ) : (
                <div className="p-4 sm:p-8 text-center" role="status">
                  <FileSearch className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-bold sm:font-black uppercase tracking-wider sm:tracking-widest">
                    {translations.noResults} "{query}"
                  </p>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
