import React, { useMemo, useState } from "react";

import {
  CalendarDays as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  GraduationCap,
  Video,
  X as CloseIcon,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

// ────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ────────────────────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  de: {
    courses: "Courses",
    eventsCalendar: "Events & Kalender",
    subtitle: "Alle Termine auf einen Blick, inkl. Kalender-Export",
    all: "Alle",
    lecture: "Vorlesung",
    seminar: "Seminar",
    lab: "Praktikum",
    officeHours: "Sprechstunde",
    previousMonth: "Vorheriger Monat",
    today: "Heute",
    nextMonth: "Nächster Monat",
    calendarView: "Kalenderansicht",
    weekdays: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
    more: "mehr",
    selectedDay: "Ausgewählter Tag",
    noEvents: "Keine Termine für diesen Tag.",
    details: "Details",
    openZoom: "Zoom öffnen",
    saveIcs: ".ics speichern",
    googleCalendar: "Google Kalender",
    close: "Schließen",
  },
  en: {
    courses: "Courses",
    eventsCalendar: "Events & Calendar",
    subtitle: "All appointments at a glance, including calendar export",
    all: "All",
    lecture: "Lecture",
    seminar: "Seminar",
    lab: "Lab",
    officeHours: "Office Hours",
    previousMonth: "Previous Month",
    today: "Today",
    nextMonth: "Next Month",
    calendarView: "Calendar View",
    weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    more: "more",
    selectedDay: "Selected Day",
    noEvents: "No events for this day.",
    details: "Details",
    openZoom: "Open Zoom",
    saveIcs: "Save .ics",
    googleCalendar: "Google Calendar",
    close: "Close",
  },
};

type EventType = "Lecture" | "Seminar" | "Lab" | "Office Hours";

interface CalendarEvent {
  id: number;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: string;
  location: string;
  professor?: string;
  zoom: string | null;
  description?: string;
}

// Demo events (can be replaced with API data later)
const EVENTS: CalendarEvent[] = [
  {
    id: 1,
    title: "Webentwicklung - Vorlesung",
    type: "Lecture",
    date: "2025-10-27",
    time: "10:00",
    duration: "90 minutes",
    location: "Hörsaal A1, Hammerbrook",
    professor: "Prof. Dr. Schmidt",
    zoom: "https://zoom.us/j/1234567890",
    description: "Moderne Web-Technologien und Best Practices",
  },
  {
    id: 2,
    title: "Datenbankdesign - Seminar",
    type: "Seminar",
    date: "2025-10-27",
    time: "13:00",
    duration: "60 minutes",
    location: "Seminarraum B2, Hammerbrook",
    professor: "Prof. Dr. Mueller",
    zoom: "https://zoom.us/j/0987654321",
    description: "Übungen zu Datenbank-Normalisierung",
  },
  {
    id: 3,
    title: "Cloud Computing - Praktikum",
    type: "Lab",
    date: "2025-10-28",
    time: "14:00",
    duration: "120 minutes",
    location: "Computerlab C3, Hammerbrook",
    professor: "Prof. Dr. Weber",
    zoom: null,
    description: "Hands-on mit AWS und Docker",
  },
  {
    id: 4,
    title: "Sprechstunde Betreuer",
    type: "Office Hours",
    date: "2025-10-29",
    time: "15:00",
    duration: "30 minutes",
    location: "Virtual",
    professor: "Prof. Dr. Bauer",
    zoom: "https://zoom.us/j/1111111111",
    description: "Individuelle Beratung für Abschlussarbeiten",
  },
];

export const loader = async () => {
  return null;
};

const typeStyles: Record<
  EventType,
  {
    badge: string;
    dot: string;
  }
> = {
  Lecture: {
    badge: "from-blue-600 to-cyan-600",
    dot: "bg-blue-600",
  },
  Seminar: {
    badge: "from-purple-600 to-pink-600",
    dot: "bg-purple-600",
  },
  Lab: {
    badge: "from-green-600 to-emerald-600",
    dot: "bg-emerald-600",
  },
  "Office Hours": {
    badge: "from-orange-600 to-red-600",
    dot: "bg-orange-600",
  },
};

function fmtMonth(date: Date) {
  return date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildMonthGrid(current: Date): Date[] {
  // Build a 6-week grid starting on Monday
  const first = startOfMonth(current);
  const dayOfWeek = (first.getDay() + 6) % 7; // Mon=0..Sun=6
  const gridStart = new Date(first);
  gridStart.setDate(first.getDate() - dayOfWeek);
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }
  return days;
}

function parseDurationMinutes(str: unknown): number {
  const m = /([0-9]+)\s*minute/.exec(String(str).toLowerCase());
  return m ? parseInt(m[1], 10) : 60;
}

function toICSDateUTC(date: Date) {
  const iso = date.toISOString().replace(/[-:]/g, "").replace(".000", "");
  return iso.replace(/Z$/, "Z"); // YYYYMMDDTHHMMSSZ
}

function buildGoogleCalendarUrl(evt: CalendarEvent) {
  const start = new Date(`${evt.date}T${evt.time}:00`);
  const end = new Date(start.getTime() + parseDurationMinutes(evt.duration) * 60000);
  const dates = `${toICSDateUTC(start)}/${toICSDateUTC(end)}`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: evt.title,
    dates,
    details: `${evt.description || ""}\nDozent: ${evt.professor || ""}`,
    location: evt.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function downloadICS(evt: CalendarEvent) {
  const uid = `${evt.id}@iu-portal`;
  const start = new Date(`${evt.date}T${evt.time}:00`);
  const end = new Date(start.getTime() + parseDurationMinutes(evt.duration) * 60000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//IU Student Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toICSDateUTC(new Date())}`,
    `DTSTART:${toICSDateUTC(start)}`,
    `DTEND:${toICSDateUTC(end)}`,
    `SUMMARY:${evt.title}`,
    `DESCRIPTION:${(evt.description || "").replace(/\n/g, "\\n")}`,
    `LOCATION:${evt.location || ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${evt.title.replace(/[^a-z0-9]+/gi, "-")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Events() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 9, 1)); // Oct 2025 sample
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedType, setSelectedType] = useState<"All" | EventType>("All");

  const days = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);
  const eventsByDate = useMemo<Map<string, CalendarEvent[]>>(() => {
    const map = new Map<string, CalendarEvent[]>();
    (selectedType === "All" ? EVENTS : EVENTS.filter((e) => e.type === selectedType)).forEach(
      (e) => {
        const list = map.get(e.date) || [];
        list.push(e);
        map.set(e.date, list);
      }
    );
    return map;
  }, [selectedType]);

  const monthLabel = fmtMonth(currentMonth);
  const types: Array<"All" | EventType> = [
    "All",
    "Lecture",
    "Seminar",
    "Lab",
    "Office Hours",
  ];

  return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Courses
            </div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              <CalendarIcon className="h-7 w-7 text-blue-600" /> Events & Kalender
            </h1>
            <p className="text-slate-600 mt-1">Alle Termine auf einen Blick, inkl. Kalender-Export</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                  selectedType === t
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Calendar header */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200"
                onClick={() => setCurrentMonth((d) => addMonths(d, -1))}
                title="Vorheriger Monat"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200"
                onClick={() => setCurrentMonth(new Date())}
                title="Heute"
              >
                Heute
              </button>
              <button
                className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200"
                onClick={() => setCurrentMonth((d) => addMonths(d, 1))}
                title="Nächster Monat"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="text-lg font-extrabold tracking-tight">{monthLabel}</div>
            <div className="text-xs text-slate-500 font-semibold">Kalenderansicht</div>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 uppercase tracking-wide px-2 sm:px-6 pt-4">
            {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-px bg-slate-200">
            {days.map((d, idx) => {
              const inMonth = d.getMonth() === currentMonth.getMonth();
              const isToday = isSameDay(d, new Date());
              const key = toISODate(d);
              const daily = eventsByDate.get(key) || [];
              const topThree = daily.slice(0, 3);
              const more = daily.length - topThree.length;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDate(d)}
                  className={`relative min-h-[96px] bg-white px-2 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    inMonth ? "" : "bg-slate-50 text-slate-400"
                  } ${isToday ? "ring-2 ring-blue-600" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`text-xs font-bold ${inMonth ? "text-slate-900" : "text-slate-400"}`}>
                      {d.getDate()}
                    </div>
                    {isToday && (
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        Heute
                      </span>
                    )}
                  </div>
                  <div className="mt-1 space-y-1">
                    {topThree.map((e: CalendarEvent) => (
                      <div
                        key={e.id}
                        title={`${e.title} • ${e.time}`}
                        className={`truncate text-[11px] font-semibold text-white px-2 py-1 rounded shadow-sm bg-gradient-to-r ${
                          typeStyles[e.type]?.badge || "from-slate-600 to-slate-700"
                        }`}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setSelectedEvent(e);
                        }}
                      >
                        {e.time} · {e.title}
                      </div>
                    ))}
                    {more > 0 && (
                      <div className="text-[11px] font-semibold text-slate-600">+{more} mehr</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day drawer */}
        {selectedDate && (
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div>
                <div className="text-xs font-bold text-slate-500">Ausgewählter Tag</div>
                <div className="text-lg font-extrabold">
                  {selectedDate.toLocaleDateString("de-DE", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
              <button
                className="p-2 rounded-lg hover:bg-slate-100"
                onClick={() => setSelectedDate(null)}
                aria-label="Schließen"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {(() => {
                const ds = selectedDate
                  ? eventsByDate.get(toISODate(selectedDate)) || []
                  : [];
                if (ds.length === 0) {
                  return (
                    <div className="text-slate-600 font-semibold">Keine Termine für diesen Tag.</div>
                  );
                }
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ds.map((e: CalendarEvent) => (
                      <div
                        key={e.id}
                        className="border border-slate-200 rounded-xl p-4 hover:shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className={`inline-flex items-center text-[11px] font-bold text-white px-2 py-1 rounded bg-gradient-to-r ${
                              typeStyles[e.type]?.badge || "from-slate-600 to-slate-700"
                            }`}>
                              {e.type}
                            </div>
                            <div className="mt-2 text-slate-900 font-extrabold leading-snug">
                              {e.title}
                            </div>
                          </div>
                          <button
                            className="text-slate-500 hover:text-slate-900"
                            onClick={() => setSelectedEvent(e)}
                          >
                            Details
                          </button>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-slate-700">
                          <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {e.time} • {e.duration}</div>
                          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {e.location}</div>
                          {e.professor && (
                            <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> {e.professor}</div>
                          )}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {e.zoom && (
                            <a
                              href={e.zoom}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                            >
                              <Video className="h-4 w-4" /> Zoom öffnen
                            </a>
                          )}
                          <button
                            onClick={() => downloadICS(e)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400"
                          >
                            .ics speichern
                          </button>
                          <a
                            href={buildGoogleCalendarUrl(e)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400"
                          >
                            Google Kalender
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Event modal */}
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-slate-950/50" onClick={() => setSelectedEvent(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl mx-4">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <div>
                  <div className={`inline-flex items-center text-[11px] font-bold text-white px-2 py-1 rounded bg-gradient-to-r ${
                    typeStyles[selectedEvent.type]?.badge || "from-slate-600 to-slate-700"
                  }`}>
                    {selectedEvent.type}
                  </div>
                  <h3 className="mt-2 text-xl font-extrabold text-slate-900">
                    {selectedEvent.title}
                  </h3>
                </div>
                <button
                  className="p-2 rounded-lg hover:bg-slate-100"
                  onClick={() => setSelectedEvent(null)}
                  aria-label="Schließen"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="px-6 py-5 space-y-3 text-slate-700">
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {selectedEvent.time} • {selectedEvent.duration}</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {selectedEvent.location}</div>
                {selectedEvent.professor && (
                  <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> {selectedEvent.professor}</div>
                )}
                {selectedEvent.description && (
                  <p className="pt-2 text-slate-800">{selectedEvent.description}</p>
                )}
              </div>
              <div className="px-6 pb-6 flex flex-wrap gap-2">
                {selectedEvent.zoom && (
                  <a
                    href={selectedEvent.zoom}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    <Video className="h-4 w-4" /> Zoom öffnen
                  </a>
                )}
                <button
                  onClick={() => downloadICS(selectedEvent)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400"
                >
                  .ics speichern
                </button>
                <a
                  href={buildGoogleCalendarUrl(selectedEvent)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400"
                >
                  Google Kalender
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
   
  );
}
