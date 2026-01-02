import { Search, ChevronRight } from "lucide-react";
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
    <div className="sticky top-4 z-20 relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 mb-6 sm:mb-8 md:mb-12 bg-card/80 border border-border shadow-2xl backdrop-blur-xl">
      <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-iu-blue transition-colors" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 md:pl-14 pr-4 sm:pr-6 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-iu-blue/50 focus:bg-background transition-all text-xs sm:text-sm font-bold"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full sm:w-auto px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-background/50 border border-border text-foreground text-xs sm:text-sm font-bold focus:outline-none focus:border-iu-blue/50 cursor-pointer transition hover:bg-muted/50 sm:min-w-[180px] md:min-w-[200px]"
          >
            <option value={ALL_CATEGORIES}>{t.allCategories}</option>
            {toolCategories.map((cat) => (
              <option key={cat.title} value={cat.title}>
                {cat.title}
              </option>
            ))}
          </select>
          <ChevronRight className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground rotate-90 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
