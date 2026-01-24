import React from "react";

interface DownloadsSectionProps {
  t: any;
  pdfUrl: string;
  advisorEmail: string;
  advisor: string;
}

export function DownloadsSection({
  t,
  pdfUrl,
  advisorEmail,
  advisor,
}: DownloadsSectionProps) {
  return (
    <div className="rounded-2xl bg-card border border-border p-8 shadow-md relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-iu-blue via-iu-pink to-iu-orange" />
      <p className="text-[10px] font-black uppercase tracking-widest text-iu-pink mb-2">
        {t.downloadsTitle}
      </p>
      <h3 className="text-2xl font-black text-foreground leading-tight">
        {t.downloadsSubtitle}
      </h3>
      <ul className="mt-6 space-y-3 text-sm text-muted-foreground font-bold">
        {t.downloadsItems.map((item: string) => (
          <li key={item} className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-iu-blue rounded-full" />
            {item.replace("- ", "")}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3">
        <a
          href={pdfUrl}
          download
          className="w-full px-6 py-3 rounded-xl bg-iu-blue text-white font-black uppercase tracking-widest shadow-lg hover:bg-iu-blue/90 transition-all text-center hover:-translate-y-0.5"
        >
          {t.downloadPdf}
        </a>
        <a
          href={`mailto:${advisorEmail}?subject=${encodeURIComponent("Beratungstermin Modulhandbuch")}`}
          className="w-full px-6 py-3 rounded-xl border-2 border-border text-foreground font-black uppercase tracking-widest hover:bg-muted transition-all text-center hover:-translate-y-0.5"
        >
          {t.askAdvisor(advisor)}
        </a>
      </div>
      <p className="mt-6 text-[10px] font-bold text-slate-700 uppercase tracking-wider leading-relaxed">
        {t.helpText}
      </p>
    </div>
  );
}
