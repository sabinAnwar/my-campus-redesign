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
  Download,
  Heart,
  Grid3x3,
  BookOpen,
  BarChart3,
  Filter,
  ChevronDown,
} from "lucide-react";

export const loader = async () => null;

// Enhanced event data with professor colors
const EVENTS = [
  {
    id: 1,
    title: "Algorithms - Lecture",
    type: "Lecture",
    date: "2025-11-03",
    time: "10:00",
    duration: "90 minutes",
    location: "Hörsaal A1, Hammerbrook",
    professor: "Prof. Dr. Schmidt",
    professorColor: "#3B82F6", // Blue
    mandatory: true,
    zoom: null,
    description: "Graph algorithms and complexity",
  },
  {
    id: 2,
    title: "Database Design - Seminar",
    type: "Seminar",
    date: "2025-11-04",
    time: "13:00",
    duration: "60 minutes",
    location: "Seminarraum B2, Hammerbrook",
    professor: "Prof. Dr. Mueller",
    professorColor: "#A855F7", // Purple
    mandatory: false,
    zoom: "https://zoom.us/j/0987654321",
    description: "Normalization practice and ER modeling",
  },
  {
    id: 3,
    title: "Cloud Computing - Lab",
    type: "Lab",
    date: "2025-11-05",
    time: "14:00",
    duration: "120 minutes",
    location: "Computerlab C3, Hammerbrook",
    professor: "Prof. Dr. Weber",
    professorColor: "#10B981", // Green
    mandatory: true,
    zoom: null,
    description: "Hands-on with containers and orchestration",
  },
  {
    id: 4,
    title: "Thesis Advising",
    type: "Office Hours",
    date: "2025-11-06",
    time: "15:00",
    duration: "30 minutes",
    location: "Virtual",
    professor: "Prof. Dr. Bauer",
    professorColor: "#F59E0B", // Orange
    mandatory: false,
    zoom: "https://zoom.us/j/1111111111",
    description: "One-on-one advising session",
  },
  {
    id: 5,
    title: "Web Development - Lecture",
    type: "Lecture",
    date: "2025-11-07",
    time: "09:00",
    duration: "90 minutes",
    location: "Hörsaal B2, Hammerbrook",
    professor: "Prof. Dr. Schmidt",
    professorColor: "#3B82F6",
    mandatory: true,
    zoom: "https://zoom.us/j/2222222222",
    description: "React patterns and best practices",
  },
];

const typeStyles = {
  Lecture: { badge: "from-blue-600 to-cyan-600", icon: "📚" },
  Seminar: { badge: "from-purple-600 to-pink-600", icon: "💬" },
  Lab: { badge: "from-green-600 to-emerald-600", icon: "⚙️" },
  "Office Hours": { badge: "from-orange-600 to-red-600", icon: "👨‍🏫" },
};

function fmtMonth(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function addMonths(date, delta) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function addDays(date, delta) {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toISODate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function buildMonthGrid(current) {
  const first = startOfMonth(current);
  const dayOfWeek = (first.getDay() + 6) % 7;
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

function buildWeekGrid(date) {
  const start = startOfWeek(date);
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }
  return days;
}

function parseDurationMinutes(str) {
  const m = /([0-9]+)\s*minute/.exec(String(str).toLowerCase());
  return m ? parseInt(m[1], 10) : 60;
}

function toICSDateUTC(date) {
  const iso = date.toISOString().replace(/[-:]/g, "").replace(".000", "");
  return iso.replace(/Z$/, "Z");
}

function buildGoogleCalendarUrl(evt) {
  const start = new Date(`${evt.date}T${evt.time}:00`);
  const end = new Date(
    start.getTime() + parseDurationMinutes(evt.duration) * 60000
  );
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

function downloadICS(evt) {
  const uid = `${evt.id}@iu-portal`;
  const start = new Date(`${evt.date}T${evt.time}:00`);
  const end = new Date(
    start.getTime() + parseDurationMinutes(evt.duration) * 60000
  );
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

export default function CourseScheduleEnhanced() {
  const today = new Date();
  const [showOptional, setShowOptional] = useState(true);
  const [selectedType, setSelectedType] = useState("All");
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState("month"); // "month" or "week"
  const [bookmarked, setBookmarked] = useState(new Set());
  const [expandedStats, setExpandedStats] = useState(false);

  const types = ["All", "Lecture", "Seminar", "Lab", "Office Hours"];
  const days = useMemo(() => {
    return viewMode === "month"
      ? buildMonthGrid(currentMonth)
      : buildWeekGrid(currentMonth);
  }, [currentMonth, viewMode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EVENTS.filter((e) => {
      if (!showOptional && !e.mandatory) return false;
      if (selectedType !== "All" && e.type !== selectedType) return false;
      if (q) {
        const hay =
          `${e.title} ${e.professor || ""} ${e.location || ""} ${e.description || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [showOptional, selectedType, query]);

  const eventsByDate = useMemo(() => {
    const map = new Map();
    filtered.forEach((e) => {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    });
    return map;
  }, [filtered]);

  const professors = useMemo(() => {
    const profs = new Map();
    EVENTS.forEach((e) => {
      if (e.professor && !profs.has(e.professor)) {
        profs.set(e.professor, {
          name: e.professor,
          color: e.professorColor,
          count: EVENTS.filter((ev) => ev.professor === e.professor).length,
        });
      }
    });
    return Array.from(profs.values());
  }, []);

  const stats = useMemo(() => {
    const typeCount = {};
    const mandatoryCount = { mandatory: 0, optional: 0 };
    const totalHours = 0;

    filtered.forEach((e) => {
      typeCount[e.type] = (typeCount[e.type] || 0) + 1;
      if (e.mandatory) mandatoryCount.mandatory++;
      else mandatoryCount.optional++;
    });

    return { typeCount, mandatoryCount, totalEvents: filtered.length };
  }, [filtered]);

  const monthLabel =
    viewMode === "month"
      ? fmtMonth(currentMonth)
      : `Week of ${currentMonth.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const typeCounts = useMemo(() => {
    const counts = { Lecture: 0, Seminar: 0, Lab: 0, "Office Hours": 0 };
    for (const e of filtered) counts[e.type] = (counts[e.type] || 0) + 1;
    return counts;
  }, [filtered]);

  const toggleBookmark = (eventId) => {
    const newBookmarks = new Set(bookmarked);
    if (newBookmarks.has(eventId)) {
      newBookmarks.delete(eventId);
    } else {
      newBookmarks.add(eventId);
    }
    setBookmarked(newBookmarks);
  };

  return (
  
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                Student Schedule Portal
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white dark:text-white flex items-center gap-3 transition-colors">
                <CalendarIcon className="h-10 w-10 text-blue-600" />
                Course Events
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg">
                Manage and organize your academic schedule efficiently.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  setViewMode(viewMode === "month" ? "week" : "month")
                }
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition"
              >
                <Grid3x3 className="h-4 w-4" />
                {viewMode === "month" ? "Week View" : "Month View"}
              </button>
              <button
                onClick={() => setExpandedStats(!expandedStats)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white dark:text-white border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 shadow-sm hover:shadow-md transition"
              >
                <BarChart3 className="h-4 w-4" />
                Stats
              </button>
            </div>
          </div>

          {/* Stats Panel */}
          {expandedStats && (
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Total Events
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white dark:text-white">
                  {stats.totalEvents}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-400 mt-2">
                  visible events
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Mandatory
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    {stats.mandatoryCount.mandatory}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 dark:text-slate-400">
                    / {stats.mandatoryCount.optional}
                  </div>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-400 mt-2">optional</div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Most Common Type
                </div>
                <div className="text-lg font-black text-slate-900 dark:text-white dark:text-white">
                  {Object.entries(stats.typeCount).sort(
                    ([, a], [, b]) => b - a
                  )[0]?.[0] || "—"}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-400 mt-2">
                  {Object.entries(stats.typeCount).sort(
                    ([, a], [, b]) => b - a
                  )[0]?.[1] || 0}{" "}
                  events
                </div>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                  Bookmarked
                </div>
                <div className="text-3xl font-black text-red-500 dark:text-red-400">
                  {bookmarked.size}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-400 mt-2">saved events</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* Quick Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <Filter className="h-4 w-4" />
                      Filters
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                        checked={showOptional}
                        onChange={(e) => setShowOptional(e.target.checked)}
                      />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:text-white">
                        Show optional
                      </span>
                    </label>
                  </div>
                </div>

                {/* Event Types */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 to-pink-50">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Event Types
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    {types.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedType(t)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition ${
                          selectedType === t
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{t}</span>
                          {t !== "All" && (
                            <span className="text-xs bg-slate-300 text-slate-900 dark:text-white px-2 py-0.5 rounded">
                              {typeCounts[t] || 0}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Professors */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                  <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      Professors
                    </div>
                  </div>
                  <div className="p-4 space-y-2 max-h-48 overflow-y-auto">
                    {professors.map((prof) => (
                      <div
                        key={prof.name}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:bg-slate-700 cursor-pointer"
                      >
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: prof.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {prof.name.replace("Prof. Dr. ", "")}
                          </div>
                          <div className="text-xs text-slate-500">
                            {prof.count} event{prof.count !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bookmarked Events */}
                {bookmarked.size > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                    <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-red-50 to-pink-50">
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                        Bookmarked
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      {EVENTS.filter((e) => bookmarked.has(e.id)).map((e) => (
                        <button
                          key={e.id}
                          onClick={() => setSelectedEvent(e)}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 hover:bg-red-100 text-red-900 transition truncate"
                        >
                          {e.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Calendar Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search events, professors, locations..."
                  className="w-full rounded-xl bg-white border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Calendar Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                {/* Calendar Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition"
                      onClick={() =>
                        setCurrentMonth((d) =>
                          viewMode === "month"
                            ? addMonths(d, -1)
                            : addDays(d, -7)
                        )
                      }
                      title={
                        viewMode === "month"
                          ? "Previous month"
                          : "Previous week"
                      }
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-sm font-semibold transition"
                      onClick={() => setCurrentMonth(new Date())}
                      title="Today"
                    >
                      Today
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 transition"
                      onClick={() =>
                        setCurrentMonth((d) =>
                          viewMode === "month" ? addMonths(d, 1) : addDays(d, 7)
                        )
                      }
                      title={viewMode === "month" ? "Next month" : "Next week"}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="text-lg font-extrabold tracking-tight">
                    {monthLabel}
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    {viewMode === "month" ? "Month" : "Week"} view
                  </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-500 uppercase tracking-wide px-2 sm:px-6 pt-4 pb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <div key={d} className="py-2">
                        {d}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-px bg-slate-200 p-2 sm:p-6 rounded-b-xl">
                  {days.map((d, idx) => {
                    const inMonth =
                      viewMode === "month"
                        ? d.getMonth() === currentMonth.getMonth()
                        : true;
                    const isToday = isSameDay(d, today);
                    const key = toISODate(d);
                    const daily = eventsByDate.get(key) || [];
                    const topTwo = daily.slice(0, 2);
                    const more = daily.length - topTwo.length;

                    return (
                      <div
                        key={idx}
                        className={`relative min-h-24 bg-white rounded-lg p-3 cursor-pointer transition hover:shadow-md hover:border-blue-200 dark:border-cyan-600 border-2 ${
                          isToday
                            ? "border-blue-600 bg-blue-50 shadow-md"
                            : inMonth
                              ? "border-slate-200 hover:border-blue-200 dark:border-cyan-600"
                              : "border-slate-100 bg-slate-50 dark:bg-slate-700 text-slate-400"
                        }`}
                        onClick={() => setSelectedDate(d)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div
                            className={`text-xs font-bold ${
                              inMonth
                                ? isToday
                                  ? "text-blue-600"
                                  : "text-slate-900 dark:text-white"
                                : "text-slate-400"
                            }`}
                          >
                            {d.getDate()}
                          </div>
                          {isToday && (
                            <span className="text-[10px] font-black text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                              Today
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          {topTwo.map((e) => (
                            <div
                              key={e.id}
                              title={`${e.title} • ${e.time}`}
                              className={`truncate text-[10px] font-bold text-white px-2 py-1 rounded shadow-sm bg-gradient-to-r cursor-pointer hover:shadow-md transition ${
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
                            <div className="text-[10px] font-bold text-slate-600 dark:text-slate-400 px-2">
                              +{more} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Selected day details */}
              {selectedDate && (
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Selected Day
                      </div>
                      <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {selectedDate.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <button
                      className="p-2 rounded-lg hover:bg-slate-100 transition"
                      onClick={() => setSelectedDate(null)}
                      aria-label="Close"
                    >
                      <CloseIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="p-6">
                    {(() => {
                      const ds =
                        eventsByDate.get(toISODate(selectedDate)) || [];
                      if (ds.length === 0) {
                        return (
                          <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-2" />
                            <div className="text-slate-600 dark:text-slate-400 font-semibold">
                              No events for this day.
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ds.map((e) => (
                            <div
                              key={e.id}
                              className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
                              style={{
                                borderLeftColor: e.professorColor,
                                borderLeftWidth: "4px",
                              }}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <div
                                    className={`inline-flex items-center text-[11px] font-bold text-white px-2 py-1 rounded bg-gradient-to-r ${
                                      typeStyles[e.type]?.badge ||
                                      "from-slate-600 to-slate-700"
                                    }`}
                                  >
                                    {typeStyles[e.type]?.icon} {e.type}{" "}
                                    {e.mandatory ? "• Mandatory" : "• Optional"}
                                  </div>
                                  <div className="mt-2 text-slate-900 dark:text-white font-extrabold leading-snug">
                                    {e.title}
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleBookmark(e.id)}
                                  className="flex-shrink-0 p-2 rounded-lg hover:bg-slate-100 transition"
                                >
                                  <Heart
                                    className={`h-5 w-5 ${
                                      bookmarked.has(e.id)
                                        ? "fill-red-500 text-red-500"
                                        : "text-slate-400 hover:text-red-500"
                                    }`}
                                  />
                                </button>
                              </div>
                              <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 flex-shrink-0" />{" "}
                                  {e.time} • {e.duration}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />{" "}
                                  {e.location}
                                </div>
                                {e.professor && (
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-4 w-4 rounded-full flex-shrink-0"
                                      style={{
                                        backgroundColor: e.professorColor,
                                      }}
                                    />
                                    {e.professor}
                                  </div>
                                )}
                              </div>
                              <div className="mt-4 flex flex-wrap gap-2">
                                {e.zoom && (
                                  <a
                                    href={e.zoom}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition"
                                  >
                                    <Video className="h-4 w-4" /> Zoom
                                  </a>
                                )}
                                <button
                                  onClick={() => downloadICS(e)}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400 transition"
                                >
                                  <Download className="h-4 w-4" /> iCal
                                </button>
                                <a
                                  href={buildGoogleCalendarUrl(e)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400 transition"
                                >
                                  Google
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
            </div>
          </div>

          {/* Event Detail Modal */}
          {selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                onClick={() => setSelectedEvent(null)}
              />
              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-colors w-full max-w-2xl overflow-hidden">
                {/* Modal Header with color accent */}
                <div
                  className="h-2 w-full"
                  style={{ backgroundColor: selectedEvent.professorColor }}
                />
                <div className="px-6 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div
                        className={`inline-flex items-center text-[11px] font-bold text-white px-2 py-1 rounded mb-3 bg-gradient-to-r ${
                          typeStyles[selectedEvent.type]?.badge ||
                          "from-slate-600 to-slate-700"
                        }`}
                      >
                        {typeStyles[selectedEvent.type]?.icon}{" "}
                        {selectedEvent.type}{" "}
                        {selectedEvent.mandatory ? "• Mandatory" : "• Optional"}
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {selectedEvent.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(selectedEvent.id)}
                        className="p-2 rounded-lg hover:bg-slate-200 transition"
                      >
                        <Heart
                          className={`h-6 w-6 ${
                            bookmarked.has(selectedEvent.id)
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400 hover:text-red-500"
                          }`}
                        />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-slate-200 transition"
                        onClick={() => setSelectedEvent(null)}
                        aria-label="Close"
                      >
                        <CloseIcon className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="px-6 py-6 space-y-4 text-slate-700 dark:text-slate-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          Time
                        </div>
                        <div className="font-semibold">
                          {selectedEvent.time} • {selectedEvent.duration}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          Location
                        </div>
                        <div className="font-semibold">
                          {selectedEvent.location}
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedEvent.professor && (
                    <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                      <div
                        className="h-12 w-12 rounded-full flex-shrink-0 flex items-center justify-center"
                        style={{
                          backgroundColor: selectedEvent.professorColor + "20",
                        }}
                      >
                        <GraduationCap
                          className="h-6 w-6"
                          style={{ color: selectedEvent.professorColor }}
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-500 uppercase">
                          Professor
                        </div>
                        <div className="font-semibold">
                          {selectedEvent.professor}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 dark:border-cyan-600">
                      <div className="text-xs font-bold text-slate-500 uppercase mb-2">
                        Description
                      </div>
                      <p className="text-slate-800 leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 pb-6 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
                  {selectedEvent.zoom && (
                    <a
                      href={selectedEvent.zoom}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition shadow-sm"
                    >
                      <Video className="h-4 w-4" /> Open Zoom
                    </a>
                  )}
                  <button
                    onClick={() => downloadICS(selectedEvent)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-700 transition"
                  >
                    <Download className="h-4 w-4" /> Download .ics
                  </button>
                  <a
                    href={buildGoogleCalendarUrl(selectedEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:bg-slate-700 transition"
                  >
                    Google Calendar
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
   
  );
}
