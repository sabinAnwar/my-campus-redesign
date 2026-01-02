import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/praxisbericht";

const STATUS_STYLES = {
  DUE: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/20",
  },
  DRAFT: {
    bg: "bg-iu-blue/10",
    text: "text-iu-blue",
    border: "border-iu-blue/20",
  },
  SUBMITTED: {
    bg: "bg-iu-blue/20",
    text: "text-iu-blue dark:text-iu-blue",
    border: "border-iu-blue/30",
  },
  APPROVED: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    border: "border-purple-500/20",
  },
  KLAUSURPHASE: {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    border: "border-border",
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
