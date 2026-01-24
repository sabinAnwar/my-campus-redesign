import { useLanguage } from "~/store/LanguageContext";
import { useLoaderData, Link } from "react-router-dom";
import { prisma } from "~/services/prisma";
import { TRANSLATIONS } from "~/services/translations/immatriculation";
import { getUserFromRequest } from "~/services/auth.server";
import type { LoaderFunctionArgs } from "react-router";

// Components
import { ImmatriculationHeader } from "~/features/certificates/immatriculation/ImmatriculationHeader";
import { ImmatriculationStudentCard } from "~/features/certificates/immatriculation/ImmatriculationStudentCard";
import { ImmatriculationPreview } from "~/features/certificates/immatriculation/ImmatriculationPreview";
import { ImmatriculationValidityInfo } from "~/features/certificates/immatriculation/ImmatriculationValidityInfo";
import { EmptyCertificateState } from "~/features/certificates/EmptyCertificateState";
import { DownloadButton } from "~/features/certificates/DownloadButton";

// Services
import { generateImmatriculationPDF } from "~/services/pdf/immatriculation";
import type { ImmatriculationStudentData } from "~/types/immatriculation";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    let user = await getUserFromRequest(request);

    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
        include: { major: true },
      });
    } else {
      user = await prisma.user.findUnique({
        where: { id: user.id },
        include: { major: true },
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
    studentId: user.matriculation_number || "12345678",
    program: user.study_program || user.major?.name || t.fallbackProgram,
    semester: user.semester ? String(user.semester) : "5",
    enrollmentDate: user.created_at
      ? new Date(user.created_at).toLocaleDateString(language === "de" ? "de-DE" : "en-US")
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
  
