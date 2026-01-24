import React from "react";
import { Search } from "lucide-react";

interface CoursesEmptyStateProps {
  t: any;
}

export function CoursesEmptyState({ t }: CoursesEmptyStateProps) {
  return (
    <div className="text-center py-12 sm:py-16 md:py-20 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-dashed border-border bg-card/30 backdrop-blur-sm">
      <div className="inline-flex p-3 sm:p-4 rounded-full bg-muted mb-3 sm:mb-4">
        <Search className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
      </div>
      <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground mb-1.5 sm:mb-2">
        {t.noCoursesFound}
      </h3>
      <p className="text-sm sm:text-base text-muted-foreground px-4">
        {t.tryAdjustingFilters}
      </p>
    </div>
  );
}
