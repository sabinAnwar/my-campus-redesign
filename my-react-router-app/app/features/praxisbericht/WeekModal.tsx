import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { X, ClipboardList, Calendar, FileEdit } from "lucide-react";
import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";
import { normalizeReport, parseISOWeekStart, parseToMinutes } from "./helpers";
import type { PraxisReport, PraxisDayEntry } from "~/types/praxisbericht";

interface WeekModalProps {
  open: boolean;
  weekKey: string | null;
  report: PraxisReport | null; // Use PraxisReport type
  onClose?: () => void;
  onSaved?: (saved: PraxisReport) => void;
}

export function WeekModal({
  open,
  weekKey,
  report,
  onClose,
  onSaved,
}: WeekModalProps) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [tasks, setTasks] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMode, setSaveMode] = useState("SUBMITTED");
  const [daysState, setDaysState] = useState<Record<string, PraxisDayEntry>>({});
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
