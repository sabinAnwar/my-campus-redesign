import React from "react";
import { Link } from "react-router";
import { Award, ArrowRight } from "lucide-react";

interface GradesWidgetProps {
  averageGrade: number | null;
  language: string;
  t: any;
}

export function GradesWidget({ averageGrade, language, t }: GradesWidgetProps) {
  const gradeLabel =
    averageGrade == null
      ? language === "de"
        ? "Keine Daten"
        : "No data"
      : averageGrade.toFixed(2);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-green/10 text-iu-green shadow-sm border border-iu-green/10 dark:bg-iu-green dark:text-white dark:border-iu-green/40">
          <Award className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
          {t.gradesLabel}
        </h3>
      </div>
      <div className="bg-card/60 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-72 h-72 bg-iu-green/10 blur-[90px] rounded-full -mr-36 -mt-36 transition-transform group-hover:scale-110 duration-1000" />
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-bold text-muted-foreground dark:text-slate-200 uppercase tracking-widest">
                {t.avgGrade}
              </p>
              <div className="text-3xl sm:text-4xl font-black text-foreground">
                {gradeLabel}
              </div>
            </div>
            <div className="rounded-2xl bg-iu-green/10 text-iu-green dark:bg-iu-green dark:text-white px-4 py-2 text-[10px] sm:text-xs font-black uppercase tracking-widest border border-iu-green/20">
              {t.average}
            </div>
          </div>
          <Link
            to="/notenverwaltung"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-bold text-xs sm:text-sm uppercase tracking-widest hover:opacity-90 transition-all shadow-lg cursor-pointer"
          >
            {language === "de" ? "Noten anzeigen" : "View grades"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
