import React from "react";
import { FileText, Info } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface ExamsHeaderProps {
  t: any;
  language: string;
}

export function ExamsHeader({ t, language }: ExamsHeaderProps) {
  return (
    <PageHeader
      icon={FileText}
      title={t.title}
      subtitle={<span className="text-foreground dark:text-white">{t.subtitle}</span>}
      backTo="/info-center"
      backLabel={language === "de" ? "Zurück zu Info Center" : "Back to Info Center"}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-iu-blue/30 bg-iu-blue text-white text-[10px] font-black uppercase tracking-widest w-fit">
        <Info size={12} />
        <span>{t.examCenterBadge || "EXAM CENTER"}</span>
      </div>
    </PageHeader>
  );
}
