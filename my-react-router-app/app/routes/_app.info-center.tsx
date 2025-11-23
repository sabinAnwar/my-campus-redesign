import React from "react";

export default function InfoCenterPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Info Center
        </h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2">

        <a
          href="/exams"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block no-underline"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            Prüfungsguide & Dokumente
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">Neu</span>
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Krankmeldungen, wissenschaftliches Arbeiten und Vorlagen.
          </p>
        </a>

        <a
          href="/security"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block no-underline"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            IT-Sicherheit & Datenschutz
            <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 px-2 py-0.5 rounded-full">Wichtig</span>
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Die 8 goldenen Regeln für den sicheren Umgang mit Daten.
          </p>
        </a>
      </section>
    </div>
  );
}
