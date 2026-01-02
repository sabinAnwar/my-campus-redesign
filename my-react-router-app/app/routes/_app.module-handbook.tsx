import React from "react";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { useLanguage } from "~/contexts/LanguageContext";
import { TEXT } from "~/services/translations/module-handbook";
import { userProfile, RECOMMENDATIONS } from "~/constants/module-handbook";
import { useModuleHandbook } from "~/hooks/useModuleHandbook";

import type { ModuleHandbookLoaderData as LoaderData } from "~/types/module-handbook";

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
  const where = user?.studiengangId
    ? { studiengangId: user.studiengangId }
    : undefined;

  let courses: LoaderData["courses"] = [];

  try {
    courses = await prisma.course.findMany({
      where,
      include: { studiengang: true },
      orderBy: [{ studiengang: { name: "asc" } }, { code: "asc" }],
    });
  } catch (error) {
    console.error("Module handbook: failed to load courses from DB", error);
    courses = [];
  }

  const studiengangName =
    courses.find((c) => c.studiengang?.name)?.studiengang?.name || null;

  return { courses, studiengangName };
};

export default function ModuleHandbookPage() {
  const { courses, studiengangName } = useLoaderData() as LoaderData;
  const { language } = useLanguage();
  const t = TEXT[language];

  const {
    semesterFilter,
    setSemesterFilter,
    filteredModules,
    semesterOptions,
    currentSemesterModules,
  } = useModuleHandbook({ courses, t });

  return (
    <div className="max-w-6xl mx-auto space-y-10">
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
