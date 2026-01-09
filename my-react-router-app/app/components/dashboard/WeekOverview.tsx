import React from "react";
import { Link } from "react-router";
import { Calendar, ArrowRight } from "lucide-react";

interface WeekDay {
  date: Date;
  dayName: string;
  dayNum: number;
  isToday: boolean;
  events: { title: string; time: string; type: string }[];
}

interface WeekOverviewProps {
  weekDays: WeekDay[];
  t: any;
}

export function WeekOverview({ weekDays, t }: WeekOverviewProps) {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10 dark:bg-iu-blue dark:text-white dark:border-iu-blue/40">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
          {t.weekOverview}
        </h3>
      </div>
      <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-end mb-6">
          <Link
            to="/courses/schedule"
            className="px-6 py-2.5 rounded-full bg-iu-blue/10 text-iu-blue hover:bg-iu-blue hover:text-white font-bold text-sm transition-all flex items-center gap-2 group/btn dark:bg-iu-blue dark:text-white cursor-pointer"
          >
            {t.showFullSchedule}
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="week-days-scroll">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className={`relative p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-[2rem] border transition-all duration-300 min-w-[120px] sm:min-w-0 flex-shrink-0 ${
                day.isToday
                  ? "bg-iu-blue/5 border-iu-blue/40 ring-2 sm:ring-4 ring-iu-blue/10 hover:bg-card shadow-xl"
                  : "bg-muted/40 border-border hover:border-iu-blue/20 hover:bg-card shadow-sm"
              }`}
            >
              <div className="text-center mb-2 sm:mb-4 space-y-0.5 sm:space-y-1">
                <p
                  className={`text-[10px] sm:text-xs font-bold uppercase tracking-widest ${day.isToday ? "text-iu-blue dark:text-white" : "text-muted-foreground dark:text-slate-200"}`}
                >
                  {day.dayName}
                </p>
                <p
                  className={`text-xl sm:text-2xl md:text-3xl font-black ${day.isToday ? "text-iu-blue dark:text-white" : "text-foreground"}`}
                >
                  {day.dayNum}
                </p>
                {day.isToday && (
                  <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-black bg-iu-blue text-white shadow-lg shadow-iu-blue/20">
                    {t.todayUpper}
                  </span>
                )}
              </div>
              <div className="space-y-1 sm:space-y-1.5 min-h-[50px] sm:min-h-[60px]">
                {day.events.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground dark:text-slate-200 text-center italic">
                    Keine Termine
                  </p>
                ) : (
                  day.events.slice(0, 2).map((event, eIdx) => (
                    <div
                      key={eIdx}
                      className={`p-1.5 rounded-lg text-[10px] ${
                        event.type === "Vorlesung"
                          ? "bg-iu-blue/10 text-iu-blue dark:bg-iu-blue dark:text-white"
                          : event.type === "Workshop"
                            ? "bg-iu-blue/10 text-iu-blue dark:bg-iu-blue dark:text-white"
                            : "bg-iu-orange/10 text-iu-orange dark:bg-iu-orange dark:text-white"
                      }`}
                    >
                      <p className="font-medium truncate">{event.time}</p>
                      <p className="truncate">
                        {event.title.split(" - ")[0]}
                      </p>
                    </div>
                  ))
                )}
                {day.events.length > 2 && (
                  <p className="text-[10px] font-bold text-iu-blue text-center bg-iu-blue/10 rounded-full px-2 py-0.5 mt-1 border border-iu-blue/20">
                    +{day.events.length - 2} mehr
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
