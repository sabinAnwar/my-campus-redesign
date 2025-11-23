import React, { useState } from "react";
import {
  Calendar,
  CheckSquare,
  FileText,
  BookOpen,
  Upload,
} from "lucide-react";
import { TaskKind } from "@prisma/client";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { calculateDaysLeft } from "~/lib/tasksSample";

type LoaderSubmission = {
  id: number;
  title: string;
  course: string;
  courseCode?: string;
  professor?: string;
  type: string;
  dueDateIso: string;
  dueDate: string;
  correctionDate: string;
};

type LoaderData = {
  submissions: LoaderSubmission[];
};

type UISubmission = LoaderSubmission & {
  status: "pending" | "submitted";
  daysUntilDue: number;
  similarity?: number;
};

const courseMeta: Record<
  string,
  { courseCode?: string; professor?: string }
> = {
  "E-Commerce": { courseCode: "ECOM301", professor: "Prof. Dr. Wagner" },
  "Commerce Engineering": { courseCode: "COMM410", professor: "Prof. Dr. Lehmann" },
};

export const loader = async () => {
  try {
    const formatGermanDate = (date: Date) =>
      date.toLocaleDateString("de-DE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

    const writingTypes = [
      "Hausarbeit",
      "Seminararbeit",
      "Bachelorarbeit",
      "Masterarbeit",
      "Projektbericht",
      "Projektarbeit",
    ];

    const canonicalTasks = [
      {
        title: "Hausarbeit: Customer Journey im Omnichannel Commerce",
        course: "E-Commerce",
        kind: TaskKind.ABGABE,
        type: "Hausarbeit",
        dueDate: new Date("2025-12-05"),
      },
      {
        title: "Projektarbeit: Commerce Plattform Redesign",
        course: "Commerce Engineering",
        kind: TaskKind.ABGABE,
        type: "Projektarbeit",
        dueDate: new Date("2025-12-20"),
      },
    ];

    // Ensure canonical tasks exist with up-to-date dates
    await Promise.all(
      canonicalTasks.map(async (task) => {
        const existing = await prisma.studentTask.findFirst({
          where: {
            title: task.title,
            course: task.course,
            type: task.type,
          },
        });

        if (existing) {
          await prisma.studentTask.update({
            where: { id: existing.id },
            data: { dueDate: task.dueDate, kind: task.kind },
          });
        } else {
          await prisma.studentTask.create({ data: task });
        }
      })
    );

    const allowedTitles = canonicalTasks.map((t) => t.title);
    const allowedCourses = Object.keys(courseMeta);

    const rows = await prisma.studentTask.findMany({
      where: {
        kind: TaskKind.ABGABE,
        type: { in: writingTypes },
        course: { in: allowedCourses },
        title: { in: allowedTitles },
      },
      orderBy: { dueDate: "asc" },
    });
    const submissions: LoaderSubmission[] = rows.map((t: { id: any; title: any; course: string; type: any; dueDate: { toISOString: () => string | any[]; }; }) => {
      const meta = courseMeta[t.course] ?? {};
      const dueDate = new Date(t.dueDate);
      const correctionDate = new Date(dueDate);
      correctionDate.setDate(dueDate.getDate() + 14); // give realistic correction window
      return {
        id: t.id,
        title: t.title,
        course: t.course,
        courseCode: meta.courseCode,
        professor: meta.professor,
        type: t.type,
        dueDateIso: dueDate.toISOString().slice(0, 10),
        dueDate: formatGermanDate(dueDate),
        correctionDate: formatGermanDate(correctionDate),
      };
    });
    return { submissions };
  } catch {
    return { submissions: [] };
  }
};

export default function Tasks() {
  const { submissions: initialSubmissions } = useLoaderData() as LoaderData;

  const loadSavedStatus = () => {
    if (typeof window === "undefined") return {} as Record<number, { status: "pending" | "submitted"; similarity?: number }>;
    try {
      return JSON.parse(localStorage.getItem("submissionStatus") || "{}") as Record<
        number,
        { status: "pending" | "submitted"; similarity?: number }
      >;
    } catch {
      return {};
    }
  };

  const persistStatus = (next: Record<number, { status: "pending" | "submitted"; similarity?: number }>) => {
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
  const [selectedSubmission, setSelectedSubmission] = useState<LoaderSubmission | null>(null);
  const [accepted, setAccepted] = useState<{ honor: boolean; privacy: boolean }>({
    honor: false,
    privacy: false,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const exams = [
    {
      id: 1,
      title: "Klausur: Wirtschaftsinformatik II",
      course: "Wirtschaftsinformatik",
      type: "Klausur",
      date: "2025-11-19",
      duration: "90 Minuten",
      location: "Online (Proctorio)",
      daysUntilExam: calculateDaysLeft("2025-11-19"),
    },
  ];

  const openModal = (submission: React.SetStateAction<LoaderSubmission | null>) => {
    setSelectedSubmission(submission);
    setShowModal(true);
    setAccepted({ honor: false, privacy: false });
    setUploadedFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setUploadedFile(file);
  };

  const handleSubmit = () => {
    if (!accepted.honor || !accepted.privacy) {
      alert(
        "Bitte akzeptiere die Eidesstattliche Erklärung und den Datenschutz."
      );
      return;
    }
    if (!uploadedFile) {
      alert("Bitte lade deine Datei hoch, bevor du fortfährst.");
      return;
    }

    // Ensure a submission is selected before accessing it
    if (!selectedSubmission) {
      alert("Keine Abgabe ausgewählt.");
      return;
    }

    // Update status
    setSubmissions((prev) => {
      const next = prev.map((s) =>
        s.id === selectedSubmission.id
          ? {
              ...s,
              status: "submitted",
              similarity: Math.floor(Math.random() * 10 + 5),
            }
          : s
      );

      const persisted: Record<number, { status: "pending" | "submitted"; similarity?: number }> = {};
      next.forEach((s) => {
        if (s.status === "submitted") {
          persisted[s.id] = { status: s.status, similarity: s.similarity };
        }
      });
      persistStatus(persisted);
      return next;
    });
    setShowModal(false);
    alert("Deine Abgabe wurde erfolgreich in Turnitin hochgeladen!");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10 border-b border-neutral-300 dark:border-neutral-800 pb-6">
          <div className="flex items-baseline justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400">
                Campus Bulletin
              </p>
              <h1 className="mt-3 text-4xl font-black leading-tight text-neutral-900 dark:text-white">
                Wissenschaftliche Arbeiten & Klausurfristen
              </h1>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 max-w-3xl">
                Verwalte deine Abgaben, lade Dateien hoch und behalte Fristen im Blick –
                gestaltet wie eine sachliche Nachrichtenübersicht in hell und dunkel.
              </p>
            </div>
            <span className="hidden md:block text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
              Ausgabe | Today
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-8 gap-8">
          {/* Submissions */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <FileText className="h-5 w-5 text-neutral-800 dark:text-neutral-100" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  Wissenschaftliche Arbeiten (Turnitin)
                </h2>
              </div>

              <div className="space-y-5">
                {submissions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 bg-white dark:bg-neutral-950/40 hover:-translate-y-0.5 transition-transform"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-1">
                          {item.course}
                          {item.courseCode ? ` · ${item.courseCode}` : ""}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 text-[11px] font-semibold">
                            {item.type}
                          </span>
                          {item.professor && (
                            <span className="text-[11px] text-neutral-600 dark:text-neutral-300">
                              {item.professor}
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span
                          className={`px-2 py-1 rounded-sm text-xs font-semibold ${
                            item.status === "submitted"
                          ? "bg-neutral-900 text-white border border-neutral-900"
                          : "bg-neutral-100 text-neutral-800 border border-neutral-300 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700"
                          }`}
                        >
                          {item.status === "submitted"
                            ? "Abgegeben"
                            : "Ausstehend"}
                        </span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mt-3 border-t border-neutral-200 dark:border-neutral-800 pt-3">
                      <div>
                        <Calendar className="h-4 w-4 text-neutral-600 dark:text-neutral-300 inline mr-2" />
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Abgabefrist:
                        </span>
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                          {item.dueDate}
                        </p>
                      </div>
                      <div>
                        <CheckSquare className="h-4 w-4 text-neutral-600 dark:text-neutral-300 inline mr-2" />
                        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                          Korrektur:
                        </span>
                        <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                          {item.correctionDate}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                      <span
                        className={`px-2 py-1 rounded-sm border ${
                          item.daysUntilDue > 5
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100 dark:border-emerald-800"
                            : item.daysUntilDue > 0
                            ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-100 dark:border-amber-800"
                            : "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-100 dark:border-rose-800"
                        }`}
                      >
                        ⏳ {item.daysUntilDue > 0 ? `${item.daysUntilDue} Tage` : "Überfällig"}
                      </span>
                      <span className="px-2 py-1 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700">
                        📁 {item.course}
                      </span>
                    </div>

                    {item.status === "pending" && (
                      <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                        {item.daysUntilDue > 0 ? (
                          <button
                            onClick={() => openModal(item)}
                            className="w-full py-2 text-sm font-semibold bg-neutral-900 text-white rounded-md hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
                          >
                            Abgabe verwalten
                          </button>
                        ) : (
                          <button
                            disabled
                            className="w-full py-2 text-sm font-semibold bg-neutral-400 dark:bg-neutral-700 text-white rounded-md cursor-not-allowed"
                          >
                            Frist verpasst – keine Abgabe möglich
                          </button>
                        )}
                      </div>
                    )}

                    {item.status === "submitted" && (
                      <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                        <span className="text-xs text-neutral-600 dark:text-neutral-300 font-semibold">
                          Turnitin Ähnlichkeit:
                        </span>
                      <span className="px-2 py-1 rounded-sm text-xs font-bold bg-neutral-900 text-white border border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-200">
                          {item.similarity}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                  <BookOpen className="h-5 w-5 text-neutral-800 dark:text-neutral-100" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  Klausurfristen
                </h2>
              </div>
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 bg-white dark:bg-neutral-950/40"
                  >
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-1">
                      {exam.course} – {exam.duration}
                    </p>
                    <p className="text-sm font-bold text-neutral-900 dark:text-neutral-50">
                      {exam.date}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700">
                        🗺️ {exam.location}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-sm text-[11px] font-semibold border ${
                        exam.daysUntilExam > 0
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700"
                          : "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
                      }`}>
                        ⏳ {exam.daysUntilExam > 0 ? `${exam.daysUntilExam} Tage` : "Heute / vorbei"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 🔹 Modal: Upload */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 font-black shadow-sm">
                  T
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
                    Turnitin Abgabe verwalten
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300">
                    Reiche deine wissenschaftliche Arbeit sicher über Turnitin ein.
                  </p>
                </div>
              </div>

              {/* Eidesstattliche Erklärung + Datenschutz */}
              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted.honor}
                    onChange={(e) =>
                      setAccepted((prev) => ({
                        ...prev,
                        honor: e.target.checked,
                      }))
                    }
                    className="mt-1 accent-neutral-900 dark:accent-white"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">
                    Ich bestätige die{" "}
                    <strong className="text-neutral-900 dark:text-neutral-100">
                      Eidesstattliche Erklärung
                    </strong>{" "}
                    zur eigenständigen Erstellung meiner Arbeit.
                  </span>
                </label>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted.privacy}
                    onChange={(e) =>
                      setAccepted((prev) => ({
                        ...prev,
                        privacy: e.target.checked,
                      }))
                    }
                    className="mt-1 accent-neutral-900 dark:accent-white"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-200">
                    Ich akzeptiere die{" "}
                    <strong className="text-neutral-900 dark:text-neutral-100">
                      Datenschutzbestimmungen
                    </strong>{" "}
                    für den Upload in Turnitin.
                  </span>
                </label>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  uploadedFile
                    ? "border-neutral-600 bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800/40"
                    : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-500 dark:hover:border-neutral-500 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40"
                }`}
              >
                {!uploadedFile && (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-10 w-10 text-neutral-700 dark:text-neutral-200" />
                      <p className="text-sm text-neutral-700 dark:text-neutral-200">
                        Datei hier ablegen oder klicken, um hochzuladen
                      </p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer inline-block mt-4 bg-neutral-900 text-white text-sm px-4 py-2 rounded-md font-semibold shadow-sm hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 transition-colors"
                    >
                      Datei auswählen
                    </label>
                  </>
                )}

                {/* Uploaded File Preview */}
                {uploadedFile && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-lg shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-neutral-900 dark:text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <div className="text-left">
                          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-neutral-300">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Progress Bar */}
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-2 mt-4 overflow-hidden">
                      <div
                        className="h-2 bg-neutral-900 dark:bg-white animate-progress"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-700 dark:text-neutral-200 mt-2 animate-fadeIn">
                      ✅ Upload abgeschlossen – Datei wurde erfolgreich übertragen.
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!accepted.honor || !accepted.privacy}
                  className={`px-4 py-2 rounded-md text-sm font-semibold shadow text-white transition-all ${
                    accepted.honor && accepted.privacy
                      ? "bg-neutral-900 hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                      : "bg-neutral-400 dark:bg-neutral-700 cursor-not-allowed"
                  }`}
                >
                  Hochladen & Bestätigen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

        
