import { Search } from "lucide-react";

interface FilterBarProps {
  t: any;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeStatus: string;
  setActiveStatus: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
}

export function FilterBar({
  t,
  searchQuery,
  setSearchQuery,
  activeStatus,
  setActiveStatus,
  activeCategory,
  setActiveCategory,
}: FilterBarProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8 sm:mb-12">
      <div className="flex-1 relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-iu-blue transition-colors z-10" />
        <input
          type="text"
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card/40 backdrop-blur-md border border-border rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-iu-blue/40 focus:ring-4 focus:ring-iu-blue/5 transition-all font-medium text-foreground placeholder:text-muted-foreground/60 shadow-sm"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 sm:flex-none sm:min-w-[180px]">
          <select
            value={activeStatus}
            onChange={(e) => setActiveStatus(e.target.value)}
            className="w-full appearance-none bg-card/40 backdrop-blur-md border border-border rounded-2xl pl-6 pr-12 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-iu-blue/40 focus:ring-4 focus:ring-iu-blue/5 cursor-pointer shadow-sm transition-all"
          >
            <option value="all">{t.allStatus}</option>
            <option value="new">{t.new}</option>
            <option value="pending">{t.pending}</option>
            <option value="approved">{t.approved}</option>
            <option value="rejected">{t.rejected}</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className="relative flex-1 sm:flex-none sm:min-w-[220px]">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full appearance-none bg-card/40 backdrop-blur-md border border-border rounded-2xl pl-6 pr-12 py-4 text-sm font-bold text-foreground focus:outline-none focus:border-iu-blue/40 focus:ring-4 focus:ring-iu-blue/5 cursor-pointer shadow-sm transition-all"
          >
            <option value="all">{t.allCategories}</option>
            <option value="examOffice">{t.categories.examOffice}</option>
            <option value="studentOffice">{t.categories.studentOffice}</option>
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
