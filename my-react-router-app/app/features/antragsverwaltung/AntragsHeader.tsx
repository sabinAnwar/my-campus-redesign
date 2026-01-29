import { FileText, Calendar } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface AntragsHeaderProps {
  t: any;
  language: string;
}

export function AntragsHeader({ t, language }: AntragsHeaderProps) {
  return (
    <PageHeader
      icon={FileText}
      title={t.title}
      subtitle={t.subtitle}
      backTo="/study-organization"
      backLabel={language === "de" ? "Zurück zu Studienorganisation" : "Back to Study Organization"}
    >
      <div className="flex items-center gap-2 text-sm font-black text-foreground bg-card/60 backdrop-blur-xl px-4 py-2 rounded-full border border-border transition-all hover:border-slate-400 dark:hover:border-slate-500 shadow-sm">
        <Calendar size={16} className="text-iu-blue" />
        <span>
          {new Date().toLocaleDateString(
            language === "de" ? "de-DE" : "en-US",
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          )}
        </span>
      </div>
    </PageHeader>
  );
}

