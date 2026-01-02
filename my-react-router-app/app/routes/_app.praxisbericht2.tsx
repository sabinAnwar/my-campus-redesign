import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiGet } from "../lib/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/20",
  },
  DRAFT: {
    bg: "bg-iu-blue/10",
    text: "text-iu-blue",
    border: "border-iu-blue/20",
  },
  SUBMITTED: {
    bg: "bg-iu-blue/20",
    text: "text-iu-blue dark:text-iu-blue",
    border: "border-iu-blue/30",
  },
  APPROVED: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/20",
  },
  KLAUSURPHASE: {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    border: "border-border",
  },
  ALL: {
    bg: "bg-card/50",
    text: "text-foreground",
    border: "border-border",
  },
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
      } catch (e: any) {
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
      if (!r) continue;
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
      const rep = reports.find((r) => r && r.isoWeekKey === wk);
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
            color: "iu-blue",
          },
          {
            label: t.mustSubmit,
            val: stats.due,
            icon: AlertCircle,
            color: "orange-500",
          },
          {
            label: t.drafts,
            val: stats.drafts,
            icon: FileEdit,
            color: "iu-blue",
          },
          {
            label: t.reviewed,
            val: stats.approved,
            icon: BadgeCheck,
            color: "purple-500",
          },
          {
            label: t.klausurWeeks,
            val: stats.klausur,
            icon: CalendarClock,
            color: "slate-400",
          },
          {
            label: t.completion,
            val: `${stats.completion}%`,
            icon: GraduationCap,
            color: "pink-500",
          },
          {
            label: t.satisfied,
            val: stats.satisfied,
            icon: Smile,
            color: "iu-blue",
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
          const r = reports.find((x) => x && x.isoWeekKey === wk) || null;
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
                  reports={reports}
                  year={year}
                  month={month}
                  filter={statusFilter}
                  onDayClick={(weekKey: string) => {
                    const r =
                      reports.find((x) => x && x.isoWeekKey === weekKey) ||
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
                        reports={reports}
                        year={y}
                        month={m}
                        filter={statusFilter}
                        onDayClick={(weekKey: string) => {
                          const r =
                            reports.find(
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
            <div className="bg-card/50 dark:bg-card/50/5 backdrop-blur-xl rounded-[2.5rem] border border-border dark:border-white/10 p-8 h-fit">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-iu-blue/10 rounded-2xl">
                  <Info className="h-6 w-6 text-iu-blue" />
                </div>
                <h3 className="text-xl font-black text-foreground dark:text-white uppercase tracking-tighter">
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
          reports={reports}
          filter={statusFilter}
          onOpen={(weekKey: string) => {
            const r =
              reports.find((x) => x && x.isoWeekKey === weekKey) || null;
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
          setReports((prev) => {
            const idx = prev.findIndex(
              (p) => p && p.isoWeekKey === saved.isoWeekKey
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
      if (r) map.set(r.isoWeekKey, r.status);
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
          <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-lg bg-muted/80 backdrop-blur-md border border-border text-muted-foreground uppercase tracking-widest">
            W{weekNumber}
          </span>
        )}
        <span className="text-lg">{date.getDate()}</span>
        {hoursLabel && (
          <span className="absolute bottom-2 right-2 text-[9px] px-2 py-0.5 rounded-lg bg-muted/80 backdrop-blur-md border border-border text-iu-blue font-bold uppercase tracking-widest">
            {hoursLabel}
          </span>
        )}
      </button>
    );
  };

  const dow = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];

  return (
    <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 transition-all duration-500">
      <div className="flex items-center justify-between mb-8">
        <div className="text-3xl font-bold text-foreground uppercase tracking-tighter">
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
    if (!s) return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    if (s === "KLAUSUR") s = "KLAUSURPHASE";
    return s === "DRAFT"
      ? "bg-iu-blue/10 text-iu-blue border-iu-blue/20"
      : s === "SUBMITTED"
        ? "bg-iu-blue/10 text-iu-blue dark:text-iu-blue border-iu-blue/20"
        : s === "APPROVED"
          ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
          : s === "KLAUSURPHASE"
            ? "bg-muted text-muted-foreground border-border"
            : "bg-orange-500/10 text-orange-500 border-orange-500/20";
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
      <div className="bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border p-16 text-center">
        <div className="p-6 bg-iu-blue/10 rounded-3xl w-fit mx-auto mb-6">
          <ClipboardList className="h-12 w-12 text-iu-blue" />
        </div>
        <p className="text-xl text-muted-foreground font-medium">
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
            className="p-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/30 transition-all duration-300 group"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-4 flex-wrap mb-3">
                <div className="text-3xl font-bold text-foreground tracking-tight group-hover:text-iu-blue transition-colors">
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
                <div className="flex items-center gap-2 text-xs text-iu-blue font-bold uppercase tracking-widest">
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
                className="px-6 py-3 text-sm font-bold rounded-xl border border-border text-foreground bg-card/50 hover:bg-muted/50 transition-all"
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
  const [grade, setGrade] = useState("");
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
      setGrade(Number.isInteger(report?.grade) ? String(report.grade) : "");
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
        grade: grade !== "" ? Number(grade) : undefined,
        status: mode,
      };
      const saved = await apiJson(
        `/api/praxisberichte/${weekKey}`,
        "PUT",
        body
      );
      toast.success(mode === "DRAFT" ? "Draft saved" : "Week submitted");
      onSaved && onSaved(saved);
      onClose && onClose();
    } catch (e) {
      const err: any = e;
      console.error(err);
      if (err && err.status === 401) {
        navigate("/login");
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

      <div className="relative w-full max-w-5xl bg-card/50 backdrop-blur-xl rounded-[2.5rem] border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-8 py-8 border-b border-border bg-muted/50 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-iu-blue/10 rounded-2xl border border-iu-blue/20">
              <ClipboardList className="h-8 w-8 text-iu-blue" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-3xl font-black text-foreground tracking-tight">
                  {weekKey}
                </h2>
                {report?.status && (
                  <span
                    className={`inline-flex items-center rounded-xl px-3 py-1 text-[10px] border font-bold uppercase tracking-widest ${
                      report.status === "DRAFT"
                        ? "bg-iu-blue/10 text-iu-blue border-iu-blue/20"
                        : report.status === "SUBMITTED"
                          ? "bg-iu-blue/10 text-iu-blue dark:text-iu-blue border-iu-blue/20"
                          : report.status === "APPROVED"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : report.status === "KLAUSURPHASE" ||
                                report.status === "KLAUSUR"
                              ? "bg-muted text-muted-foreground border-border"
                              : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                    }`}
                  >
                    {report.status === "APPROVED" ? t.reviewed : report.status}
                  </span>
                )}
              </div>
              {weekDates?.length === 7 && (
                <div className="text-sm text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  {weekDates[0].toLocaleDateString()} –{" "}
                  {weekDates[6].toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                {t.totalHours}
              </div>
              <div className="text-2xl font-bold text-iu-blue">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </div>
            </div>
            <button
              className="p-3 hover:bg-muted/50 rounded-2xl text-muted-foreground hover:text-foreground transition-all duration-300"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
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
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-border text-muted-foreground bg-card/50 hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
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
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-border text-muted-foreground bg-card/50 hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
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
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20 hover:bg-iu-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
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
            <div className="bg-card/50 rounded-3xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 text-muted-foreground border-b border-border">
                      <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.day}
                      </th>
                      <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.from}
                      </th>
                      <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.till}
                      </th>
                      <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.hours}
                      </th>
                      <th className="text-center px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.holiday}
                      </th>
                      <th className="text-center px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.hold}
                      </th>
                      <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.rating}
                      </th>
                      <th className="text-left px-6 py-4 font-bold uppercase tracking-widest text-[10px]">
                        {t.notes}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dayKeys.map((k, idx) => (
                      <tr
                        key={k}
                        className={`transition-colors ${daysState[k]?.holiday ? "bg-muted/20 opacity-50" : "hover:bg-muted/30"}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-bold text-foreground">{k}</div>
                          <div className="text-[10px] text-muted-foreground font-bold">
                            {weekDates[idx]?.toLocaleDateString?.() || ""}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="time"
                            className="w-full rounded-xl border border-border bg-muted/50 text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue outline-none transition-all"
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
                        <td className="px-6 py-4">
                          <input
                            type="time"
                            className="w-full rounded-xl border border-border bg-muted/50 text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue outline-none transition-all"
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
                        <td className="px-6 py-4 text-iu-blue font-bold">
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
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded-lg border-border bg-muted/50 text-iu-blue focus:ring-iu-blue accent-iu-blue"
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
                        <td className="px-6 py-4 text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5 rounded-lg border-border bg-muted/50 text-iu-blue focus:ring-iu-blue accent-iu-blue"
                            checked={!!daysState[k]?.hold}
                            onChange={(e) =>
                              setDaysState((prev) => ({
                                ...prev,
                                [k]: { ...prev[k], hold: e.target.checked },
                              }))
                            }
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            className="w-full rounded-xl border border-border bg-muted/50 text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue outline-none transition-all"
                            value={daysState[k]?.mood || ""}
                            onChange={(e) =>
                              setDaysState((prev) => ({
                                ...prev,
                                [k]: { ...prev[k], mood: e.target.value },
                              }))
                            }
                          >
                            <option value="">–</option>
                            <option value="happy">😃 {t.happy}</option>
                            <option value="satisfied">🙂 {t.satisfied}</option>
                            <option value="sad">😞 {t.sad}</option>
                            <option value="angry">😡 {t.angry}</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            className="w-full rounded-xl border border-border bg-muted/50 text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue outline-none transition-all"
                            placeholder="Notes..."
                            value={daysState[k]?.notes || ""}
                            onChange={(e) =>
                              setDaysState((prev) => ({
                                ...prev,
                                [k]: { ...prev[k], notes: e.target.value },
                              }))
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-iu-blue/10 rounded-2xl">
                    <FileEdit className="h-6 w-6 text-iu-blue" />
                  </div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">
                    Weekly Summary
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${taskLen >= 10 ? "text-iu-blue dark:text-iu-blue" : "text-muted-foreground"}`}
                >
                  {taskLen} / 10 chars
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <textarea
                    className="w-full min-h-[200px] rounded-3xl border border-border bg-muted/50 text-foreground px-6 py-6 text-sm focus:outline-none focus:ring-2 focus:ring-iu-blue transition-all"
                    value={tasks}
                    onChange={(e) => setTasks(e.target.value)}
                    placeholder="Describe your practical work and achievements this week..."
                  />
                </div>
                <div className="space-y-6">
                  <div className="bg-muted/50 rounded-3xl border border-border p-6">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Grade (optional)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["1", "2", "3", "4", "5", "6"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setGrade(g === grade ? "" : g)}
                          className={`py-3 rounded-xl font-bold transition-all duration-300 border ${
                            grade === g
                              ? "bg-iu-blue text-white border-iu-blue"
                              : "bg-card/50 text-muted-foreground border-border hover:border-iu-blue/50"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-8 border-t border-border bg-muted/50 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-6">
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 text-sm font-bold rounded-2xl border border-border text-muted-foreground bg-card/50 hover:bg-muted/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest"
            >
              {t.cancel}
            </button>
            <button
              disabled={saving}
              onClick={() => handleSave("DRAFT")}
              className="px-8 py-4 text-sm font-bold rounded-2xl border border-iu-blue/30 text-iu-blue bg-iu-blue/5 hover:bg-iu-blue/10 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all duration-300 uppercase tracking-widest"
            >
              {saving && saveMode === "DRAFT" ? t.saving : t.saveDraft}
            </button>
            <button
              disabled={saving || taskLen < 10}
              onClick={() => handleSave("SUBMITTED")}
              className={`px-10 py-4 text-sm font-bold rounded-2xl text-white transition-all duration-300 uppercase tracking-widest ${
                saving || taskLen < 10
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-iu-blue hover:bg-iu-blue hover:scale-[1.02] active:scale-[0.98]"
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
