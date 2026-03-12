import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";
import { Calendar, Clock, ClipboardList } from "lucide-react";
import { parseISOWeekStart, parseToMinutes, getWeekPhase } from "./helpers";
import type { PraxisReport } from "~/types/praxisbericht";
import type { StudyPlan } from "~/utils/studyPlans";

export function ListView({
  reports,
  filter = "ALL",
  onOpen,
  studyPlan,
}: {
  reports: (PraxisReport | null | undefined)[];
  filter?: string;
  onOpen?: (weekKey: string) => void;
  studyPlan?: StudyPlan | null;
}) {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const truncate = (s: string, n = 140) => {
    if (!s) return "";
    const trimmed = s.trim();
    return trimmed.length > n ? trimmed.slice(0, n - 1) + "…" : trimmed;
  };
  const statusPill = (s: string) => {
    if (!s)
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
    if (s === "KLAUSUR") s = "KLAUSURPHASE";
    return s === "DRAFT"
      ? "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20"
      : s === "SUBMITTED"
        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
        : s === "APPROVED"
          ? "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20"
          : s === "KLAUSURPHASE"
            ? "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20"
            : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20";
  };
  const weekMinutes = (rep: any) => {
    let sum = 0;
    const days: Record<string, any> = rep?.days || {};
    for (const k of ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]) {
      const d = days[k];
      if (!d || d.holiday) continue;
      const a = parseToMinutes(d.from),
        b = parseToMinutes(d.till);
      if (a != null && b != null && b > a) sum += b - a;
    }
    return sum;
  };

  const normalized = reports
    .filter((r) => r !== null)
    .map((r: any) => {
      const phase = getWeekPhase(r.isoWeekKey, studyPlan);
      const isPraxisWeek = phase === "praxis";
      return {
        ...r,
        normStatus: r.status === "KLAUSUR" ? "KLAUSURPHASE" : r.status || "DUE",
        phase,
        isPraxisWeek,
      };
    });

  const filtered = normalized.filter(
    (r: any) => filter === "ALL" || r.normStatus === filter,
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
      <div className="bg-card/40 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] border border-border p-8 sm:p-12 lg:p-16 text-center shadow-xl">
        <div className="p-4 sm:p-5 bg-iu-blue/10 dark:bg-iu-blue/20 rounded-2xl w-fit mx-auto mb-4 sm:mb-5">
          <ClipboardList className="h-8 w-8 sm:h-10 sm:w-10 text-iu-blue dark:text-iu-blue" />
        </div>
        <p className="text-base sm:text-lg text-muted-foreground font-medium">
          {t.noReports}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card/40 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] border border-border shadow-xl overflow-hidden divide-y divide-border/60">
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
            className="p-4 sm:p-5 lg:p-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between hover:bg-muted/20 dark:hover:bg-white/[0.03] transition-colors duration-200 group cursor-pointer"
            onClick={() => {
              if (typeof r.isoWeekKey === "string" && onOpen)
                onOpen(r.isoWeekKey);
            }}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="text-base sm:text-lg font-black text-foreground tracking-tight group-hover:text-iu-blue transition-colors">
                  {r.isoWeekKey}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] border font-bold uppercase tracking-wider ${statusPill(String(r.normStatus || ""))}`}
                >
                  {r.normStatus === "APPROVED" ? t.reviewed : r.normStatus}
                </span>
                {r.phase && (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] border font-bold uppercase tracking-wider ${
                      r.isPraxisWeek
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                        : r.phase === "klausurphase"
                          ? "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20"
                          : r.phase === "nachpruefung"
                            ? "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20"
                            : r.phase === "feiertag"
                              ? "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20"
                              : "bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/20"
                    }`}
                  >
                    {r.isPraxisWeek
                      ? "Praxis"
                      : r.phase === "klausurphase"
                        ? "Klausur"
                        : r.phase === "nachpruefung"
                          ? "Nachprüfung"
                          : r.phase === "feiertag"
                            ? "Feiertag"
                            : "Theorie"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 text-[11px] sm:text-xs text-muted-foreground mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 opacity-60" />
                  {dates}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-foreground/60">
                  <Clock className="h-3 w-3 opacity-60" />
                  {hours}
                </span>
              </div>
              {r.tasks && (
                <div className="text-sm text-muted-foreground/80 leading-relaxed max-w-3xl line-clamp-1">
                  {truncate(r.tasks, 160)}
                </div>
              )}
            </div>
            <div className="flex items-center shrink-0">
              <button
                className="px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border border-border text-foreground hover:bg-muted/50 dark:hover:bg-white/5 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
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
