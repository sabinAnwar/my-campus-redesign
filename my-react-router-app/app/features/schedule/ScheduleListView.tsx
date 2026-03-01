import React from "react";
import {
  CalendarDays,
  Clock,
  ChevronRight,
  MapPin,
  User,
  Flag,
  Video,
} from "lucide-react";
import { toISODate, DEFAULT_PALETTE, getBlockStatusForDate, type StudyPlan } from "~/utils/studyPlans";
import { EVENT_COLORS } from "~/config/schedule";
import { EventIcon } from "~/features/schedule/EventIcon";
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
        
        let status = currentPlan ? getBlockStatusForDate(currentPlan, date) : null;
        // Fallback to basic block lookup if helper returns null (shouldn't happen if plan exists)
        if (!status && currentPlan) {
            const block = currentPlan.blocks.find(b => dateStr >= b.start && dateStr <= b.end);
            status = block?.status || null;
        }

        const phaseConfig = status
          ? currentPlan?.paletteOverrides?.[status] ||
            DEFAULT_PALETTE[status]
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
                className={`md:w-48 p-4 sm:p-8 flex flex-row md:flex-col items-center md:items-center justify-between md:justify-center text-center md:text-center gap-3 md:gap-0 border-b md:border-b-0 md:border-r border-border/50 ${
                  isToday ? "bg-iu-blue/5" : "bg-muted/10"
                }`}
              >
                <span
                  className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] mb-0 md:mb-2 ${
                    isToday
                      ? "text-iu-blue dark:text-white"
                      : "text-muted-foreground dark:text-white"
                  }`}
                >
                  {dayNames[idx]}
                </span>
                <span
                  className={`text-2xl sm:text-4xl font-black mb-0 md:mb-1 ${
                    isToday ? "text-iu-blue dark:text-white" : "text-foreground"
                  }`}
                >
                  {date.getDate()}
                </span>
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground dark:text-white">
                  {date.toLocaleDateString(locale, { month: "short" })}
                </span>
                {phaseConfig && (
                  <div
                    className={`mt-0 md:mt-3 sm:mt-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${phaseConfig.bg} ${phaseConfig.text} border-current/10`}
                  >
                    {status === "feiertag" && (
                      <Flag className="h-3 w-3" />
                    )}
                    {phaseConfig.label}
                  </div>
                )}
              </div>

              {/* Events List */}
              <div className="flex-1 p-4 sm:p-6 md:p-8">
                {events.length > 0 ? (
                  <div className="grid gap-4">
                    {events.map((event, eIdx) => {
                      const isLive = isEventLive(event);
                      const typeColors = EVENT_COLORS[event.type] || EVENT_COLORS.Integriert;
                      const isOtherType =
                        typeof event.type === "string" &&
                        event.type.toLowerCase() === "other";
                      
                      // Use Legend Colors strictly for the card
                      const colors = {
                        bg: `${typeColors.bg}/15`,
                        text: typeColors.bg.replace('bg-', 'text-'),
                        border: typeColors.border
                      };

                      return (
                        <div
                          key={eIdx}
                          onClick={() => setSelectedEvent(event)}
                          className={`group relative flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6 p-3 sm:p-6 rounded-2xl bg-background/50 border transition-all cursor-pointer ${
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
                          <div className="flex items-center gap-3 lg:w-28 shrink-0">
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
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-bold text-base sm:text-lg text-foreground line-clamp-2 sm:line-clamp-1 group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                                {event.title}
                              </h3>
                              {event.isOptional && (
                                <span className="px-2 py-0.5 rounded-md bg-iu-orange text-white text-[10px] font-bold uppercase tracking-wider border border-iu-orange/30">
                                  Optional
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground mt-1">
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700">
                                <MapPin
                                  size={14}
                                  className="text-blue-800 dark:text-blue-300"
                                />
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                  {event.location}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900 shadow-sm border border-slate-300 dark:border-slate-700">
                                <User
                                  size={14}
                                  className="text-blue-800 dark:text-blue-300"
                                />
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                  {event.professor}
                                </span>
                              </div>
                              {event.type && (
                                <div
                                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                                    isOtherType
                                      ? "bg-iu-gold text-slate-900 border-iu-gold/50"
                                      : `${colors.bg} ${colors.text} border-current/10`
                                  }`}
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
                          <div className="lg:ml-auto self-end lg:self-auto flex items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                            {event.isOnline && event.zoomLink && (
                              <a
                                href={event.zoomLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="group relative flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 bg-gradient-to-r from-blue-800 to-indigo-900 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-900/30 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-sm sm:text-sm overflow-hidden border border-blue-700/50"
                              >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                                <span className="relative flex h-2.5 w-2.5 mr-1">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                                </span>
                                <Video size={18} className="shrink-0 relative z-10" />
                                <span className="relative z-10 tracking-wide">ZOOM BEITRETEN</span>
                              </a>
                            )}
                            <div
                              className={`p-2.5 sm:p-3 rounded-xl border transition-all shrink-0 ${
                                isLive
                                  ? "bg-iu-blue text-white border-iu-blue/60"
                                  : "bg-white text-slate-900 border-slate-300/70 group-hover:bg-iu-blue group-hover:text-white group-hover:border-iu-blue/60"
                              } dark:bg-slate-900 dark:text-white dark:border-white/10`}
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
                        className="text-muted-foreground"
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
