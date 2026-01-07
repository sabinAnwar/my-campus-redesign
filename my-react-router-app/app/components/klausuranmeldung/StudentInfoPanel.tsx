import React from "react";
import { GraduationCap } from "lucide-react";
import { STUDENT_DATA } from "~/constants/exam-registration";

interface StudentInfoPanelProps {
  t: any;
}

export function StudentInfoPanel({ t }: StudentInfoPanelProps) {
  return (
    <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8 shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-iu-blue/10 dark:bg-iu-blue flex items-center justify-center text-iu-blue dark:text-white">
          <GraduationCap size={24} />
        </div>
        <div>
          <h4 className="font-bold text-foreground">
            {STUDENT_DATA.vorname} {STUDENT_DATA.nachname}
          </h4>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {STUDENT_DATA.matrikelnummer}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-bold text-iu-blue dark:text-white">
          {STUDENT_DATA.studiengang}
        </p>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {STUDENT_DATA.semester}. {t.semester}
        </p>
      </div>
    </div>
  );
}
