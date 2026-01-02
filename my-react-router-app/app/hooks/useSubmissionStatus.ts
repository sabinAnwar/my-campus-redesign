import { useState, useEffect } from "react";

type SubmissionStatus = "pending" | "submitted";

interface SubmissionState {
  status: SubmissionStatus;
  similarity?: number;
}

export function useSubmissionStatus() {
  const loadSavedStatus = () => {
    if (typeof window === "undefined") return {} as Record<number, SubmissionState>;
    try {
      return JSON.parse(
        localStorage.getItem("submissionStatus") || "{}"
      ) as Record<number, SubmissionState>;
    } catch {
      return {};
    }
  };

  const [savedStatus, setSavedStatus] = useState<Record<number, SubmissionState>>(loadSavedStatus());

  const persistStatus = (next: Record<number, SubmissionState>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("submissionStatus", JSON.stringify(next));
    setSavedStatus(next);
  };

  useEffect(() => {
    const syncFromStorage = () => setSavedStatus(loadSavedStatus());
    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("focus", syncFromStorage);
    document.addEventListener("visibilitychange", syncFromStorage);
    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("focus", syncFromStorage);
      document.removeEventListener("visibilitychange", syncFromStorage);
    };
  }, []);

  return { savedStatus, persistStatus };
}
