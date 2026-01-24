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
    <div className="sticky top-3 z-20 overflow-hidden rounded-[0.9rem] sm:rounded-[1.1rem] px-2.5 sm:px-3 py-2.5 sm:py-3 mb-4 sm:mb-5 bg-white dark:bg-card/80 border border-slate-300/90 dark:border-white/10 shadow-sm backdrop-blur-xl group/search">
      <div className="relative flex flex-col md:flex-row gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1 group/input">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground group-focus-within/input:text-iu-blue dark:group-focus-within/input:text-white transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-background/70 dark:bg-card/60 border border-border/70 dark:border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-iu-blue/60 dark:focus:border-iu-blue/60 focus:ring-2 focus:ring-iu-blue/10 transition-all text-sm font-bold shadow-sm"
            />
          </div>

        {/* Category Filter */}
        <div className="relative md:w-60 group/select">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-iu-blue shadow-[0_0_8px_rgba(36,94,235,0.5)]" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full pl-9 pr-10 py-2.5 rounded-lg bg-background/70 dark:bg-card/60 border border-border/70 dark:border-white/10 text-foreground text-sm font-bold focus:outline-none focus:border-iu-blue/60 dark:focus:border-iu-blue/60 cursor-pointer transition-all hover:bg-muted/40 dark:hover:bg-white/5 shadow-sm"
          >
            <option value={ALL_CATEGORIES}>{t.allCategories}</option>
            {toolCategories.map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover/select:text-iu-blue transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
