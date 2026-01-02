import { Clock, ArrowRight } from "lucide-react";
import type { ApplicationItem } from "~/types/antragsverwaltung";

interface ApplicationCardProps {
  t: any;
  application: ApplicationItem;
  language: string;
  onOpen: (app: ApplicationItem) => void;
}

export function ApplicationCard({ t, application, language, onOpen }: ApplicationCardProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return t.approved;
      case "rejected":
        return t.rejected;
      default:
        return t.pending;
    }
  };

  return (
    <div
      className="group bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 hover:border-iu-blue/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                application.status === "approved"
                  ? "bg-iu-blue"
                  : application.status === "rejected"
                    ? "bg-rose-500"
                    : "bg-amber-500"
              }`}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {t.categories[application.categoryKey as keyof typeof t.categories]}
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground leading-tight group-hover:text-iu-blue transition-colors">
            {t.itemTitles[application.id as keyof typeof t.itemTitles] || application.titleKey}
          </h2>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            application.status === "approved"
              ? "border-iu-blue/20 text-iu-blue bg-iu-blue/10"
              : application.status === "rejected"
                ? "border-rose-500/20 text-rose-500 bg-rose-500/10"
                : "border-amber-500/20 text-amber-500 bg-amber-500/10"
          }`}
        >
          {getStatusText(application.status)}
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock size={14} />
          <span>
            {new Date(application.updatedAt).toLocaleDateString(
              language === "de" ? "de-DE" : "en-US"
            )}
          </span>
        </div>
        <button
          onClick={() => onOpen(application)}
          className="flex items-center gap-2 text-sm font-bold text-iu-blue hover:text-iu-blue transition-colors"
        >
          <span>{t.startApplication}</span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    </div>
  );
}
