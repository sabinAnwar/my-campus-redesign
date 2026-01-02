import { FileText } from "lucide-react";

interface GradeScaleInfoProps {
  t: any;
}

export function GradeScaleInfo({ t }: GradeScaleInfoProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 shadow-2xl mb-8 sm:mb-12">
      <div className="flex items-start gap-6">
        <div className="p-4 bg-iu-blue/10 rounded-2xl shadow-inner">
          <FileText className="h-8 w-8 text-iu-blue" />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-black text-foreground mb-3 uppercase tracking-tight">
            {t.gradeScale}
          </h3>
          <p className="font-bold text-muted-foreground text-lg leading-relaxed">
            {t.gradeScaleText}
          </p>
        </div>
      </div>
    </div>
  );
}
