import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";

const STATUS_STYLES = {
  DUE: {
    bg: "bg-amber-900",
    text: "text-white",
    border: "border-amber-900",
  },
  DRAFT: {
    bg: "bg-sky-900",
    text: "text-white",
    border: "border-sky-900",
  },
  SUBMITTED: {
    bg: "bg-emerald-900",
    text: "text-white",
    border: "border-emerald-900",
  },
  APPROVED: {
    bg: "bg-violet-900",
    text: "text-white",
    border: "border-violet-900",
  },
  KLAUSURPHASE: {
    bg: "bg-slate-900",
    text: "text-white",
    border: "border-slate-900",
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
          <span className="text-foreground font-bold text-sm">
            {it.label}
          </span>
        </div>
      ))}
    </div>
  );
}
