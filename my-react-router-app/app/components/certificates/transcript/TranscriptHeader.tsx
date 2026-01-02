import { Award, FileText } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface TranscriptHeaderProps {
  t: any;
}

export function TranscriptHeader({ t }: TranscriptHeaderProps) {
  return (
    <PageHeader
      icon={Award}
      title={t.title}
      subtitle={t.subtitle}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
        <FileText size={16} />
        <span>{t.officialDocument}</span>
      </div>
    </PageHeader>
  );
}

