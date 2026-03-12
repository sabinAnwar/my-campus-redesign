import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  X,
  ClipboardList,
  Calendar,
  FileEdit,
  Trash2,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";
import {
  normalizeReport,
  parseISOWeekStart,
  parseToMinutes,
  getWeekPhase,
} from "./helpers";
import type { PraxisReport, PraxisDayEntry } from "~/types/praxisbericht";
import type { StudyPlan } from "~/utils/studyPlans";

interface WeekModalProps {
  open: boolean;
  weekKey: string | null;
  report: PraxisReport | null;
  studyPlan?: StudyPlan | null;
  onClose?: () => void;
  onSaved?: (saved: PraxisReport) => void;
  onDeleted?: (weekKey: string) => void;
}

export function WeekModal({
  open,
  weekKey,
  report,
  studyPlan,
  onClose,
  onSaved,
  onDeleted,
}: WeekModalProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [tasks, setTasks] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMode, setSaveMode] = useState("SUBMITTED");
  const [daysState, setDaysState] = useState<Record<string, PraxisDayEntry>>(
    {},
  );
  const navigate = useNavigate();
  const dayKeys = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const taskLen = (tasks || "").trim().length;
  const weekStart = useMemo(
    () => (weekKey ? parseISOWeekStart(weekKey) : null),
    [weekKey],
  );
  const weekDates = useMemo(() => {
    if (!weekStart) return [];
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

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
      const init: Record<string, PraxisDayEntry> = {};
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

  // Determine week phase from study plan
  const weekPhase = useMemo(
    () => (weekKey ? getWeekPhase(weekKey, studyPlan) : null),
    [weekKey, studyPlan],
  );
  const isPraxisWeek = weekPhase === "praxis" || !weekPhase;
  const isBlocked = !isPraxisWeek;

  const phaseLabel =
    weekPhase === "theoriephase" || weekPhase === "vorlesung"
      ? "Theoriephase"
      : weekPhase === "klausurphase"
        ? "Klausurphase"
        : weekPhase === "nachpruefung"
          ? "Nachprüfungsphase"
          : weekPhase === "feiertag"
            ? "Feiertag"
            : "";

  if (!open) return null;

  const handleDelete = async () => {
    if (!weekKey) return;
    const confirmed = window.confirm(
      language === "de"
        ? `Praxisbericht für ${weekKey} wirklich löschen?`
        : `Delete report for ${weekKey}?`,
    );
    if (!confirmed) return;
    try {
      setSaving(true);
      const res = await fetch(`/api/praxisberichte/${weekKey}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `HTTP ${res.status}`);
      }
      toast.success(language === "de" ? "Bericht gelöscht" : "Report deleted");
      onDeleted && onDeleted(weekKey);
      onClose && onClose();
    } catch (e: any) {
      toast.error(e?.message || "Delete failed");
    } finally {
      setSaving(false);
    }
  };

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
        headers: Record<string, string> = {},
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
        body,
      );
      const normalized = normalizeReport({
        ...saved,
        status: mode,
        isoWeekKey: weekKey,
      });
      if (normalized) {
        toast.success(mode === "DRAFT" ? "Draft saved" : "Week submitted");
        onSaved && onSaved(normalized);
        onClose && onClose();
      }
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
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl bg-card rounded-2xl sm:rounded-[2rem] border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-b border-border bg-muted/30 dark:bg-white/[0.03] flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-iu-blue/10 dark:bg-iu-blue rounded-xl border border-iu-blue/20 dark:border-iu-blue">
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue dark:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-0.5">
                <h2 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                  {weekKey}
                </h2>
                {report?.status && (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] border font-bold uppercase tracking-wider ${
                      report.status === "DRAFT"
                        ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
                        : report.status === "SUBMITTED"
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                          : report.status === "APPROVED"
                            ? "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20"
                            : report.status === "KLAUSURPHASE" ||
                                report.status === "KLAUSUR"
                              ? "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                    }`}
                  >
                    {report.status === "APPROVED" ? t.reviewed : report.status}
                  </span>
                )}
              </div>
              {weekDates?.length === 7 && (
                <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  {weekDates[0].toLocaleDateString()} –{" "}
                  {weekDates[6].toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex flex-col items-end">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-0.5">
                {t.totalHours}
              </div>
              <div className="text-lg sm:text-xl font-bold text-foreground">
                {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
              </div>
            </div>
            <button
              className="p-2.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={onClose}
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 sm:py-8 custom-scrollbar bg-transparent">
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-lg font-black text-foreground tracking-tight">
                {t.weeklyHours}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
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
                  className="px-3.5 py-2 text-xs font-bold rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
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
                  className="px-3.5 py-2 text-xs font-bold rounded-xl bg-iu-blue text-white hover:bg-iu-blue/90 shadow-sm transition-all duration-200"
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
            <div className="bg-card rounded-xl sm:rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 dark:bg-white/[0.04]">
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">
                        {t.day}
                      </th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">
                        {t.from}
                      </th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">
                        {t.till}
                      </th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">
                        {t.hours}
                      </th>
                      <th className="text-center px-3 sm:px-4 lg:px-6 py-3 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">
                        {t.holiday}
                      </th>
                      <th className="text-center px-3 sm:px-4 lg:px-6 py-3 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">
                        {t.hold}
                      </th>
                      <th className="text-left px-3 sm:px-4 lg:px-6 py-3 font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">
                        {t.rating}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {dayKeys.map((k, idx) => (
                      <tr
                        key={k}
                        className={`transition-colors ${daysState[k]?.holiday ? "bg-muted/30 dark:bg-white/[0.02] opacity-50" : "hover:bg-muted/20 dark:hover:bg-white/[0.03]"}`}
                      >
                        <td className="px-3 sm:px-4 lg:px-6 py-3 whitespace-nowrap">
                          <div className="font-bold text-foreground text-sm">
                            {k}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {weekDates[idx]?.toLocaleDateString?.() || ""}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-3">
                          <input
                            type="time"
                            className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue/40 focus:border-iu-blue outline-none transition-all [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:dark:invert"
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
                        <td className="px-3 sm:px-4 lg:px-6 py-3">
                          <input
                            type="time"
                            className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue/40 focus:border-iu-blue outline-none transition-all [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:dark:invert"
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
                        <td className="px-3 sm:px-4 lg:px-6 py-3 text-foreground font-bold text-sm">
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
                        <td className="px-3 sm:px-4 lg:px-6 py-3 text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border bg-background text-iu-blue focus:ring-iu-blue/40 accent-iu-blue"
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
                        <td className="px-3 sm:px-4 lg:px-6 py-3 text-center">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-border bg-background text-iu-blue focus:ring-iu-blue/40 accent-iu-blue"
                            checked={!!daysState[k]?.hold}
                            onChange={(e) =>
                              setDaysState((prev) => ({
                                ...prev,
                                [k]: { ...prev[k], hold: e.target.checked },
                              }))
                            }
                          />
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-3">
                          <select
                            className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:ring-2 focus:ring-iu-blue/40 focus:border-iu-blue outline-none transition-all"
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
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-iu-blue/10 dark:bg-iu-blue/20 rounded-xl">
                    <FileEdit className="h-5 w-5 text-iu-blue" />
                  </div>
                  <h3 className="text-lg font-black text-foreground tracking-tight">
                    Weekly Summary
                  </h3>
                </div>
                <span
                  className={`text-xs font-bold tabular-nums ${taskLen >= 10 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                >
                  {taskLen} / 10
                </span>
              </div>

              <textarea
                className="w-full min-h-[160px] rounded-xl border border-border bg-background text-foreground px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-iu-blue/40 focus:border-iu-blue transition-all placeholder:text-muted-foreground/60 resize-y"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="Describe your practical work and achievements this week..."
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 sm:px-7 py-4 sm:py-5 border-t border-border bg-muted/30 dark:bg-white/[0.03] flex flex-col gap-3">
          {isBlocked && (
            <div className="flex items-center gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 dark:bg-rose-500/15 px-4 py-2.5">
              <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0" />
              <span className="text-sm font-medium text-rose-700 dark:text-rose-300">
                {language === "de"
                  ? `${phaseLabel} – kein Praxisbericht nötig. Einreichen ist nicht möglich.`
                  : `${phaseLabel} – no practice report needed. Submission is blocked.`}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            {/* Left: Delete button */}
            <div>
              {report && report.status !== "APPROVED" && (
                <button
                  disabled={saving}
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-bold rounded-xl border border-rose-500/25 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 disabled:opacity-50 transition-all duration-200 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {language === "de" ? "Löschen" : "Delete"}
                </button>
              )}
            </div>
            {/* Right: Cancel / Draft / Submit */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2 text-sm font-bold rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
              >
                {t.cancel}
              </button>
              {!isBlocked && (
                <>
                  <button
                    disabled={saving}
                    onClick={() => handleSave("DRAFT")}
                    className="px-5 py-2 text-sm font-bold rounded-xl border border-sky-500/25 text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 disabled:opacity-50 transition-all duration-200"
                  >
                    {saving && saveMode === "DRAFT" ? t.saving : t.saveDraft}
                  </button>
                  <button
                    disabled={saving || taskLen < 10}
                    onClick={() => handleSave("SUBMITTED")}
                    className={`px-6 py-2 text-sm font-bold rounded-xl text-white shadow-lg transition-all duration-200 ${
                      saving || taskLen < 10
                        ? "bg-slate-400 dark:bg-slate-600 cursor-not-allowed shadow-none"
                        : "bg-emerald-500 hover:bg-emerald-600 hover:shadow-emerald-500/25"
                    }`}
                  >
                    {saving && saveMode !== "DRAFT" ? t.saving : t.submit}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
