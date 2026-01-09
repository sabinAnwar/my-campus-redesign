import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiGet } from "../lib/api";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  CalendarClock,
  GraduationCap,
  ClipboardList,
  FileEdit,
  BadgeCheck,
  Smile,
  Info,
  X,
  Calendar,
  Clock,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";
import {
  PraxisberichtHeader,
  ReminderBanner,
  StatsGrid,
  ViewToggle,
  Legend,
} from "~/components/praxisbericht";

const STATUS_STYLES = {
  DUE: {
    bg: "bg-amber-900",
    text: "text-white",
    border: "border-amber-900",
  },
  DRAFT: {
    bg: "bg-sky-900",
    text: "text-white",
    border: "border-sky-900",
  },
  SUBMITTED: {
    bg: "bg-emerald-900",
    text: "text-white",
    border: "border-emerald-900",
  },
  APPROVED: {
    bg: "bg-violet-900",
    text: "text-white",
    border: "border-violet-900",
  },
  EXAM_PHASE: {
    bg: "bg-slate-900",
    text: "text-white",
    border: "border-slate-900",
  },
  ALL: {
    bg: "bg-card/50",
    text: "text-foreground",
    border: "border-border",
  },
};

const normalizeReport = (report: any) => {
  if (!report) return report;
  const rawStatus =
    typeof report.status === "string" ? report.status.toUpperCase() : "DUE";
  const normalizedStatus =
    rawStatus === "KLAUSUR" ? "KLAUSURPHASE" : rawStatus;
  return {
    ...report,
    status: normalizedStatus,
    isoWeekKey: report.isoWeekKey || report.iso_week_key,
    editedAt: report.editedAt || report.edited_at,
    approvedAt: report.approvedAt || report.approved_at,
    createdAt: report.createdAt || report.created_at,
  };
};

// Helpers
function getISOWeekKey(date: Date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  // Thursday in current week decides the year
  const dayNum = d.getUTCDay() || 7; // 1..7, Mon..Sun
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  );
  const weekStr = String(weekNo).padStart(2, "0");
  return `${d.getUTCFullYear()}-W${weekStr}`;
}

function parseISOWeekStart(weekKey: string | null | undefined) {
  // weekKey format: YYYY-Www
  try {
    if (typeof weekKey !== "string") return null;
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

function buildMonth(year: number, month: number) {
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

function getMonthWeekKeys(year: number, month: number) {
  // Collect unique ISO week keys that intersect the given month (1..last day)
  const keys = new Set();
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= lastDay; day++) {
    const d = new Date(year, month, day);
    keys.add(getISOWeekKey(d));
  }
  return keys;
}

function getSemesterWeekKeys(semStartYear: number, semStartMonth: number) {
  const keys = new Set();
  for (let i = 0; i < 6; i++) {
    const d = new Date(semStartYear, semStartMonth + i, 1);
    const monthKeys = getMonthWeekKeys(d.getFullYear(), d.getMonth());
    monthKeys.forEach((k) => keys.add(k));
  }
  return keys;
}

export default function Praxisbericht2() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [view, setView] = useState("calendar");
  const [reports, setReports] = useState<any[]>([]);
  const [activeWeekKey, setActiveWeekKey] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportsVersion, setReportsVersion] = useState(0);
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

  const fetchReports = useCallback(async () => {
    try {
      const data = await apiGet(`/api/praxisberichte?ts=${Date.now()}`);
      setReports((data.reports || []).map(normalizeReport));
      setReportsVersion((v) => v + 1);
      setLoading(false);
    } catch (e: any) {
      console.error("Failed to load praxisberichte", e);
      if (e && e.status === 401) {
        navigate("/");
      } else {
        toast.error(e?.message || "Failed to load Praxisberichte");
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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

  const normalizedReports = useMemo(
    () => reports.map(normalizeReport),
    [reports]
  );

  // Derive period-aware metrics (submitted/due/klausur/completion + drafts/approved/satisfied) for visible period
  const stats = useMemo(() => {
    const statusMap = new Map();
    for (const r of normalizedReports) {
      if (!r) continue;
      const raw = typeof r.status === "string" ? r.status.toUpperCase() : "DUE";
      const s = raw === "KLAUSUR" ? "KLAUSURPHASE" : raw;
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
      const rep = normalizedReports.find((r) => r && r.isoWeekKey === wk);
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
  }, [normalizedReports, mode, year, month, semStartYear, semStartMonth]);

  return (
    <div className="max-w-7xl mx-auto">
      <PraxisberichtHeader title={t.title} subtitle={t.subtitle} />

      <ReminderBanner
        reminderEnabled={reminderEnabled}
        reminderHour={reminderHour}
        onOpenSettings={() => navigate("/settings")}
        labels={{
          reminder: t.reminder,
          reminderActive: t.reminderActive,
          reminderDisabled: t.reminderDisabled,
          openSettings: t.openSettings,
        }}
      />

      <StatsGrid
        stats={[
          {
            label: t.submitted,
            val: stats.submitted,
            icon: CheckCircle,
            color: "iu-blue-text",
          },
          {
            label: t.mustSubmit,
            val: stats.due,
            icon: AlertCircle,
            color: "orange-900",
          },
          {
            label: t.drafts,
            val: stats.drafts,
            icon: FileEdit,
            color: "iu-blue-text",
          },
          {
            label: t.reviewed,
            val: stats.approved,
            icon: BadgeCheck,
            color: "purple-900",
          },
          {
            label: t.klausurWeeks,
            val: stats.klausur,
            icon: CalendarClock,
            color: "slate-900",
          },
          {
            label: t.completion,
            val: `${stats.completion}%`,
            icon: GraduationCap,
            color: "pink-900",
          },
          {
            label: t.satisfied,
            val: stats.satisfied,
            icon: Smile,
            color: "iu-blue-text",
          },
        ]}
      />

      <ViewToggle
        view={view as "calendar" | "list"}
        onViewChange={(v) => setView(v)}
        onGoToCurrentWeek={() => {
          const now = new Date();
          setYear(now.getFullYear());
          setMonth(now.getMonth());
          const wk = getISOWeekKey(now);
          const r =
            normalizedReports.find((x) => x && x.isoWeekKey === wk) || null;
          setActiveReport(r);
          setActiveWeekKey(wk);
        }}
        onNewDraft={() => {
          const now = new Date();
          const wk = getISOWeekKey(now);
          setActiveReport(null);
          setActiveWeekKey(wk);
        }}
        labels={{
          calendar: t.calendar,
          list: t.list,
          goToCurrentWeek: t.goToCurrentWeek,
          newDraft: t.newDraft,
        }}
      />

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
                    className={`px-2.5 py-1.5 text-xs rounded-none border transition-colors font-bold ${
                      mode === "month"
                        ? "bg-iu-blue text-white"
                        : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800"
                    }`}
                    onClick={() => setMode("month")}
                  >
                    {t.month}
                  </button>
                  <button
                    className={`px-2.5 py-1.5 text-xs rounded-none border transition-colors font-bold ${
                      mode === "semester"
                        ? "bg-iu-blue text-white"
                        : "bg-slate-900 text-slate-200 border-slate-700 hover:bg-slate-800"
                    }`}
                    onClick={() => setMode("semester")}
                  >
                    {t.semester}
                  </button>
                </div>
                {mode === "month" ? (
                  <div className="flex items-center gap-2">
                    <button
                      className="px-2 py-1 text-xs rounded border flex items-center gap-1 border-slate-300 dark:border-slate-700 bg-card/50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      onClick={() => {
                        const d = new Date(year, month - 1, 1);
                        setYear(d.getFullYear());
                        setMonth(d.getMonth());
                      }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div className="text-sm font-semibold text-foreground dark:text-slate-100">
                      {new Date(year, month, 1).toLocaleString(undefined, {
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <button
                      className="px-2 py-1 text-xs rounded border flex items-center gap-1 border-slate-300 dark:border-slate-700 bg-card/50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
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
                        const d = new Date(semStartYear, semStartMonth - 6, 1);
                        setSemStartYear(d.getFullYear());
                        setSemStartMonth(d.getMonth());
                      }}
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <div className="text-sm font-semibold text-foreground">
                      {new Date(semStartYear, semStartMonth, 1).toLocaleString(
                        undefined,
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
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
                        const d = new Date(semStartYear, semStartMonth + 6, 1);
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
                  key={`month-${year}-${month}-${reportsVersion}`}
                  reports={normalizedReports}
                  year={year}
                  month={month}
                  filter={statusFilter}
                  onDayClick={(weekKey: string) => {
                    const r =
                      normalizedReports.find(
                        (x) => x && x.isoWeekKey === weekKey
                      ) ||
                      null;
                    setActiveReport(r);
                    setActiveWeekKey(weekKey);
                  }}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Array.from({ length: 6 }).map((_, i) => {
                    const d = new Date(semStartYear, semStartMonth + i, 1);
                    const y = d.getFullYear();
                    const m = d.getMonth();
                    return (
                      <CalendarView
                        key={`${y}-${m}`}
                        reports={normalizedReports}
                        year={y}
                        month={m}
                        filter={statusFilter}
                        onDayClick={(weekKey: string) => {
                          const r =
                            normalizedReports.find(
                              (x) => x && x.isoWeekKey === weekKey
                            ) || null;
                          setActiveReport(r);
                          setActiveWeekKey(weekKey);
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            <div className="bg-card/50 dark:bg-card/50/5 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] border border-border dark:border-white/10 p-5 sm:p-6 lg:p-8 h-fit">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="p-2.5 sm:p-3 bg-iu-blue/10 dark:bg-iu-blue rounded-2xl">
                  <Info className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue dark:text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-foreground dark:text-white uppercase tracking-tighter">
                  {t.legend}
                </h3>
              </div>
              <Legend />
            </div>
          </div>

          {/* WeekModal moved outside so it also works in List view */}
        </>
      ) : (
        <ListView
          reports={normalizedReports}
          filter={statusFilter}
          onOpen={(weekKey: string) => {
            const r =
              normalizedReports.find((x) => x && x.isoWeekKey === weekKey) ||
              null;
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
        onSaved={(saved: { isoWeekKey: any }) => {
          if (!saved) return;
          const normalized = normalizeReport(saved);
          setReports((prev) => {
            const idx = prev.findIndex(
              (p) => p && p.isoWeekKey === normalized.isoWeekKey
            );
            if (idx === -1) return [...prev, normalized];
            const next = prev.slice();
            next[idx] = normalized;
            return next;
          });
          setReportsVersion((v) => v + 1);
          void fetchReports();
        }}
      />

      {/* Global ToastContainer is defined in root.jsx */}
    </div>
  );
}

function CalendarView({
  reports,
  onDayClick,
  year,
  month,
  filter = "ALL",
}: {
  reports: any[];
  onDayClick?: (weekKey: string) => void;
  year: number;
  month: number;
  filter?: string;
}) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const headerDate = new Date(year, month, 1);
  const weeks = useMemo(() => buildMonth(year, month), [year, month]);

  const statusByWeek = useMemo(() => {
    const map = new Map();
    for (const r of reports) {
      if (!r) continue;
      const raw = typeof r.status === "string" ? r.status.toUpperCase() : "DUE";
      const normalized = raw === "KLAUSUR" ? "KLAUSURPHASE" : raw;
      map.set(r.isoWeekKey, normalized);
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
    const toMin = (t: string | null | undefined) => {
      if (!t || typeof t !== "string" || !t.includes(":")) return null;
      const [hh, mm] = t.split(":");
      const h = Number(hh),
        m = Number(mm);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    };
    for (const r of reports) {
      if (!r) continue;
      let sum = 0;
      const days = r?.days || {};
      for (const k of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]) {
        const d = days[k];
        if (!d || d.holiday) continue;
        const a = toMin(d.from),
          b = toMin(d.till);
        if (a != null && b != null && b > a) sum += b - a;
      }
      if (sum > 0) map.set(r.isoWeekKey, sum);
    }
    return map;
  }, [reports]);

  const DayCell = ({ date }: { date: Date }) => {
    const inMonth = date.getMonth() === month;
    const weekKey = getISOWeekKey(date);
    let status = statusByWeek.get(weekKey) || "DUE";
    // normalize legacy values
    if (status === "KLAUSUR") status = "KLAUSURPHASE";
    const clsObj = STATUS_STYLES[status as keyof typeof STATUS_STYLES] || {
      bg: "bg-card/50",
      text: "text-foreground",
      border: "border-border",
    };
    // Always show week color starting Monday, even on trailing/leading days; fade if out of month
    const dimByFilter = filter !== "ALL" && status !== filter;
    const base = `${clsObj.bg} ${clsObj.text} ${clsObj.border} ${inMonth ? "" : "opacity-30"} ${dimByFilter ? "opacity-20" : ""}`;
    const isEdited = editedByWeek.get(weekKey);
    const mins = minutesByWeek.get(weekKey);
    const hoursLabel = mins ? `${Math.floor(mins / 60)}h ${mins % 60}m` : null;
    const isMonday = date.getDay() === 1; // Monday badge: week number
    const weekNumber = Number(weekKey.split("-W")[1]);
    return (
      <button
        type="button"
        onClick={() => onDayClick && onDayClick(weekKey)}
        className={`relative h-20 rounded-2xl border text-xs font-bold flex items-start p-3 text-left transition-all duration-300 hover:scale-[1.05] hover:z-10 ${base} ${isEdited ? "ring-2 ring-offset-2 ring-offset-background ring-iu-blue" : ""}`}
        title={`${weekKey} • ${status}${hoursLabel ? " • " + hoursLabel : ""}${isEdited ? " • edited" : ""}`}
      >
        {isMonday && (
          <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-lg bg-foreground border border-foreground text-background uppercase tracking-widest">
            W{weekNumber}
          </span>
        )}
        <span className="text-lg text-white font-black">{date.getDate()}</span>
        {hoursLabel && (
          <span className="absolute bottom-2 right-2 text-[9px] px-2 py-0.5 rounded-lg bg-iu-blue border border-iu-blue text-white font-bold uppercase tracking-widest">
            {hoursLabel}
          </span>
        )}
      </button>
    );
  };

  const dow = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] border border-border p-4 sm:p-6 lg:p-8 transition-all duration-500">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tighter">
          {headerDate.toLocaleString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </div>
        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          {t.colorsReflect}
        </div>
      </div>
      <div className="grid grid-cols-7 text-[10px] text-muted-foreground mb-4 font-bold uppercase tracking-widest">
        {weeks.flat().map((date, idx) => (
          <DayCell key={idx} date={date} />
        ))}
      </div>
    </div>
  );
}

function ListView({
  reports,
  filter = "ALL",
  onOpen,
}: {
  reports: any[];
  filter?: string;
  onOpen?: (weekKey: string) => void;
}) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const truncate = (s: string, n = 140) => {
    if (!s) return "";
    const trimmed = s.trim();
    return trimmed.length > n ? trimmed.slice(0, n - 1) + "…" : trimmed;
  };
  const statusPill = (s: string) => {
    if (!s) return "bg-amber-900 text-white border-amber-900";
    if (s === "KLAUSUR") s = "KLAUSURPHASE";
    return s === "DRAFT"
      ? "bg-iu-blue text-white border-iu-blue"
      : s === "SUBMITTED"
        ? "bg-emerald-900 text-white border-emerald-900"
        : s === "APPROVED"
          ? "bg-violet-900 text-white border-violet-900"
          : s === "KLAUSURPHASE"
            ? "bg-slate-900 text-white border-slate-900"
            : "bg-amber-900 text-white border-amber-900";
  };
  const toMinutes = (t: string | null | undefined) => {
    if (typeof t !== "string" || !t.includes(":")) return null;
    const [hh, mm] = t.split(":");
    const h = Number(hh),
      m = Number(mm);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };
  const weekMinutes = (rep: any) => {
    let sum = 0;
    const days: Record<string, any> = rep?.days || {};
    for (const k of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]) {
      const d = days[k];
      if (!d || d.holiday) continue;
      const a = toMinutes(d.from),
        b = toMinutes(d.till);
      if (a != null && b != null && b > a) sum += b - a;
    }
    return sum;
  };

  const normalized = reports
    .filter((r) => r !== null)
    .map((r: any) => ({
      ...r,
      normStatus: r.status === "KLAUSUR" ? "KLAUSURPHASE" : r.status || "DUE",
    }));

  const filtered = normalized.filter(
    (r: any) => filter === "ALL" || r.normStatus === filter
  );

  const parseWeek = (wk: any) => {
    // wk: YYYY-Www
    if (typeof wk !== "string") return { y: 0, w: 0 };
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
      <div className="bg-card/50 backdrop-blur-xl rounded-[2rem] sm:rounded-[2.5rem] border border-border p-6 sm:p-10 lg:p-16 text-center">
        <div className="p-4 sm:p-6 bg-iu-blue/10 dark:bg-iu-blue rounded-2xl sm:rounded-3xl w-fit mx-auto mb-5 sm:mb-6">
          <ClipboardList className="h-10 w-10 sm:h-12 sm:w-12 text-iu-blue dark:text-white" />
        </div>
        <p className="text-base sm:text-xl text-muted-foreground font-medium">
          {t.noReports}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2rem] border border-border overflow-hidden divide-y divide-border">
      {sorted.map((r: any) => {
        const start =
          typeof r.isoWeekKey === "string"
            ? parseISOWeekStart(r.isoWeekKey)
            : null;
        const dates = start
          ? `${start.toLocaleDateString()} – ${new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6).toLocaleDateString()}`
          : r.isoWeekKey;
        const mins = weekMinutes(r);
        const hours =
          mins > 0 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : "–";
        return (
          <div
            key={String(r.isoWeekKey)}
            className="p-5 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition-all duration-300 group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-4 flex-wrap mb-3">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                  {r.isoWeekKey}
                </div>
                <span
                  className={`inline-flex items-center rounded-xl px-3 py-1 text-[10px] border font-bold uppercase tracking-widest ${statusPill(String(r.normStatus || ""))}`}
                >
                  {r.normStatus === "APPROVED" ? t.reviewed : r.normStatus}
                </span>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold uppercase tracking-widest">
                  <Calendar className="h-3 w-3" />
                  {dates}
                </div>
                <div className="flex items-center gap-2 text-xs text-iu-blue dark:text-white font-bold uppercase tracking-widest bg-iu-blue/10 dark:bg-iu-blue px-2 py-1 rounded-lg border border-iu-blue/20 dark:border-iu-blue">
                  <Clock className="h-3 w-3" />
                  {hours}
                </div>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                {truncate(r.tasks, 180) || (
                  <span className="italic opacity-50">{t.noTasks}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                className="px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-bold rounded-xl border border-border text-foreground bg-card/50 hover:bg-muted/50 transition-all"
                onClick={() => {
                  if (typeof r.isoWeekKey === "string" && onOpen)
                    onOpen(r.isoWeekKey);
                }}
              >
                {t.openReport}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function WeekModal({
  open,
  weekKey,
  report,
  onClose,
  onSaved,
}: {
  open: boolean;
  weekKey: string | null;
  report: any | null;
  onClose?: () => void;
  onSaved?: (saved: any) => void;
}) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [tasks, setTasks] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMode, setSaveMode] = useState("SUBMITTED");
  const [daysState, setDaysState] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const taskLen = (tasks || "").trim().length;
  const weekStart = useMemo(
    () => (weekKey ? parseISOWeekStart(weekKey) : null),
    [weekKey]
  );
  const weekDates = useMemo(() => {
    if (!weekStart) return [];
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  // helper to parse HH:MM -> minutes
  const parseToMinutes = (t: string | null | undefined): number | null => {
    if (typeof t !== "string" || !t.includes(":")) return null;
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
      const init: Record<string, any> = {};
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
      async function apiJson(
        path: URL | RequestInfo,
        method = "POST",
        body: any = null,
        headers: Record<string, string> = {}
      ) {
        const opts: RequestInit = {
          method,
          headers: { "Content-Type": "application/json", ...headers },
          credentials: "include",
        };
        if (body !== null && body !== undefined) {
          opts.body = JSON.stringify(body);
        }
        const res = await fetch(path, opts);
        let data;
        let text;
        try {
          data = await res.json();
        } catch (_) {
          try {
            text = await res.text();
          } catch (_) {
            text = null;
          }
          data = null;
        }
        if (!res.ok) {
          const fallback = text && text.length < 500 ? text : null;
          const msg =
            (data && (data.error || data.message)) ||
            fallback ||
            `HTTP ${res.status}`;
          const err = new Error(msg) as Error & { status?: number; data?: any };
          err.status = res.status;
          err.data = data || { text: fallback };
          throw err;
        }
        return data;
      }
      const body = {
        isoWeekKey: weekKey,
        tasks: tasks || "",
        days: daysState || {},
        status: mode,
      };
      const saved = await apiJson(
        `/api/praxisberichte/${weekKey}`,
        "PUT",
        body
      );
      const normalized = normalizeReport({
        ...saved,
        status: mode,
        isoWeekKey: weekKey,
      });
      toast.success(mode === "DRAFT" ? "Draft saved" : "Week submitted");
      onSaved && onSaved(normalized);
      onClose && onClose();
    } catch (e) {
      const err: any = e;
      console.error(err);
      if (err && err.status === 401) {
        navigate("/");
      } else {
        const msg = err?.message || "Failed to save week";
        toast.error(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl bg-card rounded-[2rem] sm:rounded-[2.5rem] border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="p-3 sm:p-4 bg-iu-blue rounded-2xl border border-iu-blue">
              <ClipboardList className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight">
                  {weekKey}
                </h2>
                {report?.status && (
                  <span
                    className={`inline-flex items-center rounded-xl px-3 py-1 text-[10px] border font-bold uppercase tracking-widest ${
                      report.status === "DRAFT"
                        ? "bg-iu-blue text-white border-iu-blue"
                        : report.status === "SUBMITTED"
                          ? "bg-emerald-900 text-white border-emerald-900"
                          : report.status === "APPROVED"
                            ? "bg-violet-900 text-white border-violet-900"
                            : report.status === "KLAUSURPHASE" ||
                                report.status === "KLAUSUR"
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-amber-900 text-white border-amber-900"
                    }`}
                  >
                    {report.status === "APPROVED" ? t.reviewed : report.status}
                  </span>
                )}
              </div>
              {weekDates?.length === 7 && (
                <div className="text-sm text-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-foreground" />
                  {weekDates[0].toLocaleDateString()} –{" "}
                  {weekDates[6].toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-1">
                {t.totalHours}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-foreground">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </div>
            </div>
            <button
              className="p-3 hover:bg-foreground rounded-2xl text-foreground hover:text-background transition-all duration-300"
              onClick={onClose}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-transparent">
          <div className="space-y-10">
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="text-xl font-black text-foreground tracking-tight">
                {t.weeklyHours}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-foreground text-background bg-foreground hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
                  onClick={() => {
                    const monday = daysState.Mon || {};
                    if (!monday.from || !monday.till) {
                      toast.info(t.setMondayFirst);
                      return;
                    }
                    setDaysState((prev) => {
                      const next = { ...prev };
                      for (const k of dayKeys) {
                        if (!next[k]?.holiday) {
                          next[k] = {
                            ...next[k],
                            from: monday.from,
                            till: monday.till,
                          };
                        }
                      }
                      return next;
                    });
                  }}
                >
                  {t.applyMonToAll}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-foreground text-background bg-foreground hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
                  onClick={() => {
                    setDaysState((prev) => {
                      const next = { ...prev };
                      for (const k of dayKeys) {
                        next[k] = { ...next[k], from: "", till: "" };
                      }
                      return next;
                    });
                  }}
                >
                  {t.clearAll}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-iu-blue text-white border border-iu-blue hover:bg-iu-blue/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
                  onClick={() => {
                    setDaysState((prev) => {
                      const next = { ...prev };
                      const setIf = (k: string, from: string, till: string) => {
                        if (!next[k]?.holiday)
                          next[k] = { ...next[k], from, till };
                      };
                      setIf("Mon", "09:00", "17:00");
                      setIf("Tue", "09:00", "17:00");
                      setIf("Wed", "09:00", "17:00");
                      setIf("Thu", "09:00", "17:00");
                      setIf("Fri", "09:00", "17:00");
                      return next;
                    });
                  }}
                >
                  {t.fillStandard}
                </button>
              </div>
            </div>

            {/* Days Table */}
            <div className="bg-card rounded-2xl sm:rounded-3xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-900 text-white border-b border-slate-900">
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.day}
                      </th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.from}
                      </th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.till}
                      </th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.hours}
                      </th>
                      <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.holiday}
                      </th>
                      <th className="text-center px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.hold}
                      </th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 sm:py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.rating}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dayKeys.map((k, idx) => (
                      <tr
                        key={k}
                        className={`transition-colors ${daysState[k]?.holiday ? "bg-slate-100 opacity-60" : "hover:bg-slate-100"}`}
                      >
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                          <div className="font-bold text-foreground">{k}</div>
                          <div className="text-[10px] text-foreground font-bold">
                            {weekDates[idx]?.toLocaleDateString?.() || ""}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <input
                            type="time"
                            className="w-full rounded-xl border border-border bg-background text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue outline-none transition-all [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:dark:invert"
                            value={daysState[k]?.from || ""}
                            disabled={!!daysState[k]?.holiday}
                            onChange={(e) =>
                              setDaysState((prev) => ({
                                ...prev,
                                [k]: { ...prev[k], from: e.target.value },
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <input
                            type="time"
                            className="w-full rounded-xl border border-border bg-background text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue outline-none transition-all [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:dark:invert"
                            value={daysState[k]?.till || ""}
                            disabled={!!daysState[k]?.holiday}
                            onChange={(e) =>
                              setDaysState((prev) => ({
                                ...prev,
                                [k]: { ...prev[k], till: e.target.value },
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-foreground font-bold">
                          {(() => {
                            const d = daysState[k];
                            if (!d || d.holiday) return "–";
                            const a = parseToMinutes(d.from),
                              b = parseToMinutes(d.till);
                            if (a == null || b == null || b <= a) return "–";
                            const mins = b - a;
                            const h = Math.floor(mins / 60),
                              m = mins % 60;
                            return `${h}h ${m}m`;
                          })()}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded-lg border-foreground bg-background text-foreground focus:ring-foreground accent-foreground"
                            checked={!!daysState[k]?.holiday}
                            onChange={(e) =>
                              setDaysState((prev) => {
                                const checked = e.target.checked;
                                const next = {
                                  ...prev,
                                  [k]: { ...prev[k], holiday: checked },
                                };
                                if (checked) {
                                  next[k].from = "";
                                  next[k].till = "";
                                }
                                return next;
                              })
                            }
                          />
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded-lg border-foreground bg-background text-foreground focus:ring-foreground accent-foreground"
                            checked={!!daysState[k]?.hold}
                            onChange={(e) =>
                              setDaysState((prev) => ({
                                ...prev,
                                [k]: { ...prev[k], hold: e.target.checked },
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                          <select
                            className="w-full rounded-xl border border-border bg-background text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue outline-none transition-all"
                            value={daysState[k]?.mood || ""}
                            onChange={(e) =>
                              setDaysState((prev) => ({
                                ...prev,
                                [k]: { ...prev[k], mood: e.target.value },
                              }))
                            }
                          >
                            <option value="">–</option>
                            <option value="happy"> {t.happy}</option>
                            <option value="satisfied"> {t.satisfied}</option>
                            <option value="sad"> {t.sad}</option>
                            <option value="angry"> {t.angry}</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 sm:p-3 bg-iu-blue rounded-2xl">
                    <FileEdit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                    Weekly Summary
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${taskLen >= 10 ? "text-foreground" : "text-foreground"}`}
                >
                  {taskLen} / 10 chars
                </span>
              </div>

              <div className="grid grid-cols-1">
                <textarea
                  className="w-full min-h-[200px] rounded-2xl sm:rounded-3xl border border-border bg-background text-foreground px-4 sm:px-6 py-4 sm:py-6 text-sm focus:outline-none focus:ring-2 focus:ring-iu-blue transition-all"
                  value={tasks}
                  onChange={(e) => setTasks(e.target.value)}
                  placeholder="Describe your practical work and achievements this week..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 border-t border-border bg-card flex flex-col sm:flex-row sm:items-center sm:justify-end gap-4 sm:gap-6">
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 text-sm font-bold rounded-2xl border border-foreground text-background bg-foreground hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
            >
              {t.cancel}
            </button>
            <button
              disabled={saving}
              onClick={() => handleSave("DRAFT")}
              className="px-8 py-4 text-sm font-bold rounded-2xl border border-iu-blue text-white bg-iu-blue hover:bg-iu-blue/90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all duration-300 uppercase tracking-widest"
            >
              {saving && saveMode === "DRAFT" ? t.saving : t.saveDraft}
            </button>
            <button
              disabled={saving || taskLen < 10}
              onClick={() => handleSave("SUBMITTED")}
              className={`px-10 py-4 text-sm font-bold rounded-2xl text-white transition-all duration-300 uppercase tracking-widest ${
                saving || taskLen < 10
                  ? "bg-slate-900 text-white cursor-not-allowed"
                  : "bg-iu-blue hover:bg-iu-blue/90 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {saving && saveMode !== "DRAFT" ? t.saving : t.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
