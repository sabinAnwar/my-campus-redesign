import React from "react";
import {
  CalendarDays,
  Clock,
  ChevronRight,
  MapPin,
  User,
  Flag,
} from "lucide-react";
import { toISODate, DEFAULT_PALETTE, type StudyPlan } from "~/lib/studyPlans";
import { EVENT_COLORS } from "~/constants/schedule";
import { EventIcon } from "~/components/schedule/EventIcon";
import type { ScheduleEvent } from "~/types/schedule";

interface ScheduleListViewProps {
  weekDates: Date[];
  todayISO: string;
  language: string;
  locale: string;
  currentPlan: StudyPlan | null;
  dayNames: string[];
  t: any;
  getEventsForDate: (date: Date) => ScheduleEvent[];
  isEventLive: (event: ScheduleEvent) => boolean;
  setSelectedEvent: (event: ScheduleEvent) => void;
}

export function ScheduleListView({
  weekDates,
  todayISO,
  language,
  locale,
  currentPlan,
  dayNames,
  t,
  getEventsForDate,
  isEventLive,
  setSelectedEvent,
}: ScheduleListViewProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {weekDates.map((date, idx) => {
        const dateStr = toISODate(date);
        const isToday = dateStr === todayISO;
        const events = getEventsForDate(date);
        const dayBlock = currentPlan?.blocks.find(
          (b) => dateStr >= b.start && dateStr <= b.end
        );
        const phaseConfig = dayBlock
          ? currentPlan?.paletteOverrides?.[dayBlock.status] ||
            DEFAULT_PALETTE[dayBlock.status]
          : null;

        if (events.length === 0 && !isToday) return null;

        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-[2rem] border transition-all ${
              isToday
                ? "border-iu-blue/30 bg-iu-blue/[0.02] shadow-xl shadow-iu-blue/5"
                : "border-border bg-card/50"
            }`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Date Sidebar */}
              <div
                className={`md:w-48 p-5 sm:p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border/50 ${
                  isToday ? "bg-iu-blue/5" : "bg-muted/10"
                }`}
              >
                <span
                  className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${
                    isToday
                      ? "text-iu-blue dark:text-white"
                      : "text-muted-foreground dark:text-white/70"
                  }`}
                >
                  {dayNames[idx]}
                </span>
                <span
                  className={`text-3xl sm:text-4xl font-black mb-1 ${
                    isToday ? "text-iu-blue dark:text-white" : "text-foreground"
                  }`}
                >
                  {date.getDate()}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground dark:text-white/70">
                  {date.toLocaleDateString(locale, { month: "short" })}
                </span>
                {phaseConfig && (
                  <div
                    className={`mt-3 sm:mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${phaseConfig.bg} ${phaseConfig.text} border-current/10`}
                  >
                    {dayBlock?.status === "feiertag" && (
                      <Flag className="h-3 w-3" />
                    )}
                    {phaseConfig.label}
                  </div>
                )}
              </div>

              {/* Events List */}
              <div className="flex-1 p-5 sm:p-6 md:p-8">
                {events.length > 0 ? (
                  <div className="grid gap-4">
                    {events.map((event, eIdx) => {
                      const isLive = isEventLive(event);
                      const colors =
                        EVENT_COLORS[event.type] || EVENT_COLORS.Integriert;

                      return (
                        <div
                          key={eIdx}
                          onClick={() => setSelectedEvent(event)}
                          className={`group relative flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 rounded-2xl bg-background/50 border transition-all cursor-pointer ${
                            isLive
                              ? "border-iu-blue shadow-lg shadow-iu-blue/10 ring-1 ring-iu-blue/20"
                              : "border-border/50 hover:border-iu-blue/30 hover:shadow-lg hover:shadow-iu-blue/5"
                          }`}
                        >
                          {/* Live Indicator */}
                          {isLive && (
                            <div className="absolute -top-2 -right-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-iu-blue text-white text-[10px] font-black uppercase tracking-widest shadow-lg animate-bounce">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                              </span>
                              Live
                            </div>
                          )}

                          {/* Time */}
                          <div className="flex items-center gap-3 sm:w-32 shrink-0">
                            <div
                              className={`p-2.5 rounded-xl ${isLive ? "bg-iu-blue text-white" : "bg-iu-blue/10 text-iu-blue dark:bg-iu-blue/20 dark:text-white"}`}
                            >
                              <Clock size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-foreground leading-none">
                                {event.startTime}
                              </span>
                              <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground mt-1">
                                {event.endTime}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-bold text-base sm:text-lg text-foreground truncate group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                                {event.title}
                              </h3>
                              {event.isOptional && (
                                <span className="px-2 py-0.5 rounded-md bg-iu-orange text-white text-[10px] font-bold uppercase tracking-wider border border-iu-orange/30">
                                  Optional
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/30 border border-border/50">
                                <MapPin
                                  size={14}
                                  className="text-iu-blue/70 dark:text-white/70"
                                />
                                <span className="font-medium">
                                  {event.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/30 border border-border/50">
                                <User
                                  size={14}
                                  className="text-iu-blue/70 dark:text-white/70"
                                />
                                <span className="font-medium">
                                  {event.professor}
                                </span>
                              </div>
                              {event.type && (
                                <div
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${colors.bg} ${colors.text} border-current/10`}
                                >
                                  <EventIcon
                                    type={event.type}
                                    className="h-3.5 w-3.5"
                                  />
                                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                                    {event.type}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action */}
                          <div className="sm:ml-auto">
                            <div
                              className={`p-2.5 sm:p-3 rounded-xl transition-all ${isLive ? "bg-iu-blue text-white" : "bg-muted/50 text-muted-foreground group-hover:bg-iu-blue group-hover:text-white"}`}
                            >
                              <ChevronRight size={18} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-10 sm:py-12">
                    <div className="w-16 h-16 rounded-2xl bg-muted/20 flex items-center justify-center mb-4">
                      <CalendarDays
                        className="text-muted-foreground/30"
                        size={32}
                      />
                    </div>
                    <p className="text-muted-foreground font-medium">
                      {t.noEvents}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
