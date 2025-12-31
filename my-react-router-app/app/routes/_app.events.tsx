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

import { TRANSLATIONS, EVENTS, typeStyles } from "~/constants/events";

import type { EventType, CalendarEvent } from "~/types/events";

export const loader = async () => {
  return null;
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

  const translatedEvents = useMemo(
    () =>
      EVENTS.map((event) => ({
        ...event,
        title:
          t.eventTitles[event.id.toString() as keyof typeof t.eventTitles] ||
          event.title,
        location:
          t.eventLocations[
            event.id.toString() as keyof typeof t.eventLocations
          ] || event.location,
        description:
          t.eventDescriptions[
            event.id.toString() as keyof typeof t.eventDescriptions
          ] || event.description,
      })),
    [t]
  );

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2025, 9, 1)); // Oct 2025 sample
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<"All" | EventType>("All");

  const days = useMemo(() => buildMonthGrid(currentMonth), [currentMonth]);
  const eventsByDate = useMemo<Map<string, CalendarEvent[]>>(() => {
    const map = new Map<string, CalendarEvent[]>();
    (selectedType === "All"
      ? translatedEvents
      : translatedEvents.filter((e) => e.type === selectedType)
    ).forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [selectedType, translatedEvents]);

  const monthLabel = fmtMonth(currentMonth);
  const types: Array<"All" | EventType> = [
    "All",
    "Lecture",
    "Seminar",
    "Lab",
    "Office Hours",
  ];

  return (
    <div className="min-h-screen bg-transparent p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="relative overflow-hidden bg-iu-blue rounded-[2.5rem] p-12 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full rotate-45 -mr-40 -mt-40 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full rotate-45 -ml-40 -mb-40 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="p-6 bg-white text-iu-blue rounded-3xl shadow-2xl flex items-center justify-center transition-transform hover:scale-110">
                <CalendarIcon className="h-14 w-14" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-1 w-10 bg-white/50" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">
                    {t.courses}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
                  {t.eventsCalendar}
                </h1>
                <p className="text-white/70 mt-4 text-lg font-medium max-w-xl">
                  {t.subtitle}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg active:scale-95 ${
                    selectedType === type
                      ? "bg-white text-iu-blue"
                      : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  {type === "All"
                    ? t.all
                    : t[type.toLowerCase().replace(" ", "")] || type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar card */}
        <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden relative">
          {/* Hover background effect */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-iu-blue/5 blur-[100px] rounded-full opacity-100 -mr-48 -mt-48"></div>

          {/* Calendar header */}
          <div className="relative z-10 flex items-center justify-between px-10 py-8 border-b border-border/50 bg-background/20">
            <div className="flex items-center gap-4">
              <button
                className="p-3 rounded-2xl bg-background/50 border border-border hover:bg-card hover:border-iu-blue/30 transition-all shadow-lg group"
                onClick={() => setCurrentMonth((d) => addMonths(d, -1))}
                title={t.previousMonth}
              >
                <ChevronLeft className="h-6 w-6 text-foreground group-hover:text-iu-blue" />
              </button>
              <button
                className="px-6 py-3 rounded-2xl bg-background/50 border border-border hover:bg-card hover:border-iu-blue/30 transition-all shadow-lg font-bold text-foreground hover:text-iu-blue"
                onClick={() => setCurrentMonth(new Date())}
                title={t.today}
              >
                {t.today}
              </button>
              <button
                className="p-3 rounded-2xl bg-background/50 border border-border hover:bg-card hover:border-iu-blue/30 transition-all shadow-lg group"
                onClick={() => setCurrentMonth((d) => addMonths(d, 1))}
                title={t.nextMonth}
              >
                <ChevronRight className="h-6 w-6 text-foreground group-hover:text-iu-blue" />
              </button>
            </div>
            <div className="text-3xl font-bold tracking-tight text-foreground">
              {monthLabel}
            </div>
            <div className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em]">
              {t.calendarView}
            </div>
          </div>

          {/* Weekdays */}
          <div className="relative z-10 grid grid-cols-7 text-center text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] px-4 py-6 border-b border-border/30">
            {t.weekdays.map((d) => (
              <div key={d} className="py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="relative z-10 grid grid-cols-7 gap-px bg-border/30">
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
                  className={`relative min-h-[140px] bg-card/40 px-4 py-4 text-left transition-all duration-300 hover:bg-card/80 group focus:outline-none ${
                    inMonth ? "" : "opacity-30"
                  } ${isToday ? "bg-iu-blue/5" : ""}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`text-lg font-bold ${inMonth ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {d.getDate()}
                    </div>
                    {isToday && (
                      <span className="text-[10px] font-black text-iu-blue bg-iu-blue/10 px-2 py-1 rounded-lg shadow-sm">
                        {t.today.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    {topThree.map((e: CalendarEvent) => (
                      <div
                        key={e.id}
                        title={`${e.title} ${e.time}`}
                        className={`truncate text-[10px] font-black uppercase tracking-wider text-white px-3 py-2 rounded-xl shadow-lg bg-gradient-to-r transition-transform hover:scale-105 ${
                          typeStyles[e.type]?.badge ||
                          "from-slate-600 to-slate-700"
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
                      <div className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest pl-1">
                        +{more} {t.more}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day drawer */}
        {selectedDate && (
          <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border shadow-2xl overflow-hidden animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between px-10 py-8 border-b border-border/50 bg-background/20">
              <div>
                <div className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] mb-2">
                  {t.selectedDay}
                </div>
                <div className="text-3xl font-bold text-foreground tracking-tight">
                  {selectedDate.toLocaleDateString(
                    language === "de" ? "de-DE" : "en-US",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </div>
              <button
                className="p-4 rounded-2xl bg-background/50 border border-border hover:bg-card hover:border-iu-red/30 transition-all shadow-lg group"
                onClick={() => setSelectedDate(null)}
                aria-label={t.close}
              >
                <CloseIcon className="h-6 w-6 text-foreground group-hover:text-iu-red" />
              </button>
            </div>
            <div className="p-10">
              {(() => {
                const ds = selectedDate
                  ? eventsByDate.get(toISODate(selectedDate)) || []
                  : [];
                if (ds.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="inline-flex p-6 rounded-3xl bg-muted/10 text-muted-foreground mb-4">
                        <CalendarIcon className="h-12 w-12" />
                      </div>
                      <p className="text-xl font-medium text-muted-foreground">
                        {t.noEvents}
                      </p>
                    </div>
                  );
                }
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ds.map((e: CalendarEvent) => (
                      <div
                        key={e.id}
                        className="group bg-background/50 border border-border rounded-[2rem] p-8 hover:bg-card hover:border-iu-blue/30 transition-all duration-500 shadow-xl relative overflow-hidden"
                      >
                        {/* Hover background effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-16 -mt-16"></div>

                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                              <div
                                className={`inline-flex items-center text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg bg-gradient-to-r ${
                                  typeStyles[e.type]?.badge ||
                                  "from-slate-600 to-slate-700"
                                }`}
                              >
                                {e.type}
                              </div>
                              <h3 className="mt-4 text-2xl font-bold text-foreground leading-tight tracking-tight group-hover:text-iu-blue transition-colors">
                                {e.title}
                              </h3>
                            </div>
                            <button
                              className="px-6 py-2 rounded-xl bg-iu-blue/10 text-iu-blue text-sm font-bold hover:bg-iu-blue hover:text-white transition-all shadow-md"
                              onClick={() => setSelectedEvent(e)}
                            >
                              {t.details}
                            </button>
                          </div>

                          <div className="space-y-4 text-muted-foreground font-medium">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-background border border-border">
                                <Clock className="h-4 w-4 text-iu-blue" />
                              </div>
                              <span>
                                {e.time} • {e.duration}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-background border border-border">
                                <MapPin className="h-4 w-4 text-iu-blue" />
                              </div>
                              <span>{e.location}</span>
                            </div>
                            {e.professor && (
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-background border border-border">
                                  <GraduationCap className="h-4 w-4 text-iu-blue" />
                                </div>
                                <span>{e.professor}</span>
                              </div>
                            )}
                          </div>

                          <div className="mt-8 flex flex-wrap gap-3">
                            {e.zoom && (
                              <a
                                href={e.zoom}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-iu-blue hover:opacity-90 transition-all shadow-xl shadow-iu-blue/20"
                              >
                                <Video className="h-5 w-5" /> {t.openZoom}
                              </a>
                            )}
                            <button
                              onClick={() => downloadICS(e)}
                              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold border border-border bg-background/50 hover:bg-card hover:border-iu-blue/30 text-foreground transition-all shadow-lg"
                            >
                              {t.saveIcs}
                            </button>
                            <a
                              href={buildGoogleCalendarUrl(e)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold border border-border bg-background/50 hover:bg-card hover:border-iu-blue/30 text-foreground transition-all shadow-lg"
                            >
                              {t.googleCalendar}
                            </a>
                          </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300"
              onClick={() => setSelectedEvent(null)}
            />
            <div className="relative bg-card rounded-[2.5rem] shadow-2xl border border-border w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
              {/* Header */}
              <div className="relative overflow-hidden bg-iu-blue p-10 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full rotate-45 -mr-32 -mt-32 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex items-start justify-between gap-6">
                  <div>
                    <div
                      className={`inline-flex items-center text-[10px] font-black text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg bg-white/20 backdrop-blur-md border border-white/30`}
                    >
                      {selectedEvent.type}
                    </div>
                    <h3 className="mt-6 text-4xl font-bold tracking-tight leading-tight">
                      {selectedEvent.title}
                    </h3>
                  </div>
                  <button
                    className="p-4 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all shadow-lg group"
                    onClick={() => setSelectedEvent(null)}
                    aria-label={t.close}
                  >
                    <CloseIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-6 bg-background/50 border border-border rounded-3xl shadow-inner">
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <Clock className="h-5 w-5 text-iu-blue" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {t.details}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {selectedEvent.time} • {selectedEvent.duration}
                    </p>
                  </div>
                  <div className="p-6 bg-background/50 border border-border rounded-3xl shadow-inner">
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <MapPin className="h-5 w-5 text-iu-blue" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Location
                      </span>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>

                {selectedEvent.professor && (
                  <div className="p-6 bg-background/50 border border-border rounded-3xl shadow-inner">
                    <div className="flex items-center gap-4 text-muted-foreground mb-2">
                      <GraduationCap className="h-5 w-5 text-iu-blue" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Professor
                      </span>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      {selectedEvent.professor}
                    </p>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="p-8 bg-iu-blue/5 border border-iu-blue/10 rounded-3xl">
                    <p className="text-lg font-medium text-foreground leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  {selectedEvent.zoom && (
                    <a
                      href={selectedEvent.zoom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-lg font-bold text-white bg-iu-blue hover:opacity-90 transition-all shadow-2xl shadow-iu-blue/20"
                    >
                      <Video className="h-6 w-6" /> {t.openZoom}
                    </a>
                  )}
                  <button
                    onClick={() => downloadICS(selectedEvent)}
                    className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-5 rounded-2xl text-lg font-bold border border-border bg-background/50 hover:bg-card hover:border-iu-blue/30 text-foreground transition-all shadow-xl"
                  >
                    {t.saveIcs}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
