import type { ReactElement } from "react";
import { Link } from "react-router-dom";
import { Search, FileSearch, ArrowRight } from "lucide-react";

import type { SearchItem } from "~/hooks/useAppShellSearch";

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

/**
 * Global search bar component with dropdown results.
 * Displays filtered results when user types a query.
 *
 * @example
 * <SearchBar
 *   query={searchQuery}
 *   onQueryChange={setSearchQuery}
 *   results={filteredResults}
 *   translations={shellText.search}
 * />
 */
export function SearchBar({
  query,
  onQueryChange,
  onFocus,
  results,
  translations,
}: SearchBarProps): ReactElement {
  const handleResultClick = () => {
    onQueryChange(""); // Clear search on navigation
  };

  return (
    <div className="flex-1 w-full max-w-full sm:max-w-sm md:max-w-md mx-1 sm:mx-4 md:mx-8 relative">
      <div className="relative group">
        {/* Search Input */}
        <input
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={query.trim().length > 0}
          aria-haspopup="listbox"
          aria-controls="search-results"
          aria-label={translations.placeholder}
          className="block w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-3 sm:py-3 bg-muted/50 border border-border/50 rounded-xl sm:rounded-2xl text-xs sm:text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:ring-4 focus:ring-iu-blue/20 focus:border-iu-blue transition-all shadow-sm"
          placeholder={translations.placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onFocus={onFocus}
        />

        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
          <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground group-focus-within:text-iu-blue dark:group-focus-within:text-white transition-colors aria-hidden" />
        </div>

        {/* Results Dropdown */}
        {query.trim() && (
          <div className="fixed sm:absolute left-2 right-2 sm:left-0 sm:right-0 top-[4.5rem] sm:top-full mt-0 sm:mt-2 bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden z-[200] animate-in fade-in zoom-in-95 duration-200">
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
                results.map((result) => {
                  const ResultIcon = result.icon ?? FileSearch;
                  return (
                    <li key={result.id} role="option">
                      <Link
                        to={result.link}
                        onClick={handleResultClick}
                        className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-iu-blue/10 group/item transition-all border border-transparent hover:border-iu-blue/20 cursor-pointer focus:outline-none focus:bg-iu-blue/10 focus:border-iu-blue/20"
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg bg-background border border-border text-muted-foreground group-hover/item:text-iu-blue dark:group-hover/item:text-foreground dark:text-white group-hover/item:border-iu-blue/30 transition-colors">
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
                        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all text-iu-blue dark:text-white hidden sm:block" aria-hidden="true" />
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
