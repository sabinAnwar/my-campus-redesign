import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiGet, apiJson } from "../lib/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CalendarRange, ListChecks, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, CalendarClock, GraduationCap, ClipboardList, FileEdit, BadgeCheck, Smile } from "lucide-react";

// Helpers
function getISOWeekKey(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  // Thursday in current week decides the year
  const dayNum = d.getUTCDay() || 7; // 1..7, Mon..Sun
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  const weekStr = String(weekNo).padStart(2, "0");
  return `${d.getUTCFullYear()}-W${weekStr}`;
}

function parseISOWeekStart(weekKey) {
  // weekKey format: YYYY-Www
  try {
    const [y, w] = weekKey.split("-W");
    const year = parseInt(y, 10);
    const week = parseInt(w, 10);
    if (!year || !week) return null;
    // Start from Jan 1 and add (week-1)*7 days, then adjust to Monday
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const day = simple.getDay(); // 0=Sun..6=Sat
    const diffToMonday = (day + 6) % 7; // 0 if Monday
    simple.setDate(simple.getDate() - diffToMonday);
    return new Date(simple.getFullYear(), simple.getMonth(), simple.getDate());
  } catch (_e) {
    return null;
  }
}

function buildMonth(year, month) {
  // Build a 6x7 grid starting Monday
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // 0=Mon
  const start = new Date(year, month, 1 - startOffset);
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const current = new Date(start);
      current.setDate(start.getDate() + w * 7 + d);
      row.push(current);
    }
    weeks.push(row);
  }
  return weeks;
}

function getMonthWeekKeys(year, month) {
  // Collect unique ISO week keys that intersect the given month (1..last day)
  const keys = new Set();
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= lastDay; day++) {
    const d = new Date(year, month, day);
    keys.add(getISOWeekKey(d));
  }
  return keys;
}

function getSemesterWeekKeys(semStartYear, semStartMonth) {
  const keys = new Set();
  for (let i = 0; i < 6; i++) {
    const d = new Date(semStartYear, semStartMonth + i, 1);
    const monthKeys = getMonthWeekKeys(d.getFullYear(), d.getMonth());
    monthKeys.forEach((k) => keys.add(k));
  }
  return keys;
}

export default function Praxisbericht2() {
  const [view, setView] = useState("calendar");
  const [reports, setReports] = useState([]);
  const [activeWeekKey, setActiveWeekKey] = useState(null);
  const [activeReport, setActiveReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | DUE | DRAFT | SUBMITTED | APPROVED | KLAUSURPHASE
  const navigate = useNavigate();
  // Reminder preferences display
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(18);
  // calendar period control
  const [mode, setMode] = useState("month"); // 'month' | 'semester'
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-11
  // semester starts: Summer = Apr(3), Winter = Oct(9)
  const defaultSemStart =
    today.getMonth() >= 3 && today.getMonth() <= 8
      ? { y: today.getFullYear(), m: 3 }
      : { y: today.getFullYear(), m: 9 };
  const [semStartYear, setSemStartYear] = useState(defaultSemStart.y);
  const [semStartMonth, setSemStartMonth] = useState(defaultSemStart.m);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiGet("/api/praxisberichte");
        setReports(data.reports || []);
        setLoading(false);
      } catch (e) {
        console.error("Failed to load praxisberichte", e);
        if (e && e.status === 401) {
          navigate("/login");
        } else {
          toast.error("Failed to load Praxisberichte");
        }
        setLoading(false);
      }
    })();
  }, [navigate]);

  // Load reminder preferences for banner
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/reminders/preferences", {
          credentials: "include",
        });
        if (res.ok) {
          const p = await res.json();
          setReminderEnabled(!!p.reminderEnabled);
          setReminderHour(Number(p.reminderHour ?? 18));
        }
      } catch (_) {}
    })();
  }, []);

  // Derive period-aware metrics (submitted/due/klausur/completion + drafts/approved/satisfied) for visible period
  const stats = useMemo(() => {
    const statusMap = new Map();
    for (const r of reports) {
      const s = r.status === "KLAUSUR" ? "KLAUSURPHASE" : r.status;
      statusMap.set(r.isoWeekKey, s);
    }
    const visibleKeys =
      mode === "month"
        ? getMonthWeekKeys(year, month)
        : getSemesterWeekKeys(semStartYear, semStartMonth);

    let total = 0;
    let submitted = 0;
    let due = 0;
    let klausur = 0;
    let drafts = 0;
    let approved = 0;
    let satisfied = 0;

    for (const wk of visibleKeys) {
      const s = statusMap.get(wk);
      if (s === "KLAUSURPHASE") {
        klausur += 1;
        continue; // exclude from total and due/submitted calculations
      }
      total += 1;
      if (s === "SUBMITTED" || s === "APPROVED") submitted += 1;
      if (s === "DRAFT") drafts += 1;
      if (s === "APPROVED") approved += 1;
      else if (!s || s === "DUE") due += 1;

      // satisfied: majority of mooded days are happy/satisfied
      const rep = reports.find((r) => r.isoWeekKey === wk);
      if (rep && rep.days) {
        const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        let pos = 0,
          denom = 0;
        for (const k of dayKeys) {
          const d = rep.days[k];
          if (!d || d.holiday) continue;
          if (d.mood) {
            denom += 1;
            if (d.mood === "happy" || d.mood === "satisfied") pos += 1;
          }
        }
        if (denom > 0 && pos / denom >= 0.5) satisfied += 1;
      }
    }

    const completion = total > 0 ? Math.round((submitted / total) * 100) : 0;
    return { submitted, due, klausur, completion, drafts, approved, satisfied };
  }, [reports, mode, year, month, semStartYear, semStartMonth]);

  return (
  
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              Praxisberichte
            </h1>
            <p className="text-slate-600">
              Document and submit your weekly practical work reports.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Daily reminder banner */}
          <div className="mb-6 bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-900">
                Praxisbericht Erinnerung
              </div>
              <div className="text-sm text-slate-600">
                {reminderEnabled ? (
                  <>
                    Aktiv: tägliche E-Mail um{" "}
                    {String(reminderHour).padStart(2, "0")}:00
                  </>
                ) : (
                  <>
                    Deaktiviert: aktiviere tägliche Erinnerung in den
                    Einstellungen
                  </>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate("/settings")}
              className="px-3 py-2 text-sm rounded-md bg-slate-900 text-white hover:opacity-90"
            >
              Einstellungen öffnen
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden">
              <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-emerald-200 text-emerald-950 flex items-center justify-center border border-emerald-500">
                <CheckCircle size={18} />
              </div>
              <div className="text-slate-600 text-sm font-medium mb-1">
                Submitted
              </div>
              <div className="text-3xl font-bold text-emerald-700">
                {stats.submitted}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden">
              <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-amber-200 text-amber-950 flex items-center justify-center border border-amber-500">
                <AlertCircle size={18} />
              </div>
              <div className="text-slate-600 text-sm font-medium mb-1">
                Must be submitted
              </div>
              <div className="text-3xl font-bold text-amber-700">
                {stats.due}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden">
              <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-blue-200 text-blue-950 flex items-center justify-center border border-blue-500">
                <FileEdit size={18} />
              </div>
              <div className="text-slate-600 text-sm font-medium mb-1">
                Drafts
              </div>
              <div className="text-3xl font-bold text-blue-700">
                {stats.drafts}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden">
              <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-teal-200 text-teal-950 flex items-center justify-center border border-teal-500">
                <BadgeCheck size={18} />
              </div>
              <div className="text-slate-600 text-sm font-medium mb-1">
                Reviewed
              </div>
              <div className="text-3xl font-bold text-teal-700">
                {stats.approved}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden">
              <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center border border-zinc-500">
                <CalendarClock size={18} />
              </div>
              <div className="text-slate-600 text-sm font-medium mb-1">
                Klausur Weeks
              </div>
              <div className="text-3xl font-bold text-zinc-700">
                {stats.klausur}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden">
              <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <GraduationCap size={18} />
              </div>
              <div className="text-slate-600 text-sm font-medium mb-1">
                Completion
              </div>
              <div className="text-3xl font-bold text-emerald-600">
                {stats.completion}%
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-5 relative overflow-hidden">
              <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-emerald-200 text-emerald-950 flex items-center justify-center border border-emerald-500">
                <Smile size={18} />
              </div>
              <div className="text-slate-600 text-sm font-medium mb-1">
                Satisfied
              </div>
              <div className="text-3xl font-bold text-emerald-700">
                {stats.satisfied}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1.5">
              <button
                onClick={() => setView("calendar")}
                className={`px-4 py-2 rounded-md font-medium text-sm ${view === "calendar" ? "bg-slate-900 text-white" : "text-slate-700"}`}
              >
                <CalendarRange size={18} className="inline mr-2" /> Calendar
              </button>
              <button
                onClick={() => setView("list")}
                className={`px-4 py-2 rounded-md font-medium text-sm ${view === "list" ? "bg-slate-900 text-white" : "text-slate-700"}`}
              >
                <ListChecks size={18} className="inline mr-2" /> List
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 text-sm rounded-md border border-slate-300 hover:bg-slate-50"
                onClick={() => {
                  const now = new Date();
                  setYear(now.getFullYear());
                  setMonth(now.getMonth());
                  const wk = getISOWeekKey(now);
                  const r = reports.find((x) => x.isoWeekKey === wk) || null;
                  setActiveReport(r);
                  setActiveWeekKey(wk);
                }}
              >
                Go to current week
              </button>
              <button
                className="px-3 py-2 text-sm rounded-md bg-slate-900 text-white hover:opacity-90"
                onClick={() => {
                  const now = new Date();
                  const wk = getISOWeekKey(now);
                  setActiveReport(null);
                  setActiveWeekKey(wk);
                }}
              >
                New draft
              </button>
            </div>
          </div>

          {/* Status filter chips */}
          <div className="flex items-center gap-2 mb-2">
            {[
              { k: "ALL", label: "All" },
              { k: "DUE", label: "Due" },
              { k: "DRAFT", label: "Draft" },
              { k: "SUBMITTED", label: "Submitted" },
              { k: "APPROVED", label: "Reviewed" },
              { k: "KLAUSURPHASE", label: "Klausurphase" },
            ].map((f) => (
              <button
                key={f.k}
                onClick={() => setStatusFilter(f.k)}
                className={`text-xs px-2.5 py-1.5 rounded-full border ${statusFilter === f.k ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-3">
              <div className="h-8 bg-slate-200/60 rounded animate-pulse" />
              <div className="h-64 bg-slate-200/60 rounded animate-pulse" />
            </div>
          ) : view === "calendar" ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-2.5 py-1.5 text-xs rounded-md border ${mode === "month" ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}
                        onClick={() => setMode("month")}
                      >
                        Month
                      </button>
                      <button
                        className={`px-2.5 py-1.5 text-xs rounded-md border ${mode === "semester" ? "bg-slate-900 text-white" : "bg-white text-slate-700"}`}
                        onClick={() => setMode("semester")}
                      >
                        Semester
                      </button>
                    </div>
                    {mode === "month" ? (
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 text-xs rounded border flex items-center gap-1"
                          onClick={() => {
                            const d = new Date(year, month - 1, 1);
                            setYear(d.getFullYear());
                            setMonth(d.getMonth());
                          }}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <div className="text-sm font-semibold text-slate-900">
                          {new Date(year, month, 1).toLocaleString(undefined, {
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <button
                          className="px-2 py-1 text-xs rounded border flex items-center gap-1"
                          onClick={() => {
                            const d = new Date(year, month + 1, 1);
                            setYear(d.getFullYear());
                            setMonth(d.getMonth());
                          }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 text-xs rounded border flex items-center gap-1"
                          onClick={() => {
                            // move semester 6 months back
                            const d = new Date(
                              semStartYear,
                              semStartMonth - 6,
                              1
                            );
                            setSemStartYear(d.getFullYear());
                            setSemStartMonth(d.getMonth());
                          }}
                        >
                          <ChevronLeft size={14} />
                        </button>
                        <div className="text-sm font-semibold text-slate-900">
                          {new Date(
                            semStartYear,
                            semStartMonth,
                            1
                          ).toLocaleString(undefined, {
                            month: "long",
                            year: "numeric",
                          })}
                          {" – "}
                          {new Date(
                            semStartYear,
                            semStartMonth + 5,
                            1
                          ).toLocaleString(undefined, {
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <button
                          className="px-2 py-1 text-xs rounded border flex items-center gap-1"
                          onClick={() => {
                            const d = new Date(
                              semStartYear,
                              semStartMonth + 6,
                              1
                            );
                            setSemStartYear(d.getFullYear());
                            setSemStartMonth(d.getMonth());
                          }}
                        >
                          <ChevronRight size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {mode === "month" ? (
                    <CalendarView
                      reports={reports}
                      year={year}
                      month={month}
                      filter={statusFilter}
                      onDayClick={(weekKey) => {
                        const r =
                          reports.find((x) => x.isoWeekKey === weekKey) || null;
                        setActiveReport(r);
                        setActiveWeekKey(weekKey);
                      }}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => {
                        const d = new Date(semStartYear, semStartMonth + i, 1);
                        const y = d.getFullYear();
                        const m = d.getMonth();
                        return (
                          <CalendarView
                            key={`${y}-${m}`}
                            reports={reports}
                            year={y}
                            month={m}
                            filter={statusFilter}
                            onDayClick={(weekKey) => {
                              const r =
                                reports.find((x) => x.isoWeekKey === weekKey) ||
                                null;
                              setActiveReport(r);
                              setActiveWeekKey(weekKey);
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-5">
                  <h3 className="font-semibold text-slate-900 mb-4">Legend</h3>
                  <Legend />
                </div>
              </div>

              {/* WeekModal moved outside so it also works in List view */}
            </>
          ) : (
            <ListView
              reports={reports}
              filter={statusFilter}
              onOpen={(weekKey) => {
                const r = reports.find((x) => x.isoWeekKey === weekKey) || null;
                setActiveReport(r);
                setActiveWeekKey(weekKey);
              }}
            />
          )}

          {/* Shared Week Modal (available for both Calendar and List views) */}
          <WeekModal
            open={!!activeWeekKey}
            weekKey={activeWeekKey}
            report={activeReport}
            onClose={() => {
              setActiveWeekKey(null);
              setActiveReport(null);
            }}
            onSaved={(saved) => {
              setReports((prev) => {
                const idx = prev.findIndex(
                  (p) => p.isoWeekKey === saved.isoWeekKey
                );
                if (idx === -1) return [...prev, saved];
                const next = prev.slice();
                next[idx] = saved;
                return next;
              });
            }}
          />

          {/* Global ToastContainer is defined in root.jsx */}
        </div>
      </div>
  
  );
}

const STATUS_STYLES = {
  DUE: { bg: "bg-amber-200", text: "text-amber-950", border: "border-amber-500" },
  DRAFT: { bg: "bg-blue-200", text: "text-blue-950", border: "border-blue-500" },
  SUBMITTED: { bg: "bg-green-200", text: "text-green-950", border: "border-green-500" },
  APPROVED: { bg: "bg-teal-200", text: "text-teal-950", border: "border-teal-500" },
  KLAUSUR: { bg: "bg-zinc-200", text: "text-zinc-800", border: "border-zinc-500" },
  KLAUSURPHASE: { bg: "bg-zinc-200", text: "text-zinc-800", border: "border-zinc-500" },
};

function Legend() {
  const items = [
    { label: "Must be submitted (no report)", cls: STATUS_STYLES.DUE },
    { label: "Draft", cls: STATUS_STYLES.DRAFT },
    { label: "Submitted (green)", cls: STATUS_STYLES.SUBMITTED },
    { label: "Reviewed (Prüfungsamt)", cls: STATUS_STYLES.APPROVED },
    { label: "Klausurphase", cls: STATUS_STYLES.KLAUSURPHASE },
    { label: "Edited in last 48h", ring: true },
  ];
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-3 text-sm">
          <div className={`h-4 w-4 rounded border ${it.cls ? `${it.cls.bg} ${it.cls.border}` : "bg-white border-slate-300"} ${it.ring ? "ring-2 ring-offset-1 ring-indigo-400" : ""}`}></div>
          <span className="text-slate-700">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function CalendarView({ reports, onDayClick, year, month, filter = "ALL" }) {
  const headerDate = new Date(year, month, 1);
  const weeks = useMemo(() => buildMonth(year, month), [year, month]);

  const statusByWeek = useMemo(() => {
    const map = new Map();
    for (const r of reports) {
      map.set(r.isoWeekKey, r.status);
    }
    return map;
  }, [reports]);

  const editedByWeek = useMemo(() => {
    const map = new Map();
    const cutoff = Date.now() - 48 * 60 * 60 * 1000;
    for (const r of reports) {
      if (r?.editedAt) {
        const t = new Date(r.editedAt).getTime();
        if (!Number.isNaN(t) && t >= cutoff) map.set(r.isoWeekKey, true);
      }
    }
    return map;
  }, [reports]);

  const minutesByWeek = useMemo(() => {
    const map = new Map();
    const toMin = (t) => {
      if (!t || typeof t !== "string" || !t.includes(":")) return null;
      const [hh, mm] = t.split(":");
      const h = Number(hh), m = Number(mm);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    };
    for (const r of reports) {
      let sum = 0;
      const days = r?.days || {};
      for (const k of ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]) {
        const d = days[k];
        if (!d || d.holiday) continue;
        const a = toMin(d.from), b = toMin(d.till);
        if (a != null && b != null && b > a) sum += (b - a);
      }
      if (sum > 0) map.set(r.isoWeekKey, sum);
    }
    return map;
  }, [reports]);

  const DayCell = ({ date }) => {
    const inMonth = date.getMonth() === month;
    const weekKey = getISOWeekKey(date);
    let status = statusByWeek.get(weekKey) || "DUE";
    // normalize legacy values
    if (status === "KLAUSUR") status = "KLAUSURPHASE";
    const clsObj = STATUS_STYLES[status] || { bg: "bg-white", text: "text-slate-900", border: "border-slate-200" };
    // Always show week color starting Monday, even on trailing/leading days; fade if out of month
    const dimByFilter = filter !== "ALL" && status !== filter;
    const base = `${clsObj.bg} ${clsObj.text} ${clsObj.border} ${inMonth ? "" : "opacity-60"} ${dimByFilter ? "opacity-40" : ""}`;
    const isEdited = editedByWeek.get(weekKey);
    const mins = minutesByWeek.get(weekKey);
    const hoursLabel = mins ? `${Math.floor(mins/60)}h ${mins%60}m` : null;
    const isMonday = date.getDay() === 1; // Monday badge: week number
    const weekNumber = Number(weekKey.split("-W")[1]);
    return (
      <button
        type="button"
        onClick={() => onDayClick && onDayClick(weekKey)}
        className={`relative h-16 rounded-md border text-xs font-semibold flex items-start p-2 text-left transition hover:brightness-95 ${base} ${isEdited ? "ring-2 ring-offset-1 ring-indigo-400" : ""}`}
        title={`${weekKey} • ${status}${hoursLabel ? " • "+hoursLabel : ""}${isEdited ? " • edited" : ""}`}
      >
        {isMonday && (
          <span className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-white/70 border border-slate-300 text-slate-700">W{weekNumber}</span>
        )}
        <span>{date.getDate()}</span>
        {hoursLabel && (
          <span className="absolute bottom-1 right-1 text-[10px] px-1 py-0.5 rounded bg-white/70 border border-slate-300 text-slate-700">{hoursLabel}</span>
        )}
      </button>
    );
  };

  const dow = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-slate-900">{headerDate.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
        <div className="text-xs text-slate-500">Colors reflect weekly status</div>
      </div>
      <div className="grid grid-cols-7 text-[11px] text-slate-500 mb-2 font-medium">
        {dow.map((d) => (<div key={d} className="text-center py-1">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date, idx) => (
          <DayCell key={idx} date={date} />
        ))}
      </div>
    </div>
  );
}

function ListView({ reports, filter = "ALL", onOpen }) {
  const truncate = (s, n = 140) => {
    if (!s) return "";
    const t = s.trim();
    return t.length > n ? t.slice(0, n - 1) + "…" : t;
  };
  const statusPill = (s) => {
    if (!s) return "bg-amber-100 text-amber-900 border-amber-500";
    if (s === "KLAUSUR") s = "KLAUSURPHASE";
    return s === "DRAFT" ? "bg-blue-100 text-blue-900 border-blue-500" :
           s === "SUBMITTED" ? "bg-green-100 text-green-900 border-green-500" :
           s === "APPROVED" ? "bg-teal-100 text-teal-900 border-teal-500" :
           s === "KLAUSURPHASE" ? "bg-zinc-200 text-zinc-800 border-zinc-500" :
           "bg-amber-100 text-amber-900 border-amber-500";
  };
  const toMinutes = (t) => {
    if (!t || typeof t !== "string" || !t.includes(":")) return null;
    const [hh, mm] = t.split(":");
    const h = Number(hh), m = Number(mm);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };
  const weekMinutes = (rep) => {
    let sum = 0;
    const days = rep?.days || {};
    for (const k of ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]) {
      const d = days[k];
      if (!d || d.holiday) continue;
      const a = toMinutes(d.from), b = toMinutes(d.till);
      if (a != null && b != null && b > a) sum += (b - a);
    }
    return sum;
  };

  const normalized = reports.map((r) => ({
    ...r,
    normStatus: r.status === "KLAUSUR" ? "KLAUSURPHASE" : r.status || "DUE",
  }));

  const filtered = normalized.filter((r) => filter === "ALL" || r.normStatus === filter);

  const parseWeek = (wk) => {
    // wk: YYYY-Www
    const [y, w] = wk.split("-W");
    return { y: Number(y) || 0, w: Number(w) || 0 };
  };
  const sorted = filtered.slice().sort((a, b) => {
    const A = parseWeek(a.isoWeekKey);
    const B = parseWeek(b.isoWeekKey);
    if (A.y !== B.y) return B.y - A.y;
    return B.w - A.w;
  });

  if (!sorted.length) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
        <p className="text-slate-600">No reports to show yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 divide-y">
      {sorted.map((r) => {
        const start = parseISOWeekStart(r.isoWeekKey);
        const dates = start ? `${start.toLocaleDateString()} – ${new Date(start.getFullYear(), start.getMonth(), start.getDate()+6).toLocaleDateString()}` : r.isoWeekKey;
        const mins = weekMinutes(r);
        const hours = mins > 0 ? `${Math.floor(mins/60)}h ${mins%60}m` : "–";
        return (
          <div key={r.isoWeekKey} className="p-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="font-semibold text-slate-900">{r.isoWeekKey}</div>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${statusPill(r.normStatus)}`}>
                  {r.normStatus === "APPROVED" ? "Reviewed (Prüfungsamt)" : r.normStatus}
                </span>
                <span className="text-xs text-slate-500">{dates}</span>
                <span className="text-xs text-slate-600">• {hours}</span>
              </div>
              <div className="text-sm text-slate-700 mt-1">
                {truncate(r.tasks, 180) || <span className="italic text-slate-500">No tasks yet</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                className="px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-50"
                onClick={() => onOpen && onOpen(r.isoWeekKey)}
              >Open</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeekModal({ open, weekKey, report, onClose, onSaved }) {
  const [tasks, setTasks] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMode, setSaveMode] = useState("SUBMITTED");
  const [daysState, setDaysState] = useState({});
  const [grade, setGrade] = useState("");
  const navigate = useNavigate();
  const dayKeys = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const taskLen = (tasks || "").trim().length;
  const weekStart = useMemo(() => (weekKey ? parseISOWeekStart(weekKey) : null), [weekKey]);
  const weekDates = useMemo(() => {
    if (!weekStart) return [];
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // helper to parse HH:MM -> minutes
  const parseToMinutes = (t) => {
    if (!t || typeof t !== "string" || !t.includes(":")) return null;
    const [hh, mm] = t.split(":");
    const h = Number(hh);
    const m = Number(mm);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  // Compute weekly total minutes based on from/till times ignoring holidays
  const totalMinutes = useMemo(() => {
    let sum = 0;
    for (const k of dayKeys) {
      const d = daysState?.[k];
      if (!d || d.holiday) continue;
      const fromMin = parseToMinutes(d.from);
      const tillMin = parseToMinutes(d.till);
      if (fromMin != null && tillMin != null && tillMin > fromMin) {
        sum += tillMin - fromMin;
      }
    }
    return sum;
  }, [daysState]);

  useEffect(() => {
    if (open) {
      setTasks(report?.tasks || "");
      setGrade(Number.isInteger(report?.grade) ? String(report.grade) : "");
      const init = {};
      for (let i = 0; i < dayKeys.length; i++) {
        const k = dayKeys[i];
        const v = report?.days?.[k] || {};
        init[k] = {
          from: v.from || "",
          till: v.till || "",
          notes: v.notes || "",
          holiday: !!v.holiday,
          hold: !!v.hold,
          mood: v.mood || "",
        };
      }
      setDaysState(init);
    }
  }, [open, report]);

  if (!open) return null;

  const handleSave = async (mode = "SUBMITTED") => {
    try {
      setSaveMode(mode);
      if (!weekKey) return;
      // For final submission enforce a minimum, drafts can be empty
      if (mode !== "DRAFT") {
        if (!tasks || tasks.trim().length < 10) {
          toast.warn("Please enter at least 10 characters for tasks.");
          return;
        }
      }
      setSaving(true);
  const body = { tasks: (tasks || "").trim(), days: daysState, status: mode };
      if (grade !== "") {
        const g = Number(grade);
        if (!Number.isNaN(g)) body.grade = g;
      }
      const saved = await apiJson(`/api/praxisberichte/${weekKey}`, "PUT", body);
      toast.success(mode === "DRAFT" ? "Draft saved" : "Week submitted");
      onSaved && onSaved(saved);
      onClose && onClose();
    } catch (e) {
      console.error(e);
      if (e && e.status === 401) {
        navigate("/login");
      } else {
        const msg = e?.message || "Failed to save week";
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-[96vw] max-w-4xl rounded-lg bg-white shadow-2xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Praxisbericht</div>
            <div className="flex items-center gap-3">
              <div className="font-semibold text-slate-900">{weekKey}</div>
              {report?.status && (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border ${
                  report.status === "DRAFT" ? "bg-blue-100 text-blue-900 border-blue-500" :
                  report.status === "SUBMITTED" ? "bg-green-100 text-green-900 border-green-500" :
                  report.status === "APPROVED" ? "bg-teal-100 text-teal-900 border-teal-500" :
                  report.status === "KLAUSURPHASE" || report.status === "KLAUSUR" ? "bg-zinc-200 text-zinc-800 border-zinc-500" :
                  "bg-amber-100 text-amber-900 border-amber-500"
                }`}>
                  {report.status === "APPROVED" ? "Reviewed (Prüfungsamt)" : report.status}
                </span>
              )}
            </div>
            {weekDates?.length === 7 && (
              <div className="text-xs text-slate-500 mt-0.5">
                {weekDates[0].toLocaleDateString()} – {weekDates[6].toLocaleDateString()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-600">
              Total:&nbsp;
              <span className="font-semibold text-slate-900">
                {Math.floor(totalMinutes/60)}h {totalMinutes%60}m
              </span>
            </div>
            <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="p-5">
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm font-medium text-slate-900">Weekly hours</div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
                onClick={() => {
                  const monday = daysState.Mon || {};
                  if (!monday.from || !monday.till) {
                    toast.info("Set Monday times first to apply to all.");
                    return;
                  }
                  setDaysState((prev) => {
                    const next = { ...prev };
                    for (const k of dayKeys) {
                      if (!next[k]?.holiday) {
                        next[k] = { ...next[k], from: monday.from, till: monday.till };
                      }
                    }
                    return next;
                  });
                }}
              >Apply Mon to all</button>
              <button
                type="button"
                className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
                onClick={() => {
                  setDaysState((prev) => {
                    const next = { ...prev };
                    for (const k of dayKeys) {
                      next[k] = { ...next[k], from: "", till: "" };
                    }
                    return next;
                  });
                }}
              >Clear all times</button>
              <button
                type="button"
                className="text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50"
                onClick={() => {
                  setDaysState((prev) => {
                    const next = { ...prev };
                    const setIf = (k, from, till) => {
                      if (!next[k]?.holiday) next[k] = { ...next[k], from, till };
                    };
                    setIf("Mon", "09:00", "17:00");
                    setIf("Tue", "09:00", "17:00");
                    setIf("Wed", "09:00", "17:00");
                    setIf("Thu", "09:00", "17:00");
                    setIf("Fri", "09:00", "17:00");
                    return next;
                  });
                }}
              >Fill 09:00–17:00 (Mon–Fri)</button>
            </div>
          </div>
          <div className="overflow-auto rounded-md border border-slate-200">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-600 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-3 py-2 font-medium">Day</th>
                  <th className="text-left px-3 py-2 font-medium">From</th>
                  <th className="text-left px-3 py-2 font-medium">Till</th>
                  <th className="text-left px-3 py-2 font-medium">Hours</th>
                  <th className="text-left px-3 py-2 font-medium">Feiertag</th>
                  <th className="text-left px-3 py-2 font-medium">On hold</th>
                  <th className="text-left px-3 py-2 font-medium">Rating</th>
                  <th className="text-left px-3 py-2 font-medium">Sonstiges</th>
                </tr>
              </thead>
              <tbody>
                {dayKeys.map((k, idx) => (
                  <tr key={k} className={`border-t transition-colors ${daysState[k]?.holiday ? "bg-slate-50 opacity-70" : "hover:bg-slate-50/70"}`}>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{k}</div>
                      <div className="text-[11px] text-slate-500">{weekDates[idx]?.toLocaleDateString?.() || ""}</div>
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <input type="time" className="w-full rounded-md border border-slate-300 px-2 py-1" value={daysState[k]?.from || ""} disabled={!!daysState[k]?.holiday} title={daysState[k]?.holiday ? "Disabled due to holiday" : undefined} onChange={(e) => setDaysState((prev) => ({ ...prev, [k]: { ...prev[k], from: e.target.value } }))} />
                    </td>
                    <td className="px-3 py-2 align-middle">
                      <input type="time" className="w-full rounded-md border border-slate-300 px-2 py-1" value={daysState[k]?.till || ""} disabled={!!daysState[k]?.holiday} title={daysState[k]?.holiday ? "Disabled due to holiday" : undefined} onChange={(e) => setDaysState((prev) => ({ ...prev, [k]: { ...prev[k], till: e.target.value } }))} />
                    </td>
                    <td className="px-3 py-2 align-middle text-slate-700">
                      {(() => {
                        const d = daysState[k];
                        if (!d || d.holiday) return "–";
                        const a = parseToMinutes(d.from), b = parseToMinutes(d.till);
                        if (a == null || b == null || b <= a) return "–";
                        const mins = b - a; const h = Math.floor(mins/60), m = mins%60;
                        return `${h}h ${m}m`;
                      })()}
                    </td>
                    <td className="px-3 py-2 align-middle text-center">
                      <input type="checkbox" className="accent-slate-900" checked={!!daysState[k]?.holiday} onChange={(e) => setDaysState((prev) => {
                        const checked = e.target.checked;
                        const next = { ...prev, [k]: { ...prev[k], holiday: checked } };
                        if (checked) {
                          next[k].from = "";
                          next[k].till = "";
                        }
                        return next;
                      })} />
                    </td>
                    <td className="px-3 py-2 align-middle text-center">
                      <input type="checkbox" className="accent-slate-900" checked={!!daysState[k]?.hold} onChange={(e) => setDaysState((prev) => ({ ...prev, [k]: { ...prev[k], hold: e.target.checked } }))} />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                        value={daysState[k]?.mood || ""}
                        onChange={(e) => setDaysState((prev) => ({ ...prev, [k]: { ...prev[k], mood: e.target.value } }))}
                      >
                        <option value="">–</option>
                        <option value="happy">😃 happy</option>
                        <option value="satisfied">🙂 satisfied</option>
                        <option value="sad">😞 sad</option>
                        <option value="angry">😡 angry</option>
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        className="w-full rounded-md border border-slate-300 px-2 py-1"
                        placeholder="Notes"
                        value={daysState[k]?.notes || ""}
                        onChange={(e) => setDaysState((prev) => ({ ...prev, [k]: { ...prev[k], notes: e.target.value } }))}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end text-xs text-slate-600 mt-2">
            {(() => {
              const h = Math.floor(totalMinutes / 60);
              const m = totalMinutes % 60;
              return <span>Weekly total: <span className="font-medium text-slate-800">{h}h {m}m</span></span>;
            })()}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-slate-700">Tasks (brief weekly summary, min 10 chars to submit)</label>
              <span className={`text-[11px] ${taskLen >= 10 ? "text-emerald-700" : "text-slate-500"}`}>{taskLen}/10</span>
            </div>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder="Describe your practical work this week..."
            />
            <div className="mt-2 grid grid-cols-2 gap-3 max-w-sm">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grade (optional)</label>
                <select
                  className="w-full rounded-md border border-slate-300 px-2 py-1"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                >
                  <option value="">—</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </div>
            </div>
          </div>
          <div className="text-xs text-slate-500">You can <span className="font-semibold text-sky-700">save as Draft</span> now or <span className="font-semibold text-emerald-700">Submit (green)</span> when ready.</div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
          <div className="flex-1 text-xs text-slate-500 sm:text-right">Draft keeps your work private until you submit.</div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50">Cancel</button>
            <button disabled={saving} onClick={() => handleSave("DRAFT")} className="px-4 py-2 text-sm rounded-md border border-sky-300 text-sky-900 hover:bg-sky-50 disabled:opacity-60">{saving && saveMode === "DRAFT" ? "Saving draft..." : "Save draft"}</button>
            <button disabled={saving || taskLen < 10} title={taskLen < 10 ? "Enter at least 10 characters" : undefined} onClick={() => handleSave("SUBMITTED")} className={`px-4 py-2 text-sm rounded-md text-white hover:opacity-90 ${saving || taskLen < 10 ? "bg-slate-500" : "bg-slate-900"}`}>{saving && saveMode !== "DRAFT" ? "Submitting..." : "Submit"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
