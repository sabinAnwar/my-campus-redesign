import React from "react";
import { FileText, CheckCircle2, XCircle } from "lucide-react";

interface GradesTableProps {
  t: any;
  groupedMarks: [string, any[]][];
  language: string;
}

export function GradesTable({ t, groupedMarks, language }: GradesTableProps) {
  const getGradeColor = (grade: number) => {
    if (grade <= 1.5) return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20";
    if (grade <= 2.5) return "text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20";
    if (grade <= 3.5) return "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 border border-yellow-500/20";
    if (grade <= 4.0) return "text-orange-600 dark:text-orange-400 bg-orange-500/10 border border-orange-500/20";
    return "text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20";
  };

  const isPassed = (grade: number) => grade <= 4.0;

  return (
    <div className="bg-card/60 backdrop-blur-xl sm:rounded-[2.5rem] rounded-2xl border border-border shadow-2xl overflow-hidden mb-8 sm:mb-12">
      <div className="p-6 sm:p-10 border-b border-border/50 bg-iu-blue/5">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-iu-blue/10 dark:bg-iu-blue rounded-xl sm:rounded-2xl">
            <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-iu-blue dark:text-white" />
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-foreground tracking-tight">
            {t.grades}
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] sm:min-w-0">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                {t.module}
              </th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                {t.grade}
              </th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                {t.status}
              </th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em] hidden sm:table-cell">
                {t.credits}
              </th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em] hidden md:table-cell">
                {t.teacher}
              </th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em] hidden sm:table-cell">
                {t.date}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {groupedMarks.map(([semester, semesterMarks]) => (
              <React.Fragment key={semester}>
                <tr className="bg-iu-blue/5 dark:bg-iu-blue/20">
                  <td
                    colSpan={6}
                    className="px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-iu-blue dark:text-white uppercase tracking-[0.2em] sm:tracking-[0.3em]"
                  >
                    {semester}
                  </td>
                </tr>
                {semesterMarks.map((row: any) => {
                  const mark = row.mark ?? null;
                  const passed = mark ? isPassed(mark.value) : false;
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-iu-blue/5 transition-colors group"
                    >
                      <td className="px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-bold text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                        <div className="flex flex-col gap-1">
                          <span>{row.name}</span>
                          <div className="flex sm:hidden items-center gap-2 text-[10px] text-muted-foreground">
                            <span>{row.credits} ECTS</span>
                            <span className="opacity-30">•</span>
                            <span>
                              {mark
                                ? new Date(mark.date).toLocaleDateString(
                                    language === "de" ? "de-DE" : "en-US"
                                  )
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-8 py-4 sm:py-6">
                        {mark ? (
                          <span
                            className={`inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-sm ${getGradeColor(mark.value)}`}
                          >
                            {mark.value.toFixed(1)}
                          </span>
                        ) : (
                          <span className="text-xs sm:text-sm font-bold text-muted-foreground">
                            {t.noGrade || "Keine Note"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-8 py-4 sm:py-6">
                        {mark ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                              passed
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {passed ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <XCircle size={12} />
                            )}
                            {passed ? t.passed : t.notPassed || "Nicht bestanden"}
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            {t.noGrade || "Keine Note"}
                          </span>
                        )}
                      </td>
                      <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground font-bold hidden sm:table-cell">
                        {row.credits} ECTS
                      </td>
                      <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground font-bold hidden md:table-cell">
                        {mark?.teacher?.name || "N/A"}
                      </td>
                      <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground font-bold hidden sm:table-cell">
                        {mark
                          ? new Date(mark.date).toLocaleDateString(
                              language === "de" ? "de-DE" : "en-US"
                            )
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
