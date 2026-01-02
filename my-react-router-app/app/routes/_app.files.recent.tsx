import React from "react";
import { useLoaderData } from "react-router-dom";
import { Clock } from "lucide-react";
import { prisma } from "~/lib/prisma";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/recent-files";
import { useRecentFiles } from "~/hooks/useRecentFiles";

// Components
import { RecentFilesHeader } from "~/components/files/RecentFilesHeader";
import { RecentFilesSearch } from "~/components/files/RecentFilesSearch";
import { RecentFilesList } from "~/components/files/RecentFilesList";
import { RecentFilesSidebar } from "~/components/files/RecentFilesSidebar";

export const loader = async () => {
  try {
    const files = await prisma.file.findMany({
      include: {
        course: true,
        studiengang: true,
      },
      orderBy: {
        uploadedAt: "desc",
      },
      take: 100, // Limit to recent 100 files
    });

    return { files };
  } catch (error) {
    console.error("Error loading files:", error);
    return { files: [] };
  }
};

export default function RecentFiles() {
  const { files: dbFiles } = useLoaderData<typeof loader>();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const {
    q,
    setQ,
    recentTerms,
    filteredFiles,
    activeFilter,
    setActiveFilter,
    onSearch,
    clearTerms,
    clearAllFiles,
  } = useRecentFiles({ dbFiles });

  return (
    <div className="max-w-6xl mx-auto">
      <RecentFilesHeader
        t={t}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        onClearFiles={clearAllFiles}
      />

      <RecentFilesSearch
        t={t}
        query={q}
        setQuery={setQ}
        onSearch={() => onSearch()}
      />

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Timeline Column */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-500" />
            {t.recentlyOpened}
          </h2>

          <RecentFilesList
            t={t}
            language={language}
            filteredFiles={filteredFiles}
          />
        </div>

        {/* Sidebar Area */}
        <RecentFilesSidebar
          t={t}
          recentTerms={recentTerms}
          onSearch={(term) => onSearch(term)}
          onClearTerms={clearTerms}
        />
      </div>
    </div>
  );
}
