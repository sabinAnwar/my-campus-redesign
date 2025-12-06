import React, { useState, useEffect } from "react";
import { useFetcher } from "react-router-dom";

import { showSuccessToast, showErrorToast } from "../lib/toast";
import { useLanguage } from "~/contexts/LanguageContext";

const TRANSLATIONS = {
  de: {
    settings: "Einstellungen",
    profile: "Profil",
    preferences: "Einstellungen",
    security: "Sicherheit",
    notifications: "Benachrichtigungen",
    logout: "Abmelden",
    profileInfo: "Profilinformationen",
    personalData: "Persönliche Daten",
    email: "E-Mail",
    phone: "Telefon",
    address: "Adresse",
    dateOfBirth: "Geburtsdatum",
    studentId: "Studentennummer",
    major: "Studiengang",
    company: "Unternehmen",
    supervisor: "Betreuer",
    changePassword: "Passwort ändern",
    currentPassword: "Aktuelles Passwort",
    newPassword: "Neues Passwort",
    confirmPassword: "Passwort bestätigen",
    changePasswordBtn: "Passwort ändern",
    language: "Sprache",
    theme: "Design",
    darkMode: "Dunkler Modus",
    notificationSettings: "Benachrichtigungen",
    emailNotifications: "E-Mail-Benachrichtigungen",
    messageNotifications: "Nachrichtenbenachrichtigungen",
    calendarNotifications: "Kalenderbenachrichtigungen",
    enableAll: "Alle aktivieren",
    disableAll: "Alle deaktivieren",
    save: "Speichern",
    saved: "Gespeichert!",
    cancel: "Abbrechen",
    edit: "Bearbeiten",
    back: "Zurück",
    twoFactor: "Zwei-Faktor-Authentifizierung",
    activeSession: "Aktive Sitzungen",
    loginHistory: "Anmeldungsverlauf",
    dataExport: "Datenexport",
    deleteAccount: "Konto löschen",
    accountDeletion: "Kontolöschung",
    deleteAccountWarning: "Dies kann nicht rückgängig gemacht werden",
  },
  en: {
    settings: "Settings",
    profile: "Profile",
    preferences: "Preferences",
    security: "Security",
    notifications: "Notifications",
    logout: "Logout",
    profileInfo: "Profile Information",
    personalData: "Personal Data",
    email: "Email",
    phone: "Phone",
    address: "Address",
    dateOfBirth: "Date of Birth",
    studentId: "Student ID",
    major: "Major",
    company: "Company",
    supervisor: "Supervisor",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    changePasswordBtn: "Change Password",
    language: "Language",
    theme: "Theme",
    darkMode: "Dark Mode",
    notificationSettings: "Notifications",
    emailNotifications: "Email Notifications",
    messageNotifications: "Message Notifications",
    calendarNotifications: "Calendar Notifications",
    enableAll: "Enable All",
    disableAll: "Disable All",
    save: "Save",
    saved: "Saved!",
    cancel: "Cancel",
    edit: "Edit",
    back: "Back",
    twoFactor: "Two-Factor Authentication",
    activeSession: "Active Sessions",
    loginHistory: "Login History",
    dataExport: "Data Export",
    deleteAccount: "Delete Account",
    accountDeletion: "Account Deletion",
    deleteAccountWarning: "This cannot be undone",
  },
};

export const loader = async () => {
  return null;
};

export default function Settings() {
  const fetcher = useFetcher();
  const REMINDER_CACHE_KEY = "iu-reminder-preferences";
  const { language } = useLanguage();
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
    <div className="max-w-5xl mx-auto space-y-10 text-slate-900 dark:text-slate-100">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 via-indigo-500 to-fuchsia-500 px-6 py-8 shadow-xl">
        <div className="absolute inset-0 opacity-20 mix-blend-screen bg-[radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_0%,#c4f1f9,transparent_25%)]" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.4em] text-white/80 font-semibold">
            Control Center
          </p>
          <h1 className="text-3xl font-black text-white drop-shadow-sm">Einstellungen</h1>
          <p className="mt-2 text-sm text-white/80">
            Verwalte Konto, Benachrichtigungen und Erinnerungen.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 shadow-lg shadow-blue-100/50 dark:shadow-none">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-blue-600 dark:text-blue-300 font-semibold">
                Profil
              </p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Persönliche Daten</h2>
            </div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
              Sicher gespeichert
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 opacity-0 group-hover:opacity-100 transition" />
                <input
                  className="w-full relative rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-inner shadow-slate-100/60 dark:shadow-black/20"
                  value={userName || ""}
                  readOnly
                />
              </div>
            </div>
            <div className="group">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                E‑Mail
              </label>
              <div className="relative">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-fuchsia-100 to-pink-100 dark:from-fuchsia-900/30 dark:to-pink-900/30 opacity-0 group-hover:opacity-100 transition" />
                <input
                  className="w-full relative rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-inner shadow-slate-100/60 dark:shadow-black/20"
                  value={userEmail || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benachrichtigungen */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 shadow-lg shadow-fuchsia-100/50 dark:shadow-none">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] text-fuchsia-600 dark:text-fuchsia-300 font-semibold">
                Alerts
              </p>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Benachrichtigungen</h2>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden />
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between text-sm rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 shadow-sm">
              <span className="text-slate-700 dark:text-slate-200">
                E‑Mail‑Benachrichtigungen
              </span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-blue-600"
                checked={notifEmail}
                onChange={(e) => setNotifEmail(e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between text-sm rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 shadow-sm">
              <span className="text-slate-700 dark:text-slate-200">Nachrichten</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-indigo-600"
                checked={notifMessages}
                onChange={(e) => setNotifMessages(e.target.checked)}
              />
            </label>
            <label className="flex items-center justify-between text-sm rounded-xl px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 shadow-sm">
              <span className="text-slate-700 dark:text-slate-200">Kalender</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-fuchsia-600"
                checked={notifCalendar}
                onChange={(e) => setNotifCalendar(e.target.checked)}
              />
            </label>
          </div>
          <div className="mt-5">
            <button
              type="button"
              onClick={handleNotificationsSave}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 text-sm font-semibold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition"
            >
              Änderungen speichern
            </button>
          </div>
        </section>
      </div>

      {/* Reminder card full width */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl shadow-blue-100/60 dark:shadow-none">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 opacity-60 pointer-events-none" />
        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-300 font-semibold">
              Daily flow
            </p>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Praxisbericht‑Erinnerung (täglich)
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Tägliche E‑Mail‑Erinnerung zur gewünschten Uhrzeit.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 text-sm bg-white/80 dark:bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-600"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
            <span className="font-medium text-slate-900 dark:text-white">
              Aktivieren
            </span>
          </label>
        </div>

        <div className="relative mt-5 flex items-center gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              Uhrzeit
            </label>
            <div className="flex items-center gap-2">
              <select
                value={reminderHour}
                onChange={(e) => setReminderHour(Number(e.target.value))}
                className="w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 text-slate-900 dark:text-slate-100 shadow-sm"
              >
                {Array.from({ length: 24 }).map((_, h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="text-slate-500 dark:text-slate-400">:</span>
              <select
                value={reminderMinute}
                onChange={(e) => setReminderMinute(Number(e.target.value))}
                className="w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-700 text-slate-900 dark:text-slate-100 shadow-sm"
              >
                {Array.from({ length: 60 }).map((_, m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="text-slate-600 dark:text-slate-300 text-sm">Uhr</span>
            </div>
          </div>

          <fetcher.Form
            method="post"
            action="/api/reminders/preferences"
            className="mt-6 sm:mt-0 flex items-center gap-2"
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
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-5 py-2 text-sm font-semibold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition disabled:opacity-60"
            >
              {fetcher.state === "submitting" ? "Speichern…" : "Speichern"}
            </button>
          </fetcher.Form>
          <div className="text-xs text-slate-600 dark:text-slate-400 mt-2">
            Wird täglich um{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {String(reminderHour).padStart(2, "0")}:
              {String(reminderMinute).padStart(2, "0")} Uhr
            </span>
            {reminderTimezone ? ` (${reminderTimezone})` : ""} gesendet.
          </div>
        </div>
      </section>
    </div>

  );
}
