import React from "react";
import { FileText, Info } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface ExamsHeaderProps {
  t: any;
}

export function ExamsHeader({ t }: ExamsHeaderProps) {
  return (
    <PageHeader
      icon={FileText}
      title={t.title}
      subtitle={t.subtitle}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-[10px] font-black uppercase tracking-widest w-fit">
        <Info size={12} />
        <span>{t.examCenterBadge || "EXAM CENTER"}</span>
      </div>
    </PageHeader>
  );
}

