import { MoreHorizontal, CheckCircle2, Clock, Calendar, AlertCircle } from "lucide-react";

interface GradesLegendProps {
  labels: {
    legend: string;
    statusPassed: string;
    statusRegistered: string;
    statusExamRegistered: string;
    statusOpen: string;
    statusFailed: string;
    gradeExcellent: string;
    gradeGood: string;
    gradeSatisfactory: string;
    gradeSufficient: string;
  };
}

export function GradesLegend({ labels }: GradesLegendProps) {
  const statusItems = [
    { c: "bg-iu-green", label: labels.statusPassed, icon: CheckCircle2 },
    { c: "bg-iu-indigo", label: labels.statusRegistered, icon: Clock },
    { c: "bg-iu-purple", label: labels.statusExamRegistered, icon: Calendar },
    { c: "bg-iu-brown", label: labels.statusOpen, icon: Clock },
    { c: "bg-iu-red", label: labels.statusFailed, icon: AlertCircle },
  ];

  const gradeItems = [
    { c: "bg-iu-blue", label: labels.gradeExcellent },
    { c: "bg-iu-indigo", label: labels.gradeGood },
    { c: "bg-iu-brown", label: labels.gradeSatisfactory },
    { c: "bg-slate-900 dark:bg-slate-100", label: labels.gradeSufficient },
  ];

  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-border p-4 sm:p-6 shadow-lg">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-2.5 bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white rounded-lg">
          <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
          {labels.legend}
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
        {statusItems.map((it, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 sm:gap-3 rounded-lg border border-border bg-background/40 p-2.5 sm:p-3 transition-all hover:bg-iu-blue/5 hover:border-iu-blue/30 group"
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded ${it.c} flex items-center justify-center text-white shadow group-hover:scale-110 transition-transform`}
            >
              <it.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide text-foreground/80 leading-tight">
              {it.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mt-4 sm:mt-6">
        {gradeItems.map((it, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-lg border border-border bg-background/40 p-2.5 sm:p-3 transition-all hover:bg-iu-blue/5 hover:border-iu-blue/30 group"
          >
            <div
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded ${it.c} shadow group-hover:scale-125 transition-transform border border-black/10 dark:border-white/10`}
            />
            <div className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide text-foreground/80">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
