import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";

const LEGEND_COLORS = {
  DUE: "bg-amber-200 dark:bg-amber-500/30 border-amber-400 dark:border-amber-500/40",
  DRAFT: "bg-sky-200 dark:bg-sky-500/30 border-sky-400 dark:border-sky-500/40",
  SUBMITTED:
    "bg-emerald-200 dark:bg-emerald-500/30 border-emerald-400 dark:border-emerald-500/40",
  APPROVED:
    "bg-violet-200 dark:bg-violet-500/30 border-violet-400 dark:border-violet-500/40",
  THEORIE:
    "bg-stone-200 dark:bg-stone-500/30 border-stone-400 dark:border-stone-500/40",
  KLAUSUR:
    "bg-rose-200 dark:bg-rose-500/30 border-rose-400 dark:border-rose-500/40",
  NACHPRUEFUNG:
    "bg-indigo-200 dark:bg-indigo-500/30 border-indigo-400 dark:border-indigo-500/40",
  FEIERTAG:
    "bg-orange-200 dark:bg-orange-500/30 border-orange-400 dark:border-orange-500/40",
};

export function Legend() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const reportItems = [
    { label: t.mustSubmitLegend, cls: LEGEND_COLORS.DUE },
    { label: t.draftLegend, cls: LEGEND_COLORS.DRAFT },
    { label: t.submittedLegend, cls: LEGEND_COLORS.SUBMITTED },
    { label: t.reviewedLegend, cls: LEGEND_COLORS.APPROVED },
    { label: t.editedLegend, ring: true },
  ];

  const phaseItems = [
    {
      label:
        (t as any).theorieLegend +
        (language === "de" ? " (kein Bericht)" : " (no report)"),
      cls: LEGEND_COLORS.THEORIE,
    },
    {
      label:
        t.klausurphaseLegend +
        (language === "de" ? " (kein Bericht)" : " (no report)"),
      cls: LEGEND_COLORS.KLAUSUR,
    },
    {
      label:
        (t as any).nachpruefungLegend +
        (language === "de" ? " (kein Bericht)" : " (no report)"),
      cls: LEGEND_COLORS.NACHPRUEFUNG,
    },
    { label: (t as any).feiertagLegend, cls: LEGEND_COLORS.FEIERTAG },
  ];

  const sectionLabel = language === "de" ? "Bericht-Status" : "Report Status";
  const phaseLabel = language === "de" ? "Studienplan" : "Study Plan";

  const renderItem = (it: any, i: number) => (
    <div key={i} className="flex items-center gap-3 py-1 group">
      <div
        className={`h-4 w-4 rounded-md shrink-0 border-2 shadow-sm transition-transform duration-200 group-hover:scale-125 ${
          it.cls || "bg-card border-border"
        } ${it.ring ? "ring-2 ring-offset-2 ring-offset-background ring-iu-blue" : ""}`}
      />
      <span className="text-[13px] text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
        {it.label}
      </span>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-2.5">
          {sectionLabel}
        </p>
        <div className="space-y-1">{reportItems.map(renderItem)}</div>
      </div>
      <div className="border-t border-border/60 pt-4">
        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] mb-2.5">
          {phaseLabel}
        </p>
        <div className="space-y-1">{phaseItems.map(renderItem)}</div>
      </div>
    </div>
  );
}
