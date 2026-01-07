import { useLanguage } from "~/contexts/LanguageContext";
import { useLoaderData, Link } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { TRANSLATIONS } from "~/services/translations/immatriculation";
import { getUserFromRequest } from "~/lib/auth.server";
import type { LoaderFunctionArgs } from "react-router";

// Components
import { ImmatriculationHeader } from "~/components/certificates/immatriculation/ImmatriculationHeader";
import { ImmatriculationStudentCard } from "~/components/certificates/immatriculation/ImmatriculationStudentCard";
import { ImmatriculationPreview } from "~/components/certificates/immatriculation/ImmatriculationPreview";
import { ImmatriculationValidityInfo } from "~/components/certificates/immatriculation/ImmatriculationValidityInfo";
import { EmptyCertificateState } from "~/components/certificates/EmptyCertificateState";
import { DownloadButton } from "~/components/certificates/DownloadButton";

// Services
import { generateImmatriculationPDF } from "~/services/pdf/immatriculation";
import type { ImmatriculationStudentData } from "~/types/immatriculation";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    let user = await getUserFromRequest(request);

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
        include: { studiengang: true },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: { studiengang: true },
      });
    }

    if (!user) return { user: null };
    return { user };
  } catch (error) {
    console.error("Error loading user:", error);
    return { user: null };
  }
};

export default function ImmatriculationCertificatePage() {
  const { language } = useLanguage();
  const { user } = useLoaderData<typeof loader>();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  if (!user) {
    return <EmptyCertificateState t={t} />;
  }

  const studentData: ImmatriculationStudentData = {
    name: user.name || "Student Name",
    studentId: user.matriculationNumber || "12345678",
    program: user.studyProgram || user.studiengang?.name || t.fallbackProgram,
    semester: "5",
    enrollmentDate: user.createdAt
      ? new Date(user.createdAt).toLocaleDateString(language === "de" ? "de-DE" : "en-US")
      : "01.10.2022",
    status: t.statusActive,
  };

  const today = new Date().toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownload = () => {
    generateImmatriculationPDF(t, studentData, today);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <ImmatriculationHeader t={t} />


      <ImmatriculationStudentCard t={t} studentData={studentData} />

      <ImmatriculationPreview t={t} studentData={studentData} today={today} />

      <ImmatriculationValidityInfo t={t} />

      <DownloadButton onClick={handleDownload} label={t.downloadPdf} />
    </div>
  );
}
  
