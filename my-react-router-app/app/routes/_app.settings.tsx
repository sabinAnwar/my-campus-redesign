import React, { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Clock, 
  Shield, 
  Mail, 
  Smartphone, 
  Globe, 
  Moon, 
  Save, 
  LogOut,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../lib/toast";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS, REMINDER_CACHE_KEY } from "~/constants/settings";

export const loader = async () => {
  return null;
};

export default function Settings() {
  const fetcher = useFetcher();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(18);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [reminderTimezone, setReminderTimezone] = useState("Europe/Berlin");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifCalendar, setNotifCalendar] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  // Load cached reminder values immediately (before network), so UI doesn't snap back to defaults on reload
  useEffect(() => {
    try {
      const cachedRaw = localStorage.getItem(REMINDER_CACHE_KEY);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        if (typeof cached.reminderEnabled === "boolean")
          setReminderEnabled(cached.reminderEnabled);
        if (Number.isFinite(cached.reminderHour))
          setReminderHour(Number(cached.reminderHour));
        if (Number.isFinite(cached.reminderMinute))
          setReminderMinute(Number(cached.reminderMinute));
        if (cached.reminderTimezone)
          setReminderTimezone(String(cached.reminderTimezone));
      }
    } catch (_) {}
  }, []);

  // Load current reminder preferences
  useEffect(() => {
    (async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const headers: Record<string, string> = {};
        if (sessionToken) headers["X-Session-Token"] = sessionToken;
        const res = await fetch("/api/reminders/preferences", {
          credentials: "include",
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          setReminderEnabled(!!data.reminderEnabled);
          setReminderHour(Number(data.reminderHour ?? 18));
          setReminderMinute(Number(data.reminderMinute ?? 0));
          if (data.reminderTimezone) setReminderTimezone(data.reminderTimezone);
          try {
            localStorage.setItem(
              REMINDER_CACHE_KEY,
              JSON.stringify({
                reminderEnabled: !!data.reminderEnabled,
                reminderHour: Number(data.reminderHour ?? 18),
                reminderMinute: Number(data.reminderMinute ?? 0),
                reminderTimezone: data.reminderTimezone || "Europe/Berlin",
              })
            );
          } catch (_) {}
        }
      } catch (_) {}
    })();
  }, []);

  // Load current user (name, email) to replace placeholders
  useEffect(() => {
    (async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const headers: Record<string, string> = {};
        if (sessionToken) headers["X-Session-Token"] = sessionToken;
        const res = await fetch("/api/user", {
          credentials: "include",
          headers,
        });
        if (res.ok) {
          const data = await res.json();
          const u = data?.user || {};
          if (u.name) setUserName(u.name);
          if (u.email) setUserEmail(u.email);
        }
      } catch (_) {}
    })();
  }, []);

  // Handle save result
  useEffect(() => {
    if (fetcher?.data?.success) {
      const enabled = fetcher.data.reminderEnabled ?? reminderEnabled;
      const hour = fetcher.data.reminderHour ?? reminderHour;
      const minute = fetcher.data.reminderMinute ?? reminderMinute ?? 0;
      const hh = String(hour).padStart(2, "0");
      const mm = String(minute).padStart(2, "0");
      const message =
        language === "de"
          ? enabled
            ? `E-Mail-Erinnerung aktiv: täglich um ${hh}:${mm}`
            : "Erinnerungen deaktiviert"
          : enabled
            ? `Daily email reminder scheduled at ${hh}:${mm}`
            : "Reminders disabled";
      showSuccessToast(message);
      try {
        localStorage.setItem(
          REMINDER_CACHE_KEY,
          JSON.stringify({
            reminderEnabled: enabled,
            reminderHour: hour,
            reminderMinute: minute,
            reminderTimezone,
          })
        );
      } catch (_) {}
    } else if (fetcher?.data?.error) {
      showErrorToast(fetcher.data.error);
    }
  }, [fetcher?.data, language]);

  const handleNotificationsSave = () => {
    const message =
      language === "de"
        ? "Benachrichtigungseinstellungen gespeichert"
        : "Notification preferences saved";
    showSuccessToast(message);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
            <SettingsIcon size={28} />
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">
            {t.title}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Section */}
        <section className="lg:col-span-2 bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                  <User className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-foreground tracking-tight">
                  {t.personalData}
                </h2>
              </div>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-iu-blue/10 border border-iu-blue/20 text-iu-blue text-xs font-bold">
                <Shield className="w-3.5 h-3.5" />
                {t.securelyStored}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  Name
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within/input:text-iu-blue transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    className="w-full bg-background/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-iu-blue/20 focus:border-iu-blue transition-all"
                    value={userName || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  {t.email}
                </label>
                <div className="relative group/input">
                  <div className="absolute inset-y-0 left-4 flex items-center text-muted-foreground group-focus-within/input:text-iu-blue transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    className="w-full bg-background/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-iu-blue/20 focus:border-iu-blue transition-all"
                    value={userEmail || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-iu-blue/5 blur-3xl rounded-full group-hover:bg-iu-blue/10 transition-colors" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10">
                  <Bell className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-black text-foreground tracking-tight">
                  {t.notifications}
                </h2>
              </div>
              <div className="h-2 w-2 rounded-full bg-iu-blue animate-pulse" />
            </div>

            <div className="space-y-4">
              {[
                {
                  label: t.emailNotifications,
                  icon: Mail,
                  state: notifEmail,
                  setter: setNotifEmail,
                },
                {
                  label: t.messageNotifications,
                  icon: Smartphone,
                  state: notifMessages,
                  setter: setNotifMessages,
                },
                {
                  label: t.calendarNotifications,
                  icon: Clock,
                  state: notifCalendar,
                  setter: setNotifCalendar,
                },
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex items-center justify-between p-4 rounded-2xl border border-border bg-background/30 hover:bg-background/50 transition-all cursor-pointer group/item"
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
              onClick={handleNotificationsSave}
              className="w-full mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-iu-blue text-white px-6 py-4 text-sm font-black shadow-xl shadow-iu-blue/20 hover:shadow-iu-blue/40 transition-all active:scale-95 uppercase tracking-widest"
            >
              <Save className="w-4 h-4" />
              {t.save}
            </button>
          </div>
        </section>
      </div>

      {/* Reminder Section */}
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
                  {t.reminderTitle}
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                  {t.reminderSubtitle}
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
                {t.activate}
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
                {t.time}
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
                <span className="text-2xl font-black text-muted-foreground">
                  :
                </span>
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
                  {t.hour}
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
                    {t.saving}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t.save}
                  </>
                )}
              </button>
            </fetcher.Form>

            <div className="hidden md:block p-4 rounded-2xl bg-iu-blue/5 border border-iu-blue/10">
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
                {language === "de" ? "Nächster Versand:" : "Next delivery:"}
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

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-bold transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t.back}
        </Link>

        <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-destructive hover:bg-destructive/10 font-bold transition-all">
          <LogOut className="w-4 h-4" />
          {t.logout}
        </button>
      </div>
    </div>
  );
}
