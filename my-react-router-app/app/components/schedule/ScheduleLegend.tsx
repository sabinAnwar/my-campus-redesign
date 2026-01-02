import React from "react";
import { Info } from "lucide-react";
import { EVENT_COLORS } from "~/constants/schedule";
import { EventIcon } from "~/components/schedule/EventIcon";

interface ScheduleLegendProps {
  t: any;
}

export function ScheduleLegend({ t }: ScheduleLegendProps) {
  return (
    <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-foreground flex items-center gap-3">
          <Info size={24} className="text-iu-blue" />
          {t.courseTypes}
        </h3>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          {t.courseTypesDesc}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(EVENT_COLORS).map(([type, colors]) => (
          <div
            key={type}
            className={`flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-current/20 transition-all group`}
          >
            <div
              className={`p-3 rounded-xl ${colors.bg} ${colors.text} shadow-sm group-hover:scale-110 transition-transform`}
            >
              <EventIcon type={type} className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">
                {t.eventTypes[type] || type}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${colors.bg.split(" ")[0]}`}
                />
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {type === "Q&A" || type === "Tutorium"
                    ? t.optional
                    : t.mandatory}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
