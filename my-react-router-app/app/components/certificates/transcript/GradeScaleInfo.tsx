import { FileText } from "lucide-react";

interface GradeScaleInfoProps {
  t: any;
}

export function GradeScaleInfo({ t }: GradeScaleInfoProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border sm:rounded-[2.5rem] rounded-2xl p-6 sm:p-10 shadow-2xl mb-8 sm:mb-12">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        <div className="p-3 sm:p-4 bg-iu-blue/10 rounded-xl sm:rounded-2xl shadow-inner shrink-0">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-iu-blue" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-3 uppercase tracking-tight">
            {t.gradeScale}
          </h3>
          <p className="font-bold text-muted-foreground text-base sm:text-lg leading-relaxed">
            {t.gradeScaleText}
          </p>
        </div>
      </div>
    </div>
  );
}
