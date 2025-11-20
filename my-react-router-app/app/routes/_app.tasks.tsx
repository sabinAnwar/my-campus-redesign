import React, { useState } from "react";
import {
  Calendar,
  CheckSquare,
  FileText,
  BookOpen,
  Upload,
} from "lucide-react";
import { useLoaderData } from "react-router-dom";
import { prisma } from "~/lib/prisma";
import { calculateDaysLeft } from "~/lib/tasksSample";

type LoaderSubmission = {
  id: number;
  title: string;
  course: string;
  type: string;
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

export const loader = async () => {
  try {
    const rows = await prisma.studentTask.findMany({
      orderBy: { dueDate: "asc" },
    });
    const submissions: LoaderSubmission[] = rows.map((t: { id: any; title: any; course: any; type: any; dueDate: { toISOString: () => string | any[]; }; }) => ({
      id: t.id,
      title: t.title,
      course: t.course,
      type: t.type,
      dueDate: t.dueDate.toISOString().slice(0, 10),
      correctionDate: t.dueDate.toISOString().slice(0, 10),
    }));
    return { submissions };
  } catch {
    return { submissions: [] };
  }
};

export default function Tasks() {
  const { submissions: initialSubmissions } = useLoaderData() as LoaderData;
  // Submissions from database (with extra UI fields)
  const [submissions, setSubmissions] = useState<UISubmission[]>(
    initialSubmissions.map((s) => ({
      ...s,
      status: "pending",
      daysUntilDue: calculateDaysLeft(s.dueDate),
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
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSubmission.id
          ? {
              ...s,
              status: "submitted",
              similarity: Math.floor(Math.random() * 10 + 5),
            }
          : s
      )
    );
    setShowModal(false);
    alert("Deine Abgabe wurde erfolgreich in Turnitin hochgeladen!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/20 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
            Wissenschaftliche Arbeiten & Klausurfristen
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Verwalte deine Abgaben, lade Dateien hoch und behalte Fristen im
            Blick
          </p>
        </header>

        <div className="grid lg:grid-cols-8 gap-8">
          {/* Submissions */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg shadow-cyan-100/60 dark:shadow-cyan-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100 dark:from-cyan-900/50 dark:via-blue-900/40 dark:to-indigo-900/40 border border-cyan-200 dark:border-cyan-800 shadow-inner">
                  <FileText className="h-5 w-5 text-cyan-700 dark:text-cyan-200" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  Wissenschaftliche Arbeiten (Turnitin)
                </h2>
              </div>

              <div className="space-y-5">
                {submissions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-gradient-to-br from-white via-cyan-50 to-emerald-50 dark:from-slate-900 dark:via-cyan-950/40 dark:to-emerald-950/30 hover:shadow-xl transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">
                          {item.course}
                        </p>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm">
                          {item.type}
                        </span>
                      </div>

                      <div>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                            item.status === "submitted"
                          ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 border-green-300 dark:border-green-800 shadow-sm shadow-green-200/60 dark:shadow-green-900/30"
                          : "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-sm shadow-amber-200/60 dark:shadow-amber-900/30"
                          }`}
                        >
                          {item.status === "submitted"
                            ? "Abgegeben"
                            : "Ausstehend"}
                        </span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mt-3 border-t border-slate-200 dark:border-slate-700 pt-3">
                      <div>
                        <Calendar className="h-4 w-4 text-slate-600 dark:text-slate-300 inline mr-2" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Abgabefrist:
                        </span>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-1">
                          {item.dueDate}
                        </p>
                      </div>
                      <div>
                        <CheckSquare className="h-4 w-4 text-slate-600 dark:text-slate-300 inline mr-2" />
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Korrektur:
                        </span>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-1">
                          {item.correctionDate}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs font-semibold">
                      <span className="px-2 py-1 rounded-full bg-emerald-100/70 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 shadow-sm">
                        ⏳ {item.daysUntilDue >= 0 ? `${item.daysUntilDue} Tage` : "Überfällig"}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-indigo-100/70 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 shadow-sm">
                        📁 {item.course}
                      </span>
                    </div>

                    {item.status === "pending" && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => openModal(item)}
                          className="w-full py-2 text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-emerald-600 dark:to-emerald-500 text-white rounded-lg hover:from-slate-800 hover:to-slate-600 dark:hover:from-emerald-500 dark:hover:to-emerald-400 transition-all"
                        >
                          Abgabe verwalten
                        </button>
                      </div>
                    )}

                    {item.status === "submitted" && (
                      <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
                          Turnitin Ähnlichkeit:
                        </span>
                      <span className="px-2 py-1 rounded-md text-xs font-bold bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-800">
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
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg shadow-amber-100/60 dark:shadow-amber-900/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
                  <BookOpen className="h-5 w-5 text-amber-700 dark:text-amber-200" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  Klausurfristen
                </h2>
              </div>
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-gradient-to-br from-slate-50 via-amber-50 to-white dark:from-slate-800 dark:via-amber-950/30 dark:to-slate-900"
                  >
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">
                      {exam.course} – {exam.duration}
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-50">
                      {exam.date}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 shadow-sm">
                        🗺️ {exam.location}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold border shadow-sm ${
                        exam.daysUntilExam > 0
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
                          : "bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800"
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
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-black shadow-lg">
                  T
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                    Turnitin Abgabe verwalten
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
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
                    className="mt-1 accent-blue-600 dark:accent-blue-400"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    Ich bestätige die{" "}
                    <strong className="text-slate-900">
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
                    className="mt-1 accent-blue-600 dark:accent-blue-400"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-200">
                    Ich akzeptiere die{" "}
                    <strong className="text-slate-900">
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
                    ? "border-green-400 bg-green-50/40 dark:border-green-700 dark:bg-green-900/30"
                    : "border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-blue-900/20"
                }`}
              >
                {!uploadedFile && (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-2 animate-pulse-slow">
                      <Upload className="h-10 w-10 text-blue-500 dark:text-blue-300" />
                      <p className="text-sm text-slate-700 dark:text-slate-200">
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
                      className="cursor-pointer inline-block mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-4 py-2 rounded-md font-semibold shadow hover:from-blue-700 hover:to-indigo-700 dark:hover:from-indigo-500 dark:hover:to-indigo-400 transition-all"
                    >
                      Datei auswählen
                    </label>
                  </>
                )}

                {/* Uploaded File Preview */}
                {uploadedFile && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-green-300 dark:border-green-700 px-3 py-2 rounded-lg shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-600"
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
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-300">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-green-400 dark:from-emerald-400 dark:to-lime-400 animate-progress"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-300 mt-2 animate-fadeIn">
                      ✅ Upload abgeschlossen – Datei wurde erfolgreich
                      übertragen.
                    </p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!accepted.honor || !accepted.privacy}
                  className={`px-4 py-2 rounded-md text-sm font-semibold shadow text-white transition-all ${
                    accepted.honor && accepted.privacy
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-emerald-600 dark:to-teal-500 dark:hover:from-emerald-500 dark:hover:to-teal-400"
                      : "bg-slate-400 dark:bg-slate-700 cursor-not-allowed"
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

        
