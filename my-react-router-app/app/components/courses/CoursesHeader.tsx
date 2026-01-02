import React from "react";
import { BookOpen, GraduationCap, Search } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface CoursesHeaderProps {
  t: any;
  language: string;
  userStudiengang: string | null;
  currentSemester: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function CoursesHeader({
  t,
  language,
  userStudiengang,
  currentSemester,
  searchQuery,
  setSearchQuery,
}: CoursesHeaderProps) {
  return (
    <PageHeader
      icon={BookOpen}
      title={t.modules || t.myCourses}
      subtitle={t.manageProgress}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">

        {/* Search Bar */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none w-4 h-4" />
          <input
            type="text"
            placeholder={t.searchModule}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:border-iu-blue/50 focus:ring-4 focus:ring-iu-blue/10 transition-all outline-none font-bold text-sm shadow-sm hover:shadow-md"
          />
        </div>
      </div>
    </PageHeader>
  );
}

