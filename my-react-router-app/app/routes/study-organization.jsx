import React, { useState } from "react";
import AppShell from "../components/AppShell";
import {
  CheckCircle2,
  Hourglass,
  Clock3,
  FileText,
  Award,
  BookOpen,
  Calendar,
} from "lucide-react";

export const loader = async () => null;

const PLAN = [
  {
    term: "Semester 1",
    ects: 30,
    modules: [
      {
        code: "MATH101",
        title: "Mathematik Grundlagen",
        ects: 5,
        status: "completed",
      },
      {
        code: "PROG101",
        title: "Programmieren 1",
        ects: 5,
        status: "completed",
      },
      {
        code: "WEB101",
        title: "Webentwicklung",
        ects: 5,
        status: "inProgress",
      },
      { code: "DB101", title: "Datenbanken", ects: 5, status: "inProgress" },
      {
        code: "ENG101",
        title: "Wissenschaftliches Arbeiten",
        ects: 5,
        status: "open",
      },
      { code: "BUS101", title: "BWL Grundlagen", ects: 5, status: "open" },
    ],
  },
  {
    term: "Semester 2",
    ects: 30,
    modules: [
      {
        code: "ALGO201",
        title: "Algorithmen & Datenstrukturen",
        ects: 5,
        status: "open",
      },
      { code: "PROG201", title: "Programmieren 2", ects: 5, status: "open" },
      { code: "OS201", title: "Betriebssysteme", ects: 5, status: "open" },
      { code: "NET201", title: "Netzwerke", ects: 5, status: "open" },
      { code: "STAT201", title: "Statistik", ects: 5, status: "open" },
      { code: "PROJ201", title: "Projekt", ects: 5, status: "open" },
    ],
  },
];

function statusStyles(status) {
  switch (status) {
    case "completed":
      return "bg-green-50 border-green-200 text-green-800";
    case "inProgress":
      return "bg-blue-50 border-blue-200 text-blue-800";
    default:
      return "bg-slate-50 border-slate-200 text-slate-800";
  }
}

export default function StudyOrganization() {
  const [showCompleted, setShowCompleted] = useState(true);

  const totalECTS = PLAN.reduce((acc, s) => acc + s.ects, 0);
  const earnedECTS = PLAN.flatMap((s) => s.modules)
    .filter((m) => m.status === "completed")
    .reduce((a, m) => a + m.ects, 0);

  return (
    <AppShell>
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            Studienorganisation
          </h1>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              ECTS: {earnedECTS}/{totalECTS}
            </div>
            <button
              onClick={() => setShowCompleted((s) => !s)}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white"
            >
              {showCompleted ? "Hide completed" : "Show completed"}
            </button>
          </div>
        </div>

        {/* Module Online Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {/* Antragsverwaltung */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 dark:from-blue-600 dark:to-cyan-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-white/80 px-2 py-1 rounded-full bg-white/20">
                  Modul Online
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Antragsverwaltung
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Verwalten Sie Ihre Anträge und Formulare online
              </p>
            </div>
          </div>

          {/* Notenverwaltung */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-white/80 px-2 py-1 rounded-full bg-white/20">
                  Modul Online
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Notenverwaltung
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Ihre Prüfungsergebnisse und Notenübersicht
              </p>
            </div>
          </div>

          {/* Vertiefungswahl */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-white/80 px-2 py-1 rounded-full bg-white/20">
                  Modul Online
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Vertiefungswahl
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Wählen Sie Ihre Vertiefungsrichtung
              </p>
            </div>
          </div>

          {/* Klausuranmeldung */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 p-6 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-white/80 px-2 py-1 rounded-full bg-white/20">
                  Modul Online
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Klausuranmeldung
              </h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Melden Sie sich zu Prüfungen an
              </p>
            </div>
          </div>
        </div>

        {/* Studienplan Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Studienplan
          </h2>
        </div>

        {/* Terms timeline */}
        <div className="space-y-10">
          {PLAN.map((sem, idx) => (
            <section key={sem.term} className="relative">
              {/* Term header */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-3 w-3 rounded-full bg-slate-400" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  {sem.term}
                </h2>
                <div className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200">
                  {sem.ects} ECTS
                </div>
              </div>

              {/* Module grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sem.modules
                  .filter((m) => showCompleted || m.status !== "completed")
                  .map((m) => (
                    <div
                      key={m.code}
                      className={`rounded-2xl p-4 border ${statusStyles(m.status)} hover:shadow-md transition`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-xs font-semibold tracking-wide text-slate-500">
                            {m.code}
                          </p>
                          <h3 className="text-sm font-bold text-slate-900">
                            {m.title}
                          </h3>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded bg-white/60 border border-current">
                          {m.ects} ECTS
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        {m.status === "completed" && (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />{" "}
                            Abgeschlossen
                          </span>
                        )}
                        {m.status === "inProgress" && (
                          <span className="inline-flex items-center gap-1">
                            <Hourglass className="h-4 w-4 text-blue-600" />{" "}
                            Läuft
                          </span>
                        )}
                        {m.status === "open" && (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-4 w-4 text-slate-600" /> Offen
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Divider line to next term */}
              {idx < PLAN.length - 1 && (
                <div className="mt-8 h-px bg-gradient-to-r from-slate-300 via-slate-200 to-transparent" />
              )}
            </section>
          ))}
        </div>
      </main>
    </AppShell>
  );
}
