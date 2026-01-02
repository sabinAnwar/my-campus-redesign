import React from "react";
import { FileText } from "lucide-react";

interface GradesTableProps {
  t: any;
  groupedMarks: [string, any[]][];
  language: string;
}

export function GradesTable({ t, groupedMarks, language }: GradesTableProps) {
  const getGradeColor = (grade: number) => {
    if (grade <= 1.5) return "text-iu-blue dark:text-iu-blue bg-iu-blue/10 border border-iu-blue/20";
    if (grade <= 2.5) return "text-iu-blue bg-iu-blue/10 border border-iu-blue/20";
    if (grade <= 3.5) return "text-iu-orange bg-iu-orange/10 border border-iu-orange/20";
    return "text-iu-red bg-iu-red/10 border border-iu-red/20";
  };

  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden mb-8 sm:mb-12">
      <div className="p-10 border-b border-border/50 bg-iu-blue/5">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-iu-blue/10 rounded-2xl">
            <FileText className="h-8 w-8 text-iu-blue" />
          </div>
          <h2 className="text-3xl font-black text-foreground tracking-tight">
            {t.grades}
          </h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {t.module}
              </th>
              <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {t.grade}
              </th>
              <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {t.credits}
              </th>
              <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {t.teacher}
              </th>
              <th className="px-8 py-6 text-left text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {t.date}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {groupedMarks.map(([semester, semesterMarks]) => (
              <React.Fragment key={semester}>
                <tr className="bg-iu-blue/5">
                  <td
                    colSpan={5}
                    className="px-8 py-4 text-xs font-black text-iu-blue uppercase tracking-[0.3em]"
                  >
                    {semester}
                  </td>
                </tr>
                {semesterMarks.map((mark: any) => (
                  <tr
                    key={mark.id}
                    className="hover:bg-iu-blue/5 transition-colors group"
                  >
                    <td className="px-8 py-6 text-base font-bold text-foreground group-hover:text-iu-blue transition-colors">
                      {mark.course}
                    </td>
                    <td className="px-8 py-6">
                      <span
                        className={`inline-flex items-center px-4 py-1.5 rounded-xl text-sm font-black shadow-sm ${getGradeColor(mark.value)}`}
                      >
                        {mark.value.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-muted-foreground font-bold">
                      5 ECTS
                    </td>
                    <td className="px-8 py-6 text-sm text-muted-foreground font-bold">
                      {mark.teacher?.name || "N/A"}
                    </td>
                    <td className="px-8 py-6 text-sm text-muted-foreground font-bold">
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
