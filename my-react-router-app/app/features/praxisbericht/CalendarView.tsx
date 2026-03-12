import { useMemo } from "react";
import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";
import { STATUS_STYLES, buildMonth, getISOWeekKey } from "./helpers";

import type { PraxisReport } from "~/types/praxisbericht";
import type { StudyPlan } from "~/utils/studyPlans";
import { getBlockStatusForDate } from "~/utils/studyPlans";

export function CalendarView({
  reports,
  onDayClick,
  year,
  month,
  filter = "ALL",
  studyPlan,
}: {
  reports: (PraxisReport | null | undefined)[];
  onDayClick?: (weekKey: string) => void;
  year: number;
  month: number;
  filter?: string;
  studyPlan?: StudyPlan | null;
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
    if (status === "KLAUSUR") status = "KLAUSURPHASE";

    // Per-day phase from study plan (syncs with schedule view)
    if (status === "DUE" && studyPlan) {
      const dayPhase = getBlockStatusForDate(studyPlan, date);
      if (dayPhase === "klausurphase") status = "KLAUSUR";
      else if (dayPhase === "nachpruefung") status = "NACHPRUEFUNG";
      else if (dayPhase === "theoriephase" || dayPhase === "vorlesung")
        status = "THEORIE";
      else if (dayPhase === "feiertag") status = "FEIERTAG";
      else if (dayPhase && dayPhase !== "praxis" && dayPhase !== "wochenende")
        status = "THEORIE";
    }

    const clsObj = STATUS_STYLES[status as keyof typeof STATUS_STYLES] || {
      bg: "bg-card/50",
      text: "text-foreground",
      border: "border-border",
    };
    const dimByFilter = filter !== "ALL" && status !== filter;
    const base = `${clsObj.bg} ${clsObj.text} ${clsObj.border} ${inMonth ? "" : "opacity-25"} ${dimByFilter ? "opacity-15" : ""}`;
    const isEdited = editedByWeek.get(weekKey);
    const mins = minutesByWeek.get(weekKey);
    const hoursLabel = mins
      ? `${Math.floor(mins / 60)}h${mins % 60 > 0 ? ` ${mins % 60}m` : ""}`
      : null;
    const isMonday = date.getDay() === 1;
    const weekNumber = Number(weekKey.split("-W")[1]);
    const isToday =
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();

    const hasReport = statusByWeek.has(weekKey);

    const isNonPraxis =
      !hasReport &&
      (status === "THEORIE" ||
        status === "KLAUSUR" ||
        status === "NACHPRUEFUNG" ||
        status === "FEIERTAG");

    return (
      <button
        type="button"
        onClick={() => !isNonPraxis && onDayClick && onDayClick(weekKey)}
        disabled={isNonPraxis}
        className={`relative h-14 sm:h-[4.5rem] rounded-xl border text-xs flex flex-col justify-between p-1.5 sm:p-2 text-left transition-all duration-300 ${isNonPraxis ? "cursor-default opacity-70" : "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 hover:z-10 cursor-pointer"} ${base} ${isEdited ? "ring-2 ring-offset-1 ring-offset-background ring-iu-blue" : ""} ${isToday ? "ring-2 ring-offset-1 ring-offset-background ring-iu-blue dark:ring-iu-blue" : ""}`}
        title={`${weekKey} • ${status}${isNonPraxis ? " • kein Bericht nötig" : ""}${hoursLabel ? " • " + hoursLabel : ""}${isEdited ? " • edited" : ""}`}
      >
        <div className="flex items-start justify-between w-full">
          <span
            className={`text-xs sm:text-sm font-bold leading-none ${isToday ? "bg-iu-blue text-white rounded-md px-1.5 py-0.5" : ""}`}
          >
            {date.getDate()}
          </span>
          {isMonday && (
            <span className="text-[7px] sm:text-[8px] px-1 py-px rounded bg-foreground/10 dark:bg-white/15 font-semibold tracking-wide">
              W{weekNumber}
            </span>
          )}
        </div>
        {hoursLabel && (
          <span className="text-[7px] sm:text-[8px] px-1 py-px rounded bg-foreground/10 dark:bg-white/15 font-medium self-end">
            {hoursLabel}
          </span>
        )}
      </button>
    );
  };

  const dow = [t.mon, t.tue, t.wed, t.thu, t.fri, t.sat, t.sun];

  return (
    <div className="bg-card/40 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] border border-border shadow-xl p-4 sm:p-6 lg:p-8 transition-all duration-500">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
          {headerDate.toLocaleString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
          {t.colorsReflect}
        </span>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5">
        {dow.map((d) => (
          <div
            key={d}
            className="text-center text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest py-1.5"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {weeks.flat().map((date, idx) => (
          <DayCell key={idx} date={date} />
        ))}
      </div>
    </div>
  );
}
