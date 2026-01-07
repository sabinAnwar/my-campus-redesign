import React from "react";
import { FileText } from "lucide-react";

interface GradesTableProps {
  t: any;
  groupedMarks: [string, any[]][];
  language: string;
}

export function GradesTable({ t, groupedMarks, language }: GradesTableProps) {
  const getGradeColor = (grade: number) => {
    if (grade <= 1.5) return "text-iu-blue dark:text-white bg-iu-blue/10 dark:bg-iu-blue border border-iu-blue/20 dark:border-iu-blue";
    if (grade <= 2.5) return "text-iu-blue dark:text-white bg-iu-blue/10 dark:bg-iu-blue border border-iu-blue/20 dark:border-iu-blue";
    if (grade <= 3.5) return "text-iu-orange dark:text-white bg-iu-orange/10 dark:bg-iu-orange border border-iu-orange/20 dark:border-iu-orange";
    return "text-iu-red dark:text-white bg-iu-red/10 dark:bg-iu-red border border-iu-red/20 dark:border-iu-red";
  };

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
        <table className="w-full min-w-[600px] sm:min-w-0">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                {t.module}
              </th>
              <th className="px-4 sm:px-8 py-4 sm:py-6 text-left text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em]">
                {t.grade}
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
                    colSpan={5}
                    className="px-4 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-iu-blue dark:text-white uppercase tracking-[0.2em] sm:tracking-[0.3em]"
                  >
                    {semester}
                  </td>
                </tr>
                {semesterMarks.map((mark: any) => (
                  <tr
                    key={mark.id}
                    className="hover:bg-iu-blue/5 transition-colors group"
                  >
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-bold text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                      <div className="flex flex-col gap-1">
                        <span>{mark.course}</span>
                        <div className="flex sm:hidden items-center gap-2 text-[10px] text-muted-foreground">
                          <span>5 ECTS</span>
                          <span className="opacity-30">•</span>
                          <span>{new Date(mark.date).toLocaleDateString(language === "de" ? "de-DE" : "en-US")}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6">
                      <span
                        className={`inline-flex items-center px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-black shadow-sm ${getGradeColor(mark.value)}`}
                      >
                        {mark.value.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground font-bold hidden sm:table-cell">
                      5 ECTS
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground font-bold hidden md:table-cell">
                      {mark.teacher?.name || "N/A"}
                    </td>
                    <td className="px-4 sm:px-8 py-4 sm:py-6 text-xs sm:text-sm text-muted-foreground font-bold hidden sm:table-cell">
                      {new Date(mark.date).toLocaleDateString(
                        language === "de" ? "de-DE" : "en-US"
                      )}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
