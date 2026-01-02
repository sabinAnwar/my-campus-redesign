import { Clock } from "lucide-react";

interface SupportHoursProps {
  t: any;
}

export function SupportHours({ t }: SupportHoursProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group hover:bg-card transition-all duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-foreground tracking-tight">
          {t.supportHours}
        </h3>
      </div>
      <div className="space-y-4">
        <HourItem day={t.monFri} hours="08:00 - 18:00" />
        <HourItem day={t.sat} hours="10:00 - 14:00" />
        <HourItem day={t.sun} hours={t.closed} isClosed />
      </div>
    </div>
  );
}

function HourItem({ day, hours, isClosed = false }: { day: string; hours: string; isClosed?: boolean }) {
  return (
    <div className={`flex justify-between items-center p-5 rounded-2xl border border-border shadow-inner transition-all ${
      isClosed ? "bg-muted/30 opacity-60" : "bg-background/50 hover:border-iu-blue/30 group/item"
    }`}>
      <span className={`font-bold ${!isClosed ? "text-foreground group-hover/item:text-iu-blue transition-colors" : "text-muted-foreground"}`}>
        {day}
      </span>
      <span className="text-muted-foreground font-bold">
        {hours}
      </span>
    </div>
  );
}
