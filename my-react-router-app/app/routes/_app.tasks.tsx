import {
  Calendar,
  CheckSquare,
  FileText,
  FileCheck,
  BookOpen,
  Upload,
  ChevronRight,
  Info,
  Clock,
  X,
  Briefcase,
  AlertTriangle,
  UploadCloud,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { type LoaderFunctionArgs } from "@react-router/node";
import { useLoaderData, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { prisma } from "~/lib/prisma";
import { TaskKind } from "@prisma/client";
import { ensureCanonicalTasks } from "~/lib/tasks.server";
import { calculateDaysLeft } from "~/lib/tasksSample";
import { useLanguage } from "~/contexts/LanguageContext";
import { TEXT, WRITING_TYPES } from "~/constants/tasks";
import type {
  TaskLoaderSubmission as LoaderSubmission,
  TaskLoaderData as LoaderData,
  TaskUISubmission as UISubmission,
} from "~/types/tasks";

import { getUserFromRequest } from "~/lib/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
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

    const courseMapDb = new Map(userCourses.map((c) => [c.name, c]));

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
          dbCourse?.code || t.course.substring(0, 3).toUpperCase() + "101",
        professor: "Dozent TBD", // Could be added to Course model later
        type: t.type,
        dueDateIso: dueDate.toISOString().slice(0, 10),
        dueDate: formatGermanDate(dueDate),
        correctionDate: formatGermanDate(correctionDate),
        correctionDateIso: correctionDate.toISOString().slice(0, 10),
      };
    });

    const submissions: LoaderSubmission[] = allData.filter((s: any) =>
      WRITING_TYPES.includes(s.type)
    );
    const exams: any[] = allData
      .filter((s: any) => s.type === "Online-Klausur" || s.type === "Klausur")
      .map((s: any) => ({
        id: s.id,
        title: s.title,
        course: s.course,
        type: s.type,
        date: s.dueDateIso,
        duration: "90 Minuten",
        location:
          s.type === "Online-Klausur" ? "Online (Proctorio)" : "Hörsaal H1",
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

export default function Tasks() {
  const {
    submissions: initialSubmissions,
    exams: initialExams,
    currentSemester,
    studiengangName,
  } = useLoaderData() as {
    submissions: LoaderSubmission[];
    exams: any[];
    currentSemester: number;
    studiengangName: string;
  };
  const { language } = useLanguage();
  const t = TEXT[language];
  const formatDate = (iso: string) =>
    iso
      ? new Date(iso).toLocaleDateString(
          language === "de" ? "de-DE" : "en-US",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }
        )
      : "";

  const titleMap: Record<string, { en: string }> = {
    "Hausarbeit: Customer Journey im Omnichannel Commerce": {
      en: "Term Paper: Customer Journey in Omnichannel Commerce",
    },
    "Projektarbeit: Commerce Plattform Redesign": {
      en: "Project Work: Commerce Platform Redesign",
    },
    "Online-Klausur: E-Commerce Grundlagen": {
      en: "Online Exam: E-Commerce Foundations",
    },
    "Klausur: Wirtschaftsinformatik II": {
      en: "Exam: Business Informatics II",
    },
  };

  const courseMap: Record<string, { en: string }> = {
    "E-Commerce": { en: "E-Commerce" },
    "Commerce Engineering": { en: "Commerce Engineering" },
    Wirtschaftsinformatik: { en: "Business Informatics" },
  };

  const typeMap: Record<string, { en: string }> = {
    Hausarbeit: { en: "Term Paper" },
    Projektarbeit: { en: "Project Work" },
    Klausur: { en: "Exam" },
    "Online-Klausur": { en: "Online Exam" },
    Seminararbeit: { en: "Seminar Paper" },
    Bachelorarbeit: { en: "Bachelor Thesis" },
    Masterarbeit: { en: "Master Thesis" },
    Projektbericht: { en: "Project Report" },
    Workbook: { en: "Workbook" },
    Fallstudie: { en: "Case Study" },
    Portfolio: { en: "Portfolio" },
    Fachpräsentation: { en: "Technical Presentation" },
    "Wissenschaftliche Arbeit": { en: "Academic Paper" },
  };

  const translate = (value: string, map: Record<string, { en: string }>) => {
    if (language === "de") return value;
    if (map[value]) return map[value].en;

    // Handle dynamic titles like "Klausur: Course Name"
    if (value.includes(": ")) {
      const [prefix, ...rest] = value.split(": ");
      const suffix = rest.join(": ");
      const translatedPrefix =
        prefix === "Klausur"
          ? "Exam"
          : prefix === "Hausarbeit"
            ? "Term Paper"
            : prefix === "Projektarbeit"
              ? "Project Work"
              : prefix === "Fallstudie"
                ? "Case Study"
                : prefix === "Online-Klausur"
                  ? "Online Exam"
                  : prefix;
      return `${translatedPrefix}: ${suffix}`;
    }

    return value;
  };

  const loadSavedStatus = () => {
    if (typeof window === "undefined")
      return {} as Record<
        number,
        { status: "pending" | "submitted"; similarity?: number }
      >;
    try {
      return JSON.parse(
        localStorage.getItem("submissionStatus") || "{}"
      ) as Record<
        number,
        { status: "pending" | "submitted"; similarity?: number }
      >;
    } catch {
      return {};
    }
  };

  const persistStatus = (
    next: Record<
      number,
      { status: "pending" | "submitted"; similarity?: number }
    >
  ) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("submissionStatus", JSON.stringify(next));
  };

  const saved = loadSavedStatus();
  // Submissions from database (with extra UI fields)
  const [submissions, setSubmissions] = useState<UISubmission[]>(
    initialSubmissions.map((s) => ({
      ...s,
      status: saved[s.id]?.status ?? "pending",
      similarity: saved[s.id]?.similarity,
      daysUntilDue: calculateDaysLeft(s.dueDateIso || s.dueDate),
    }))
  );

  // UI state for modal/upload handling
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<LoaderSubmission | null>(null);
  const [accepted, setAccepted] = useState<{
    honor: boolean;
    privacy: boolean;
  }>({
    honor: false,
    privacy: false,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [examsList] = useState<any[]>(initialExams);

  const examsDisplay = examsList.map((exam) => ({
    ...exam,
    title: translate(exam.title, titleMap),
    course: translate(exam.course, courseMap),
    type: translate(exam.type, typeMap),
    duration: translate(exam.duration, { "90 Minuten": { en: "90 minutes" } }),
    location: translate(exam.location, {
      "Online (Proctorio)": { en: "Online (Proctorio)" },
    }),
    date: formatDate(exam.date),
  }));

  const openModal = (
    submission: React.SetStateAction<LoaderSubmission | null>
  ) => {
    setSelectedSubmission(submission);
    setShowModal(true);
    setAccepted({ honor: false, privacy: false });
    setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setUploadedFile(file);
  };

  const handleSubmit = async () => {
    if (!accepted.honor || !accepted.privacy) {
      alert(t.alertAccept);
      return;
    }
    if (!uploadedFile) {
      alert(t.alertUpload);
      return;
    }

    if (!selectedSubmission) {
      alert(t.alertSelect);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("taskId", selectedSubmission.id.toString());
      formData.append("fileName", uploadedFile.name);
      formData.append("courseName", selectedSubmission.course);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      // Update local status as well for immediate feedback
      setSubmissions((prev) => {
        const next = prev.map((s) =>
          s.id === selectedSubmission.id
            ? {
                ...s,
                status: "submitted" as const,
                similarity: Math.floor(Math.random() * 10 + 5),
              }
            : s
        );

        const persisted: Record<
          number,
          { status: "pending" | "submitted"; similarity?: number }
        > = {};
        next.forEach((s) => {
          if (s.status === "submitted") {
            persisted[s.id] = { status: s.status, similarity: s.similarity };
          }
        });
        persistStatus(persisted);
        return next;
      });

      setShowModal(false);
      alert(t.toastSuccess);
    } catch (error) {
      console.error("Upload error:", error);
      alert(language === "de" ? "Fehler beim Upload" : "Upload failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <Upload size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-4 py-1.5 rounded-full bg-iu-orange/10 border border-iu-orange/20 text-iu-orange text-[10px] font-black uppercase tracking-widest">
                {studiengangName}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-iu-blue/10 border border-iu-blue/20 text-iu-blue text-[10px] font-black uppercase tracking-widest">
                {language === "de"
                  ? `${currentSemester}. Semester`
                  : `Semester ${currentSemester}`}
              </span>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>
          </div>

          <div className="bg-card/50 backdrop-blur-xl border border-border px-6 py-4 rounded-3xl flex items-center gap-4 shadow-xl">
            <div className="p-2 bg-iu-blue/20 rounded-xl">
              <Calendar className="h-6 w-6 text-iu-blue" />
            </div>
            <span className="text-sm font-bold text-foreground uppercase tracking-widest">
              {new Date().toLocaleDateString(
                language === "de" ? "de-DE" : "en-US",
                { day: "2-digit", month: "long", year: "numeric" }
              )}
            </span>
          </div>
        </div>
      </header>

      <div className="space-y-6 mb-20">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-iu-orange rounded-full" />
          <h2 className="text-xl font-black text-foreground">
            {t.submissionsHeader}
          </h2>
        </div>
        {submissions.map((item) => (
          <div
            key={item.id}
            className="group bg-card/60 border border-border rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-iu-orange/30 hover:bg-card transition-all shadow-xl"
          >
            <div className="flex items-start gap-6">
              <div className="mt-1 p-3.5 rounded-2xl bg-iu-orange/10 border border-iu-orange/20 text-iu-orange shadow-lg">
                <Clock className="h-7 w-7" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-foreground truncate group-hover:text-iu-orange transition-colors">
                    {translate(item.title, titleMap)}
                  </h3>
                  <Info className="h-5 w-5 text-iu-orange/40 cursor-pointer hover:text-iu-orange transition-colors" />
                </div>
                <div className="flex flex-wrap items-center gap-6">
                  <span className="px-5 py-2 rounded-full bg-iu-orange/10 border border-iu-orange/20 text-iu-orange text-xs font-bold uppercase tracking-widest">
                    {item.status === "pending"
                      ? language === "de"
                        ? "In Bearbeitung"
                        : "In Progress"
                      : language === "de"
                        ? "Eingereicht"
                        : "Submitted"}
                  </span>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
                    <Calendar className="h-4.5 w-4.5 text-iu-orange/60" />
                    <span>{formatDate(item.dueDateIso)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm font-semibold">
                    <BookOpen className="h-4.5 w-4.5 text-iu-orange/60" />
                    <span>{item.professor || "Prüfungsamt"}</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => openModal(item)}
              className="bg-foreground text-background px-10 py-4 rounded-2xl font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-3 group/btn shadow-xl active:scale-95 whitespace-nowrap"
            >
              {t.manageSubmission}
              <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        ))}
      </div>

      {/* Exams Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-1 bg-iu-blue rounded-full" />
          <h2 className="text-xl font-black text-foreground">
            {t.examsHeader}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examsDisplay.map((exam) => (
            <div
              key={exam.id}
              className="group bg-card/60 border border-border rounded-[2.5rem] p-8 hover:border-iu-blue/30 hover:bg-card transition-all shadow-xl flex flex-col justify-between gap-6"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-2xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20 shadow-lg">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <span className="px-4 py-1.5 rounded-full bg-iu-blue/10 border border-iu-blue/20 text-iu-blue text-[10px] font-black uppercase tracking-widest">
                    {translate(exam.type, typeMap)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-6 group-hover:text-iu-blue transition-colors truncate">
                  {translate(exam.title, titleMap)}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-semibold">
                    <Calendar className="h-5 w-5 text-iu-blue/60" />
                    <span>{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-semibold">
                    <Clock className="h-5 w-5 text-iu-blue/60" />
                    <span>{exam.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground text-sm font-semibold">
                    <MapPin className="h-5 w-5 text-iu-blue/60" />
                    <span>{exam.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <span
                  className={`text-sm font-black uppercase tracking-widest ${
                    exam.daysUntilExam <= 3
                      ? "text-iu-red"
                      : "text-muted-foreground"
                  }`}
                >
                  {t.daysUntilExam(exam.daysUntilExam)}
                </span>
                <button className="bg-iu-blue/10 text-iu-blue px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-iu-blue hover:text-white transition-all flex items-center gap-2 uppercase tracking-widest">
                  Details <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Modal: Upload */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-card rounded-[2.5rem] shadow-3xl p-10 w-full max-w-xl relative animate-in fade-in zoom-in-95 duration-300 border border-border">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-iu-blue flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-iu-blue/20">
                  IU
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {t.modalTitle}
                  </h2>
                  <p className="text-muted-foreground font-medium">
                    {t.modalSubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-3 rounded-xl hover:bg-muted text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-5 mb-8">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={accepted.honor}
                    onChange={(e) =>
                      setAccepted((v) => ({ ...v, honor: e.target.checked }))
                    }
                    className="w-5 h-5 rounded-lg border-border bg-muted text-iu-blue focus:ring-iu-blue transition-all"
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">
                  {t.honor}
                </span>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative flex items-center mt-1">
                  <input
                    type="checkbox"
                    checked={accepted.privacy}
                    onChange={(e) =>
                      setAccepted((v) => ({ ...v, privacy: e.target.checked }))
                    }
                    className="w-5 h-5 rounded-lg border-border bg-muted text-iu-blue focus:ring-iu-blue transition-all"
                  />
                </div>
                <span className="text-sm text-muted-foreground font-medium leading-relaxed group-hover:text-foreground transition-colors">
                  {t.privacy}
                </span>
              </label>
            </div>

            <div
              className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300 ${
                uploadedFile
                  ? "border-iu-blue bg-iu-blue/5 shadow-inner"
                  : "border-border hover:border-iu-blue/30 hover:bg-muted/50"
              }`}
            >
              {!uploadedFile ? (
                <div className="flex flex-col items-center">
                  <div className="p-4 rounded-2xl bg-iu-blue/10 text-iu-blue mb-4">
                    <Upload className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-bold text-foreground mb-2">
                    {t.dropHere}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6 font-medium">
                    {t.orDrag}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer bg-iu-blue text-white px-8 py-3 rounded-xl font-bold shadow-xl shadow-iu-blue/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    {t.chooseFile}
                  </label>
                </div>
              ) : (
                <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-2">
                  <div className="p-4 rounded-2xl bg-iu-blue/10 text-iu-blue dark:text-iu-blue mb-4 shadow-lg">
                    <FileCheck className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-bold text-foreground mb-1">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium mb-6">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <div className="w-full bg-black rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-iu-blue w-full animate-progress" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-10">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-6 py-4 rounded-2xl font-bold bg-muted text-foreground border border-border hover:bg-muted/80 transition-all"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!accepted.honor || !accepted.privacy || !uploadedFile}
                className="flex-[2] px-6 py-4 rounded-2xl font-bold bg-foreground text-background hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                {t.upload}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
