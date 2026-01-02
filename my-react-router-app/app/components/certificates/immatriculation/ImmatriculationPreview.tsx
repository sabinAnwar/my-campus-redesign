import { Building2, Shield, Calendar } from "lucide-react";
import type { ImmatriculationStudentData } from "~/types/immatriculation";

interface ImmatriculationPreviewProps {
  t: any;
  studentData: ImmatriculationStudentData;
  today: string;
}

export function ImmatriculationPreview({ t, studentData, today }: ImmatriculationPreviewProps) {
  return (
    <div className="relative bg-card/40 backdrop-blur-xl rounded-[2.5rem] border-4 border-iu-blue/20 p-6 sm:p-12 shadow-2xl overflow-hidden mb-8 sm:mb-12">
      {/* Decorative corners */}
      <div className="absolute top-6 left-6 w-16 h-16 border-t-4 border-l-4 border-iu-blue/20 rounded-tl-2xl hidden sm:block" />
      <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-iu-blue/20 rounded-tr-2xl hidden sm:block" />
      <div className="absolute bottom-6 left-6 w-16 h-16 border-b-4 border-l-4 border-iu-blue/20 rounded-bl-2xl hidden sm:block" />
      <div className="absolute bottom-6 right-6 w-16 h-16 border-b-4 border-r-4 border-iu-blue/20 rounded-br-2xl hidden sm:block" />

      <div className="text-center mb-8 sm:mb-12 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 bg-iu-blue rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-2xl shadow-iu-blue/30 transition-transform hover:rotate-12">
          <Building2 className="h-8 w-8 sm:h-12 sm:w-12 text-white" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">
          {t.certificateTitle}
        </h2>
        <p className="text-muted-foreground text-lg sm:text-xl font-medium">
          IU Internationale Hochschule
        </p>
        <div className="w-24 sm:w-40 h-1 sm:h-1.5 bg-iu-blue mx-auto mt-4 sm:mt-6 rounded-full shadow-lg shadow-iu-blue/20" />
      </div>

      <div className="space-y-6 sm:space-y-8 text-foreground/80 max-w-2xl mx-auto relative z-10">
        <p className="text-center text-lg sm:text-xl font-medium">
          {t.certificateText}
        </p>
        <p className="text-center text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
          {studentData.name}
        </p>
        <p className="text-center text-sm sm:text-base text-muted-foreground/60 font-bold tracking-widest uppercase">
          {t.studentId}: {studentData.studentId}
        </p>
        <p className="text-center text-lg sm:text-xl font-medium">{t.isEnrolled}</p>
        <p className="text-center text-xl sm:text-2xl font-bold text-iu-blue tracking-tight">
          {studentData.program}
        </p>
        <p className="text-center text-lg sm:text-xl font-medium leading-relaxed">
          {t.inSemester}{" "}
          <span className="font-bold text-foreground">
            {studentData.semester}. {t.semesterText}
          </span>{" "}
          {t.enrolledSince}{" "}
          <span className="font-bold text-foreground">
            {studentData.enrollmentDate}
          </span>
          .
        </p>
      </div>

      <div className="mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-iu-blue/20 rounded-xl sm:rounded-2xl flex items-center justify-center bg-iu-blue/5 shadow-inner">
            <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-iu-blue" />
          </div>
          <div>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest mb-1">
              {t.officialStamp}
            </p>
            <p className="text-base sm:text-lg font-bold text-foreground">
              {t.registrarOffice}
            </p>
          </div>
        </div>
        <div className="text-center md:text-right">
          <div className="flex items-center justify-center md:justify-end gap-3 text-xs sm:text-sm text-muted-foreground font-bold mb-3 sm:mb-4">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-iu-blue/40" />
            <span>
              {t.issueDate}: {today}
            </span>
          </div>
          <div className="w-32 sm:w-48 h-px bg-border mx-auto md:ml-auto mb-2" />
          <p className="text-[8px] sm:text-[10px] text-muted-foreground/50 font-black uppercase tracking-widest">
            {t.signature}
          </p>
        </div>
      </div>
    </div>
  );
}
