import React, { useEffect, useMemo, useState } from "react";
import {
  CalendarDays as CalendarIcon,
  Info,
  MapPin,
  Video,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3x3,
} from "lucide-react";

export const loader = async () => null;

type EventType = "Lecture" | "Seminar" | "Lab" | "Office Hours";
type DayStatus =
  | "praxis"
  | "vorlesung"
  | "theoriephase"
  | "klausurphase"
  | "nachpruefung"
  | "wochenende"
  | "feiertag"
  | "urlaubstag";

interface CourseEvent {
  id: number;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: string;
  location: string;
  professor: string;
  professorColor: string;
  mandatory: boolean;
  zoom: string | null;
  description: string;
}

// Sample events for the detail card
const EVENTS: CourseEvent[] = [
  {
    id: 1,
    title: "DSBEC01 - E-Commerce",
    type: "Lecture",
    date: "2026-01-06",
    time: "11:30",
    duration: "8 LE",
    location: "HH - Christoph-Probst-Weg 28 - 2.54 Jenischhaus",
    professor: "Klein, Holger",
    professorColor: "#3B82F6",
    mandatory: true,
    zoom: null,
    description: "Vorlesung in Präsenz",
  },
  {
    id: 2,
    title: "Praxis-Workshop (optional)",
    type: "Lab",
    date: "2026-01-06",
    time: "16:00",
    duration: "2h",
    location: "Online",
    professor: "Team Praxis",
    professorColor: "#10B981",
    mandatory: false,
    zoom: "https://zoom.us/j/333333333",
    description: "Optionaler Praxisblock mit Übungen.",
  },
];

type StudyBlock = { start: string; end: string; status: DayStatus };

type PaletteEntry = { label: string; bg: string; text: string; ring: string };

type StudyPlan = {
  id: string;
  label: string;
  description?: string;
  blocks: StudyBlock[];
  paletteOverrides?: Partial<Record<DayStatus, PaletteEntry>>;
  autoWeekends?: boolean;
};

const DEFAULT_PALETTE: Record<DayStatus, PaletteEntry> = {
  praxis: {
    label: "Praxiszeit",
    bg: "bg-emerald-100/80 dark:bg-emerald-900/20",
    text: "text-emerald-900 dark:text-emerald-100",
    ring: "ring-emerald-300/60 dark:ring-emerald-400/50",
  },
  vorlesung: {
    label: "Vorlesungstermine",
    bg: "bg-blue-100/80 dark:bg-blue-900/20",
    text: "text-blue-900 dark:text-blue-100",
    ring: "ring-blue-300/60 dark:ring-blue-400/50",
  },
  theoriephase: {
    label: "Theoriewoche",
    bg: "bg-fuchsia-100/80 dark:bg-fuchsia-900/20",
    text: "text-fuchsia-900 dark:text-fuchsia-100",
    ring: "ring-fuchsia-300/60 dark:ring-fuchsia-400/50",
  },
  klausurphase: {
    label: "Prüfungsphase",
    bg: "bg-rose-100/80 dark:bg-rose-900/20",
    text: "text-rose-900 dark:text-rose-100",
    ring: "ring-rose-300/60 dark:ring-rose-400/50",
  },
  nachpruefung: {
    label: "Nachprüfungsphase",
    bg: "bg-slate-200 dark:bg-slate-800/40",
    text: "text-slate-900 dark:text-slate-100",
    ring: "ring-slate-300/60 dark:ring-slate-500/50",
  },
  wochenende: {
    label: "Wochenenden (frei von Praxis)",
    bg: "bg-amber-100/80 dark:bg-amber-900/20",
    text: "text-amber-900 dark:text-amber-100",
    ring: "ring-amber-300/60 dark:ring-amber-400/50",
  },
  feiertag: {
    label: "Feiertag",
    bg: "bg-slate-700 text-white dark:bg-slate-800/70",
    text: "text-white",
    ring: "ring-slate-600/70",
  },
  urlaubstag: {
    label: "Urlaubstage / keine Praxis",
    bg: "bg-cyan-100/80 dark:bg-cyan-900/20",
    text: "text-cyan-900 dark:text-cyan-100",
    ring: "ring-cyan-300/60 dark:ring-cyan-400/50",
  },
};

const STUDY_PLANS: StudyPlan[] = [
  {
    id: "ws25-26",
    label: "7. Semester (Blockmodell) Okt 2025 – Mär 2026",
    description:
      "Angelehnt an den Plan im Screenshot, inkl. Theorie-/Prüfungsphasen.",
    autoWeekends: true,
    paletteOverrides: {
      theoriephase: {
        label: "Theoriewoche (Jan bis Mär)",
        bg: "bg-fuchsia-300 dark:bg-fuchsia-900/50",
        text: "text-fuchsia-900 dark:text-fuchsia-100",
        ring: "ring-fuchsia-500/70 dark:ring-fuchsia-500/60",
      },
      praxis: {
        label: "Praxiswochen (Okt bis Dez)",
        bg: "bg-lime-300 dark:bg-lime-900/50",
        text: "text-lime-900 dark:text-lime-100",
        ring: "ring-lime-500/70 dark:ring-lime-500/60",
      },
      klausurphase: {
        label: "Prüfungswoche",
        bg: "bg-red-400 dark:bg-red-900/60",
        text: "text-red-50 dark:text-red-50",
        ring: "ring-red-500/70",
      },
      nachpruefung: {
        label: "Nachprüfungsphase",
        bg: "bg-slate-400 dark:bg-slate-800",
        text: "text-slate-900 dark:text-slate-100",
        ring: "ring-slate-500/70",
      },
      wochenende: {
        label: "Wochenenden (max. 2/Monat arbeiten)",
        bg: "bg-amber-300 dark:bg-amber-900/60",
        text: "text-amber-900 dark:text-amber-100",
        ring: "ring-amber-500/70",
      },
      urlaubstag: {
        label: "Urlaubstage",
        bg: "bg-cyan-300 dark:bg-cyan-900/50",
        text: "text-cyan-900 dark:text-cyan-100",
        ring: "ring-cyan-500/70",
      },
      feiertag: {
        label: "Nationaler Feiertag",
        bg: "bg-slate-800 text-white",
        text: "text-white",
        ring: "ring-slate-600/70",
      },
    },
    blocks: [
      { start: "2025-10-01", end: "2025-12-31", status: "praxis" },
      { start: "2026-01-01", end: "2026-03-31", status: "theoriephase" },
      { start: "2026-02-15", end: "2026-02-21", status: "klausurphase" },
      { start: "2026-03-10", end: "2026-03-20", status: "nachpruefung" },
      { start: "2025-12-24", end: "2025-12-26", status: "feiertag" },
      { start: "2025-12-27", end: "2025-12-31", status: "urlaubstag" },
    ],
  },
  {
    id: "ss26",
    label: "Sommersemester Beispiel 2026",
    description: "Abweichende Farben und Blöcke, falls sich der Plan ändert.",
    autoWeekends: true,
    paletteOverrides: {
      praxis: {
        label: "Praxisphase",
        bg: "bg-emerald-300 dark:bg-emerald-900/50",
        text: "text-emerald-900 dark:text-emerald-100",
        ring: "ring-emerald-500/70",
      },
      theoriephase: {
        label: "Theorieblock",
        bg: "bg-indigo-300 dark:bg-indigo-900/50",
        text: "text-indigo-900 dark:text-indigo-100",
        ring: "ring-indigo-500/70",
      },
      klausurphase: {
        label: "Prüfungen",
        bg: "bg-rose-400 dark:bg-rose-900/60",
        text: "text-rose-50 dark:text-rose-50",
        ring: "ring-rose-500/70",
      },
    },
    blocks: [
      { start: "2026-04-01", end: "2026-05-31", status: "theoriephase" },
      { start: "2026-06-01", end: "2026-07-31", status: "praxis" },
      { start: "2026-08-01", end: "2026-08-10", status: "klausurphase" },
      { start: "2026-08-20", end: "2026-08-31", status: "urlaubstag" },
    ],
  },
];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function addDays(date: Date, delta: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}

function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getMonthDays(month: Date): Date[] {
  const days: Date[] = [];
  const end = endOfMonth(month).getDate();
  for (let i = 1; i <= end; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  return days;
}

function expandBlocksToMap(blocks: StudyBlock[], autoWeekends: boolean) {
  const map = new Map<string, DayStatus>();
  blocks.forEach((b) => {
    const start = new Date(b.start);
    const end = new Date(b.end);
    for (
      let d = new Date(start);
      d.getTime() <= end.getTime();
      d = addDays(d, 1)
    ) {
      map.set(toISODate(d), b.status);
    }
  });
  if (autoWeekends) {
    // Fill weekends if not already set
    const minStart = new Date(
      Math.min(...blocks.map((b) => new Date(b.start).getTime()))
    );
    const maxEnd = new Date(
      Math.max(...blocks.map((b) => new Date(b.end).getTime()))
    );
    for (
      let d = new Date(minStart);
      d.getTime() <= maxEnd.getTime();
      d = addDays(d, 1)
    ) {
      const iso = toISODate(d);
      if (!map.has(iso)) {
        const day = d.getDay();
        if (day === 0 || day === 6) {
          map.set(iso, "wochenende");
        }
      }
    }
  }
  return map;
}

function listMonthsForBlocks(blocks: StudyBlock[]) {
  const starts = blocks.map((b) => new Date(b.start));
  const ends = blocks.map((b) => new Date(b.end));
  const minStart = startOfMonth(
    new Date(Math.min(...starts.map((d) => d.getTime())))
  );
  const maxEnd = endOfMonth(
    new Date(Math.max(...ends.map((d) => d.getTime())))
  );

  const months: Date[] = [];
  let cursor = new Date(minStart);
  while (
    cursor.getFullYear() < maxEnd.getFullYear() ||
    (cursor.getFullYear() === maxEnd.getFullYear() &&
      cursor.getMonth() <= maxEnd.getMonth())
  ) {
    months.push(new Date(cursor));
    cursor = addMonths(cursor, 1);
  }
  return months;
}

export default function CourseScheduleEnhanced() {
  const today = new Date();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    STUDY_PLANS[0]?.id || ""
  );
  const selectedPlan =
    STUDY_PLANS.find((p) => p.id === selectedPlanId) || STUDY_PLANS[0];
  const paletteColors = useMemo(
    () => ({ ...DEFAULT_PALETTE, ...(selectedPlan?.paletteOverrides || {}) }),
    [selectedPlan]
  );
  const statusMap = useMemo(
    () =>
      expandBlocksToMap(
        selectedPlan?.blocks || [],
        selectedPlan?.autoWeekends ?? true
      ),
    [selectedPlan]
  );
  const studyMonths = useMemo(
    () => listMonthsForBlocks(selectedPlan?.blocks || []),
    [selectedPlan]
  );
  const studyYears = useMemo(() => {
    const years = new Set<number>();
    studyMonths.forEach((m) => years.add(m.getFullYear()));
    return Array.from(years).sort();
  }, [studyMonths]);
  const todayISO = toISODate(today);
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CourseEvent[]>();
    EVENTS.forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, []);
  const [selectedDate, setSelectedDate] = useState<string>(toISODate(today));
  const dayEvents = eventsByDate.get(selectedDate) || [];
  const mandatoryDayEvents = dayEvents.filter((e) => e.mandatory);
  const optionalDayEvents = dayEvents.filter((e) => !e.mandatory);
  const nextMandatoryEvent = useMemo(() => {
    const sorted = [...EVENTS]
      .filter((e) => e.mandatory)
      .sort(
        (a, b) =>
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
      );
    return (
      sorted.find((e) => new Date(`${e.date}T${e.time}`) >= today) ||
      sorted[0] ||
      null
    );
  }, [today]);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"multi" | "single">("multi");
  const monthList = studyMonths;
  const [currentMonthIdx, setCurrentMonthIdx] = useState<number>(0);
  const [showOptional, setShowOptional] = useState<boolean>(true);
  useEffect(() => {
    setCurrentMonthIdx(0);
  }, [selectedPlanId]);

  const selectedStatus = statusMap.get(selectedDate);
  const todayStatus = statusMap.get(todayISO);
  const getPalette = (status: DayStatus, plan?: StudyPlan) => {
    const palette = { ...DEFAULT_PALETTE, ...(plan?.paletteOverrides || {}) };
    return palette[status] || DEFAULT_PALETTE.praxis;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-4">
            <CalendarIcon className="h-10 w-10 text-slate-900 dark:text-white" />
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
                Studienplan & Termine
              </div>
              <h1 className="text-3xl md:text-4xl font-black leading-tight text-slate-900 dark:text-white">
                Dein Semester-Planer
              </h1>
              <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={showOptional}
                  onChange={() => setShowOptional((v) => !v)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Freiwillige Veranstaltungsangebote einblenden
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/40 dark:border-slate-700/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md px-4 py-4 sm:px-5 sm:py-5 shadow-xl ring-1 ring-black/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                  Plan wählen
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative group">
                    <select
                      value={selectedPlanId}
                      onChange={(e) => setSelectedPlanId(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white shadow-sm hover:border-blue-400 dark:hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
                    >
                      {STUDY_PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                    Wähle deinen Studienplan, dann Monatsansicht einstellen.
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
                <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-800/50 p-1 shadow-inner">
                  <button
                    onClick={() => setViewMode("multi")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      viewMode === "multi"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm ring-1 ring-black/5"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <Grid3x3 className="h-3.5 w-3.5" />
                    Alle Monate
                  </button>
                  <button
                    onClick={() => setViewMode("single")}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      viewMode === "single"
                        ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-sm ring-1 ring-black/5"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                    }`}
                  >
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Monatsfokus
                  </button>
                </div>
                
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2 py-1.5 shadow-sm">
                  <button
                    onClick={() =>
                      setCurrentMonthIdx((i) => Math.max(0, i - 1))
                    }
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors"
                    disabled={currentMonthIdx === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div className="text-xs text-center min-w-[120px]">
                    <div className="font-bold text-slate-900 dark:text-white">
                    {monthList[currentMonthIdx]
                      ? monthList[currentMonthIdx].toLocaleDateString("de-DE", {
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Monat {currentMonthIdx + 1} von {monthList.length}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      setCurrentMonthIdx((i) =>
                        Math.min(monthList.length - 1, i + 1)
                      )
                    }
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 transition-colors"
                    disabled={currentMonthIdx >= monthList.length - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-6 items-start">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Studienplan
                </div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedPlan?.label || "Studienplan"}
                </h2>
                {selectedPlan?.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedPlan.description}
                  </p>
                )}
                {studyYears.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {studyYears.map((year) => (
                      <span
                        key={year}
                        className="px-3 py-1 rounded-full text-[12px] font-semibold bg-slate-900 text-white dark:bg-slate-700"
                      >
                        Jahr {year}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
            {viewMode === "multi" && (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {studyMonths.map((month) => {
                  const hideBadges =
                    month.getFullYear() === 2026 && month.getMonth() === 4;
                  const days = getMonthDays(month);
                  const label = month.toLocaleDateString("de-DE", {
                    month: "short",
                    year: "numeric",
                  });
                  const monthNumber = month.getMonth() + 1;
                  const year = month.getFullYear();
                  return (
                    <div
                      key={month.toISOString()}
                      className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40"
                    >
                      <div className="px-4 py-3 bg-slate-900 text-white text-sm font-semibold flex items-center justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold">{label}</span>
                        </div>
                      </div>
                      <div className="px-3 py-3 bg-white dark:bg-slate-900">
                        <div className="grid grid-cols-7 text-[10px] font-bold text-slate-500 uppercase mb-2">
                          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(
                            (d) => (
                              <div key={d} className="text-center">
                                {d}
                              </div>
                            )
                          )}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({
                            length:
                              (new Date(
                                month.getFullYear(),
                                month.getMonth(),
                                1
                              ).getDay() +
                                6) %
                              7,
                          }).map((_, i) => (
                            <div key={`pad-${i}`} />
                          ))}
                          {days.map((d) => {
                            const iso = toISODate(d);
                            const status = statusMap.get(iso);
                            const dayPalette = status
                              ? paletteColors[status]
                              : null;
                            const dayEvents = eventsByDate.get(iso) || [];
                            const optionalCountRaw = dayEvents.filter(
                              (e) => !e.mandatory
                            ).length;
                            const optionalCount = showOptional
                              ? optionalCountRaw
                              : 0;
                            const mandatoryCount = dayEvents.filter(
                              (e) => e.mandatory
                            ).length;
                            const hasEvent = mandatoryCount > 0 || optionalCountRaw > 0;
                            const dotColor =
                              mandatoryCount > 0
                                ? "#2563EB"
                                : optionalCount > 0
                                  ? "#10B981"
                                  : null;
                            const isSelected = iso === selectedDate;
                            return (
                              <div
                                key={iso}
                                onClick={() => setSelectedDate(iso)}
                                className={`h-16 flex flex-col justify-center text-center text-[11px] font-semibold rounded-md px-1.5 py-1 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-sm transition ${
                                  dayPalette
                                    ? `${dayPalette.bg} ${dayPalette.text} ring-1 ${dayPalette.ring}`
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700"
                                } ${
                                  isSelected
                                    ? "ring-2 ring-blue-500 shadow-md"
                                    : hasEvent
                                      ? "ring-1 ring-blue-300/60"
                                      : ""
                                }`}
                                title={`${dayPalette?.label || "Kein Eintrag"}${hasEvent ? " · " + dayEvents.length + " Termin(e)" : ""}`}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <span>{d.getDate()}</span>
                                  {dotColor && (
                                    <span
                                      className="h-2.5 w-2.5 rounded-full ring-2 ring-white/80 dark:ring-slate-900/80 shadow inline-block"
                                      style={{ backgroundColor: dotColor }}
                                    />
                                  )}
                                </div>
                                {mandatoryCount > 0 ? (
                                  <span className="mt-1 text-[9px] font-bold text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded-full inline-block">
                                    Pflicht
                                  </span>
                                ) : optionalCount > 0 ? (
                                  <span className="mt-1 text-[9px] font-bold text-emerald-900 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full inline-block">
                                    Optional
                                  </span>
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {viewMode === "single" &&
              monthList[currentMonthIdx] &&
              (() => {
                const activeMonth = monthList[currentMonthIdx];
                const monthLabel = activeMonth.toLocaleDateString("de-DE", {
                  month: "long",
                  year: "numeric",
                });
                const hideBadges =
                  activeMonth.getFullYear() === 2026 &&
                  activeMonth.getMonth() === 4;

                return (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500 dark:text-slate-400">
                          Monatsansicht
                        </div>
                        <div className="text-lg font-black text-slate-900 dark:text-white">
                          {monthLabel}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Mit den Pfeilen blätterst du Monat für Monat.
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                        {monthLabel}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between mb-2 gap-3">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentMonthIdx((i) => Math.max(0, i - 1))
                          }
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-semibold"
                          disabled={currentMonthIdx === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Zurück
                        </button>
                        <button
                          onClick={() =>
                            setCurrentMonthIdx((i) =>
                              Math.min(monthList.length - 1, i + 1)
                            )
                          }
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 text-sm font-semibold"
                          disabled={currentMonthIdx >= monthList.length - 1}
                        >
                          Weiter
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        Monat {currentMonthIdx + 1} / {monthList.length} –
                        Monat/Jahr klar markiert
                      </div>
                    </div>
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/40">
                      <div className="px-4 py-3 bg-slate-900 text-white text-sm font-semibold flex items-center justify-between">
                        <span>
                          {monthList[currentMonthIdx].toLocaleDateString(
                            "de-DE",
                            {
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="px-3 py-3">
                        <div className="grid grid-cols-7 text-[10px] font-bold text-slate-500 uppercase mb-2">
                          {["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"].map(
                            (d) => (
                              <div key={d} className="text-center">
                                {d}
                              </div>
                            )
                          )}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({
                            length:
                              (new Date(
                                monthList[currentMonthIdx].getFullYear(),
                                monthList[currentMonthIdx].getMonth(),
                                1
                              ).getDay() +
                                6) %
                              7,
                          }).map((_, i) => (
                            <div key={`pad-single-${i}`} />
                          ))}
                          {getMonthDays(monthList[currentMonthIdx]).map((d) => {
                            const iso = toISODate(d);
                            const status = statusMap.get(iso);
                            const dayPalette = status
                              ? paletteColors[status]
                              : null;
                            const dayEvents = eventsByDate.get(iso) || [];
                            const optionalCountRaw = dayEvents.filter(
                              (e) => !e.mandatory
                            ).length;
                            const optionalCount = showOptional
                              ? optionalCountRaw
                              : 0;
                            const mandatoryCount = dayEvents.filter(
                              (e) => e.mandatory
                            ).length;
                            const hasEvent = mandatoryCount > 0 || optionalCountRaw > 0;
                            const dotColor =
                              mandatoryCount > 0
                                ? "#2563EB"
                                : optionalCount > 0
                                  ? "#10B981"
                                  : null;
                            const isSelected = iso === selectedDate;
                            return (
                              <div
                                key={iso}
                                onClick={() => setSelectedDate(iso)}
                                className={`h-16 flex flex-col justify-center text-center text-[11px] font-semibold rounded-md px-2 py-2 border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-sm transition ${
                                  dayPalette
                                    ? `${dayPalette.bg} ${dayPalette.text} ring-1 ${dayPalette.ring}`
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-700"
                                } ${
                              isSelected
                                ? "ring-2 ring-blue-500 shadow-md"
                                : hasEvent
                                  ? "ring-1 ring-blue-300/60"
                                  : ""
                                }`}
                                title={`${dayPalette?.label || "Kein Eintrag"}${hasEvent ? " · " + dayEvents.length + " Termin(e)" : ""}`}
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span>{d.getDate()}</span>
                                {dotColor && (
                                  <span
                                    className="h-2.5 w-2.5 rounded-full ring-2 ring-white/80 dark:ring-slate-900/80 shadow inline-block"
                                    style={{ backgroundColor: dotColor }}
                                  />
                                )}
                              </div>
                              {mandatoryCount > 0 ? (
                                <span className="mt-1 text-[9px] font-bold text-blue-900 dark:text-blue-100 bg-blue-100 dark:bg-blue-900/40 px-1.5 py-0.5 rounded-full inline-block">
                                  Pflicht
                                </span>
                              ) : optionalCount > 0 ? (
                                <span className="mt-1 text-[9px] font-bold text-emerald-900 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-900/40 px-1.5 py-0.5 rounded-full inline-block">
                                  Optional
                                </span>
                              ) : null}
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">
                    Legende
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Farben für Praxis, Vorlesungen und Prüfungsphasen.
                  </p>
                </div>
                <button
                  onClick={() => setShowLegend((v) => !v)}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showLegend ? "rotate-180" : ""}`}
                  />
                  {showLegend ? "Verbergen" : "Anzeigen"}
                </button>
              </div>
              {showLegend && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {Object.entries(paletteColors).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-900/40 shadow-sm"
                    >
                      <span
                        className={`h-5 w-5 mt-0.5 rounded-full ring-2 ${val.bg} ${val.ring}`}
                        aria-hidden
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {val.label}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Termine und Phasen schnell erkennbar.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sticky top-6">
            {nextMandatoryEvent && (
              <div className="rounded-2xl border border-blue-100 dark:border-blue-800 bg-blue-50/80 dark:bg-blue-900/30 px-4 py-3 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-wide text-blue-700 dark:text-blue-200">
                  Nächste Vorlesung / Termin
                </div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  {new Date(nextMandatoryEvent.date).toLocaleDateString(
                    "de-DE",
                    {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}{" "}
                  · {nextMandatoryEvent.time}
                </div>
              </div>
            )}

            {/* Selected day details */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Termine am gewählten Tag
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {new Date(selectedDate).toLocaleDateString("de-DE", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-3">
                {mandatoryDayEvents.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                      Pflichttermine
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mandatoryDayEvents.map((e) => (
                        <div
                          key={`mini-m-${e.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {e.time}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="font-bold">{e.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {optionalDayEvents.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wide text-sky-700 dark:text-sky-300">
                      Optionale Termine
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {optionalDayEvents.map((e) => (
                        <div
                          key={`mini-o-${e.id}`}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold bg-sky-50 dark:bg-sky-900/30 border border-sky-100 dark:border-sky-800"
                        >
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {e.time}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="font-bold">{e.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {mandatoryDayEvents.map((e) => (
                  <div
                    key={`card-m-${e.id}`}
                    className="border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 flex flex-col gap-2 bg-emerald-50 dark:bg-emerald-900/20"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold"
                        style={{
                          backgroundColor: e.professorColor + "20",
                          color: e.professorColor,
                        }}
                      >
                        {e.type}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span>{e.time}</span>
                      <span className="text-slate-500">•</span>
                      <span>{e.duration}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100">
                        In Präsenz
                      </span>
                    </div>
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      {e.title}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        <span className="font-semibold">{e.time}</span>
                        <span className="text-slate-500">·</span>
                        <span>{e.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                        <span className="font-semibold">{e.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: e.professorColor }}
                        />
                        <span>{e.professor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700">
                          {e.zoom ? "Hybrid/Online" : "In Präsenz"}
                        </span>
                        {e.zoom && (
                          <a
                            href={e.zoom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline"
                          >
                            <Video className="h-4 w-4" />
                            Zoom-Link
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Vorlesungsreihe: {e.title.split(" ").join("_")}
                      </div>
                    </div>
                  </div>
                ))}

                {optionalDayEvents.map((e) => (
                  <div
                    key={`card-o-${e.id}`}
                    className="border border-sky-100 dark:border-sky-800 rounded-xl p-4 flex flex-col gap-2 bg-sky-50 dark:bg-sky-900/20"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-bold"
                        style={{
                          backgroundColor: e.professorColor + "20",
                          color: e.professorColor,
                        }}
                      >
                        {e.type}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span>{e.time}</span>
                      <span className="text-slate-500">•</span>
                      <span>{e.duration}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-100">
                        <Info className="h-3 w-3" />
                        Optional
                      </span>
                    </div>
                    <div className="text-base font-black text-slate-900 dark:text-white">
                      {e.title}
                    </div>
                    <div className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        <span className="font-semibold">{e.time}</span>
                        <span className="text-slate-500">·</span>
                        <span>{e.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                        <span className="font-semibold">{e.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: e.professorColor }}
                        />
                        <span>{e.professor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-200 dark:bg-slate-700">
                          {e.zoom ? "Hybrid/Online" : "In Präsenz"}
                        </span>
                        {e.zoom && (
                          <a
                            href={e.zoom}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-300 text-sm font-semibold hover:underline"
                          >
                            <Video className="h-4 w-4" />
                            Zoom-Link
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Vorlesungsreihe: {e.title.split(" ").join("_")}
                      </div>
                    </div>
                  </div>
                ))}

                {dayEvents.length === 0 && (
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Keine Termine für diesen Tag hinterlegt.
                  </div>
                )}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    
    </div>
  );
}
