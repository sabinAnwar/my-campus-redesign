import React from "react";
import { useLanguage } from "~/contexts/LanguageContext";

const TRANSLATIONS = {
  de: {
    title: "Studienplan",
    description: "Übersicht deines Curriculums. Inhalte folgen.",
  },
  en: {
    title: "Curriculum",
    description: "Overview of your curriculum. Content coming soon.",
  },
};

export default function CurriculumPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.title}</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-2">
        {t.description}
      </p>
    </div>
  );
}
