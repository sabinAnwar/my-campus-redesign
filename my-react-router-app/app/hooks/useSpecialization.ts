import { useState, useEffect, useCallback } from "react";
import type { VertiefungId } from "~/types/specialization";
import { VERTIEFUNGEN } from "~/constants/specialization";

//
// TYPES
//

interface UseSpecializationReturn {
  selectedVertiefung: VertiefungId | null;
  setSelectedVertiefung: (id: VertiefungId | null) => void;
  savedChoice: VertiefungId | null;
  confirmModal: boolean;
  setConfirmModal: (show: boolean) => void;
  showSuccess: boolean;
  handleConfirm: () => void;
}

//
// CONSTANTS
//

const STORAGE_KEY = "vertiefungswahl";
const SUCCESS_TOAST_DURATION = 3000;

//
// HOOK
//

/**
 * Hook for managing specialization selection state
 * Handles localStorage persistence and confirmation flow
 */
export function useSpecialization(): UseSpecializationReturn {
  const [selectedVertiefung, setSelectedVertiefung] = useState<VertiefungId | null>(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [savedChoice, setSavedChoice] = useState<VertiefungId | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved choice from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved in VERTIEFUNGEN) {
      setSavedChoice(saved as VertiefungId);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedVertiefung) {
      localStorage.setItem(STORAGE_KEY, selectedVertiefung);
      setSavedChoice(selectedVertiefung);
      setConfirmModal(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), SUCCESS_TOAST_DURATION);
    }
  }, [selectedVertiefung]);

  return {
    selectedVertiefung,
    setSelectedVertiefung,
    savedChoice,
    confirmModal,
    setConfirmModal,
    showSuccess,
    handleConfirm,
  };
}
