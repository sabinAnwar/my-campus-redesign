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
    <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1.5 bg-card/40 backdrop-blur-xl rounded-xl border border-border p-1">
        <button
          onClick={() => onViewChange("calendar")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
            view === "calendar"
              ? "bg-iu-blue text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <CalendarRange size={16} />
          {labels.calendar}
        </button>
        <button
          onClick={() => onViewChange("list")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all duration-200 ${
            view === "list"
              ? "bg-iu-blue text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <ListChecks size={16} />
          {labels.list}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-5 py-2.5 text-sm font-bold rounded-xl border border-border text-muted-foreground hover:text-foreground bg-card/40 hover:bg-muted/50 transition-all"
          onClick={onGoToCurrentWeek}
        >
          {labels.goToCurrentWeek}
        </button>
        <button
          className="px-5 py-2.5 text-sm font-bold rounded-xl bg-iu-blue text-white hover:bg-iu-blue/90 shadow-lg hover:shadow-iu-blue/25 transition-all"
          onClick={onNewDraft}
        >
          {labels.newDraft}
        </button>
      </div>
    </div>
  );
}
