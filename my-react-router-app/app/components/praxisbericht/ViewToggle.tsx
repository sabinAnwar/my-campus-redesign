import { CalendarRange, ListChecks } from "lucide-react";

interface ViewToggleProps {
  view: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
  onGoToCurrentWeek: () => void;
  onNewDraft: () => void;
  labels: {
    calendar: string;
    list: string;
    goToCurrentWeek: string;
    newDraft: string;
  };
}

export function ViewToggle({
  view,
  onViewChange,
  onGoToCurrentWeek,
  onNewDraft,
  labels,
}: ViewToggleProps) {
  return (
    <div className="flex flex-col gap-6 mb-10 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 bg-card/50 backdrop-blur-xl rounded-2xl border border-border p-1.5">
        <button
          onClick={() => onViewChange("calendar")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
            view === "calendar"
              ? "bg-iu-blue text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <CalendarRange size={18} />
          {labels.calendar}
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
            view === "list"
              ? "bg-iu-blue text-white"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <ListChecks size={18} />
          {labels.list}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="px-6 py-3 text-sm font-bold rounded-xl border border-border text-foreground bg-card/50 hover:bg-muted/50 transition-all"
          onClick={onGoToCurrentWeek}
        >
          {labels.goToCurrentWeek}
        </button>
        <button
          className="px-6 py-3 text-sm font-bold rounded-xl bg-iu-blue text-white hover:bg-iu-blue transition-all"
          onClick={onNewDraft}
        >
          {labels.newDraft}
        </button>
      </div>
    </div>
  );
}
