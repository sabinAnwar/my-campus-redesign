import React, { useState, useMemo } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  User,
  Video,
  Briefcase,
  GraduationCap,
  Info,
  Calendar,
  Grid3X3,
  Filter,
  Check,
  Eye,
  EyeOff,
  Download,
  List,
  BookOpen,
  MessageCircleQuestion,
  Presentation,
  Users,
  Wrench,
  FileCheck,
  MessageSquare,
  PenTool,
  ExternalLink,
  X,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { useLoaderData } from "react-router-dom";
import {
  STUDY_PLANS,
  DEFAULT_PALETTE,
  toISODate,
  getMonthDays,
  startOfMonth,
  addMonths,
  getStudyPlanByStudiengang,
  type DayStatus,
  type StudyPlan,
} from "~/lib/studyPlans";
import { prisma } from "~/lib/prisma";
import { getUserFromRequest } from "~/lib/auth.server";
import type { LoaderFunctionArgs } from "react-router-dom";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    let user = await getUserFromRequest(request);

    // FALLBACK for development if no session
    if (!user) {
      user = await prisma.user.findUnique({
        where: { email: "sabin.elanwar@iu-study.org" },
      });
    }

    if (!user) return { events: [], userCourses: [], studiengangName: null };

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        studiengang: {
          include: {
            courses: true,
          },
        },
      },
    });

    if (!dbUser) return { events: [], userCourses: [], studiengangName: null };

    let events: any[] = [];
    let userCourses: { id: number; code: string; name: string }[] = [];
    let studiengangName: string | null = dbUser.studiengang?.name || null;

    // First, check for existing schedule events in DB
    const dbEvents = await prisma.scheduleEvent.findMany({
      where: { userId: dbUser.id },
      orderBy: [{ date: "asc" }, { startTime: "asc" }],
    });

    if (dbEvents.length > 0) {
      // Use existing schedule events
      events = dbEvents.map(
        (e: {
          id: number;
          title: string;
          courseCode: string | null;
          eventType: string;
          date: Date;
          startTime: string;
          endTime: string;
          location: string | null;
          professor: string | null;
        }) => {
          const isOnline = e.location?.toLowerCase() === "online";
          return {
            id: e.id,
            title: e.title,
            courseCode: e.courseCode || "",
            type: e.eventType.charAt(0) + e.eventType.slice(1).toLowerCase(),
            date: toISODate(e.date),
            startTime: e.startTime,
            endTime: e.endTime,
            location: e.location || "",
            professor: e.professor || "",
            room: null,
            isOnline,
            zoomLink: isOnline
              ? `https://iu-online.zoom.us/j/${e.courseCode?.replace(/[^0-9]/g, "") || "123456789"}`
              : undefined,
            isOptional: e.eventType === "TUTORIUM" || e.eventType === "Q&A",
          };
        }
      );
    }

    // Get user's courses from their Studiengang (Current Semester)
    if (dbUser.studiengang?.courses) {
      userCourses = dbUser.studiengang.courses
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

import type { ScheduleEvent } from "~/types/schedule";
export type { ScheduleEvent };

// Get week dates
function getWeekDates(date: Date): Date[] {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  const monday = new Date(date);
  monday.setDate(diff);

  const week: Date[] = [];
  for (let i = 0; i < 5; i++) {
    // Only weekdays
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

// Time slots for the grid
const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

// Shape types for event visualization
// Icon component for event type indicators using Lucide icons
const EVENT_ICONS: Record<string, LucideIcon> = {
  Integriert: BookOpen,
  "Q&A": MessageCircleQuestion,
  Vorlesung: Presentation,
  Tutorium: Users,
  Workshop: Wrench,
  Prüfung: FileCheck,
  Seminar: MessageSquare,
  Uebung: PenTool,
};

const EventIcon: React.FC<{ type: string; className?: string }> = ({
  type,
  className = "h-4 w-4",
}) => {
  const Icon = EVENT_ICONS[type] || BookOpen;
  return <Icon className={className} />;
};

// Event type colors with colored dots - vibrant & distinct
const EVENT_COLORS: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    dotColor: string;
    desc?: string;
    descEn?: string;
  }
> = {
  Integriert: {
    bg: "bg-iu-blue/10",
    border: "border-iu-blue/30",
    text: "text-iu-blue dark:text-iu-blue",
    dotColor: "#10b981",
    desc: "Integrierte Vorlesung mit Live-Unterricht & Übungen",
    descEn: "Integrated lecture with live teaching & exercises",
  },
  "Q&A": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    dotColor: "#f59e0b",
    desc: "Q&A Sprint – Fragen an den Dozenten (optional)",
    descEn: "Q&A Sprint – Questions to professor (optional)",
  },
  Vorlesung: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    dotColor: "#3b82f6",
    desc: "Normale Vorlesung mit Dozent",
    descEn: "Standard lecture with professor",
  },
  Tutorium: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-600 dark:text-teal-400",
    dotColor: "#14b8a6",
    desc: "Tutorium – Lernunterstützung durch Tutoren (optional)",
    descEn: "Tutorial – Learning support by tutors (optional)",
  },
  Workshop: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
    dotColor: "#6366f1",
    desc: "Workshop – Praktische Projektarbeit",
    descEn: "Workshop – Hands-on project work",
  },
  Prüfung: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
    dotColor: "#f43f5e",
    desc: "Klausur oder mündliche Prüfung",
    descEn: "Written or oral exam",
  },
  Seminar: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-600 dark:text-purple-400",
    dotColor: "#a855f7",
    desc: "Seminar – Interaktive Diskussion",
    descEn: "Seminar – Interactive discussion",
  },
  Uebung: {
    bg: "bg-lime-500/10",
    border: "border-lime-500/30",
    text: "text-lime-600 dark:text-lime-400",
    dotColor: "#84cc16",
    desc: "Übung – Praktische Aufgaben",
    descEn: "Exercise – Practical tasks",
  },
};

// Generate ICS file content for calendar export
function generateICSContent(
  events: ScheduleEvent[],
  studyBlocks: (typeof STUDY_PLANS)[0]["blocks"]
): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MyCampus//Schedule//DE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  // Add schedule events
  events.forEach((event) => {
    const startDate = event.date.replace(/-/g, "");
    const startTime = event.startTime.replace(":", "") + "00";
    const endTime = event.endTime.replace(":", "") + "00";

    lines.push(
      "BEGIN:VEVENT",
      `DTSTART:${startDate}T${startTime}`,
      `DTEND:${startDate}T${endTime}`,
      `SUMMARY:${event.title}`,
      `LOCATION:${event.location || ""}`,
      `DESCRIPTION:${event.courseCode}${event.professor ? " - " + event.professor : ""}${event.isOptional ? " (Optional)" : ""}`,
      `UID:${event.id}-${startDate}@mycampus`,
      "END:VEVENT"
    );
  });

  // Add study phase blocks
  studyBlocks.forEach((block, idx) => {
    const startDate = block.start.replace(/-/g, "");
    const endDate = block.end.replace(/-/g, "");
    const config = DEFAULT_PALETTE[block.status];

    lines.push(
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${startDate}`,
      `DTEND;VALUE=DATE:${endDate}`,
      `SUMMARY:${config.label}`,
      `DESCRIPTION:Semesterphase: ${config.label}`,
      `UID:phase-${idx}-${startDate}@mycampus`,
      "END:VEVENT"
    );
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

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
  const isEventLive = (event: ScheduleEvent) => {
    const todayStr = toISODate(now);
    if (event.date !== todayStr) return false;

    const [startH, startM] = event.startTime.split(":").map(Number);
    const [endH, endM] = event.endTime.split(":").map(Number);

    const startTime = new Date(now);
    startTime.setHours(startH, startM, 0);

    const endTime = new Date(now);
    endTime.setHours(endH, endM, 0);

    return now >= startTime && now <= endTime;
  };

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const monthDays = useMemo(
    () => getMonthDays(startOfMonth(currentDate)),
    [currentDate]
  );
  const todayISO = toISODate(new Date());

  // Get the study plan based on user's Studiengang
  // Different Studiengänge have different exam schedules and phases
  const currentPlan = useMemo(() => {
    return getStudyPlanByStudiengang(studiengangName);
  }, [studiengangName]);

  // Generate schedule events based on priority:
  // 1. Database events (if any)
  // 2. Events generated from user's enrolled courses
  // 3. Fallback to sample events
  // For month view, generate events for all weeks in the visible month
  const scheduleEvents = useMemo(() => {
    return dbEvents;
  }, [dbEvents]);

  // Get current study phase (using the Studiengang-specific plan)
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
  // Phase-based filtering:
  // - Praxisphase: only optional/workshop events (no regular lectures)
  // - Klausurphase: only Prüfung events (exams only)
  // - Nachprüfungsphase: only Prüfung events (exams only)
  // - Theoriephase: all events
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
      // Theoriephase: show all events

      events.push(e);
    });

    return events;
  };

  // Calculate event position and height
  const getEventStyle = (event: ScheduleEvent) => {
    const startHour = parseInt(event.startTime.split(":")[0]);
    const startMinute = parseInt(event.startTime.split(":")[1]);
    const endHour = parseInt(event.endTime.split(":")[0]);
    const endMinute = parseInt(event.endTime.split(":")[1]);

    const top = (startHour - 8) * 60 + startMinute; // 8:00 is the start
    const height = (endHour - startHour) * 60 + (endMinute - startMinute);

    return {
      top: `${top}px`,
      height: `${Math.max(height, 30)}px`,
    };
  };

  const locale = language === "de" ? "de-DE" : "en-US";
  const dayNames =
    language === "de"
      ? ["Mo", "Di", "Mi", "Do", "Fr"]
      : ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const t = {
    title: language === "de" ? "Stundenplan" : "Schedule",
    today: language === "de" ? "Heute" : "Today",
    week: language === "de" ? "Woche" : "Week",
    month: language === "de" ? "Monat" : "Month",
    list: language === "de" ? "Liste" : "List",
    noEvents: language === "de" ? "Keine Termine" : "No events",
    currentPhase: language === "de" ? "Aktuelle Phase" : "Current Phase",
    legend: language === "de" ? "Legende" : "Legend",
    semesterPlan: language === "de" ? "Semesterübersicht" : "Semester Overview",
    praxis: language === "de" ? "Praxisphase" : "Practical Phase",
    theorie: language === "de" ? "Theoriephase" : "Theory Phase",
    pruefung: language === "de" ? "Klausurwoche" : "Exam Week",
    ferien: language === "de" ? "Ferien" : "Holidays",
    weekShort: language === "de" ? "KW" : "W",
    showOptional: language === "de" ? "Optionale Kurse" : "Optional Courses",
    mandatory: language === "de" ? "Pflicht" : "Mandatory",
    optional: language === "de" ? "Optional" : "Optional",
    downloadCalendar:
      language === "de" ? "Kalender exportieren" : "Export Calendar",
    praxisNote:
      language === "de"
        ? "Praxisphase – nur optionale Kurse"
        : "Practical phase – optional courses only",
    courseTypes: language === "de" ? "Veranstaltungstypen" : "Course Types",
    courseTypesDesc:
      language === "de"
        ? "Was bedeuten die verschiedenen Farben?"
        : "What do the different colors mean?",
    // Event type translations
    eventTypes: {
      Integriert: language === "de" ? "Integriert" : "Integrated",
      "Q&A": "Q&A",
      Vorlesung: language === "de" ? "Vorlesung" : "Lecture",
      Tutorium: language === "de" ? "Tutorium" : "Tutorial",
      Workshop: "Workshop",
      Prüfung: language === "de" ? "Prüfung" : "Exam",
      Seminar: language === "de" ? "Seminar" : "Seminar",
      Uebung: language === "de" ? "Uebung" : "Exercise",
    } as Record<string, string>,
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

    // Sort blocks by start date and remove duplicates (some blocks overlap)
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

      // Check if current date is in this block
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
  }, [todayISO, locale]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <CalendarDays size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {language === "de"
                ? "Dein persönlicher Stundenplan und akademischer Kalender. Behalte alle Vorlesungen und Prüfungen im Blick."
                : "Your personal schedule and academic calendar. Keep track of all lectures and exams."}
            </p>

            {/* Current Phase Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusConfig.bg} ${statusConfig.text} border-current/10 text-sm font-bold w-fit mt-2`}
            >
              {currentStatus === "praxis" ? (
                <Briefcase size={16} />
              ) : (
                <GraduationCap size={16} />
              )}
              <span>{statusConfig.label}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 lg:flex-col lg:items-end">
            {/* View Toggle */}
            <div className="flex p-1.5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border shadow-sm">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  viewMode === "list"
                    ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List size={16} />
                {t.list}
              </button>
              <button
                onClick={() => setViewMode("week")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  viewMode === "week"
                    ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3X3 size={16} />
                {t.week}
              </button>
              <button
                onClick={() => setViewMode("month")}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  viewMode === "month"
                    ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar size={16} />
                {t.month}
              </button>
            </div>

            <button
              onClick={handleDownloadICS}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border text-foreground font-bold text-sm hover:border-iu-blue/50 transition-all shadow-sm"
            >
              <Download size={18} className="text-iu-blue" />
              {t.downloadCalendar}
            </button>
          </div>
        </div>
      </header>

      {/* Controls & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-8 p-6 rounded-[2rem] bg-card/30 backdrop-blur-xl border border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-background/50 rounded-xl p-1 border border-border">
            <button
              onClick={viewMode === "month" ? goToPrevMonth : goToPrevWeek}
              className="p-2.5 rounded-lg hover:bg-iu-blue/10 text-muted-foreground hover:text-iu-blue transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-1.5 text-sm font-bold text-foreground hover:text-iu-blue transition-colors"
            >
              {t.today}
            </button>
            <button
              onClick={viewMode === "month" ? goToNextMonth : goToNextWeek}
              className="p-2.5 rounded-lg hover:bg-iu-blue/10 text-muted-foreground hover:text-iu-blue transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <h2 className="text-xl font-black text-foreground ml-2">
            {currentDate.toLocaleDateString(locale, {
              month: "long",
              year: "numeric",
            })}
          </h2>
        </div>

        <button
          onClick={() => setShowOptional(!showOptional)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm border transition-all ${
            showOptional
              ? "bg-iu-blue/10 border-iu-blue/30 text-iu-blue"
              : "bg-background/50 border-border text-muted-foreground hover:border-iu-blue/30"
          }`}
        >
          {showOptional ? <Eye size={16} /> : <EyeOff size={16} />}
          {t.showOptional}
        </button>
      </div>

      {/* Main Calendar Area */}
      <div className="space-y-12">
        {viewMode === "list" ? (
          <div className="space-y-8">
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
                      className={`md:w-48 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border/50 ${
                        isToday ? "bg-iu-blue/5" : "bg-muted/10"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${
                          isToday ? "text-iu-blue" : "text-muted-foreground"
                        }`}
                      >
                        {dayNames[idx]}
                      </span>
                      <span
                        className={`text-4xl font-black mb-1 ${
                          isToday ? "text-iu-blue" : "text-foreground"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">
                        {date.toLocaleDateString(locale, { month: "short" })}
                      </span>
                      {phaseConfig && (
                        <div
                          className={`mt-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${phaseConfig.bg} ${phaseConfig.text} border-current/10`}
                        >
                          {phaseConfig.label}
                        </div>
                      )}
                    </div>

                    {/* Events List */}
                    <div className="flex-1 p-6 md:p-8">
                      {events.length > 0 ? (
                        <div className="grid gap-4">
                          {events.map((event, eIdx) => {
                            const isLive = isEventLive(event);
                            const colors =
                              EVENT_COLORS[event.type] ||
                              EVENT_COLORS.Integriert;

                            return (
                              <div
                                key={eIdx}
                                onClick={() => setSelectedEvent(event)}
                                className={`group relative flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-2xl bg-background/50 border transition-all cursor-pointer ${
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
                                    className={`p-2.5 rounded-xl ${isLive ? "bg-iu-blue text-white" : "bg-iu-blue/10 text-iu-blue"}`}
                                  >
                                    <Clock size={18} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-foreground leading-none">
                                      {event.startTime}
                                    </span>
                                    <span className="text-[10px] font-bold text-muted-foreground mt-1">
                                      {event.endTime}
                                    </span>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-lg text-foreground truncate group-hover:text-iu-blue transition-colors">
                                      {event.title}
                                    </h3>
                                    {event.isOptional && (
                                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                                        Optional
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/30 border border-border/50">
                                      <MapPin
                                        size={14}
                                        className="text-iu-blue/70"
                                      />
                                      <span className="font-medium">
                                        {event.location}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/30 border border-border/50">
                                      <User
                                        size={14}
                                        className="text-iu-blue/70"
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
                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                          {event.type}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Action */}
                                <div className="sm:ml-auto">
                                  <div
                                    className={`p-3 rounded-xl transition-all ${isLive ? "bg-iu-blue text-white" : "bg-muted/50 text-muted-foreground group-hover:bg-iu-blue group-hover:text-white"}`}
                                  >
                                    <ChevronRight size={18} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-12">
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
        ) : viewMode === "week" ? (
          <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl shadow-2xl shadow-iu-blue/5 overflow-x-auto">
            {/* Week Header */}
            <div className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-border bg-muted/20 min-w-[800px]">
              <div className="p-6" />
              {weekDates.map((date, idx) => {
                const dateStr = toISODate(date);
                const isToday = dateStr === todayISO;
                const dayBlock = currentPlan?.blocks.find(
                  (b) => dateStr >= b.start && dateStr <= b.end
                );
                const phaseConfig = dayBlock
                  ? currentPlan?.paletteOverrides?.[dayBlock.status] ||
                    DEFAULT_PALETTE[dayBlock.status]
                  : null;

                return (
                  <div
                    key={idx}
                    className={`p-6 text-center border-l border-border ${isToday ? "bg-iu-blue/5" : ""}`}
                  >
                    <div
                      className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${isToday ? "text-iu-blue" : "text-muted-foreground"}`}
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
                        className={`text-[10px] font-bold mt-2 uppercase tracking-widest ${phaseConfig.text} opacity-70`}
                      >
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
                    className="h-[100px] flex items-start justify-end pr-6 pt-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest"
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
                        className="absolute w-full border-t border-border/30"
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
                          <div className="w-2 h-2 rounded-full bg-rose-500 -ml-1 shadow-lg shadow-rose-500/50" />
                          <div className="flex-1 h-0.5 bg-rose-500/50" />
                        </div>
                      )}

                    {events.map((event) => {
                      const isLive = isEventLive(event);
                      const colors =
                        EVENT_COLORS[event.type] || EVENT_COLORS.Integriert;
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
                          className={`absolute left-2 right-2 ${colors.bg} ${colors.border} border-l-4 rounded-2xl p-4 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden group ${
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
                                <div className="text-[10px] font-black uppercase tracking-wider opacity-70 leading-none mb-1">
                                  {event.startTime} – {event.endTime}
                                </div>
                                <div
                                  className={`font-bold text-xs leading-tight truncate ${colors.text}`}
                                >
                                  {event.title}
                                </div>
                              </div>
                            </div>

                            <div className="mt-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
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
                const dayBlock = currentPlan?.blocks.find(
                  (b) => dateStr >= b.start && dateStr <= b.end
                );
                const phaseConfig = dayBlock
                  ? currentPlan?.paletteOverrides?.[dayBlock.status] ||
                    DEFAULT_PALETTE[dayBlock.status]
                  : null;

                return (
                  <div
                    key={dateStr}
                    className={`min-h-[180px] p-4 border-b border-r border-border/50 transition-all hover:bg-iu-blue/5 group ${isToday ? "bg-iu-blue/[0.02]" : ""} ${phaseConfig ? phaseConfig.bg : ""}`}
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
                    </div>

                    <div className="space-y-2">
                      {dayEvents.slice(0, 3).map((event) => {
                        const colors =
                          EVENT_COLORS[event.type] || EVENT_COLORS.Integriert;
                        return (
                          <div
                            key={event.id}
                            onClick={() => setSelectedEvent(event)}
                            className={`text-[10px] px-3 py-2 rounded-xl cursor-pointer ${colors.bg} ${colors.text} font-bold border-l-4 ${colors.border} shadow-sm hover:shadow-md hover:scale-[1.02] transition-all truncate flex items-center gap-2`}
                          >
                            <span className="opacity-70 shrink-0">
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
        <div className="space-y-8">
          {/* Legend Section */}
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

          {/* Semester Plan Section */}
          <div className="rounded-[2.5rem] border border-border bg-card/50 backdrop-blur-xl p-8">
            <h3 className="text-xl font-black text-foreground mb-8 flex items-center gap-3">
              <CalendarDays size={24} className="text-iu-blue" />
              {t.semesterPlan}
            </h3>

            <div className="space-y-12">
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
                        className={`p-6 rounded-3xl border transition-all duration-500 relative overflow-hidden group ${
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
                        <div className="flex items-center gap-5">
                          <div
                            className={`p-4 rounded-2xl transition-transform duration-500 group-hover:scale-110 ${
                              block.isActive
                                ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/20"
                                : "bg-muted/50 text-muted-foreground"
                            }`}
                          >
                            <Icon size={24} />
                          </div>
                          <div>
                            <div className="text-sm font-black text-foreground mb-1 group-hover:text-iu-blue transition-colors">
                              {block.config.label}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar
                                size={12}
                                className="text-iu-blue/50"
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
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                    <h4 className="text-lg font-bold text-foreground">
                      {language === "de"
                        ? "Nationale Feiertage"
                        : "National Holidays"}
                    </h4>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                    {language === "de" ? "VORLESUNGSFREI" : "NO LECTURES"}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {semesterBlocks
                    .filter((b) => b.status === "feiertag")
                    .map((block, idx) => (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-card border border-border flex items-center gap-4 group hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all"
                      >
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
                          <Calendar size={20} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-foreground truncate group-hover:text-amber-500 transition-colors">
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
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-card/95 backdrop-blur-2xl rounded-[3rem] p-10 max-w-xl w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-10">
              <div className="flex items-center gap-6">
                <div
                  className={`p-5 rounded-[2rem] ${EVENT_COLORS[selectedEvent.type]?.bg} ${EVENT_COLORS[selectedEvent.type]?.text} shadow-xl`}
                >
                  <EventIcon type={selectedEvent.type} className="h-10 w-10" />
                </div>
                <div>
                  <div
                    className={`text-xs font-bold uppercase tracking-[0.3em] mb-2 ${EVENT_COLORS[selectedEvent.type]?.text}`}
                  >
                    {selectedEvent.type}
                  </div>
                  <h3 className="text-3xl font-bold tracking-tight text-foreground">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-lg text-muted-foreground font-medium mt-1">
                    {selectedEvent.courseCode}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvent(null)}
                className="p-3 hover:bg-muted rounded-2xl transition-all"
              >
                <X size={32} className="text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="p-6 bg-muted/30 rounded-[2rem] border border-border/50">
                <div className="flex items-center gap-3 mb-4 text-iu-blue">
                  <Clock size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Zeit & Datum
                  </span>
                </div>
                <div className="font-bold text-xl text-foreground mb-1">
                  {selectedEvent.startTime} - {selectedEvent.endTime}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {new Date(selectedEvent.date).toLocaleDateString(locale, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </div>
              </div>

              <div className="p-6 bg-muted/30 rounded-[2rem] border border-border/50">
                <div className="flex items-center gap-3 mb-4 text-iu-blue">
                  <MapPin size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Ort
                  </span>
                </div>
                <div className="font-bold text-xl text-foreground mb-1">
                  {selectedEvent.location}
                </div>
                {selectedEvent.room && (
                  <div className="text-sm text-muted-foreground font-medium">
                    Raum: {selectedEvent.room}
                  </div>
                )}
              </div>

              <div className="p-6 bg-muted/30 rounded-[2rem] border border-border/50 md:col-span-2">
                <div className="flex items-center gap-3 mb-4 text-iu-blue">
                  <User size={20} />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Dozent
                  </span>
                </div>
                <div className="font-bold text-xl text-foreground">
                  {selectedEvent.professor}
                </div>
              </div>
            </div>

            {selectedEvent.isOnline && selectedEvent.zoomLink && (
              <a
                href={selectedEvent.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-4 w-full p-6 bg-iu-blue text-white rounded-[2rem] font-bold text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-iu-blue/20"
              >
                <Video size={24} />
                Zoom-Meeting beitreten
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
