import { User } from "lucide-react";
import type { TranscriptStudentData } from "~/types/transcript";

interface TranscriptStudentCardProps {
  t: any;
  studentData: TranscriptStudentData;
}

export function TranscriptStudentCard({ t, studentData }: TranscriptStudentCardProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl sm:rounded-[2.5rem] rounded-2xl border border-border p-6 sm:p-10 shadow-2xl mb-8 sm:mb-12">
      <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-border/50">
        <div className="p-2 sm:p-3 bg-iu-blue/10 rounded-xl sm:rounded-2xl">
          <User className="h-6 w-6 sm:h-8 sm:w-8 text-iu-blue" />
        </div>
        <h2 className="text-xl sm:text-3xl font-black text-foreground tracking-tight">
          {t.studentInfo}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
        <InfoItem label={t.name} value={studentData.name} />
        <InfoItem label={t.studentId} value={studentData.studentId} />
        <InfoItem label={t.program} value={studentData.program} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 sm:p-6 bg-background/40 rounded-2xl sm:rounded-3xl border border-border/50 hover:border-iu-blue/30 transition-colors group">
      <p className="text-[10px] sm:text-xs font-bold text-muted-foreground mb-1 sm:mb-2 uppercase tracking-widest group-hover:text-iu-blue transition-colors">
        {label}
      </p>
      <p className="text-base sm:text-xl font-bold text-foreground break-words">
        {value}
      </p>
    </div>
  );
}
