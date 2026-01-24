import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiGet } from "~/services/api";
import { toast } from "react-toastify";
import {
  CheckCircle,
  AlertCircle,
  CalendarClock,
  GraduationCap,
  FileEdit,
  BadgeCheck,
  Smile,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";
import {
  PraxisberichtHeader,
  ReminderBanner,
  StatsGrid,
  ViewToggle,
  Legend,
} from "~/features/praxisbericht";

import { normalizeReport, getISOWeekKey, getMonthWeekKeys, getSemesterWeekKeys } from "~/features/praxisbericht/helpers";
import { CalendarView } from "~/features/praxisbericht/CalendarView";
import { ListView } from "~/features/praxisbericht/ListView";
import { WeekModal } from "~/features/praxisbericht/WeekModal";
import type { PraxisReport, StatusFilter } from "~/types/praxisbericht";

export default function Praxisbericht2() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [reports, setReports] = useState<PraxisReport[]>([]);
  const [activeWeekKey, setActiveWeekKey] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<PraxisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [reportsVersion, setReportsVersion] = useState(0);
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | DUE | DRAFT | SUBMITTED | APPROVED | KLAUSURPHASE
  const navigate = useNavigate();
  // Reminder preferences display
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(18);
  // calendar period control
  const [mode, setMode] = useState<"month" | "semester">("month");
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
      setReports((data.reports || []).map(normalizeReport).filter((r: any): r is PraxisReport => !!r));
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
    () => reports.map(normalizeReport).filter((r): r is PraxisReport => !!r),
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
        onSaved={(saved) => {
          if (!saved) return;
          const normalized = normalizeReport(saved);
          if (normalized) {
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
          }
        }}
      />
    </div>
  );
}
