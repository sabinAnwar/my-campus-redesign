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
      case "new":
        return t.new;
      default:
        return t.pending;
    }
  };

  return (
    <div
      className="group bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-6 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col h-full"
    >
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                application.status === "approved"
                  ? "bg-iu-green"
                  : application.status === "rejected"
                    ? "bg-iu-red"
                    : application.status === "pending"
                      ? "bg-iu-orange"
                      : "bg-iu-blue"
              }`}
            />
            <span className="text-xs font-black text-foreground">
              {t.categories[application.categoryKey as keyof typeof t.categories]}
            </span>
          </div>
          <h2 className="text-xl font-black text-foreground leading-tight group-hover:translate-x-1 transition-transform">
            {t.itemTitles[application.id as keyof typeof t.itemTitles] || application.titleKey}
          </h2>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300 ${
            application.status === "approved"
              ? "border-iu-green/20 text-iu-green bg-iu-green/10"
              : application.status === "rejected"
                ? "border-iu-red/20 text-iu-red bg-iu-red/10 animate-pulse"
                : application.status === "pending"
                  ? "border-iu-orange/20 text-iu-orange bg-iu-orange/10"
                  : "border-iu-blue/20 text-iu-blue bg-iu-blue/10"
          }`}
        >
          {getStatusText(application.status)}
        </div>
      </div>

      {application.status === "rejected" && (
        <div className="mb-6 p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium leading-relaxed">
            <span className="font-bold underline">Ablehnungsgrund:</span> Die hochgeladenen Dokumente sind unvollständig oder unleserlich. Bitte erneut prüfen.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
        <div className="flex items-center gap-2 text-xs text-foreground font-black">
          <Clock size={14} className="text-iu-blue" />
          <span>
            {new Date(application.updatedAt).toLocaleDateString(
              language === "de" ? "de-DE" : "en-US"
            )}
          </span>
        </div>
        <button
          onClick={() => onOpen(application)}
          className="flex items-center gap-2 text-sm font-black text-foreground hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
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
