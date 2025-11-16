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

export const loader = async () => {
  try {
    const rows = await prisma.studentTask.findMany({
      orderBy: { dueDate: "asc" },
    });
    const submissions: LoaderSubmission[] = rows.map((t) => ({
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
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<LoaderSubmission | null>(null);
  const [accepted, setAccepted] = useState({ honor: false, privacy: false });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Submissions from database (with extra UI fields)
  const [submissions, setSubmissions] = useState(
    initialSubmissions.map((s) => ({
      ...s,
      status: "pending" as "pending" | "submitted",
      daysUntilDue: calculateDaysLeft(s.dueDate),
    }))
  );

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

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
    setAccepted({ honor: false, privacy: false });
    setUploadedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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

      <div className="max-w-7xl mx-auto px-6 py-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            Wissenschaftliche Arbeiten & Klausurfristen
          </h1>
          <p className="text-slate-600">
            Verwalte deine Abgaben, lade Dateien hoch und behalte Fristen im
            Blick
          </p>
        </header>

        <div className="grid lg:grid-cols-8 gap-8">
          {/* Submissions */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                  <FileText className="h-5 w-5 text-blue-700" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Wissenschaftliche Arbeiten (Turnitin)
                </h2>
              </div>

              <div className="space-y-5">
                {submissions.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-5 bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-600 mb-1">
                          {item.course}
                        </p>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-300 text-slate-700 text-xs font-semibold">
                          {item.type}
                        </span>
                      </div>

                      <div>
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold border ${
                            item.status === "submitted"
                              ? "bg-green-50 text-green-700 border-green-300"
                              : "bg-amber-50 text-amber-700 border-amber-300"
                          }`}
                        >
                          {item.status === "submitted"
                            ? "Abgegeben"
                            : "Ausstehend"}
                        </span>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mt-3 border-t border-slate-200 pt-3">
                      <div>
                        <Calendar className="h-4 w-4 text-slate-600 inline mr-2" />
                        <span className="text-xs font-semibold text-slate-700">
                          Abgabefrist:
                        </span>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {item.dueDate}
                        </p>
                      </div>
                      <div>
                        <CheckSquare className="h-4 w-4 text-slate-600 inline mr-2" />
                        <span className="text-xs font-semibold text-slate-700">
                          Korrektur:
                        </span>
                        <p className="text-sm font-bold text-slate-900 mt-1">
                          {item.correctionDate}
                        </p>
                      </div>
                    </div>

                    {item.status === "pending" && (
                      <div className="mt-4 pt-3 border-t border-slate-200">
                        <button
                          onClick={() => openModal(item)}
                          className="w-full py-2 text-sm font-semibold bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-lg hover:from-slate-800 hover:to-slate-600 transition-all"
                        >
                          Abgabe verwalten
                        </button>
                      </div>
                    )}

                    {item.status === "submitted" && (
                      <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs text-slate-600 font-semibold">
                          Turnitin Ähnlichkeit:
                        </span>
                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-300">
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
            <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                  <BookOpen className="h-5 w-5 text-amber-700" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Klausurfristen
                </h2>
              </div>
              <div className="space-y-4">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="border border-slate-200 rounded-xl p-4 bg-slate-50"
                  >
                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-600 mb-1">
                      {exam.course} – {exam.duration}
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {exam.date}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {exam.daysUntilExam > 0
                        ? `${exam.daysUntilExam} Tage verbleibend`
                        : "Heute / vorbei"}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* 🔹 Modal: Upload */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
              <h2 className="text-xl font-bold text-slate-900 mb-2">
                Turnitin Abgabe verwalten
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Reiche deine wissenschaftliche Arbeit sicher über Turnitin ein.
              </p>

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
                    className="mt-1 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">
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
                    className="mt-1 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">
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
                    ? "border-green-400 bg-green-50/40"
                    : "border-slate-300 hover:border-blue-400 hover:bg-blue-50/30"
                }`}
              >
                {!uploadedFile && (
                  <>
                    <div className="flex flex-col items-center justify-center space-y-2 animate-pulse-slow">
                      <Upload className="h-10 w-10 text-blue-500" />
                      <p className="text-sm text-slate-700">
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
                      className="cursor-pointer inline-block mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-4 py-2 rounded-md font-semibold shadow hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      Datei auswählen
                    </label>
                  </>
                )}

                {/* Uploaded File Preview */}
                {uploadedFile && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <div className="flex items-center gap-2 bg-white border border-green-300 px-3 py-2 rounded-lg shadow-sm">
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
                          <p className="text-sm font-medium text-slate-900">
                            {uploadedFile.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Simulated Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
                      <div
                        className="h-2 bg-gradient-to-r from-blue-500 to-green-400 animate-progress"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-green-600 mt-2 animate-fadeIn">
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
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-slate-200 hover:bg-slate-300"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!accepted.honor || !accepted.privacy}
                  className={`px-4 py-2 rounded-md text-sm font-semibold shadow text-white transition-all ${
                    accepted.honor && accepted.privacy
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      : "bg-slate-400 cursor-not-allowed"
                  }`}
                >
                  Hochladen & Bestätigen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
   
  );
}

        

