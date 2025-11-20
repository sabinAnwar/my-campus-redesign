import React from "react";
import { Link } from "react-router-dom";

export default function InfoCenterPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Info Center
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Zentrale Anlaufstelle für wichtige Informationen rund um dein Studium.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          to="/news"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white">
            News &amp; Updates
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Aktuelle Meldungen und Hinweise deiner Hochschule.
          </p>
        </Link>

        <Link
          to="/faq"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Häufige Fragen (FAQ)
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Antworten auf typische Fragen zu Organisation, Prüfungen und mehr.
          </p>
        </Link>

        <Link
          to="/study-organization"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Studienorganisation
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Überblick über Stundenplan, Module und organisatorische Themen.
          </p>
        </Link>

        <Link
          to="/contact"
          className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Kontakt
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Finde die richtigen Ansprechpersonen für deine Anliegen.
          </p>
        </Link>
      </section>
    </div>
  );
}
