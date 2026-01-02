import { Download, CheckCircle } from "lucide-react";

interface TranscriptDownloadSectionProps {
  t: any;
  onDownloadPassed: () => void;
  onDownloadComplete: () => void;
}

export function TranscriptDownloadSection({ 
  t, 
  onDownloadPassed, 
  onDownloadComplete 
}: TranscriptDownloadSectionProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6 pb-12">
      <button
        onClick={onDownloadPassed}
        className="group relative flex items-center justify-center gap-4 bg-iu-blue text-white font-black py-6 px-8 rounded-[2rem] transition-all duration-300 shadow-xl hover:shadow-iu-blue/20 hover:-translate-y-1 text-xl uppercase tracking-widest overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <CheckCircle className="h-7 w-7 relative z-10" />
        <span className="relative z-10">{t.downloadPassedPdf}</span>
      </button>
      <button
        onClick={onDownloadComplete}
        className="group relative flex items-center justify-center gap-4 bg-card/60 backdrop-blur-xl border-2 border-iu-blue/30 text-iu-blue font-black py-6 px-8 rounded-[2rem] transition-all duration-300 shadow-xl hover:shadow-iu-blue/10 hover:-translate-y-1 text-xl uppercase tracking-widest overflow-hidden"
      >
        <div className="absolute inset-0 bg-iu-blue/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Download className="h-7 w-7 relative z-10" />
        <span className="relative z-10">{t.downloadCompletePdf}</span>
      </button>
    </div>
  );
}
