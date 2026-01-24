import React from "react";
import { Info, Flag } from "lucide-react";
import { EVENT_COLORS } from "~/config/schedule";
import { EventIcon } from "~/features/schedule/EventIcon";

interface ScheduleLegendProps {
  t: any;
}

export function ScheduleLegend({ t }: ScheduleLegendProps) {
  return (
    <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-5 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
        <h3 className="text-lg sm:text-xl font-black text-foreground flex items-center gap-3">
          <Info size={20} className="text-iu-blue dark:text-white" />
          {t.courseTypes}
        </h3>
        <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-foreground dark:text-white">
          {t.courseTypesDesc}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Object.entries(EVENT_COLORS).map(([type, colors]) => (
          <div
            key={type}
            className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border hover:border-current/20 transition-all group`}
          >
            <div
              className={`p-2.5 sm:p-3 rounded-xl ${colors.bg} ${colors.text} shadow-sm group-hover:scale-110 transition-transform`}
            >
              <EventIcon type={type} className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">
                {t.eventTypes[type] || type}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${colors.bg.split(" ")[0]}`}
                />
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {type === "Q&A" || type === "Tutorium"
                    ? t.optional
                    : t.mandatory}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border">
          <div className="p-2.5 sm:p-3 rounded-xl bg-iu-gold text-white shadow-sm">
            <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground">
              {t.holidaysTitle || "Feiertag"}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-iu-gold" />
              <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {t.ferien || "Feiertag"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
