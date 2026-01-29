import { Search, ChevronDown } from "lucide-react";
import type { ToolCategory } from "~/types/benefits";

interface BenefitsSearchProps {
  t: any;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  toolCategories: ToolCategory[];
  ALL_CATEGORIES: string;
}

export function BenefitsSearch({
  t,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  toolCategories,
  ALL_CATEGORIES,
}: BenefitsSearchProps) {
  return (
    <div className="sticky top-3 z-20 overflow-hidden rounded-[0.9rem] sm:rounded-[1.1rem] px-2.5 sm:px-3 py-2.5 sm:py-3 mb-4 sm:mb-5 bg-white dark:bg-card/80 border border-slate-300/90 dark:border-slate-700 shadow-sm backdrop-blur-xl group/search">
      <div className="relative flex flex-col md:flex-row gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1 group/input">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-foreground group-focus-within/input:text-iu-blue transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background/70 dark:bg-card/60 border border-slate-300/80 dark:border-slate-700 text-foreground placeholder:text-foreground/60 focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 focus:ring-4 focus:ring-slate-100 dark:focus:ring-slate-800/20 transition-all text-sm font-black shadow-sm"
            />
          </div>

        {/* Category Filter */}
        <div className="relative md:w-60 group/select">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-iu-blue" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full pl-9 pr-10 py-2.5 rounded-lg bg-background/70 dark:bg-card/60 border border-slate-300/80 dark:border-slate-700 text-foreground text-sm font-black focus:outline-none focus:border-slate-400 dark:focus:border-slate-500 cursor-pointer transition-all hover:bg-muted/40 dark:hover:bg-slate-800 shadow-sm"
          >
            <option value={ALL_CATEGORIES}>{t.allCategories}</option>
            {toolCategories.map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-foreground group-hover/select:translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
