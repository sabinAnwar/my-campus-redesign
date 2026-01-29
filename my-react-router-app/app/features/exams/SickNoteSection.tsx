import React from "react";
import { Link } from "react-router";
import { AlertCircle, ExternalLink, FileCheck } from "lucide-react";

interface SickNoteSectionProps {
  t: any;
}

export function SickNoteSection({ t }: SickNoteSectionProps) {
  return (
    <section className="bg-card border border-slate-300 dark:border-slate-700 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden shadow-2xl backdrop-blur-xl group hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-500">
      <div className="absolute -top-12 -right-12 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <AlertCircle className="w-64 h-64 text-iu-blue" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10">
        <div className="space-y-5 sm:space-y-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-3 bg-iu-blue/10 dark:bg-iu-blue rounded-2xl">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-iu-blue dark:text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              {t.sickDuringExams}
            </h2>
          </div>
          <p className="text-foreground text-base sm:text-lg max-w-xl font-bold leading-relaxed">
            {t.sickDuringExamsDesc}
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 px-4 sm:px-5 py-2.5 rounded-xl border border-border text-[10px] sm:text-xs font-black text-white dark:text-slate-900 uppercase tracking-widest shadow-lg">
              <FileCheck className="w-4 h-4" />{" "}
              {t.extensionRequest}
            </span>
            <span className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 px-4 sm:px-5 py-2.5 rounded-xl border border-border text-[10px] sm:text-xs font-black text-white dark:text-slate-900 uppercase tracking-widest shadow-lg">
              <FileCheck className="w-4 h-4" /> {t.certificate}
            </span>
          </div>
        </div>

        <Link
          to="/antragsverwaltung"
          state={{ from: "/exams" }}
          className="shrink-0 inline-flex items-center gap-3 px-6 sm:px-10 py-4 sm:py-5 bg-foreground text-background rounded-2xl text-base sm:text-lg font-bold shadow-xl transition-all active:scale-95 group-hover:-translate-y-1 hover:opacity-90"
        >
          {t.toApplicationManagement}
          <ExternalLink className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
