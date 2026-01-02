import { useState, useMemo, useCallback } from "react";
import { calculateDaysLeft } from "~/lib/tasksSample";
import type {
  TaskLoaderSubmission,
  TaskUISubmission,
} from "~/types/tasks";

// ============================================================================
// TYPES
// ============================================================================

interface AcceptedState {
  honor: boolean;
  privacy: boolean;
}

interface SavedStatus {
  status: "pending" | "submitted";
  similarity?: number;
}

type SavedStatusMap = Record<number, SavedStatus>;

// ============================================================================
// STORAGE HELPERS
// ============================================================================

function loadSavedStatus(): SavedStatusMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("submissionStatus") || "{}");
  } catch {
    return {};
  }
}

function persistStatus(next: SavedStatusMap): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("submissionStatus", JSON.stringify(next));
}

// ============================================================================
// HOOK: useTasks
// ============================================================================

interface UseTasksOptions {
  initialSubmissions: TaskLoaderSubmission[];
  initialExams: any[];
  language: "de" | "en";
  translations: any;
}

export function useTasks({
  initialSubmissions,
  initialExams,
  language,
  translations: t,
}: UseTasksOptions) {
  // Initialize submissions with saved status
  const saved = loadSavedStatus();
  const [submissions, setSubmissions] = useState<TaskUISubmission[]>(
    initialSubmissions.map((s) => ({
      ...s,
      status: saved[s.id]?.status ?? "pending",
      similarity: saved[s.id]?.similarity,
      daysUntilDue: calculateDaysLeft(s.dueDateIso || s.dueDate),
    }))
  );

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<TaskLoaderSubmission | null>(null);
  const [accepted, setAccepted] = useState<AcceptedState>({ honor: false, privacy: false });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Exams display data with translations
  const examsDisplay = useMemo(
    () =>
      initialExams.map((exam) => ({
        ...exam,
        title: translateValue(exam.title, "titles", t),
        course: translateValue(exam.course, "courses", t),
        type: translateValue(exam.type, "types", t),
        duration: t.examDuration,
        location: exam.type === "Online-Klausur" ? t.onlineLocation : t.onSiteLocation,
        date: formatDate(exam.date, language),
      })),
    [initialExams, t, language]
  );

  // Modal handlers
  const openModal = useCallback((submission: TaskLoaderSubmission) => {
    setSelectedSubmission(submission);
    setShowModal(true);
    setAccepted({ honor: false, privacy: false });
    setUploadedFile(null);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) setUploadedFile(file);
  }, []);

  const handleAcceptChange = useCallback((field: keyof AcceptedState, value: boolean) => {
    setAccepted((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
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

      // Update local status
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

        const persisted: SavedStatusMap = {};
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
  }, [accepted, uploadedFile, selectedSubmission, t, language]);

  return {
    // Submissions
    submissions,
    examsDisplay,
    
    // Modal state
    showModal,
    selectedSubmission,
    accepted,
    uploadedFile,
    
    // Modal actions
    openModal,
    closeModal,
    handleFileChange,
    handleAcceptChange,
    handleSubmit,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function formatDate(iso: string, language: "de" | "en"): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(
    language === "de" ? "de-DE" : "en-US",
    { year: "numeric", month: "2-digit", day: "2-digit" }
  );
}

export function translateValue(
  value: string,
  category: "types" | "titles" | "courses",
  translations: any
): string {
  const map = translations[category] as Record<string, string> | undefined;
  if (map && map[value]) return map[value];

  // Handle dynamic titles like "Klausur: Course Name"
  if (value.includes(": ")) {
    const [prefix, ...rest] = value.split(": ");
    const suffix = rest.join(": ");
    const translatedPrefix = translations.types?.[prefix] || prefix;
    return `${translatedPrefix}: ${suffix}`;
  }

  return value;
}
