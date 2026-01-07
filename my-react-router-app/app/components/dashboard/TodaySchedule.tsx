import React from "react";
import { Link } from "react-router";
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react";

interface TodayClass {
  id: number;
  title: string;
  time: string;
  location: string;
  type: string;
  professor: string;
  color: string;
}

interface TodayScheduleProps {
  todayClasses: TodayClass[];
  t: any;
}

export function TodaySchedule({ todayClasses, t }: TodayScheduleProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative group overflow-hidden bg-card/40 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] p-4 sm:p-6 shadow-xl transition-all duration-500 hover:shadow-iu-blue/10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/10 blur-[100px] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-125 duration-1000" />
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-iu-blue text-white shadow-[0_0_20px_rgba(36,94,235,0.3)] border border-iu-blue/50">
              <CalendarDays className="h-6 w-6" />
            </div>
          </div>
          <Link
            to="/courses/schedule"
            className="p-2.5 rounded-full bg-muted/50 text-iu-blue hover:bg-iu-blue hover:text-white transition-all shadow-sm border border-border dark:bg-iu-blue dark:text-white dark:border-iu-blue/40"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        {todayClasses.length > 0 ? (
          <div className="relative z-10 space-y-3">
            {todayClasses.slice(0, 4).map((cls) => (
              <div
                key={cls.id}
                className={`flex items-start gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border transition-all duration-500 bg-card/40 hover:bg-card hover:shadow-lg group/item ${
                  cls.color === "orange"
                    ? "border-iu-orange/20 hover:border-iu-orange/40 shadow-md dark:bg-iu-orange/10"
                    : "border-iu-blue/20 hover:border-iu-blue/40 shadow-md dark:bg-iu-blue/10"
                }`}
              >
                <div
                  className={`mt-0.5 p-2 sm:p-2.5 rounded-lg sm:rounded-xl border shadow-md shrink-0 transition-all duration-500 group-hover/item:scale-110 ${
                    cls.color === "orange"
                      ? "bg-iu-orange/10 border-iu-orange/20 text-iu-orange dark:bg-iu-orange dark:text-white"
                      : "bg-iu-blue/10 border-iu-blue/20 text-iu-blue dark:bg-iu-blue dark:text-white"
                  }`}
                >
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight break-words [hyphens:auto] group-hover/item:text-iu-blue dark:group-hover/item:text-white transition-colors">
                      {cls.title}
                    </h3>
                    <span
                      className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current/20 leading-none shrink-0 ${
                        cls.color === "orange"
                          ? "bg-iu-orange/15 text-iu-orange dark:bg-iu-orange dark:text-white"
                          : "bg-iu-blue/15 text-iu-blue dark:bg-iu-blue dark:text-white"
                      }`}
                    >
                      {cls.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 shrink-0">
                      <Clock className="h-3 w-3" />
                      {cls.time}
                    </span>
                    <span className="flex items-center gap-1 min-w-0">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <p className="truncate">{cls.location}</p>
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {todayClasses.length > 4 && (
              <p className="text-center text-xs text-muted-foreground font-medium">
                +{todayClasses.length - 4} {t.moreEvents}
              </p>
            )}
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center py-8 text-center">
            <CalendarDays className="h-10 w-10 text-muted-foreground/60 mb-3" />
            <p className="text-sm text-muted-foreground font-medium italic">
              {t.noClassesToday}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
