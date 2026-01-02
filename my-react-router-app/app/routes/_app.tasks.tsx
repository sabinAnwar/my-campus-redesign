import type { Route } from ".react-router/types/app/routes/+types/_app.tasks";
import { useLoaderData } from "react-router";

import { prisma } from "~/lib/prisma";
import { ensureCanonicalTasks } from "~/lib/tasks.server";
import { calculateDaysLeft } from "~/lib/tasksSample";
import { getUserFromRequest } from "~/lib/auth.server";
import { useLanguage } from "~/contexts/LanguageContext";
import { WRITING_TYPES } from "~/constants/tasks";
import { TRANSLATIONS } from "~/services/translations/tasks";
import { useTasks } from "~/hooks/useTasks";
import {
  TasksHeader,
  SubmissionCard,
  ExamCard,
  UploadModal,
  SectionHeader,
} from "~/components/tasks";

import type { TaskLoaderSubmission } from "~/types/tasks";

// ============================================================================
// LOADER
// ============================================================================

export const loader = async ({ request }: Route.LoaderArgs) => {
  try {
    const formatGermanDate = (date: Date) =>
      date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

    // 1. Try to get user from session
    const user = await getUserFromRequest(request);
    let userId = user?.id;
    let currentSemester = user?.semester || 1;
    let studiengangName = user?.studiengang?.name || "IU Studium";

    // 2. Fallback to Sabin if no session (Dev/Fallback)
    if (!userId) {
      const sabin = await prisma.user.findUnique({
        where: { email: "sabin.elanwar@iu-study.org" },
        include: { studiengang: true },
      });
      userId = sabin?.id;
      currentSemester = sabin?.semester || 1;
      studiengangName = sabin?.studiengang?.name || "IU Studium";
    }

    if (userId) {
      await ensureCanonicalTasks(userId);
    }

    const [rows, userCourses] = await Promise.all([
      prisma.studentTask.findMany({
        where: { userId: userId },
        orderBy: { dueDate: "asc" },
      }),
      prisma.course.findMany({
        where: {
          studiengang: {
            users: { some: { id: userId } },
          },
        },
      }),
    ]);

    const courseMapDb = new Map<string, { code: string; name: string }>(
      userCourses.map((c: any) => [c.name, c])
    );

    const allData = rows.map((t: any) => {
      const dbCourse = courseMapDb.get(t.course);
      const dueDate = new Date(t.dueDate);
      const correctionDate = new Date(dueDate);
      correctionDate.setDate(dueDate.getDate() + 14);

      return {
        id: t.id,
        title: t.title,
        course: t.course,
        courseCode:
          dbCourse?.code ?? t.course.substring(0, 3).toUpperCase() + "101",
        professor: "Dozent TBD", // Could be added to Course model later
        type: t.type,
        dueDateIso: dueDate.toISOString().slice(0, 10),
        dueDate: formatGermanDate(dueDate),
        correctionDate: formatGermanDate(correctionDate),
        correctionDateIso: correctionDate.toISOString().slice(0, 10),
      };
    });

    const submissions: TaskLoaderSubmission[] = allData.filter((s: any) =>
      WRITING_TYPES.includes(s.type)
    );
    const exams = allData
      .filter((s: any) => s.type === "Online-Klausur" || s.type === "Klausur")
      .map((s: any) => ({
        id: s.id,
        title: s.title,
        course: s.course,
        type: s.type,
        date: s.dueDateIso,
        daysUntilExam: calculateDaysLeft(s.dueDateIso),
      }));

    return { submissions, exams, currentSemester, studiengangName };
  } catch (error) {
    console.error("Loader error:", error);
    return {
      submissions: [],
      exams: [],
      currentSemester: 1,
      studiengangName: "IU Studium",
    };
  }
};

// ============================================================================
// COMPONENT
// ============================================================================

export default function Tasks() {
  const {
    submissions: initialSubmissions,
    exams: initialExams,
    currentSemester,
    studiengangName,
  } = useLoaderData<typeof loader>();

  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const {
    submissions,
    examsDisplay,
    showModal,
    accepted,
    uploadedFile,
    openModal,
    closeModal,
    handleFileChange,
    handleAcceptChange,
    handleSubmit,
  } = useTasks({
    initialSubmissions,
    initialExams,
    language,
    translations: t,
  });

  return (
    <div className="max-w-7xl mx-auto">
      <TasksHeader title={t.title} subtitle={t.subtitle} language={language} />

      {/* Submissions Section */}
      <div className="space-y-6 mb-20">
        <SectionHeader title={t.submissionsHeader} color="orange" />
        {submissions.map((item) => (
          <SubmissionCard
            key={item.id}
            submission={item}
            language={language}
            translations={t}
            onManage={() => openModal(item)}
          />
        ))}
      </div>

      {/* Exams Section */}
      <div className="space-y-6">
        <SectionHeader title={t.examsHeader} color="blue" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examsDisplay.map((exam) => (
            <ExamCard key={exam.id} exam={exam} translations={t} />
          ))}
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showModal}
        accepted={accepted}
        uploadedFile={uploadedFile}
        translations={t}
        onClose={closeModal}
        onAcceptChange={handleAcceptChange}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
