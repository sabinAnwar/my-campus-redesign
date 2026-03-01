import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  Video,
  Briefcase,
  BookOpen,
  Calendar,
  MapPin,
  FileCheck,
  MessageSquare,
  Flag,
} from "lucide-react";
import { useLanguage } from "~/store/LanguageContext";
import { useLoaderData } from "react-router-dom";
import {
  STUDY_PLANS,
  DEFAULT_PALETTE,
  toISODate,
  getMonthDays,
  startOfMonth,
  addMonths,
  getStudyPlanByStudiengang,
  getBlockStatusForDate,
} from "~/utils/studyPlans";
import { prisma } from "~/services/prisma";
import { getUserFromRequest } from "~/services/auth.server";
import type { LoaderFunctionArgs } from "react-router";
import { TRANSLATIONS } from "~/services/translations/schedule";
import type { ScheduleEvent } from "~/types/schedule";

// Extracted utilities and constants
import { TIME_SLOTS, EVENT_COLORS } from "~/config/schedule";
import {
  getWeekDates,
  getEventStyle,
  isEventLive as checkEventLive,
  generateICSContent,
} from "~/utils/scheduleUtils";

// Extracted components
import { EventIcon } from "~/features/schedule/EventIcon";
import { ScheduleHeader } from "~/features/schedule/ScheduleHeader";
import { ScheduleListView } from "~/features/schedule/ScheduleListView";
import { ScheduleLegend } from "~/features/schedule/ScheduleLegend";
import { ScheduleEventModal } from "~/features/schedule/ScheduleEventModal";

export { type ScheduleEvent };

// Helper to create soft background colors for phases
const toSoftPhaseBg = (bgClassString: string) => {
  if (!bgClassString) return "";
  // With AAA dark colors, we need higher opacity for the pastel look
  return bgClassString.endsWith("/10") ? bgClassString.replace("/10", "/15") : `${bgClassString}/15`;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    let user = await getUserFromRequest(request);

    // FALLBACK for development if no session
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: "student.demo@iu-study.org" },
      });
    }

    if (!user) return { events: [], userCourses: [], studiengangName: null };

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        major: {
          include: {
            courses: true,
          },
        },
      },
    });

    if (!dbUser) return { events: [], userCourses: [], studiengangName: null };

    let events: any[] = [];
    let userCourses: { id: number; code: string; name: string }[] = [];
    let studiengangName: string | null = dbUser.major?.name || null;

    // First, check for existing schedule events in DB
    const dbEvents = await prisma.scheduleEvent.findMany({
      where: { user_id: dbUser.id },
      orderBy: [{ date: "asc" }, { start_time: "asc" }],
    });

    if (dbEvents.length > 0) {
      // Use existing schedule events
      events = dbEvents.map(
        (e: {
          id: number;
          title: string;
          course_code: string | null;
          event_type: string;
          date: Date;
          start_time: string;
          end_time: string;
          location: string | null;
          professor: string | null;
        }) => {
          const locationParts = e.location?.split("|") || [];
          const locationName = locationParts[0]?.trim() || "";
          const dbZoomLink = locationParts[1]?.trim() || undefined;
          const isOnline = locationName.toLowerCase().includes("online");

          return {
            id: e.id,
            title: e.title,
            courseCode: e.course_code || "",
            type: e.event_type.charAt(0) + e.event_type.slice(1).toLowerCase(),
            date: toISODate(e.date),
            startTime: e.start_time,
            endTime: e.end_time,
            location: locationName,
            professor: e.professor || "",
            room: null,
            isOnline,
            zoomLink: dbZoomLink,
            isOptional: e.event_type === "TUTORIUM" || e.event_type === "Q&A",
          };
        }
      );
    }

    // Get user's courses from their Major (Current Semester)
    if (dbUser.major?.courses) {
      userCourses = dbUser.major.courses
        .filter((c: any) => c.semester === dbUser.semester)
        .map((c: { id: number; code: string; name: string }) => ({
          id: c.id,
          code: c.code,
          name: c.name,
        }));
    }

    return { events, userCourses, studiengangName };
  } catch (error) {
    console.error("Error loading schedule events:", error);
    return { events: [], userCourses: [], studiengangName: null };
  }
};

export default function CourseSchedule() {
  const { language } = useLanguage();
  const {
    events: dbEvents,
    userCourses,
    studiengangName,
  } = useLoaderData<{
    events: ScheduleEvent[];
    userCourses: { id: number; code: string; name: string }[];
    studiengangName: string | null;
  }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"week" | "month" | "list">("list");
  const [showOptional, setShowOptional] = useState(true);
  const [now, setNow] = useState(new Date());

  // Update current time every minute
  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Helper to check if an event is currently happening
  const isEventLive = (event: ScheduleEvent) => checkEventLive(event, now);

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const monthDays = useMemo(
    () => getMonthDays(startOfMonth(currentDate)),
    [currentDate]
  );
  const todayISO = toISODate(new Date());

  // Get the study plan based on user's Studiengang
  const currentPlan = useMemo(() => {
    return getStudyPlanByStudiengang(studiengangName);
  }, [studiengangName]);

  const scheduleEvents = useMemo(() => {
    return dbEvents;
  }, [dbEvents]);

  // Get current study phase
  const currentBlock = currentPlan?.blocks.find(
    (b) => todayISO >= b.start && todayISO <= b.end
  );
  const currentStatus = currentBlock?.status || "vorlesung";
  const statusConfig =
    currentPlan?.paletteOverrides?.[currentStatus] ||
    DEFAULT_PALETTE[currentStatus];

  // Navigation
  const goToPrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToPrevMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get events for a specific date (filtered by optional setting)
  const getEventsForDate = (date: Date) => {
    const dateStr = toISODate(date);
    const events: ScheduleEvent[] = [];

    // Check which phase this date is in
    const dateBlock = currentPlan?.blocks.find(
      (b) => dateStr >= b.start && dateStr <= b.end
    );
    const currentPhase = dateBlock?.status;
    const isInPraxisPhase = currentPhase === "praxis";
    const isInExamPhase =
      currentPhase === "klausurphase" || currentPhase === "nachpruefung";

    // Add regular events
    scheduleEvents.forEach((e: ScheduleEvent) => {
      if (e.date !== dateStr) return;
      if (!showOptional && e.isOptional) return;

      // During Klausurphase or Nachprüfungsphase: only show Prüfung events
      if (isInExamPhase) {
        if (e.type !== "Prüfung") return;
      }
      // During Praxis phase: only show optional courses (no mandatory lectures)
      else if (isInPraxisPhase) {
        if (!e.isOptional) return;
      }

      events.push(e);
    });

    return events;
  };

  const locale = language === "de" ? "de-DE" : "en-US";
  const t = TRANSLATIONS[language];
  const dayNames = t.dayNames;
  const toSoftPhaseBg = (bg?: string | null) => {
    if (!bg) return "";
    if (bg.includes("bg-iu-") && !bg.includes("/")) {
      return `${bg}/10`;
    }
    return bg;
  };
  const getPhaseLabelClass = (status?: string | null) => {
    switch (status) {
      case "theoriephase":
        return "text-iu-purple dark:text-white";
      case "praxis":
        return "text-iu-green dark:text-white";
      case "klausurphase":
        return "text-iu-red dark:text-white";
      case "nachpruefung":
        return "text-foreground dark:text-white";
      case "feiertag":
        return "text-iu-orange dark:text-white";
      case "vorlesung":
        return "text-iu-blue dark:text-white";
      case "wochenende":
        return "text-iu-orange dark:text-white";
      default:
        return "text-muted-foreground dark:text-white";
    }
  };

  // Handle ICS download
  const handleDownloadICS = () => {
    const icsContent = generateICSContent(
      scheduleEvents,
      currentPlan?.blocks || []
    );
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "studienplan.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Generate semester blocks overview
  const semesterBlocks = useMemo(() => {
    const plan = currentPlan || STUDY_PLANS[0];
    if (!plan) return [];

    const sortedBlocks = [...plan.blocks].sort(
      (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
    );

    return sortedBlocks.map((block) => {
      const start = new Date(block.start);
      const end = new Date(block.end);
      const startWeek =
        Math.ceil(
          (start.getTime() - new Date(start.getFullYear(), 0, 1).getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        ) + 1;
      const endWeek =
        Math.ceil(
          (end.getTime() - new Date(end.getFullYear(), 0, 1).getTime()) /
            (7 * 24 * 60 * 60 * 1000)
        ) + 1;
      const config =
        plan.paletteOverrides?.[block.status] || DEFAULT_PALETTE[block.status];

      const isActive = todayISO >= block.start && todayISO <= block.end;

      return {
        ...block,
        startWeek,
        endWeek,
        config,
        isActive,
        startDate: start.toLocaleDateString(locale, {
          day: "numeric",
          month: "short",
        }),
        endDate: end.toLocaleDateString(locale, {
          day: "numeric",
          month: "short",
        }),
      };
    });
  }, [todayISO, locale, currentPlan]);

  return (
    <div className="max-w-7xl mx-auto">
      <ScheduleHeader
        language={language}
        locale={locale}
        currentDate={currentDate}
        viewMode={viewMode}
        showOptional={showOptional}
        statusConfig={statusConfig}
        currentStatus={currentStatus}
        t={t}
        setViewMode={setViewMode}
        setShowOptional={setShowOptional}
        goToPrevWeek={goToPrevWeek}
        goToNextWeek={goToNextWeek}
        goToPrevMonth={goToPrevMonth}
        goToNextMonth={goToNextMonth}
        goToToday={goToToday}
        handleDownloadICS={handleDownloadICS}
      />

      {/* Main Calendar Area */}
      <div className="space-y-8 sm:space-y-12">
        {viewMode === "list" ? (
          <ScheduleListView
            weekDates={weekDates}
            todayISO={todayISO}
            language={language}
            locale={locale}
            currentPlan={currentPlan}
            dayNames={dayNames}
            t={t}
            getEventsForDate={getEventsForDate}
            isEventLive={isEventLive}
            setSelectedEvent={setSelectedEvent}
          />
        ) : viewMode === "week" ? (
          <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl shadow-2xl shadow-iu-blue/5 overflow-x-auto">
            {/* Week Header */}
            <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-border bg-muted/20 min-w-[800px]">
              <div className="p-6" />
              {weekDates.map((date, idx) => {
                const dateStr = toISODate(date);
                const isToday = dateStr === todayISO;
                
                const status = currentPlan ? getBlockStatusForDate(currentPlan, date) : null;
                const phaseConfig = status
                  ? currentPlan?.paletteOverrides?.[status] ||
                    DEFAULT_PALETTE[status]
                  : null;

                return (
                  <div
                    key={idx}
                    className={`p-6 text-center border-l border-border ${isToday ? "bg-iu-blue/5" : ""}`}
                  >
                    <div
                      className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isToday ? "text-iu-blue dark:text-white" : "text-muted-foreground"}`}
                    >
                      {dayNames[idx]}
                    </div>
                    <div
                      className={`text-2xl font-bold w-12 h-12 flex items-center justify-center mx-auto rounded-2xl transition-all ${
                        isToday
                          ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20 scale-110"
                          : "text-foreground"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    {phaseConfig && (
                      <div
                        className={`text-[10px] font-bold mt-2 uppercase tracking-widest inline-flex items-center gap-1 ${status === 'feiertag' ? 'text-iu-gold' : phaseConfig.text.replace('text-white', 'text-iu-blue dark:text-white')}`}
                      >
                        {status === "feiertag" && (
                          <Flag className="h-3 w-3" />
                        )}
                        {phaseConfig.label.split(" ")[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Week Grid */}
            <div className="grid grid-cols-[100px_repeat(5,1fr)] relative min-w-[800px]">
              {/* Time Labels */}
              <div className="border-r border-border bg-muted/10">
                {TIME_SLOTS.map((time) => (
                  <div
                    key={time}
                    className="h-[100px] flex items-start justify-end pr-6 pt-3 text-[10px] text-foreground/70 font-bold uppercase tracking-widest"
                  >
                    {time}
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {weekDates.map((date, dayIdx) => {
                const dateStr = toISODate(date);
                const events = getEventsForDate(date);
                const isToday = dateStr === todayISO;

                // Calculate current time line position
                const nowH = now.getHours();
                const nowM = now.getMinutes();
                const startH = 8; // Calendar starts at 08:00
                const minutesSinceStart = (nowH - startH) * 60 + nowM;
                const timeLineTop = (minutesSinceStart / 60) * 100;

                return (
                  <div
                    key={dayIdx}
                    className={`relative border-l border-border ${isToday ? "bg-iu-blue/[0.02]" : ""}`}
                    style={{ height: `${TIME_SLOTS.length * 100}px` }}
                  >
                    {TIME_SLOTS.map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute w-full border-t border-border"
                        style={{ top: `${idx * 100}px` }}
                      />
                    ))}

                    {/* Current Time Line */}
                    {isToday &&
                      timeLineTop >= 0 &&
                      timeLineTop <= TIME_SLOTS.length * 100 && (
                        <div
                          className="absolute left-0 right-0 z-20 flex items-center pointer-events-none"
                          style={{ top: `${timeLineTop}px` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-iu-red -ml-1 shadow-lg shadow-rose-500/50" />
                          <div className="flex-1 h-0.5 bg-iu-red" />
                        </div>
                      )}

                    {events.map((event) => {
                      const isLive = isEventLive(event);
                      const typeColors = EVENT_COLORS[event.type] || EVENT_COLORS.Integriert;
                      // Calculate phase config for this specific day
                      const eventDate = new Date(event.date);
                      const status = currentPlan ? getBlockStatusForDate(currentPlan, eventDate) : null;
                      const phaseConfig = status
                        ? currentPlan?.paletteOverrides?.[status] ||
                          DEFAULT_PALETTE[status]
                        : null;

                      // Use Legend Colors strictly for the card
                      const colors = {
                        bg: `${typeColors.bg}/15 dark:bg-white/5`, // Slightly tone down dark mode background tint for higher text contrast
                        text: "text-slate-900 dark:text-white", // AAA High Contrast Text
                        border: typeColors.border
                      };

                      const style = getEventStyle(event);
                      const adjustedStyle = {
                        ...style,
                        top: `${(parseFloat(style.top) / 60) * 100}px`,
                        height: `${(parseFloat(style.height) / 60) * 100}px`,
                      };

                      return (
                        <div
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={`absolute left-2 right-2 ${colors.bg} ${colors.border} border-l-4 rounded-2xl p-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group ${colors.text} ${
                            isLive
                              ? "ring-2 ring-iu-blue ring-offset-2 ring-offset-background z-10"
                              : ""
                          }`}
                          style={adjustedStyle}
                        >
                          {isLive && (
                            <div className="absolute top-2 right-2 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-iu-blue opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-iu-blue"></span>
                            </div>
                          )}
                          <div className="flex flex-col h-full">
                            <div className="flex items-start gap-2 mb-1">
                              <div
                                className={`p-1.5 rounded-lg bg-white/50 dark:bg-black/20 ${colors.text} group-hover:scale-110 transition-transform shrink-0`}
                              >
                                <EventIcon
                                  type={event.type}
                                  className="h-3.5 w-3.5"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className={`text-[10px] font-black uppercase tracking-wider ${colors.text} opacity-70 leading-none mb-1`}>
                                  {event.startTime} – {event.endTime}
                                </div>
                                <div
                                  className={`font-bold text-xs leading-tight truncate ${colors.text}`}
                                >
                                  {event.title}
                                </div>
                              </div>
                            </div>

                            <div className="mt-auto flex items-center gap-2 opacity-100 transition-opacity">
                              <div className={`flex items-center gap-1 text-[9px] font-bold ${colors.text}`}>
                                {event.isOnline ? (
                                  <Video size={10} />
                                ) : (
                                  <MapPin size={10} />
                                )}
                                <span className="truncate">
                                  {event.isOnline ? "Zoom" : event.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl shadow-2xl shadow-iu-blue/5 overflow-x-auto">
            {/* Month Header */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/20 min-w-[800px]">
              {(language === "de"
                ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
                : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              ).map((day) => (
                <div
                  key={day}
                  className="p-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-7 min-w-[800px]">
              {Array.from({ length: (monthDays[0].getDay() + 6) % 7 }).map(
                (_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[180px] p-4 border-b border-r border-border/50 bg-muted/5"
                  />
                )
              )}

              {monthDays.map((date) => {
                const dateStr = toISODate(date);
                const isToday = dateStr === todayISO;
                const dayEvents = getEventsForDate(date);
                
                const status = currentPlan ? getBlockStatusForDate(currentPlan, date) : null;
                const phaseConfig = status
                  ? currentPlan?.paletteOverrides?.[status] ||
                    DEFAULT_PALETTE[status]
                  : null;

                return (
                  <div
                    key={dateStr}
                    className={`min-h-[180px] p-4 border-b border-r border-border/50 transition-all hover:bg-iu-blue/5 group ${isToday ? "bg-iu-blue/[0.02]" : ""} ${phaseConfig ? toSoftPhaseBg(phaseConfig.bg) : ""}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-10 text-lg font-bold rounded-2xl transition-all ${
                          isToday
                            ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20 scale-110"
                            : "text-foreground"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      {status === "feiertag" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-iu-gold text-white">
                          <Flag className="h-3 w-3" />
                          {language === "de" ? "Feiertag" : "Holiday"}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      {dayEvents.slice(0, 3).map((event) => {
                        const typeColors = EVENT_COLORS[event.type] || EVENT_COLORS.Integriert;
                        
                        // Use Legend Colors strictly for the card
                        const colors = {
                           bg: `${typeColors.bg}/15 dark:bg-white/5`,
                           text: "text-slate-900 dark:text-white",
                           border: typeColors.border
                        };

                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`text-[10px] px-3 py-2 rounded-xl cursor-pointer ${colors.bg} ${colors.text} font-bold border-l-4 ${colors.border} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all truncate flex items-center gap-2`}
                          >
                            <span className="opacity-80 shrink-0">
                              {event.startTime}
                            </span>
                            <span className="truncate">{event.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[10px] text-muted-foreground font-bold text-center py-1 bg-muted/20 rounded-lg">
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info & Legend Section */}
        <div className="space-y-6 sm:space-y-8">
          <ScheduleLegend t={t} />

          {/* Semester Plan Section */}
          <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-5 sm:p-6 lg:p-8">
            <h3 className="text-lg sm:text-xl font-black text-foreground mb-6 sm:mb-8 flex items-center gap-3">
              <CalendarDays size={20} className="text-iu-blue dark:text-white sm:hidden" />
              <CalendarDays size={24} className="text-iu-blue dark:text-white hidden sm:block" />
              {t.semesterPlan}
            </h3>

            <div className="space-y-8 sm:space-y-12">
              {/* Main Phases - Horizontal Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {semesterBlocks
                  .filter((b) => b.status !== "feiertag")
                  .map((block, idx) => {
                    const Icon =
                      block.status === "praxis"
                        ? Briefcase
                        : block.status === "klausurphase"
                          ? FileCheck
                          : block.status === "nachpruefung"
                            ? MessageSquare
                            : BookOpen;

                    return (
                      <div
                        key={idx}
                        className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-500 relative overflow-hidden group ${
                          block.isActive
                            ? "bg-iu-blue/10 border-iu-blue/30 shadow-xl shadow-iu-blue/10 scale-[1.02]"
                            : "bg-card border-border/50 hover:border-iu-blue/30 hover:shadow-lg hover:shadow-iu-blue/5"
                        }`}
                      >
                        {block.isActive && (
                          <div className="absolute top-0 right-0 px-4 py-1.5 bg-iu-blue text-white text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-lg">
                            {language === "de" ? "AKTUELL" : "CURRENT"}
                          </div>
                        )}
                        <div className="flex items-center gap-4 sm:gap-5">
                          <div
                            className={`p-3 sm:p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${
                              block.isActive
                                ? `${block.config.bg} ${block.config.text} shadow-lg`
                                : `${block.config.bg} ${block.config.text}`
                            }`}
                          >
                            <Icon size={20} className="sm:hidden" />
                            <Icon size={24} className="hidden sm:block" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-foreground mb-1 group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                              {block.config.label}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar
                                size={12}
                                className="text-iu-blue/50 dark:text-white"
                              />
                              <div className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                                {block.startDate} – {block.endDate}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar for active block */}
                        {block.isActive && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-iu-blue/10">
                            <div className="h-full bg-iu-blue w-1/2 animate-pulse" />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Holidays - Horizontal Grid */}
              <div className="pt-12 border-t border-border/50">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-iu-gold rounded-full" />
                    <h4 className="text-lg font-bold text-foreground">
                      {language === "de"
                        ? "Nationale Feiertage"
                        : "National Holidays"}
                    </h4>
                  </div>
                  <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-black/90 text-foreground dark:text-white dark:bg-white/90 dark:text-black">
                    {language === "de" ? "VORLESUNGSFREI" : "NO LECTURES"}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {semesterBlocks
                    .filter((b) => b.status === "feiertag")
                    .map((block, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 group hover:border-iu-gold hover:shadow-lg hover:shadow-amber-500/5 transition-all"
                      >
                      <div className="p-3 rounded-xl bg-iu-gold text-white group-hover:scale-110 transition-transform">
                        <Flag size={20} />
                      </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-foreground truncate group-hover:text-iu-gold transition-colors">
                            {block.config.label}
                          </div>
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-0.5">
                            {block.startDate}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <ScheduleEventModal
          selectedEvent={selectedEvent}
          locale={locale}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
