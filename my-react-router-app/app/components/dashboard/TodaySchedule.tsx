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
      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
          <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          {t.yourSchedule}
        </h2>
      </div>
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
            className="p-2.5 rounded-full bg-muted/50 text-iu-blue hover:bg-iu-blue hover:text-white transition-all shadow-sm border border-border"
          >
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        {todayClasses.length > 0 ? (
          <div className="relative z-10 space-y-3">
            {todayClasses.slice(0, 4).map((cls) => (
              <div
                key={cls.id}
                className="flex items-start gap-4 p-4 rounded-2xl border transition-all duration-500 bg-card/40 hover:bg-card hover:shadow-lg group/item border-iu-blue/20 hover:border-iu-blue/40"
              >
                <div className="p-2.5 rounded-xl border shadow-md bg-iu-blue/10 border-iu-blue/20 text-iu-blue">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-foreground truncate">
                      {cls.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border bg-iu-blue/10 border-iu-blue/20 text-iu-blue">
                      {cls.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground/30" />
                      {cls.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground/30" />
                      {cls.location}
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
            <CalendarDays className="h-10 w-10 text-muted-foreground/20 mb-3" />
            <p className="text-sm text-muted-foreground font-medium italic">
              {t.noClassesToday}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
