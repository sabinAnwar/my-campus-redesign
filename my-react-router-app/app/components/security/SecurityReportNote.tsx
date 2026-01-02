import { FileWarning } from "lucide-react";

interface SecurityReportNoteProps {
  t: any;
}

export function SecurityReportNote({ t }: SecurityReportNoteProps) {
  return (
    <div className="bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

      <div className="p-4 bg-iu-blue/10 rounded-2xl text-iu-blue shrink-0 group-hover:scale-110 transition-transform duration-500 shadow-sm">
        <FileWarning className="w-8 h-8" />
      </div>
      <div className="text-center md:text-left relative z-10">
        <h4 className="text-xl font-black text-foreground mb-2 tracking-tight">
          {t.reportIncident}
        </h4>
        <p className="text-muted-foreground font-medium text-base leading-relaxed">
          {t.reportIncidentDesc}{" "}
          <a
            href="mailto:datenschutz@iu.org"
            className="text-iu-blue hover:text-iu-blue/80 transition-colors font-bold hover:underline"
          >
            datenschutz@iu.org
          </a>
          .
        </p>
      </div>
    </div>
  );
}
