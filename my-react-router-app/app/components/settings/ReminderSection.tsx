import { Clock, Save } from "lucide-react";
import type { FetcherWithComponents } from "react-router-dom";

interface ReminderSectionProps {
  reminderEnabled: boolean;
  setReminderEnabled: (value: boolean) => void;
  reminderHour: number;
  setReminderHour: (value: number) => void;
  reminderMinute: number;
  setReminderMinute: (value: number) => void;
  reminderTimezone: string;
  fetcher: FetcherWithComponents<any>;
  labels: {
    reminderTitle: string;
    reminderSubtitle: string;
    activate: string;
    time: string;
    hour: string;
    save: string;
    saving: string;
    nextDelivery: string;
  };
}

export function ReminderSection({
  reminderEnabled,
  setReminderEnabled,
  reminderHour,
  setReminderHour,
  reminderMinute,
  setReminderMinute,
  reminderTimezone,
  fetcher,
  labels,
}: ReminderSectionProps) {
  return (
    <section className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full group-hover:bg-iu-blue/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">
                {labels.reminderTitle}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                {labels.reminderSubtitle}
              </p>
            </div>
          </div>

          <label className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-background/50 border border-border hover:border-iu-blue/30 transition-all cursor-pointer group/toggle">
            <div
              className={`w-10 h-6 rounded-full p-1 transition-colors ${reminderEnabled ? "bg-iu-blue" : "bg-muted"}`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${reminderEnabled ? "translate-x-4" : "translate-x-0"}`}
              />
            </div>
            <span className="text-sm font-black uppercase tracking-widest text-foreground">
              {labels.activate}
            </span>
            <input
              type="checkbox"
              className="hidden"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
          </label>
        </div>

        <div className="flex flex-col md:flex-row items-end gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
              {labels.time}
            </label>
            <div className="flex items-center gap-3">
              <select
                value={reminderHour}
                onChange={(e) => setReminderHour(Number(e.target.value))}
                className="bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-iu-blue/20 cursor-pointer appearance-none min-w-[80px] text-center"
              >
                {Array.from({ length: 24 }).map((_, h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="text-2xl font-black text-muted-foreground">:</span>
              <select
                value={reminderMinute}
                onChange={(e) => setReminderMinute(Number(e.target.value))}
                className="bg-background/50 border border-border rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-iu-blue/20 cursor-pointer appearance-none min-w-[80px] text-center"
              >
                {Array.from({ length: 60 }).map((_, m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="text-sm font-black text-muted-foreground uppercase tracking-widest ml-2">
                {labels.hour}
              </span>
            </div>
          </div>

          <fetcher.Form
            method="post"
            action="/api/reminders/preferences"
            className="flex-1 w-full md:w-auto"
          >
            <input
              type="hidden"
              name="enabled"
              value={reminderEnabled ? "true" : "false"}
            />
            <input type="hidden" name="hour" value={reminderHour} />
            <input type="hidden" name="minute" value={reminderMinute} />
            <button
              type="submit"
              disabled={fetcher.state === "submitting"}
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-iu-blue text-white px-8 py-4 text-sm font-black shadow-xl shadow-iu-blue/20 hover:shadow-iu-blue/40 transition-all disabled:opacity-60 active:scale-95 uppercase tracking-widest"
            >
              {fetcher.state === "submitting" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {labels.saving}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {labels.save}
                </>
              )}
            </button>
          </fetcher.Form>

          <div className="hidden md:block p-4 rounded-2xl bg-iu-blue/5 border border-iu-blue/10">
            <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
              {labels.nextDelivery}
              <br />
              <span className="text-iu-blue font-black text-xs">
                {String(reminderHour).padStart(2, "0")}:
                {String(reminderMinute).padStart(2, "0")}{" "}
                {reminderTimezone ? `(${reminderTimezone})` : ""}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
