import React from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { useLoaderData } from "react-router-dom";
import { TRANSLATIONS } from "~/services/translations/curriculum";
import { useCurriculumData } from "~/hooks/useCurriculumData";

// Components
import { CurriculumHeader } from "~/components/curriculum/CurriculumHeader";
import { CurriculumStats } from "~/components/curriculum/CurriculumStats";
import { SemesterSection } from "~/components/curriculum/SemesterSection";

export const loader = async ({ request }: { request: Request }) => {
  const user = await getUserFromRequest(request);
  let userId = user?.id;

  if (!userId) {
    const sabin = await prisma.user.findUnique({
      where: { email: "sabin.elanwar@iu-study.org" },
      select: { id: true },
    });
    userId = sabin?.id;
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      marks: true,
      studiengang: true,
    },
  });

  return { user: dbUser };
};

export default function CurriculumPage() {
  const { language } = useLanguage();
  const { user } = useLoaderData<typeof loader>();
  const t = TRANSLATIONS[language];

  const { userProgram, semesters, stats, userMarks, currentSemester } =
    useCurriculumData({ user, language });

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <CurriculumHeader t={t} userProgram={userProgram} stats={stats} />

      <CurriculumStats stats={stats} t={t} />

      {/* CURRICULUM SECTIONS */}
      <div className="space-y-12 pb-20">
        {semesters.map(([semesterName, courses]) => (
          <SemesterSection
            key={semesterName}
            semesterName={semesterName}
            courses={courses}
            userMarks={userMarks}
            currentSemester={currentSemester}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
