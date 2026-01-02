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
    >
      <div className="flex items-center gap-2 text-sm font-bold text-muted-foreground bg-card/50 backdrop-blur-xl px-4 py-2 rounded-full border border-border transition-all hover:border-iu-blue/30 shadow-sm">
        <Calendar size={16} />
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

