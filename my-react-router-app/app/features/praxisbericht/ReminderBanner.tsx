import { CalendarClock } from "lucide-react";

interface ReminderBannerProps {
  reminderEnabled: boolean;
  reminderHour: number;
  onOpenSettings: () => void;
  labels: {
    reminder: string;
    reminderActive: string;
    reminderDisabled: string;
    openSettings: string;
  };
}

export function ReminderBanner({
  reminderEnabled,
  reminderHour,
  onOpenSettings,
  labels,
}: ReminderBannerProps) {
  return (
    <div className="mb-10 bg-card/40 backdrop-blur-xl border border-border rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-5">
        <div className="p-3 bg-iu-blue/10 dark:bg-iu-blue/20 rounded-xl border border-iu-blue/15">
          <CalendarClock className="h-6 w-6 text-iu-blue" />
        </div>
        <div>
          <div className="text-lg font-black text-foreground tracking-tight">
            {labels.reminder}
          </div>
          <div className="text-sm text-muted-foreground">
            {reminderEnabled ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {labels.reminderActive} {String(reminderHour).padStart(2, "0")}
                :00
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                {labels.reminderDisabled}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onOpenSettings}
        className="w-full md:w-auto px-6 py-3 text-sm font-bold rounded-xl bg-iu-blue text-white hover:bg-iu-blue/90 shadow-lg hover:shadow-iu-blue/25 transition-all"
      >
        {labels.openSettings}
      </button>
    </div>
  );
}
