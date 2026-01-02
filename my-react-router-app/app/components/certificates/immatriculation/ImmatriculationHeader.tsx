import { GraduationCap, Shield } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface ImmatriculationHeaderProps {
  t: any;
}

export function ImmatriculationHeader({ t }: ImmatriculationHeaderProps) {
  return (
    <PageHeader
      icon={GraduationCap}
      title={t.title}
      subtitle={t.subtitle}
    >
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-[10px] font-black uppercase tracking-widest w-fit">
        <Shield size={16} />
        <span>{t.officialDocument}</span>
      </div>
    </PageHeader>
  );
}

