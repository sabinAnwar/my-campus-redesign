import React, { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import AppShell from "../components/AppShell";
import { showSuccessToast, showErrorToast } from "../lib/toast";

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
  const [language, setLanguage] = useState("de");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderHour, setReminderHour] = useState(18);
  const [reminderMinute, setReminderMinute] = useState(0);
  const [reminderTimezone, setReminderTimezone] = useState("Europe/Berlin");
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifCalendar, setNotifCalendar] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const t = TRANSLATIONS[language];

  // Load current reminder preferences
  useEffect(() => {
    (async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const headers = {};
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
        }
      } catch (_) {}
    })();
  }, []);

  // Load current user (name, email) to replace placeholders
  useEffect(() => {
    (async () => {
      try {
        const sessionToken = localStorage.getItem("sessionToken");
        const headers = {};
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
      const minute = fetcher.data.reminderMinute ?? reminderMinute;
      const hh = String(hour).padStart(2, "0");
      const mm = String(minute).padStart(2, "0");
      showSuccessToast(
        enabled
          ? `Erinnerungen aktiviert für ${hh}:${mm} Uhr`
          : `Erinnerungen deaktiviert`
      );
    } else if (fetcher?.data?.error) {
      showErrorToast(fetcher.data.error);
    }
  }, [fetcher?.data]);

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Einstellungen</h1>
            <p className="text-sm text-slate-500">
              Verwalte Konto, Einstellungen und Benachrichtigungen
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border bg-white border-slate-200 text-slate-900"
            >
              <option value="de">Deutsch</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil */}
          <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xs font-semibold tracking-wide text-slate-500 mb-4 uppercase">
              Profil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  Name
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50"
                  value={userName || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">
                  E‑Mail
                </label>
                <input
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm bg-slate-50"
                  value={userEmail || ""}
                  readOnly
                />
              </div>
            </div>
          </section>

          {/* Benachrichtigungen */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xs font-semibold tracking-wide text-slate-500 mb-4 uppercase">
              Benachrichtigungen
            </h2>
            <div className="space-y-3">
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700">
                  E‑Mail‑Benachrichtigungen
                </span>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Nachrichten</span>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={notifMessages}
                  onChange={(e) => setNotifMessages(e.target.checked)}
                />
              </label>
              <label className="flex items-center justify-between text-sm">
                <span className="text-slate-700">Kalender</span>
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={notifCalendar}
                  onChange={(e) => setNotifCalendar(e.target.checked)}
                />
              </label>
            </div>
            <div className="mt-4">
              <button className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                Änderungen speichern
              </button>
            </div>
          </section>
        </div>

        {/* Reminder card full width */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Praxisbericht‑Erinnerung (täglich)
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Tägliche E‑Mail‑Erinnerung zur gewünschten Uhrzeit.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
              />
              <span className="font-medium text-slate-900">Aktivieren</span>
            </label>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Uhrzeit
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={reminderHour}
                  onChange={(e) => setReminderHour(Number(e.target.value))}
                  className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  {Array.from({ length: 24 }).map((_, h) => (
                    <option key={h} value={h}>
                      {String(h).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className="text-slate-500">:</span>
                <select
                  value={reminderMinute}
                  onChange={(e) => setReminderMinute(Number(e.target.value))}
                  className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                >
                  {Array.from({ length: 60 }).map((_, m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className="text-slate-600 text-sm">Uhr</span>
              </div>
            </div>

            <fetcher.Form
              method="post"
              action="/api/reminders/preferences"
              className="mt-6 sm:mt-0"
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
                className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
              >
                {fetcher.state === "submitting" ? "Speichern…" : "Speichern"}
              </button>
            </fetcher.Form>
            <div className="text-xs text-slate-500 mt-2">
              Wird täglich um{" "}
              <span className="font-medium">
                {String(reminderHour).padStart(2, "0")}:
                {String(reminderMinute).padStart(2, "0")} Uhr
              </span>
              {reminderTimezone ? ` (${reminderTimezone})` : ""} gesendet.
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
