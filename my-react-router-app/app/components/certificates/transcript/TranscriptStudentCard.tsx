import { User } from "lucide-react";
import type { TranscriptStudentData } from "~/types/transcript";

interface TranscriptStudentCardProps {
  t: any;
  studentData: TranscriptStudentData;
}

export function TranscriptStudentCard({ t, studentData }: TranscriptStudentCardProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl mb-8 sm:mb-12">
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
        <div className="p-3 bg-iu-blue/10 rounded-2xl">
          <User className="h-8 w-8 text-iu-blue" />
        </div>
        <h2 className="text-3xl font-black text-foreground tracking-tight">
          {t.studentInfo}
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <InfoItem label={t.name} value={studentData.name} />
        <InfoItem label={t.studentId} value={studentData.studentId} />
        <InfoItem label={t.program} value={studentData.program} />
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 bg-background/40 rounded-3xl border border-border/50 hover:border-iu-blue/30 transition-colors group">
      <p className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest group-hover:text-iu-blue transition-colors">
        {label}
      </p>
      <p className="text-xl font-bold text-foreground">
        {value}
      </p>
    </div>
  );
}
