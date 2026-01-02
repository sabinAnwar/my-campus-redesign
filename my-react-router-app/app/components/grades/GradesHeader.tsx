import { GraduationCap, Printer, FileSpreadsheet } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface GradesHeaderProps {
  title: string;
  universityName: string;
  exportPDFLabel: string;
  exportCSVLabel: string;
  onExportPDF: () => void;
  onExportCSV: () => void;
}

export function GradesHeader({
  title,
  universityName,
  exportPDFLabel,
  exportCSVLabel,
  onExportPDF,
  onExportCSV,
}: GradesHeaderProps) {
  return (
    <PageHeader
      icon={GraduationCap}
      title={title}
      subtitle={universityName}
    >
      <div className="flex flex-wrap gap-2 sm:gap-3">
        <button
          onClick={onExportPDF}
          className="group flex items-center gap-1.5 sm:gap-2 bg-iu-blue hover:bg-iu-blue/90 text-white font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-iu-blue/20"
        >
          <Printer className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {exportPDFLabel}
        </button>
        <button
          onClick={onExportCSV}
          className="group flex items-center gap-1.5 sm:gap-2 bg-card hover:bg-muted text-foreground font-bold py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm transition-all duration-300 border border-border"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          {exportCSVLabel}
        </button>
      </div>
    </PageHeader>
  );
}

