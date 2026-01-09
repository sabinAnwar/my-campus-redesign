import React from "react";
import { useLoaderData, useRevalidator } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { TimeoutError, withTimeout } from "~/lib/loaderUtils";
import { useLanguage } from "~/contexts/LanguageContext";
import { TEXT } from "~/services/translations/module-handbook";
import { userProfile, RECOMMENDATIONS } from "~/constants/module-handbook";
import { useModuleHandbook } from "~/hooks/useModuleHandbook";

import type { ModuleHandbookLoaderData as LoaderData } from "~/types/module-handbook";

const MODULES_TIMEOUT_MS = 2000;

// Components
import { ModuleHandbookHeader } from "~/components/module-handbook/ModuleHandbookHeader";
import { QuickFactsSection } from "~/components/module-handbook/QuickFactsSection";
import { SemesterFilter } from "~/components/module-handbook/SemesterFilter";
import { CurrentSemesterModules } from "~/components/module-handbook/CurrentSemesterModules";
import { ModuleGrid } from "~/components/module-handbook/ModuleGrid";
import { RecommendationsSection } from "~/components/module-handbook/RecommendationsSection";
import { DownloadsSection } from "~/components/module-handbook/DownloadsSection";

export const loader = async ({ request }: { request: Request }) => {
  const user = await getUserFromRequest(request);
  const where = (user as any)?.major_id
    ? { major_id: (user as any).major_id }
    : undefined;

  let courses: LoaderData["courses"] = [];
  let marks: LoaderData["marks"] = [];
  let errorMessage: string | null = null;

  try {
    const [loadedCourses, loadedMarks] = await withTimeout(
      Promise.all([
        prisma.course.findMany({
          where,
          include: { major: true },
          orderBy: [{ major: { name: "asc" } }, { code: "asc" }],
        }),
        user?.id
          ? prisma.mark.findMany({
              where: { user_id: user.id },
              select: { id: true, value: true, course: true },
            })
          : Promise.resolve([]),
      ]),
      MODULES_TIMEOUT_MS,
      "Loading modules timed out"
    );
    courses = loadedCourses;
    marks = loadedMarks;
  } catch (error) {
    console.error("Module handbook: failed to load courses from DB", error);
    courses = [];
    marks = [];
    errorMessage =
      error instanceof TimeoutError
        ? "Module handbook is taking longer than expected."
        : "Module handbook is unavailable right now.";
  }

  const studiengangName =
    courses.find((c: any) => c.major?.name)?.major?.name || null;

  return Response.json(
    {
      courses,
      marks,
      currentSemester: (user as any)?.semester || 1,
      studiengangName,
      error: errorMessage,
    },
    { headers: { "Cache-Control": "private, max-age=60" } }
  );
};

export default function ModuleHandbookPage() {
  const { courses, marks, currentSemester, studiengangName, error } =
    useLoaderData() as LoaderData;
  const revalidator = useRevalidator();
  const { language } = useLanguage();
  const t = TEXT[language];
  const retryLabel = language === "de" ? "Erneut versuchen" : "Try again";

  const {
    semesterFilter,
    setSemesterFilter,
    filteredModules,
    semesterOptions,
    currentSemesterModules,
  } = useModuleHandbook({ courses, marks, currentSemester, t, language });

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {error && (
        <div className="rounded-2xl border border-iu-red/30 bg-iu-red/5 p-4 text-sm text-foreground flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="font-semibold">
              {language === "de" ? "Fehler beim Laden" : "Loading issue"}
            </p>
            <p className="text-muted-foreground">
              {language === "de"
                ? "Dokumente konnten nicht geladen werden. Bitte versuche es erneut."
                : "Documents could not be loaded. Please try again."}
            </p>
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

      <ModuleHandbookHeader
        t={t}
        studiengangName={studiengangName}
        userProfile={userProfile}
      />

      <QuickFactsSection
        t={t}
        studiengangName={studiengangName}
        userProfile={userProfile}
      />

      {/* Filters */}
      <section className="rounded-[2rem] bg-card border border-border p-8 shadow-sm">
        <SemesterFilter
          t={t}
          semesterFilter={semesterFilter}
          setSemesterFilter={setSemesterFilter}
          semesterOptions={semesterOptions}
        />

        <CurrentSemesterModules
          t={t}
          language={language}
          currentSemester={userProfile.currentSemester}
          currentSemesterModules={currentSemesterModules}
        />

        <ModuleGrid
          t={t}
          language={language}
          filteredModules={filteredModules}
        />
      </section>

      {/* Recommendations */}
      <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <RecommendationsSection
          t={t}
          focus={userProfile.focus}
          recommendations={RECOMMENDATIONS}
        />

        <DownloadsSection
          t={t}
          pdfUrl={userProfile.pdfUrl}
          advisorEmail={userProfile.advisorEmail}
          advisor={userProfile.advisor}
        />
      </section>
    </div>
  );
}
