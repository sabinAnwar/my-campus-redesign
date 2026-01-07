import { Clock } from "lucide-react";

interface SupportHoursProps {
  t: any;
}

export function SupportHours({ t }: SupportHoursProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border sm:rounded-[2.5rem] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group hover:bg-card transition-all duration-500">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm border border-iu-blue/10 shrink-0">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
          {t.supportHours}
        </h3>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <HourItem day={t.monFri} hours="08:00 - 18:00" />
        <HourItem day={t.sat} hours="10:00 - 14:00" />
        <HourItem day={t.sun} hours={t.closed} isClosed />
      </div>
    </div>
  );
}

function HourItem({ day, hours, isClosed = false }: { day: string; hours: string; isClosed?: boolean }) {
  return (
    <div className={`flex justify-between items-center p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-border shadow-inner transition-all ${
      isClosed ? "bg-muted/30 opacity-60" : "bg-background/50 hover:border-iu-blue/30 group/item"
    }`}>
      <span className={`text-sm sm:text-base font-bold ${!isClosed ? "text-foreground group-hover/item:text-iu-blue dark:group-hover/item:text-white transition-colors" : "text-muted-foreground"}`}>
        {day}
      </span>
      <span className="text-xs sm:text-sm text-muted-foreground font-bold">
        {hours}
      </span>
    </div>
  );
}
