import { useState } from "react";
import { useLoaderData } from "react-router";
import { useLanguage } from "~/contexts/LanguageContext";
import { prisma } from "~/lib/prisma";
import { TaskKind } from "@prisma/client";
import { TRANSLATIONS } from "~/services/translations/exams";

// Components
import { ExamsHeader } from "~/components/exams/ExamsHeader";
import { ExamsList } from "~/components/exams/ExamsList";
import { SickNoteSection } from "~/components/exams/SickNoteSection";
import { RepeatExamsSection } from "~/components/exams/RepeatExamsSection";
import { ScientificWorkSection } from "~/components/exams/ScientificWorkSection";
import { DocumentPreviewModal } from "~/components/exams/DocumentPreviewModal";

export const loader = async () => {
  try {
    const sabin = await prisma.user.findUnique({
      where: { email: "sabin.elanwar@iu-study.org" },
      select: { id: true },
    });
    const userId = sabin?.id;

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
    <div className="min-h-screen bg-transparent p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-12 px-2 sm:px-0">
        <ExamsHeader t={t} />

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
