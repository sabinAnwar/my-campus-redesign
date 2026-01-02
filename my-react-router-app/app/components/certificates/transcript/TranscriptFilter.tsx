import { Filter } from "lucide-react";

interface TranscriptFilterProps {
  t: any;
  showPassedOnly: boolean;
  onToggle: () => void;
}

export function TranscriptFilter({ t, showPassedOnly, onToggle }: TranscriptFilterProps) {
  return (
    <div className="flex items-center justify-between bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-8 shadow-2xl mb-8 sm:mb-12">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-muted rounded-2xl">
          <Filter className="h-6 w-6 text-muted-foreground" />
        </div>
        <span className="font-black text-foreground uppercase tracking-[0.2em] text-sm">
          {showPassedOnly ? t.passedOnly : t.allGrades}
        </span>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-iu-blue focus:ring-offset-2 ${
          showPassedOnly ? "bg-iu-blue" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            showPassedOnly ? "translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
