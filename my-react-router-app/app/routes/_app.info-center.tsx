import React from "react";
import { useLanguage } from "~/contexts/LanguageContext";

export default function InfoCenterPage() {
  const { language } = useLanguage();
  const t = {
    de: {
      title: "Info Center",
      examGuide: "Prüfungsguide & Dokumente",
      new: "Neu",
      examDesc: "Krankmeldungen, wissenschaftliches Arbeiten und Vorlagen.",
      security: "IT-Sicherheit & Datenschutz",
      important: "Wichtig",
      securityDesc: "Die 8 goldenen Regeln für den sicheren Umgang mit Daten.",
    },
    en: {
      title: "Info Center",
      examGuide: "Exam guide & documents",
      new: "New",
      examDesc: "Sick notes, academic writing, and templates.",
      security: "IT Security & Data Protection",
      important: "Important",
      securityDesc: "The 8 golden rules for handling data securely.",
    },
  }[language];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t.title}
        </h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2">

        <a
          href="/exams"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block no-underline"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            {t.examGuide}
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">{t.new}</span>
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.examDesc}
          </p>
        </a>

        <a
          href="/security"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block no-underline"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            {t.security}
            <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full">{t.important}</span>
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {t.securityDesc}
          </p>
        </a>
      </section>
    </div>
  );
}
