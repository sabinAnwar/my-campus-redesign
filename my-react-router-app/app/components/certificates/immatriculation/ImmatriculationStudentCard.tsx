import { User, CheckCircle } from "lucide-react";
import type { ImmatriculationStudentData } from "~/types/immatriculation";

interface ImmatriculationStudentCardProps {
  t: any;
  studentData: ImmatriculationStudentData;
}

export function ImmatriculationStudentCard({ t, studentData }: ImmatriculationStudentCardProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden mb-8 sm:mb-12">
      <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-100 -mr-32 -mt-32"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-border/50">
          <div className="p-3 rounded-2xl bg-iu-blue/10 border border-iu-blue/20 text-iu-blue shadow-lg">
            <User className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            {t.studentInfo}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <InfoItem label={t.name} value={studentData.name} />
          <InfoItem label={t.studentId} value={studentData.studentId} isMonospaced />
          <InfoItem label={t.program} value={studentData.program} />
          <InfoItem label={t.semester} value={`${studentData.semester}. ${t.semesterText}`} />
          <InfoItem label={t.enrollmentDate} value={studentData.enrollmentDate} isMonospaced />
          
          <div className="p-6 bg-iu-blue/10 rounded-3xl border border-iu-blue/20 shadow-xl shadow-iu-blue/5 group hover:bg-iu-blue/20 transition-all duration-500">
            <p className="text-[10px] text-iu-blue dark:text-iu-blue mb-2 font-black uppercase tracking-widest">
              {t.status}
            </p>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-iu-blue dark:text-iu-blue" />
              <p className="text-xl font-bold text-iu-blue dark:text-iu-blue tracking-tight">
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
    <div className="p-6 bg-background/50 border border-border rounded-3xl group hover:bg-card hover:border-iu-blue/30 transition-all duration-500 shadow-inner">
      <p className="text-[10px] text-muted-foreground/50 mb-2 font-black uppercase tracking-widest">
        {label}
      </p>
      <p className={`text-xl font-bold text-foreground tracking-tight group-hover:text-iu-blue transition-colors ${isMonospaced ? "tracking-widest" : ""}`}>
        {value}
      </p>
    </div>
  );
}
