import React from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { Clock } from "lucide-react";
import { Prisma } from "@prisma/client";
import { prisma } from "~/lib/prisma";
import { TimeoutError, withTimeout } from "~/lib/loaderUtils";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/recent-files";
import { useRecentFiles } from "~/hooks/useRecentFiles";

// Components
import { RecentFilesHeader } from "~/components/files/RecentFilesHeader";
import { RecentFilesSearch } from "~/components/files/RecentFilesSearch";
import { RecentFilesList } from "~/components/files/RecentFilesList";
import { RecentFilesSidebar } from "~/components/files/RecentFilesSidebar";

const FILES_TIMEOUT_MS = 2000;

export const loader = async () => {
  let errorMessage: string | null = null;
  try {
    const files = await withTimeout(
      prisma.file.findMany({
        include: {
          course: true,
          major: true,
        },
        orderBy: {
          uploaded_at: "desc",
        },
        take: 100, // Limit to recent 100 files
      }),
      FILES_TIMEOUT_MS,
      "Loading recent files timed out"
    );

    return Response.json(
      { files, error: null },
      { headers: { "Cache-Control": "private, max-age=30" } }
    );
  } catch (error) {
    const isMissingTable =
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2021" ||
        error.message.toLowerCase().includes("does not exist"));

    if (isMissingTable) {
      console.warn("Recent files: missing table, returning empty list.");
      return Response.json(
        { files: [], error: null },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    if (error instanceof TimeoutError) {
      errorMessage =
        "Recent files are taking longer than expected. Showing a fallback list.";
    } else {
      errorMessage =
        "Recent files are unavailable right now. Please try again shortly.";
    }
    console.error("Error loading files:", error);
    return Response.json(
      { files: [], error: errorMessage },
      { headers: { "Cache-Control": "no-store" } }
    );
  }
};

export default function RecentFiles() {
  const { files: dbFiles, error } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const retryLabel = language === "de" ? "Erneut versuchen" : "Try again";
  const errorText =
    language === "de"
      ? "Dokumente konnten nicht geladen werden. Bitte versuche es erneut."
      : "Documents could not be loaded. Please try again.";

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

      {error && (
        <div className="mb-6 rounded-2xl border border-iu-red/30 bg-iu-red/5 p-4 text-sm text-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-semibold">
              {language === "de" ? "Fehler beim Laden" : "Loading issue"}
            </p>
            <p className="text-muted-foreground">{errorText}</p>
          </div>
          <button
            type="button"
            onClick={() => revalidator.revalidate()}
            className="inline-flex items-center justify-center rounded-full border border-iu-red/30 px-4 py-2 font-semibold text-iu-red hover:bg-iu-red/10 transition-colors"
          >
            {retryLabel}
          </button>
        </div>
      )}

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Timeline Column */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xl font-black text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white">
              <Clock className="h-5 w-5" />
            </div>
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
