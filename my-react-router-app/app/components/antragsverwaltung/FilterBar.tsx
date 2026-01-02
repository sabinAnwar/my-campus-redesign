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
    <div className="flex flex-col md:flex-row gap-4 mb-12">
      <div className="flex-1 relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-iu-blue transition-colors" />
        <input
          type="text"
          placeholder={t.search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card/50 backdrop-blur-xl border border-border rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all font-medium"
        />
      </div>
      <div className="flex gap-4">
        <select
          value={activeStatus}
          onChange={(e) => setActiveStatus(e.target.value)}
          className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl px-6 py-3 text-sm font-black text-foreground focus:outline-none focus:border-iu-blue/50 cursor-pointer"
        >
          <option value="all">{t.allStatus}</option>
          <option value="pending">{t.pending}</option>
          <option value="approved">{t.approved}</option>
          <option value="rejected">{t.rejected}</option>
        </select>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl px-6 py-3 text-sm font-black text-foreground focus:outline-none focus:border-iu-blue/50 cursor-pointer"
        >
          <option value="all">{t.allCategories}</option>
          <option value="examOffice">{t.categories.examOffice}</option>
          <option value="studentOffice">
            {t.categories.studentOffice}
          </option>
        </select>
      </div>
    </div>
  );
}
