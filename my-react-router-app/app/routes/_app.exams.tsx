import { useState } from "react";
import { useLoaderData } from "react-router";
import { useLanguage } from "~/store/LanguageContext";
import { prisma } from "~/services/prisma";
// TaskKind is imported from @prisma/client, but we use string literals to avoid client generation issues
const TaskKind = {
  ABGABE: "ABGABE" as any,
  KLAUSUR: "KLAUSUR" as any,
};
import { TRANSLATIONS } from "~/services/translations/exams";

// Components
import { ExamsHeader } from "~/features/exams/ExamsHeader";
import { ExamsList } from "~/features/exams/ExamsList";
import { SickNoteSection } from "~/features/exams/SickNoteSection";
import { RepeatExamsSection } from "~/features/exams/RepeatExamsSection";
import { ScientificWorkSection } from "~/features/exams/ScientificWorkSection";
import { DocumentPreviewModal } from "~/features/exams/DocumentPreviewModal";

export const loader = async () => {
  try {
    const demo = await prisma.user.findUnique({
      where: { email: "student.demo@iu-study.org" },
      select: { id: true },
    });
    const userId = demo?.id;

    if (!userId) return { exams: [] };

    // Fetch unsubmitted exams/tasks
    const tasks = await prisma.studentTask.findMany({
      where: {
        userId,
        type: { in: ["Online-Klausur", "Klausur"] },
        kind: TaskKind.ABGABE, // Open tasks
      },
      orderBy: { dueDate: "asc" },
    });

    return {
      exams: tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        dueDate: task.dueDate.toISOString(),
      })),
    };
  } catch {
    return { exams: [] };
  }
};

export default function ExamsPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const { exams } = useLoaderData<typeof loader>();
  const [isRepeatExamsOpen, setIsRepeatExamsOpen] = useState(true);
  const [isScientificWorkOpen, setIsScientificWorkOpen] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 py-2">
        <ExamsHeader t={t} language={language} />

        <ExamsList exams={exams} language={language} t={t} />

        <SickNoteSection t={t} />

        <RepeatExamsSection
          t={t}
          isOpen={isRepeatExamsOpen}
          setIsOpen={setIsRepeatExamsOpen}
        />

        <ScientificWorkSection
          t={t}
          isOpen={isScientificWorkOpen}
          setIsOpen={setIsScientificWorkOpen}
          setSelectedDocument={setSelectedDocument}
        />

        {selectedDocument && (
          <DocumentPreviewModal
            t={t}
            selectedDocument={selectedDocument}
            onClose={() => setSelectedDocument(null)}
          />
        )}
      </div>
    </div>
  );
}
