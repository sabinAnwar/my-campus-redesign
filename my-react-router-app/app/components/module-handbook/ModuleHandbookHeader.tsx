import React from "react";
import { Download, User, BookOpen } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface ModuleHandbookHeaderProps {
  t: any;
  studiengangName: string | null;
  userProfile: {
    program: string;
    focus: string;
    campus: string;
    pdfUrl: string;
    advisorEmail: string;
  };
}

export function ModuleHandbookHeader({
  t,
  studiengangName,
  userProfile,
}: ModuleHandbookHeaderProps) {
  return (
    <PageHeader
      icon={BookOpen}
      title={t.title}
      subtitle={t.subtitle}
      backTo="/dashboard"
      backLabel="Dashboard"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 w-full lg:w-auto">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
            <span>{studiengangName || userProfile.program}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/20 bg-pink-500/10 text-pink-500 text-sm font-bold w-fit">
            <span>{userProfile.focus}</span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-sm font-bold w-fit">
            <span>{userProfile.campus}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <a
            href={userProfile.pdfUrl}
            className="px-6 py-3 rounded-xl bg-iu-blue text-white font-bold transition-all hover:bg-iu-blue/90 shadow-lg shadow-iu-blue/20 flex items-center gap-2"
            download
          >
            <Download size={18} />
            {t.btnPdf}
          </a>
          <a
            href={`mailto:${userProfile.advisorEmail}?subject=${encodeURIComponent("Beratungstermin Modulhandbuch")}`}
            className="px-6 py-3 rounded-xl bg-card border border-border text-foreground font-bold hover:bg-muted transition-all flex items-center gap-2"
          >
            <User size={18} />
            {t.btnAdvisor}
          </a>
        </div>
      </div>
    </PageHeader>
  );
}

