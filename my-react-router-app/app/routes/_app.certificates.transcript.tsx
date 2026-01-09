import { useState, useMemo } from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { useLoaderData, Link } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import { TRANSLATIONS } from "~/services/translations/transcript";
import { showSuccessToast, showErrorToast, showInfoToast } from "~/lib/toast";
import { FEEDBACK_TRANSLATIONS } from "~/services/translations/feedback";

// Components
import { TranscriptHeader } from "~/components/certificates/transcript/TranscriptHeader";
import { TranscriptStudentCard } from "~/components/certificates/transcript/TranscriptStudentCard";
import { TranscriptStats } from "~/components/certificates/transcript/TranscriptStats";
import { TranscriptFilter } from "~/components/certificates/transcript/TranscriptFilter";
import { GradesTable } from "~/components/certificates/transcript/GradesTable";
import { GradeScaleInfo } from "~/components/certificates/transcript/GradeScaleInfo";
import { TranscriptDownloadSection } from "~/components/certificates/transcript/TranscriptDownloadSection";
import { EmptyCertificateState } from "~/components/certificates/EmptyCertificateState";

// Services
import { generateTranscriptPDF } from "~/services/pdf/transcript";
import type { TranscriptStudentData, MarkWithTeacher } from "~/types/transcript";

export const loader = async ({ request }: { request: Request }) => {
  try {
    const user = await getUserFromRequest(request);

    if (!user) {
      return { user: null, marks: [] };
    }

    const marks = await prisma.mark.findMany({
      where: { user_id: user.id },
      include: {
        teacher: true,
      },
      orderBy: {
        date: "desc",
      },
    });

  const userWithProgram = await prisma.user.findUnique({
      where: { id: user.id },
      include: { major: { include: { courses: true } } },
    });

    return { user: userWithProgram, marks };
  } catch (error) {
    console.error("Error loading transcript data:", error);
    return { user: null, marks: [] };
  }
};

export default function TranscriptPage() {
  const { language } = useLanguage();
  const { user, marks } = useLoaderData<typeof loader>() as { user: any; marks: any[] };
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const [showPassedOnly, setShowPassedOnly] = useState(false);

  if (!user) {
    return <EmptyCertificateState t={t} />;
  }

  const studentData: TranscriptStudentData = {
    name: user.name || "Student Name",
    studentId: user.matriculation_number || "12345678",
    program: user.study_program || user.major?.name || t.fallbackProgram,
    semester: "5",
    enrollmentDate: user.created_at
      ? new Date(user.created_at).toLocaleDateString(language === "de" ? "de-DE" : "en-US")
      : "01.10.2022",
  };

  const dbCourses = user?.major?.courses ?? [];

  const groupedMarks = useMemo(() => {
    const groups: Record<string, any[]> = {};
    const matchedMarkIds = new Set<number>();

    const findMark = (course: any) =>
      marks.find((m: any) => {
        if (typeof m.course !== "string") return false;
        const keys = [
          course.name,
          course.name_de,
          course.name_en,
          course.code,
        ]
          .filter(Boolean)
          .map((val: string) => val.toLowerCase());
        return keys.includes(m.course.toLowerCase());
      });

    dbCourses.forEach((course: any) => {
      const semLabel = `${course.semester}. ${t.semester}`;
      if (!groups[semLabel]) groups[semLabel] = [];

      const mark = findMark(course);
      if (mark) matchedMarkIds.add(mark.id);

      const passed = mark ? mark.value <= 4.0 : false;
      if (showPassedOnly && !passed) return;

      groups[semLabel].push({
        id: course.id,
        name:
          language === "de"
            ? course.name_de || course.name
            : course.name_en || course.name,
        credits: course.credits ?? 5,
        mark,
      });
    });

    // Add marks that do not match a course (legacy data)
    const unmatched = marks.filter((m: any) => !matchedMarkIds.has(m.id));
    if (unmatched.length) {
      groups[t.otherModules] = groups[t.otherModules] || [];
      unmatched.forEach((m: any) => {
        if (showPassedOnly && m.value > 4.0) return;
        groups[t.otherModules].push({
          id: `mark-${m.id}`,
          name: m.course,
          credits: 5,
          mark: m,
        });
      });
    }

    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [dbCourses, marks, language, t, showPassedOnly]);

  const passedMarks = marks.filter((m) => m.value <= 4.0);

  const stats = useMemo(() => {
    let totalCredits = 0;
    let weightedSum = 0;

    passedMarks.forEach((m) => {
      const course = dbCourses.find((c: any) => {
        const keys = [
          c.name,
          c.name_de,
          c.name_en,
          c.code,
        ]
          .filter(Boolean)
          .map((val: string) => val.toLowerCase());
        return typeof m.course === "string" && keys.includes(m.course.toLowerCase());
      });
      const credits = course?.credits ?? 5;
      totalCredits += credits;
      weightedSum += m.value * credits;
    });

    const gpaVal = totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : "0.00";
    return { totalCredits, gpa: gpaVal, passedCount: passedMarks.length };
  }, [passedMarks, dbCourses]);

  const today = new Date().toLocaleDateString(language === "de" ? "de-DE" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleDownload = (passedOnly: boolean) => {
    const f = FEEDBACK_TRANSLATIONS[language as keyof typeof FEEDBACK_TRANSLATIONS];
    
    try {
      showInfoToast(f.transcriptDownloading);
      const marksToExport = passedOnly ? passedMarks : marks;
      generateTranscriptPDF(
        t,
        studentData,
        marksToExport,
        stats,
        today,
        language,
        passedOnly,
        dbCourses
      );
      
      // Show success after a short delay to let the PDF generate
      setTimeout(() => {
        showSuccessToast(f.transcriptDownloadSuccess);
      }, 500);
    } catch (error) {
      console.error("PDF generation error:", error);
      showErrorToast(f.transcriptDownloadError);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <TranscriptHeader t={t} />


      <TranscriptStudentCard t={t} studentData={studentData} />

      <TranscriptStats t={t} stats={stats} />

      <TranscriptFilter 
        t={t} 
        showPassedOnly={showPassedOnly} 
        onToggle={() => setShowPassedOnly(!showPassedOnly)} 
      />

      <GradesTable 
        t={t} 
        groupedMarks={groupedMarks} 
        language={language} 
      />

      <GradeScaleInfo t={t} />

      <TranscriptDownloadSection 
        t={t} 
        onDownloadPassed={() => handleDownload(true)}
        onDownloadComplete={() => handleDownload(false)}
      />
    </div>
  );
}
