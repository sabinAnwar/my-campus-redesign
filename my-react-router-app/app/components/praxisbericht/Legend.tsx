import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";

const STATUS_STYLES = {
  DUE: {
    bg: "bg-amber-500 dark:bg-amber-600",
    text: "text-amber-700 dark:text-white",
    border: "border-amber-600 dark:border-amber-500",
  },
  DRAFT: {
    bg: "bg-sky-500 dark:bg-sky-600",
    text: "text-sky-700 dark:text-white",
    border: "border-sky-600 dark:border-sky-500",
  },
  SUBMITTED: {
    bg: "bg-emerald-500 dark:bg-emerald-600",
    text: "text-emerald-700 dark:text-white",
    border: "border-emerald-600 dark:border-emerald-500",
  },
  APPROVED: {
    bg: "bg-violet-500 dark:bg-violet-600",
    text: "text-violet-700 dark:text-white",
    border: "border-violet-600 dark:border-violet-500",
  },
  KLAUSURPHASE: {
    bg: "bg-slate-400 dark:bg-slate-600",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-500 dark:border-slate-500",
  },
};

export function Legend() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const items = [
    { label: t.mustSubmitLegend, cls: STATUS_STYLES.DUE },
    { label: t.draftLegend, cls: STATUS_STYLES.DRAFT },
    { label: t.submittedLegend, cls: STATUS_STYLES.SUBMITTED },
    { label: t.reviewedLegend, cls: STATUS_STYLES.APPROVED },
    { label: t.klausurphaseLegend, cls: STATUS_STYLES.KLAUSURPHASE },
    { label: t.editedLegend, ring: true },
  ];
  
  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-4 group">
          <div
            className={`h-6 w-6 rounded-lg border transition-transform group-hover:scale-110 ${
              it.cls
                ? `${it.cls.bg} ${it.cls.border}`
                : "bg-card/50 border-border"
            } ${it.ring ? "ring-2 ring-offset-2 ring-offset-background ring-iu-blue" : ""}`}
          />
          <span className="text-muted-foreground font-bold text-sm group-hover:text-foreground transition-colors">
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}
