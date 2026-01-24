import React from "react";
import { Clock, Trash2, Video, ClipboardCheck, File as FileIcon } from "lucide-react";

interface RecentFilesHeaderProps {
  t: any;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onClearFiles: () => void;
}

export function RecentFilesHeader({
  t,
  activeFilter,
  setActiveFilter,
  onClearFiles,
}: RecentFilesHeaderProps) {
  const filters = [
    { id: "all", label: t.filterAll, icon: Clock },
    { id: "videos", label: t.filterVideos, icon: Video },
    { id: "docs", label: t.filterDocs, icon: FileIcon },
    { id: "tests", label: t.filterTests, icon: ClipboardCheck },
  ];

  return (
    <header className="mb-8 sm:mb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm">
              <Clock size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {t.title}
            </h1>
          </div>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {t.subtitle}
          </p>
        </div>
        <button
          onClick={onClearFiles}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-red-50 dark:bg-neutral-800 dark:hover:bg-red-950/30 text-neutral-700 hover:text-red-600 dark:text-neutral-200 dark:hover:text-red-400 rounded-xl transition-all duration-300 text-xs sm:text-sm font-bold border border-neutral-200 dark:border-neutral-700 hover:border-red-200 dark:hover:border-red-900/50 shadow-sm"
        >
          <Trash2 className="h-4 w-4" />
          {t.clear}
        </button>
      </div>

      {/* Activity Filter */}
      <div className="flex flex-wrap items-center gap-2 mt-6 sm:mt-8">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20 translate-y-[-2px]"
                : "bg-card dark:bg-card text-muted-foreground hover:bg-muted dark:hover:bg-muted border border-border"
            }`}
          >
            <filter.icon className="h-4 w-4" />
            {filter.label}
          </button>
        ))}
      </div>
    </header>
  );
}
