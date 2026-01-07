import { Filter } from "lucide-react";

interface TranscriptFilterProps {
  t: any;
  showPassedOnly: boolean;
  onToggle: () => void;
}

export function TranscriptFilter({ t, showPassedOnly, onToggle }: TranscriptFilterProps) {
  return (
    <div className="flex items-center justify-between bg-card/60 backdrop-blur-xl sm:rounded-[2.5rem] rounded-2xl border border-border p-5 sm:p-8 shadow-2xl mb-8 sm:mb-12">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="p-2 sm:p-3 bg-iu-blue/10 dark:bg-iu-blue rounded-xl sm:rounded-2xl">
          <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue dark:text-white" />
        </div>
        <span className="font-black text-foreground uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[10px] sm:text-sm">
          {showPassedOnly ? t.passedOnly : t.allGrades}
        </span>
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 sm:h-8 w-12 sm:w-14 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-iu-blue focus:ring-offset-2 shrink-0 ${
          showPassedOnly ? "bg-iu-blue" : "bg-muted"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            showPassedOnly ? "translate-x-6 sm:translate-x-7" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
