import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const [language, setLanguage] = useState("de");
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    messages: true,
    calendar: false,
  });
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const [userData, setUserData] = useState({
    name: "Max Mustermann",
    email: "max.mustermann@iu-student.de",
    phone: "+49 30 123456789",
    address: "Mustertstraße 1, 10115 Berlin",
    dateOfBirth: "15.05.2001",
    studentId: "S2024001234",
    major: "Informatik (Duales Studium)",
    company: "TechCorp GmbH",
    supervisor: "Markus Weber",
  });

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-900" : "bg-gradient-to-br from-white via-blue-50 to-slate-50"}`}>
      {/* Header */}
      <header className={`${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-blue-100"} shadow-sm border-b sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">IU</span>
              </div>
              <div>
                <h1 className={`text-lg font-black ${darkMode ? "text-white" : "text-blue-900"}`}>IU Portal</h1>
                <p className={`text-xs font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{t.settings}</p>
              </div>
            </Link>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`px-3 py-2 text-sm rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-slate-100 border-slate-200 text-slate-900"} cursor-pointer`}
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  darkMode
                    ? "bg-slate-700 text-yellow-400"
                    : "bg-slate-100 text-slate-900"
                }`}
              >
                {darkMode ? "🌙" : "☀️"}
              </button>

              <button
                onClick={() => navigate("/logout")}
                className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200"
              >
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-blue-100"} h-fit`}>
            <nav className="space-y-2 p-4">
              {[
                { id: "profile", icon: "👤", label: t.profile },
                { id: "preferences", icon: "⚙️", label: t.preferences },
                { id: "security", icon: "🔒", label: t.security },
                { id: "notifications", icon: "🔔", label: t.notifications },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${
                    activeTab === item.id
                      ? darkMode
                        ? "bg-blue-600 text-white"
                        : "bg-blue-100 text-blue-900"
                      : darkMode
                      ? "text-slate-300 hover:bg-slate-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-blue-100"} p-6`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-black ${darkMode ? "text-white" : "text-blue-900"}`}>
                    👤 {t.profileInfo}
                  </h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      editMode
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    {editMode ? t.cancel : t.edit}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {Object.entries({
                    name: t.personalData.split(" ")[0],
                    email: t.email,
                    phone: t.phone,
                    address: t.address,
                    dateOfBirth: t.dateOfBirth,
                    studentId: t.studentId,
                    major: t.major,
                    company: t.company,
                    supervisor: t.supervisor,
                  }).map(([key, label]) => (
                    <div key={key}>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
                        {label}
                      </label>
                      <input
                        type="text"
                        value={userData[key] || ""}
                        disabled={!editMode}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? editMode
                              ? "bg-slate-700 border-slate-600 text-white"
                              : "bg-slate-700 border-slate-600 text-slate-400"
                            : editMode
                            ? "bg-white border-blue-300"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        } ${editMode ? "cursor-text" : "cursor-not-allowed"}`}
                      />
                    </div>
                  ))}
                </div>

                {editMode && (
                  <div className="mt-6 flex gap-3">
                    <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                      {t.save}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className={`px-6 py-2 rounded-lg font-semibold ${darkMode ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-900"}`}
                    >
                      {t.cancel}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-blue-100"} p-6 space-y-6`}>
                <h2 className={`text-2xl font-black ${darkMode ? "text-white" : "text-blue-900"}`}>⚙️ {t.preferences}</h2>

                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600" : "bg-blue-50 border-blue-200"}`}>
                    <label className={`flex items-center justify-between cursor-pointer`}>
                      <span className={`font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                        🌙 {t.darkMode}
                      </span>
                      <input
                        type="checkbox"
                        checked={darkMode}
                        onChange={(e) => setDarkMode(e.target.checked)}
                        className="w-5 h-5"
                      />
                    </label>
                  </div>

                  <div className={`p-4 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600" : "bg-blue-50 border-blue-200"}`}>
                    <label className={`block font-semibold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
                      🌐 {t.language}
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-slate-600 border-slate-500 text-white"
                          : "bg-white border-blue-300"
                      }`}
                    >
                      <option value="de">Deutsch</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-blue-100"} p-6 space-y-6`}>
                <h2 className={`text-2xl font-black ${darkMode ? "text-white" : "text-blue-900"}`}>🔒 {t.security}</h2>

                <div className={`p-4 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600" : "bg-orange-50 border-orange-200"}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {t.changePassword}
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="password"
                      placeholder={t.currentPassword}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-slate-600 border-slate-500 text-white"
                          : "bg-white border-orange-300"
                      }`}
                    />
                    <input
                      type="password"
                      placeholder={t.newPassword}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-slate-600 border-slate-500 text-white"
                          : "bg-white border-orange-300"
                      }`}
                    />
                    <input
                      type="password"
                      placeholder={t.confirmPassword}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode
                          ? "bg-slate-600 border-slate-500 text-white"
                          : "bg-white border-orange-300"
                      }`}
                    />
                    <button className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                      {t.changePasswordBtn}
                    </button>
                  </div>
                </div>

                <div className={`p-4 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600" : "bg-purple-50 border-purple-200"}`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {t.twoFactor}
                  </h3>
                  <button className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">
                    ✓ {t.enableAll}
                  </button>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className={`${darkMode ? "bg-slate-800" : "bg-white"} rounded-xl shadow-md border ${darkMode ? "border-slate-700" : "border-blue-100"} p-6 space-y-4`}>
                <h2 className={`text-2xl font-black mb-6 ${darkMode ? "text-white" : "text-blue-900"}`}>
                  🔔 {t.notifications}
                </h2>

                {[
                  { key: "email", label: t.emailNotifications },
                  { key: "messages", label: t.messageNotifications },
                  { key: "calendar", label: t.calendarNotifications },
                ].map(item => (
                  <div
                    key={item.key}
                    className={`p-4 rounded-lg border flex items-center justify-between ${
                      darkMode ? "bg-slate-700 border-slate-600" : "bg-blue-50 border-blue-200"
                    }`}
                  >
                    <label className={`font-semibold cursor-pointer ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {item.label}
                    </label>
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={(e) => setNotifications({
                        ...notifications,
                        [item.key]: e.target.checked,
                      })}
                      className="w-5 h-5"
                    />
                  </div>
                ))}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setNotifications({ email: true, messages: true, calendar: true })}
                    className="flex-1 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                  >
                    ✓ {t.enableAll}
                  </button>
                  <button
                    onClick={() => setNotifications({ email: false, messages: false, calendar: false })}
                    className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
                      darkMode
                        ? "bg-slate-700 text-white hover:bg-slate-600"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                    }`}
                  >
                    ✗ {t.disableAll}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
