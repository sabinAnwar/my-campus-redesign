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
  AlertTriangle,
  BookOpen,
  MessageCircleQuestion,
  Presentation,
  Users,
  Wrench,
  FileCheck,
  MessageSquare,
  PenTool,
  ExternalLink,
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
  type DayStatus,
} from "~/lib/studyPlans";
import { prisma } from "~/lib/prisma";

// Loader to fetch schedule events from database
export const loader = async () => {
  try {
    // Get first user (in production, get from session)
    const firstUser = await prisma.user.findFirst();
    const userId = firstUser?.id;

    let events: any[] = [];

    if (userId) {
      // Get all schedule events for this user
      const dbEvents = await prisma.scheduleEvent.findMany({
        where: { userId },
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
      });

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
            isOptional:
              e.eventType === "TUTORIUM" || e.eventType === "WORKSHOP",
          };
        }
      );
    }

    return { events };
  } catch (error) {
    console.error("Error loading schedule events:", error);
    return { events: [] };
  }
};

// Simple event type
interface ScheduleEvent {
  id: number;
  title: string;
  courseCode: string;
  type:
    | "Integriert"
    | "Q&A"
    | "Vorlesung"
    | "Tutorium"
    | "Workshop"
    | "Prüfung";
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  professor: string;
  room?: string;
  isOnline?: boolean;
  zoomLink?: string;
  isOptional?: boolean;
}

// Sample schedule data - in production, this would come from the database
const SCHEDULE_EVENTS: ScheduleEvent[] = [
  // Monday
  {
    id: 1,
    title: "Webentwicklung",
    courseCode: "DLBINGWP01",
    type: "Integriert",
    date: "2025-12-08",
    startTime: "09:00",
    endTime: "12:00",
    location: "Hammerbrook",
    professor: "Prof. Dr. Schmidt",
    room: "Raum 2.14",
    isOptional: false,
  },
  {
    id: 2,
    title: "Datenbanken Q&A",
    courseCode: "DLBINGDB01",
    type: "Q&A",
    date: "2025-12-08",
    startTime: "14:00",
    endTime: "15:30",
    location: "Online",
    professor: "Prof. Dr. Müller",
    isOnline: true,
    isOptional: true,
  },
  // Tuesday
  {
    id: 3,
    title: "Mathematik",
    courseCode: "DLBINGMT01",
    type: "Vorlesung",
    date: "2025-12-09",
    startTime: "10:00",
    endTime: "11:30",
    location: "Waterloohain",
    professor: "Dr. Weber",
    room: "Raum 3.22",
    isOptional: false,
  },
  {
    id: 4,
    title: "E-Commerce",
    courseCode: "DSBEC01",
    type: "Integriert",
    date: "2025-12-09",
    startTime: "14:00",
    endTime: "17:00",
    location: "HH - Christoph-Probst-Weg",
    professor: "Klein, Holger",
    room: "2.54 Jenischhaus",
    isOptional: false,
  },
  // Wednesday
  {
    id: 5,
    title: "Game Design",
    courseCode: "DLBINGDT01",
    type: "Integriert",
    date: "2025-12-10",
    startTime: "09:00",
    endTime: "12:00",
    location: "Hammerbrook",
    professor: "Prof. Dr. Nowak",
    room: "Raum 2.14",
    isOptional: false,
  },
  // Thursday
  {
    id: 6,
    title: "Mathe Tutorium",
    courseCode: "DLBINGMT01",
    type: "Tutorium",
    date: "2025-12-11",
    startTime: "14:00",
    endTime: "15:30",
    location: "Online",
    professor: "Tutor Meier",
    isOnline: true,
    zoomLink: "https://zoom.us/j/123456789",
    isOptional: true,
  },
  // Friday
  {
    id: 7,
    title: "Praxis-Workshop",
    courseCode: "PRAXIS",
    type: "Workshop",
    date: "2025-12-12",
    startTime: "10:00",
    endTime: "14:00",
    location: "Online",
    professor: "Team Praxis",
    isOnline: true,
    zoomLink: "https://zoom.us/j/987654321",
    isOptional: false,
  },
];

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

// German holidays for 2025/2026
const GERMAN_HOLIDAYS: { date: string; name: string; nameEn: string }[] = [
  // 2025
  { date: "2025-01-01", name: "Neujahr", nameEn: "New Year" },
  { date: "2025-04-18", name: "Karfreitag", nameEn: "Good Friday" },
  { date: "2025-04-21", name: "Ostermontag", nameEn: "Easter Monday" },
  { date: "2025-05-01", name: "Tag der Arbeit", nameEn: "Labour Day" },
  { date: "2025-05-29", name: "Christi Himmelfahrt", nameEn: "Ascension Day" },
  { date: "2025-06-09", name: "Pfingstmontag", nameEn: "Whit Monday" },
  {
    date: "2025-10-03",
    name: "Tag der Deutschen Einheit",
    nameEn: "German Unity Day",
  },
  { date: "2025-12-24", name: "Heiligabend", nameEn: "Christmas Eve" },
  { date: "2025-12-25", name: "1. Weihnachtstag", nameEn: "Christmas Day" },
  { date: "2025-12-26", name: "2. Weihnachtstag", nameEn: "Boxing Day" },
  { date: "2025-12-31", name: "Silvester", nameEn: "New Year's Eve" },
  // 2026
  { date: "2026-01-01", name: "Neujahr", nameEn: "New Year" },
  { date: "2026-04-03", name: "Karfreitag", nameEn: "Good Friday" },
  { date: "2026-04-06", name: "Ostermontag", nameEn: "Easter Monday" },
  { date: "2026-05-01", name: "Tag der Arbeit", nameEn: "Labour Day" },
  { date: "2026-05-14", name: "Christi Himmelfahrt", nameEn: "Ascension Day" },
  { date: "2026-05-25", name: "Pfingstmontag", nameEn: "Whit Monday" },
  {
    date: "2026-10-03",
    name: "Tag der Deutschen Einheit",
    nameEn: "German Unity Day",
  },
  { date: "2026-12-24", name: "Heiligabend", nameEn: "Christmas Eve" },
  { date: "2026-12-25", name: "1. Weihnachtstag", nameEn: "Christmas Day" },
  { date: "2026-12-26", name: "2. Weihnachtstag", nameEn: "Boxing Day" },
  { date: "2026-12-31", name: "Silvester", nameEn: "New Year's Eve" },
];

// Helper to check if a date is a holiday
function getHoliday(dateStr: string, language: string) {
  const holiday = GERMAN_HOLIDAYS.find((h) => h.date === dateStr);
  if (holiday) {
    return language === "de" ? holiday.name : holiday.nameEn;
  }
  return null;
}

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
    bg: "bg-blue-200 dark:bg-blue-800/60",
    border: "border-blue-600 dark:border-blue-400",
    text: "text-blue-900 dark:text-blue-50",
    dotColor: "#2563eb",
    desc: "Integrierte Vorlesung mit Live-Unterricht & Übungen",
    descEn: "Integrated lecture with live teaching & exercises",
  },
  "Q&A": {
    bg: "bg-orange-200 dark:bg-orange-800/60",
    border: "border-orange-600 dark:border-orange-400",
    text: "text-orange-900 dark:text-orange-50",
    dotColor: "#ea580c",
    desc: "Q&A Sprint – Fragen an den Dozenten (optional)",
    descEn: "Q&A Sprint – Questions to professor (optional)",
  },
  Vorlesung: {
    bg: "bg-sky-200 dark:bg-sky-800/60",
    border: "border-sky-600 dark:border-sky-400",
    text: "text-sky-900 dark:text-sky-50",
    dotColor: "#0284c7",
    desc: "Normale Vorlesung mit Dozent",
    descEn: "Standard lecture with professor",
  },
  Tutorium: {
    bg: "bg-teal-200 dark:bg-teal-800/60",
    border: "border-teal-600 dark:border-teal-400",
    text: "text-teal-900 dark:text-teal-50",
    dotColor: "#0d9488",
    desc: "Tutorium – Lernunterstützung durch Tutoren (optional)",
    descEn: "Tutorial – Learning support by tutors (optional)",
  },
  Workshop: {
    bg: "bg-yellow-200 dark:bg-yellow-700/60",
    border: "border-yellow-600 dark:border-yellow-400",
    text: "text-yellow-900 dark:text-yellow-50",
    dotColor: "#ca8a04",
    desc: "Workshop – Praktische Projektarbeit",
    descEn: "Workshop – Hands-on project work",
  },
  Prüfung: {
    bg: "bg-red-300 dark:bg-red-800/70",
    border: "border-red-600 dark:border-red-400",
    text: "text-red-900 dark:text-red-50",
    dotColor: "#dc2626",
    desc: "Klausur oder mündliche Prüfung",
    descEn: "Written or oral exam",
  },
  Seminar: {
    bg: "bg-fuchsia-200 dark:bg-fuchsia-800/60",
    border: "border-fuchsia-600 dark:border-fuchsia-400",
    text: "text-fuchsia-900 dark:text-fuchsia-50",
    dotColor: "#c026d3",
    desc: "Seminar – Interaktive Diskussion",
    descEn: "Seminar – Interactive discussion",
  },
  Uebung: {
    bg: "bg-lime-200 dark:bg-lime-800/60",
    border: "border-lime-600 dark:border-lime-400",
    text: "text-lime-900 dark:text-lime-50",
    dotColor: "#65a30d",
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
  const { events: dbEvents } = useLoaderData<{ events: ScheduleEvent[] }>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(
    null
  );
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [showOptional, setShowOptional] = useState(true);

  // Use database events if available, otherwise fallback to hardcoded
  const scheduleEvents = dbEvents.length > 0 ? dbEvents : SCHEDULE_EVENTS;

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const monthDays = useMemo(
    () => getMonthDays(startOfMonth(currentDate)),
    [currentDate]
  );
  const todayISO = toISODate(new Date());

  // Get current study phase
  const currentPlan = STUDY_PLANS[0];
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
  // Also adds holidays as special events
  const getEventsForDate = (date: Date) => {
    const dateStr = toISODate(date);
    const events: ScheduleEvent[] = [];

    // Check if it's a holiday - add as special event
    const holidayName = getHoliday(dateStr, language);
    if (holidayName) {
      events.push({
        id: -1,
        title: holidayName,
        courseCode: "FEIERTAG",
        type: "Prüfung" as any, // Will use Feiertag colors via special handling
        date: dateStr,
        startTime: "00:00",
        endTime: "23:59",
        location: "",
        professor: "",
        isOptional: false,
        isHoliday: true,
      } as ScheduleEvent & { isHoliday: boolean });
    }

    // Add regular events (skip on holidays)
    if (!holidayName) {
      scheduleEvents.forEach((e) => {
        if (e.date !== dateStr) return;
        if (!showOptional && e.isOptional) return;
        events.push(e);
      });
    }

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
    noEvents: language === "de" ? "Keine Termine" : "No events",
    currentPhase: language === "de" ? "Aktuelle Phase" : "Current Phase",
    legend: language === "de" ? "Legende" : "Legend",
    semesterPlan: language === "de" ? "Semesterübersicht" : "Semester Overview",
    praxis: language === "de" ? "Praxisphase" : "Practical Phase",
    theorie: language === "de" ? "Theoriephase" : "Theory Phase",
    pruefung: language === "de" ? "Prüfungsphase" : "Exam Phase",
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
    holidays: language === "de" ? "Feiertage" : "Holidays",
    holidayNote:
      language === "de"
        ? "An Feiertagen finden keine Vorlesungen statt"
        : "No lectures on public holidays",
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
    const plan = STUDY_PLANS[0];
    if (!plan) return [];

    return plan.blocks.map((block) => {
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t.title}
                </h1>
                {/* Month and Year display */}
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {currentDate.toLocaleDateString(locale, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {viewMode === "week" ? (
                    <>
                      {weekDates[0].toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                      })}
                      {" – "}
                      {weekDates[4].toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                      })}
                      {" • "}
                      {t.weekShort}{" "}
                      {Math.ceil(
                        (weekDates[0].getTime() -
                          new Date(
                            weekDates[0].getFullYear(),
                            0,
                            1
                          ).getTime()) /
                          (7 * 24 * 60 * 60 * 1000)
                      ) + 1}
                    </>
                  ) : (
                    <>
                      {monthDays.length} {language === "de" ? "Tage" : "days"}
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1">
                <button
                  onClick={() => setViewMode("week")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    viewMode === "week"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                  {t.week}
                </button>
                <button
                  onClick={() => setViewMode("month")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    viewMode === "month"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  {t.month}
                </button>
              </div>

              {/* Optional Courses Toggle */}
              <button
                onClick={() => setShowOptional(!showOptional)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                  showOptional
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                {showOptional ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                {t.showOptional}
              </button>

              {/* ICS Export Button */}
              <button
                onClick={handleDownloadICS}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                title={t.downloadCalendar}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">{t.downloadCalendar}</span>
              </button>

              <button
                onClick={goToToday}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {t.today}
              </button>
              <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <button
                  onClick={viewMode === "week" ? goToPrevWeek : goToPrevMonth}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
                <span className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[100px] text-center">
                  {viewMode === "week"
                    ? `${t.weekShort} ${Math.ceil((weekDates[0].getTime() - new Date(weekDates[0].getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}`
                    : currentDate.toLocaleDateString(locale, {
                        month: "short",
                        year: "numeric",
                      })}
                </span>
                <button
                  onClick={viewMode === "week" ? goToNextWeek : goToNextMonth}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Phase Banner */}
          <div
            className={`mt-4 p-3 rounded-xl ${statusConfig.bg} ${statusConfig.ring} ring-1 flex items-center gap-3`}
          >
            <Briefcase className={`h-5 w-5 ${statusConfig.text}`} />
            <span className={`text-sm font-semibold ${statusConfig.text}`}>
              {t.currentPhase}: {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Unified Legend - One clear box for everything */}
        <div className="mb-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          {/* Course Types - Main focus with shapes */}
          <div className="mb-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              {t.courseTypes}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {Object.entries(EVENT_COLORS).map(([type, colors]) => (
                <div
                  key={type}
                  className={`flex items-center gap-3 p-3 rounded-xl ${colors.bg} border-l-4 ${colors.border} hover:shadow-md transition-shadow`}
                  title={language === "de" ? colors.desc : colors.descEn}
                >
                  <EventIcon type={type} className={`h-5 w-5 ${colors.text}`} />
                  <div>
                    <div className={`text-sm font-bold ${colors.text}`}>
                      {type}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      {type === "Q&A" || type === "Tutorium"
                        ? language === "de"
                          ? "optional"
                          : "optional"
                        : language === "de"
                          ? "Pflicht"
                          : "required"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Semester Phases - Compact */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              {t.semesterPlan}
            </h3>
            <div className="flex flex-wrap gap-2">
              {semesterBlocks.map((block, idx) => (
                <div
                  key={idx}
                  className={`relative px-3 py-2 rounded-lg ${block.config.bg} ${
                    block.isActive ? `ring-2 ${block.config.ring}` : ""
                  }`}
                >
                  {block.isActive && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      {language === "de" ? "JETZT" : "NOW"}
                    </span>
                  )}
                  <div className={`text-xs font-bold ${block.config.text}`}>
                    {block.config.label}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    {block.startDate} – {block.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Holidays - Compact */}
          {GERMAN_HOLIDAYS.filter((h) => {
            const hDate = new Date(h.date);
            const now = new Date();
            const threeMonthsLater = new Date();
            threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
            return hDate >= now && hDate <= threeMonthsLater;
          }).length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {t.holidays}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {GERMAN_HOLIDAYS.filter((h) => {
                  const hDate = new Date(h.date);
                  const now = new Date();
                  const threeMonthsLater = new Date();
                  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);
                  return hDate >= now && hDate <= threeMonthsLater;
                })
                  .slice(0, 5)
                  .map((holiday) => (
                    <span
                      key={holiday.date}
                      className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    >
                      {new Date(holiday.date).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                      })}{" "}
                      {language === "de" ? holiday.name : holiday.nameEn}
                    </span>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Calendar Grid - Week View */}
        {viewMode === "week" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Header Row - Days */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)] border-b border-slate-200 dark:border-slate-700">
              <div className="p-3 bg-slate-50 dark:bg-slate-800" />
              {weekDates.map((date, idx) => {
                const dateStr = toISODate(date);
                const isToday = dateStr === todayISO;
                
                // Get phase status for header
                const dayBlock = currentPlan?.blocks.find(
                  (b) => dateStr >= b.start && dateStr <= b.end
                );
                const dayStatus = dayBlock?.status;
                const phaseConfig = dayStatus
                  ? currentPlan?.paletteOverrides?.[dayStatus] ||
                    DEFAULT_PALETTE[dayStatus]
                  : null;
                
                return (
                  <div
                    key={idx}
                    className={`p-3 text-center border-l border-slate-200 dark:border-slate-700 ${
                      phaseConfig ? phaseConfig.bg : isToday
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "bg-slate-50 dark:bg-slate-800"
                    }`}
                  >
                    <div
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        phaseConfig ? phaseConfig.text : isToday
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {dayNames[idx]}
                    </div>
                    <div
                      className={`text-xl font-bold mt-1 ${
                        isToday
                          ? "bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                          : phaseConfig ? phaseConfig.text : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {date.getDate()}
                    </div>
                    {phaseConfig && (
                      <div className={`text-[9px] font-medium mt-1 ${phaseConfig.text} opacity-80`}>
                        {phaseConfig.label.split(" ")[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-[60px_repeat(5,1fr)]">
              {/* Time Labels */}
              <div className="border-r border-slate-200 dark:border-slate-700">
                {TIME_SLOTS.map((time) => (
                  <div
                    key={time}
                    className="h-[60px] flex items-start justify-end pr-2 pt-1 text-xs text-slate-500 dark:text-slate-400 font-medium"
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

                // Get phase status for this day (same as month view)
                const dayBlock = currentPlan?.blocks.find(
                  (b) => dateStr >= b.start && dateStr <= b.end
                );
                const dayStatus = dayBlock?.status;
                const phaseConfig = dayStatus
                  ? currentPlan?.paletteOverrides?.[dayStatus] ||
                    DEFAULT_PALETTE[dayStatus]
                  : null;

                return (
                  <div
                    key={dayIdx}
                    className={`relative border-l border-slate-200 dark:border-slate-700 ${
                      phaseConfig ? phaseConfig.bg : isToday ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                    style={{ height: `${TIME_SLOTS.length * 60}px` }}
                  >
                    {/* Hour lines */}
                    {TIME_SLOTS.map((_, idx) => (
                      <div
                        key={idx}
                        className="absolute w-full border-t border-slate-100 dark:border-slate-800/50"
                        style={{ top: `${idx * 60}px` }}
                      />
                    ))}

                    {/* Events */}
                    {events.map((event) => {
                      // Check if it's a holiday
                      const isHoliday = (event as any).isHoliday;

                      if (isHoliday) {
                        // Render holiday as full-day banner
                        return (
                          <div
                            key={event.id}
                            className="absolute left-1 right-1 top-2 bg-slate-700 dark:bg-slate-800 border-l-4 border-amber-500 rounded-r-lg p-2"
                          >
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-amber-400" />
                              <span className="text-xs font-bold text-white">
                                {event.title}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-300 mt-0.5">
                              {language === "de"
                                ? "Vorlesungsfrei"
                                : "No classes"}
                            </div>
                          </div>
                        );
                      }

                      const colors =
                        EVENT_COLORS[event.type] || EVENT_COLORS.Integriert;
                      const style = getEventStyle(event);

                      return (
                        <div
                          key={event.id}
                          className={`absolute left-1 right-1 ${colors.bg} ${colors.border} border-l-4 rounded-r-lg p-2 cursor-pointer hover:shadow-lg transition-shadow overflow-hidden ${event.isOptional ? "opacity-90" : ""}`}
                          style={style}
                          title={`${event.title}\n${event.courseCode}\n${event.startTime} - ${event.endTime}\n${event.location}${event.professor ? "\n" + event.professor : ""}${event.zoomLink ? "\n" + event.zoomLink : ""}`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5">
                              <EventIcon
                                type={event.type}
                                className={`h-4 w-4 ${colors.text}`}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div
                                className={`text-xs font-bold ${colors.text} truncate`}
                              >
                                {event.title}
                              </div>
                              <div className="text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                                {event.startTime} - {event.endTime}
                              </div>
                              <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate flex items-center gap-1">
                                {event.isOnline ? (
                                  <Video className="h-3 w-3 flex-shrink-0 text-blue-500" />
                                ) : (
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                )}
                                {event.isOnline && event.zoomLink ? (
                                  <a
                                    href={event.zoomLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Zoom-Raum{" "}
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                ) : (
                                  event.location
                                )}
                              </div>
                              {event.professor && (
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1 mt-0.5">
                                  <User className="h-3 w-3 flex-shrink-0" />
                                  {event.professor}
                                </div>
                              )}
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
        )}

        {/* Calendar Grid - Month View */}
        {viewMode === "month" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            {/* Month Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700">
              {(language === "de"
                ? ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
                : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
              ).map((day, idx) => (
                <div
                  key={day}
                  className={`p-3 text-center text-xs font-semibold uppercase tracking-wider ${
                    idx >= 5
                      ? "text-slate-400 dark:text-slate-500"
                      : "text-slate-600 dark:text-slate-400"
                  } bg-slate-50 dark:bg-slate-800`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7">
              {/* Empty cells for days before first day of month */}
              {Array.from({ length: (monthDays[0].getDay() + 6) % 7 }).map(
                (_, idx) => (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[130px] p-2 border-b border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50"
                  />
                )
              )}

              {/* Actual days */}
              {monthDays.map((date) => {
                const dateStr = toISODate(date);
                const isToday = dateStr === todayISO;
                const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                const dayEvents = getEventsForDate(date);

                // Get phase status for this day
                const dayBlock = currentPlan?.blocks.find(
                  (b) => dateStr >= b.start && dateStr <= b.end
                );
                const dayStatus = dayBlock?.status;
                const phaseConfig = dayStatus
                  ? currentPlan?.paletteOverrides?.[dayStatus] ||
                    DEFAULT_PALETTE[dayStatus]
                  : null;

                return (
                  <div
                    key={dateStr}
                    className={`min-h-[130px] p-2 border-b border-r border-slate-100 dark:border-slate-800 transition-all hover:opacity-90 ${
                      isToday ? "ring-2 ring-blue-500 ring-inset" : ""
                    } ${phaseConfig ? phaseConfig.bg : isWeekend ? "bg-slate-50/50 dark:bg-slate-900/50" : ""}`}
                  >
                    {/* Day number */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 text-sm font-bold rounded-full ${
                          isToday
                            ? "bg-blue-600 text-white"
                            : phaseConfig
                              ? phaseConfig.text
                              : isWeekend
                                ? "text-slate-400 dark:text-slate-500"
                                : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </div>

                    {/* Events for this day */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => {
                        // Check if it's a holiday
                        const isHoliday = (event as any).isHoliday;

                        if (isHoliday) {
                          return (
                            <div
                              key={event.id}
                              className="text-[10px] px-1.5 py-1 rounded truncate bg-slate-700 dark:bg-slate-800 text-white font-medium flex items-center gap-1"
                            >
                              <AlertTriangle className="h-3 w-3 text-amber-400 flex-shrink-0" />
                              {event.title}
                            </div>
                          );
                        }

                        const colors =
                          EVENT_COLORS[event.type] || EVENT_COLORS.Integriert;
                        return (
                          <div
                            key={event.id}
                            className={`text-[10px] px-1.5 py-1.5 rounded cursor-pointer ${colors.bg} ${colors.text} font-medium hover:shadow-md transition-shadow border-l-2 ${colors.border}`}
                            title={`${event.title}\n${event.startTime} - ${event.endTime}\n${event.location}${event.professor ? "\n" + event.professor : ""}${event.zoomLink ? "\nZoom: " + event.zoomLink : ""}`}
                          >
                            <div className="flex items-center gap-1">
                              <EventIcon
                                type={event.type}
                                className={`h-3 w-3 ${colors.text}`}
                              />
                              <span className="font-bold truncate">
                                {event.startTime}
                              </span>
                              <span className="truncate flex-1">
                                {event.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5 text-[9px] opacity-80">
                              {event.isOnline ? (
                                <Video className="h-2.5 w-2.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                              ) : (
                                <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                              )}
                              <span className="truncate">
                                {event.isOnline ? "Online" : event.location}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div
                          className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold text-center py-0.5 bg-slate-100 dark:bg-slate-800 rounded cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
                          onClick={() => setViewMode("week")}
                        >
                          +{dayEvents.length - 3}{" "}
                          {language === "de" ? "mehr" : "more"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEvent(null)}
          >
            <div
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      EVENT_COLORS[selectedEvent.type]?.bg || "bg-slate-100"
                    } ${EVENT_COLORS[selectedEvent.type]?.text || "text-slate-900"} mb-2`}
                  >
                    <EventIcon type={selectedEvent.type} className="h-4 w-4" />
                    {selectedEvent.type}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {selectedEvent.courseCode}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <span className="text-slate-400 dark:text-slate-500 text-xl">
                    ×
                  </span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {new Date(selectedEvent.date).toLocaleDateString(locale, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-5 w-5 text-emerald-500" />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {selectedEvent.location}
                    </div>
                    {selectedEvent.room && (
                      <div className="text-slate-500 dark:text-slate-400">
                        {selectedEvent.room}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <User className="h-5 w-5 text-purple-500" />
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {selectedEvent.professor}
                  </div>
                </div>

                {selectedEvent.isOnline && selectedEvent.zoomLink && (
                  <a
                    href={selectedEvent.zoomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <Video className="h-5 w-5" />
                    Zoom-Meeting beitreten
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Today's Schedule Summary (Mobile) */}
        <div className="mt-6 lg:hidden">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            {language === "de" ? "Heute" : "Today"}
          </h2>
          <div className="space-y-2">
            {getEventsForDate(new Date()).length === 0 ? (
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400">
                {t.noEvents}
              </div>
            ) : (
              getEventsForDate(new Date()).map((event) => {
                const colors =
                  EVENT_COLORS[event.type] || EVENT_COLORS.Vorlesung;
                return (
                  <div
                    key={event.id}
                    className={`p-4 ${colors.bg} border-l-4 ${colors.border} rounded-xl`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className={`font-bold ${colors.text}`}>
                          {event.title}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {event.startTime} - {event.endTime} · {event.location}
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-slate-400" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
