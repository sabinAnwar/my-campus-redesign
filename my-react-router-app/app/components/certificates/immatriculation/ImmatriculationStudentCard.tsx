import { User, CheckCircle } from "lucide-react";
import type { ImmatriculationStudentData } from "~/types/immatriculation";

interface ImmatriculationStudentCardProps {
  t: any;
  studentData: ImmatriculationStudentData;
}

export function ImmatriculationStudentCard({ t, studentData }: ImmatriculationStudentCardProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-2xl sm:rounded-[2.5rem] border border-border p-4 sm:p-6 md:p-10 shadow-2xl relative overflow-hidden mb-6 sm:mb-8 md:mb-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-100 -mr-32 -mt-32"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10 pb-4 sm:pb-6 border-b border-border/50">
          <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 border border-iu-blue/20 text-iu-blue shadow-lg">
            <User className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <h2 className="text-base sm:text-xl md:text-2xl font-bold text-foreground tracking-tight break-words leading-tight min-w-0 [hyphens:auto]">
            {t.studentInfo}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <InfoItem label={t.name} value={studentData.name} />
          <InfoItem label={t.studentId} value={studentData.studentId} isMonospaced />
          <InfoItem label={t.program} value={studentData.program} />
          <InfoItem label={t.semester} value={`${studentData.semester}. ${t.semesterText}`} />
          <InfoItem label={t.enrollmentDate} value={studentData.enrollmentDate} isMonospaced />
          
          <div className="p-4 sm:p-5 md:p-6 bg-iu-blue/10 rounded-2xl sm:rounded-3xl border border-iu-blue/20 shadow-xl shadow-iu-blue/5 group hover:bg-iu-blue/20 transition-all duration-500">
            <p className="text-[9px] sm:text-[10px] text-iu-blue dark:text-iu-blue mb-1 sm:mb-2 font-black uppercase tracking-widest">
              {t.status}
            </p>
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue dark:text-iu-blue" />
              <p className="text-base sm:text-lg md:text-xl font-bold text-iu-blue dark:text-iu-blue tracking-tight">
                {studentData.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, isMonospaced = false }: { label: string; value: string; isMonospaced?: boolean }) {
  return (
    <div className="p-4 sm:p-5 md:p-6 bg-background/50 border border-border rounded-2xl sm:rounded-3xl group hover:bg-card hover:border-iu-blue/30 transition-all duration-500 shadow-inner">
      <p className="text-[9px] sm:text-[10px] text-muted-foreground/50 mb-1 sm:mb-2 font-black uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-base sm:text-lg md:text-xl font-bold text-foreground tracking-tight group-hover:text-iu-blue transition-colors ${isMonospaced ? "tracking-widest" : ""}`}>
        {value}
      </p>
    </div>
  );
}
