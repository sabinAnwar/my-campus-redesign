import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "de" | "en";

type LanguageContextValue = {
  language: Language;
  setLanguage: (next: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

type ProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

export function LanguageProvider({
  children,
  defaultLanguage = "de",
  storageKey = "iu-language",
}: ProviderProps) {
  const [language, setLanguage] = useState<Language>(defaultLanguage);

  // Hydrate initial language from localStorage or browser preference
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
    if (stored === "de" || stored === "en") {
      setLanguage(stored);
      return;
    }
    const prefersEnglish =
      typeof navigator !== "undefined" &&
      (navigator.language || "").toLowerCase().startsWith("en");
    setLanguage(prefersEnglish ? "en" : "de");
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(storageKey, language);
    } catch (_) {
      // fail silently if storage is unavailable
    }
  }, [language, storageKey]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === "de" ? "en" : "de")),
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}

export type { Language };
