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
    <div className="sticky top-4 z-20 overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] px-4 sm:px-6 py-4 sm:py-6 mb-8 sm:mb-12 bg-background/60 dark:bg-card/60 border border-border/50 dark:border-white/5 shadow-2xl backdrop-blur-xl group/search">
      <div className="relative flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Search Input */}
        <div className="relative flex-1 group/input">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within/input:text-iu-blue dark:group-focus-within/input:text-white transition-colors" />
          </div>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 sm:pl-14 pr-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-background/50 dark:bg-card/40 border border-border/50 dark:border-white/5 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-iu-blue/50 dark:focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/5 transition-all text-sm font-bold shadow-sm"
          />
        </div>

        {/* Category Filter */}
        <div className="relative md:w-72 group/select">
          <div className="absolute inset-y-0 left-0 pl-4 sm:pl-6 flex items-center pointer-events-none z-10">
            <div className="w-1.5 h-1.5 rounded-full bg-iu-blue shadow-[0_0_8px_rgba(36,94,235,0.5)]" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full pl-10 sm:pl-12 pr-12 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-background/50 dark:bg-card/40 border border-border/50 dark:border-white/5 text-foreground text-sm font-bold focus:outline-none focus:border-iu-blue/50 dark:focus:border-iu-blue/50 cursor-pointer transition-all hover:bg-muted/50 dark:hover:bg-white/5 shadow-sm"
          >
            <option value={ALL_CATEGORIES}>{t.allCategories}</option>
            {toolCategories.map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 sm:pr-6 flex items-center pointer-events-none">
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover/select:text-iu-blue transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
