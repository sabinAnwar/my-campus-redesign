import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";
import { Calendar, Clock, ClipboardList } from "lucide-react";
import { parseISOWeekStart, parseToMinutes } from "./helpers";
import type { PraxisReport } from "~/types/praxisbericht";

export function ListView({
  reports,
  filter = "ALL",
  onOpen,
}: {
  reports: (PraxisReport | null | undefined)[];
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
