import { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "~/utils/toast";
import { useLanguage } from "~/store/LanguageContext";
import { REMINDER_CACHE_KEY } from "~/config/settings";
import { TRANSLATIONS } from "~/services/translations/settings";
import {
  SettingsHeader,
  ProfileSection,
  NotificationsSection,
  ReminderSection,
} from "~/features/settings";

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
      const message = enabled
        ? t.reminderActiveMsg(`${hh}:${mm}`)
        : t.reminderDisabledMsg;
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
  }, [fetcher?.data, t, reminderEnabled, reminderHour, reminderMinute, reminderTimezone]);

  const handleNotificationsSave = () => {
    showSuccessToast(t.notifSavedMsg);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10">
      <SettingsHeader title={t.title} subtitle={t.subtitle} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <ProfileSection
          userName={userName}
          userEmail={userEmail}
          labels={{
            personalData: t.personalData,
            securelyStored: t.securelyStored,
            name: t.name,
            email: t.email,
          }}
        />

        <NotificationsSection
          notifEmail={notifEmail}
          setNotifEmail={setNotifEmail}
          notifMessages={notifMessages}
          setNotifMessages={setNotifMessages}
          notifCalendar={notifCalendar}
          setNotifCalendar={setNotifCalendar}
          onSave={handleNotificationsSave}
          labels={{
            notifications: t.notifications,
            emailNotifications: t.emailNotifications,
            messageNotifications: t.messageNotifications,
            calendarNotifications: t.calendarNotifications,
            save: t.save,
          }}
        />
      </div>

      <ReminderSection
        reminderEnabled={reminderEnabled}
        setReminderEnabled={setReminderEnabled}
        reminderHour={reminderHour}
        setReminderHour={setReminderHour}
        reminderMinute={reminderMinute}
        setReminderMinute={setReminderMinute}
        reminderTimezone={reminderTimezone}
        fetcher={fetcher}
        labels={{
          reminderTitle: t.reminderTitle,
          reminderSubtitle: t.reminderSubtitle,
          activate: t.activate,
          time: t.time,
          hour: t.hour,
          save: t.save,
          saving: t.saving,
          nextDelivery: t.nextDelivery,
        }}
      />
    </div>
  );
}
