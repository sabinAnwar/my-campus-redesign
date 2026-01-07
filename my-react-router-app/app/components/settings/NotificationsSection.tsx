import { Bell, Mail, Smartphone, Clock, Save } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NotificationItem {
  label: string;
  icon: LucideIcon;
  state: boolean;
  setter: (value: boolean) => void;
}

interface NotificationsSectionProps {
  notifEmail: boolean;
  setNotifEmail: (value: boolean) => void;
  notifMessages: boolean;
  setNotifMessages: (value: boolean) => void;
  notifCalendar: boolean;
  setNotifCalendar: (value: boolean) => void;
  onSave: () => void;
  labels: {
    notifications: string;
    emailNotifications: string;
    messageNotifications: string;
    calendarNotifications: string;
    save: string;
  };
}

export function NotificationsSection({
  notifEmail,
  setNotifEmail,
  notifMessages,
  setNotifMessages,
  notifCalendar,
  setNotifCalendar,
  onSave,
  labels,
}: NotificationsSectionProps) {
  const items: NotificationItem[] = [
    {
      label: labels.emailNotifications,
      icon: Mail,
      state: notifEmail,
      setter: setNotifEmail,
    },
    {
      label: labels.messageNotifications,
      icon: Smartphone,
      state: notifMessages,
      setter: setNotifMessages,
    },
    {
      label: labels.calendarNotifications,
      icon: Clock,
      state: notifCalendar,
      setter: setNotifCalendar,
    },
  ];

  return (
    <section className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-6 sm:p-10 shadow-2xl relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white shadow-sm border border-iu-blue/10 dark:border-iu-blue">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
              {labels.notifications}
            </h2>
          </div>
          <div className="h-2 w-2 rounded-full bg-iu-blue animate-pulse" />
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <label
              key={i}
              className="flex items-center justify-between p-3 sm:p-4 rounded-2xl border border-border bg-background/30 hover:bg-background/50 transition-all cursor-pointer group/item"
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`w-4 h-4 ${item.state ? "text-iu-blue" : "text-muted-foreground"} transition-colors`}
                />
                <span className="text-sm font-bold text-foreground/80 group-hover/item:text-foreground">
                  {item.label}
                </span>
              </div>
              <div
                className={`w-10 h-6 rounded-full p-1 transition-colors ${item.state ? "bg-iu-blue" : "bg-muted"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${item.state ? "translate-x-4" : "translate-x-0"}`}
                />
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={item.state}
                onChange={(e) => item.setter(e.target.checked)}
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={onSave}
          className="w-full mt-6 sm:mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-iu-blue text-white px-6 py-4 text-sm font-black shadow-xl shadow-iu-blue/20 hover:shadow-iu-blue/40 transition-all active:scale-95 uppercase tracking-widest"
        >
          <Save className="w-4 h-4" />
          {labels.save}
        </button>
      </div>
    </section>
  );
}
