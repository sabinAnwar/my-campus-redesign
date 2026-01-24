import { useMemo } from "react";
import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";
import { STATUS_STYLES, buildMonth, getISOWeekKey } from "./helpers";

import type { PraxisReport } from "~/types/praxisbericht";

export function CalendarView({
  reports,
  onDayClick,
  year,
  month,
  filter = "ALL",
}: {
  reports: (PraxisReport | null | undefined)[];
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
