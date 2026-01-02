import { Search, Filter, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import type { GradeStatusKey } from "~/types/grades";

interface GradesFilterControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: "ALL" | GradeStatusKey;
  onStatusFilterChange: (value: "ALL" | GradeStatusKey) => void;
  sortKey: "none" | "datum" | "note";
  onSortKeyChange: (value: "none" | "datum" | "note") => void;
  sortDir: "asc" | "desc";
  onSortDirToggle: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  labels: {
    filterAndSort: string;
    searchPlaceholder: string;
    allStatus: string;
    statusPassed: string;
    statusOpen: string;
    statusRegistered: string;
    statusExamRegistered: string;
    statusFailed: string;
    sortNone: string;
    sortDate: string;
    sortGrade: string;
    expandAll: string;
    collapseAll: string;
  };
}

export function GradesFilterControls({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortKey,
  onSortKeyChange,
  sortDir,
  onSortDirToggle,
  onExpandAll,
  onCollapseAll,
  labels,
}: GradesFilterControlsProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 shadow-lg">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-2.5 bg-iu-blue/10 rounded-lg">
          <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue" />
        </div>
        <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
          {labels.filterAndSort}
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative group">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-iu-blue transition-colors"
            size={18}
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full pl-10 pr-3 py-2.5 sm:py-3 rounded-lg border border-border bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-iu-blue/10 focus:border-iu-blue transition-all text-sm sm:text-base font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-background/50 border border-border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 group focus-within:border-iu-blue transition-colors">
            <Filter
              size={14}
              className="text-muted-foreground group-focus-within:text-iu-blue"
            />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as any)}
              className="bg-transparent text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground focus:outline-none cursor-pointer"
            >
              <option value="ALL">{labels.allStatus}</option>
              <option value="P">{labels.statusPassed}</option>
              <option value="M">{labels.statusOpen}</option>
              <option value="CE">{labels.statusRegistered}</option>
              <option value="E">{labels.statusExamRegistered}</option>
              <option value="F">{labels.statusFailed}</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 bg-background/50 border border-border rounded-lg px-2.5 sm:px-3 py-2 sm:py-2.5 group focus-within:border-iu-blue transition-colors">
            <ArrowUpDown
              size={14}
              className="text-muted-foreground group-focus-within:text-iu-blue"
            />
            <select
              value={sortKey}
              onChange={(e) => onSortKeyChange(e.target.value as any)}
              className="bg-transparent text-xs sm:text-sm font-bold uppercase tracking-wide text-foreground focus:outline-none cursor-pointer"
            >
              <option value="none">{labels.sortNone}</option>
              <option value="datum">{labels.sortDate}</option>
              <option value="note">{labels.sortGrade}</option>
            </select>
            <button
              onClick={onSortDirToggle}
              className="p-1.5 hover:bg-iu-blue/10 rounded-lg transition-colors text-iu-blue"
            >
              {sortDir === "asc" ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-muted/50 p-1 rounded-lg border border-border">
            <button
              onClick={onExpandAll}
              className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-iu-blue hover:bg-white dark:hover:bg-slate-800 rounded transition-all"
            >
              {labels.expandAll}
            </button>
            <div className="w-px h-4 bg-border" />
            <button
              onClick={onCollapseAll}
              className="px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide text-muted-foreground hover:text-iu-blue hover:bg-white dark:hover:bg-slate-800 rounded transition-all"
            >
              {labels.collapseAll}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
