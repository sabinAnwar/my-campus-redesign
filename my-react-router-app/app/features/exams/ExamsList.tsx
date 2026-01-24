import React from "react";
import { GraduationCap } from "lucide-react";

interface Exam {
  id: number;
  title: string;
  dueDate: string;
}

interface ExamsListProps {
  exams: Exam[];
  language: string;
  t: any;
}

export function ExamsList({ exams, language, t }: ExamsListProps) {
  if (!exams || exams.length === 0) return null;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="w-1.5 h-8 bg-iu-blue rounded-full shadow-[0_0_10px_rgba(36,94,235,0.5)]" />
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {t.yourExams}
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="group p-5 sm:p-8 bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] shadow-2xl hover:border-iu-blue/30 hover:bg-card transition-all duration-500 relative overflow-hidden"
          >
            {/* Hover background effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6 sm:mb-8">
                <div className="p-3 sm:p-4 rounded-2xl bg-iu-blue text-white border border-iu-blue/30 shadow-lg group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <span className="px-3 sm:px-4 py-2 rounded-xl bg-iu-blue text-white border border-iu-blue/30 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm">
                  {new Date(exam.dueDate).toLocaleDateString(
                    language === "de" ? "de-DE" : "en-US"
                  )}
                </span>
              </div>
              <h3 className="font-bold text-xl sm:text-2xl mb-3 text-foreground tracking-tight group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                {exam.title}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground dark:text-white">
                {t.exam}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
