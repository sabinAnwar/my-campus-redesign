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
    <div className="mb-12 bg-card/50 backdrop-blur-xl border border-border rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-iu-blue/10 rounded-2xl border border-iu-blue/20 dark:bg-iu-blue dark:border-iu-blue">
          <CalendarClock className="h-8 w-8 text-iu-blue dark:text-white" />
        </div>
        <div>
          <div className="text-xl font-black text-foreground mb-1">
            {labels.reminder}
          </div>
          <div className="text-muted-foreground font-medium">
            {reminderEnabled ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-iu-blue animate-pulse" />
                {labels.reminderActive} {String(reminderHour).padStart(2, "0")}
                :00
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted" />
                {labels.reminderDisabled}
              </span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={onOpenSettings}
        className="w-full md:w-auto px-8 py-4 text-sm font-bold rounded-2xl bg-iu-blue text-white hover:bg-iu-blue transition-all"
      >
        {labels.openSettings}
      </button>
    </div>
  );
}
