import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const TRANSLATIONS = {
  de: {
    messages: "Nachrichten",
    inbox: "Posteingang",
    sent: "Gesendet",
    compose: "Neue Nachricht",
    from: "Von",
    to: "An",
    subject: "Betreff",
    message: "Nachricht",
    send: "Senden",
    back: "Zurück",
    logout: "Abmelden",
    noMessages: "Keine Nachrichten",
    reply: "Antworten",
    delete: "Löschen",
    search: "Suchen",
    today: "Heute",
    yesterday: "Gestern",
    unread: "Ungelesen",
    read: "Gelesen",
  },
  en: {
    messages: "Messages",
    inbox: "Inbox",
    sent: "Sent",
    compose: "New Message",
    from: "From",
    to: "To",
    subject: "Subject",
    message: "Message",
    send: "Send",
    back: "Back",
    logout: "Logout",
    noMessages: "No messages",
    reply: "Reply",
    delete: "Delete",
    search: "Search",
    today: "Today",
    yesterday: "Yesterday",
    unread: "Unread",
    read: "Read",
  },
};

export const loader = async () => {
  return null;
};

export default function Messages() {
  const [language, setLanguage] = useState("de");
  const [activeTab, setActiveTab] = useState("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const t = TRANSLATIONS[language];

  const messages = [
    {
      id: 1,
      from: "Prof. Dr. Sarah Schmidt",
      to: "Du",
      subject: language === "de" ? "Projektarbeit Feedback" : "Project Work Feedback",
      body: language === "de" 
        ? "Gute Arbeit bei deinem Projektvorschlag. Bitte noch zwei Punkte berücksichtigen..."
        : "Good work on your project proposal. Please consider two more points...",
      time: t.today,
      unread: true,
      type: "inbox",
    },
    {
      id: 2,
      from: "Markus Weber",
      to: "Du",
      subject: language === "de" ? "Wochenabschluss" : "Weekly Summary",
      body: language === "de"
        ? "Diese Woche hast du 38 Stunden gearbeitet. Zusammenfassung: Modul A abgeschlossen, Modul B zu 80% erledigt."
        : "This week you worked 38 hours. Summary: Module A completed, Module B 80% done.",
      time: t.today,
      unread: true,
      type: "inbox",
    },
    {
      id: 3,
      from: "Du",
      to: "Prof. Dr. Sarah Schmidt",
      subject: language === "de" ? "Frage zum Projekt" : "Question about Project",
      body: language === "de"
        ? "Hallo Professor, ich habe eine Frage zu den Anforderungen..."
        : "Hello Professor, I have a question about the requirements...",
      time: t.yesterday,
      unread: false,
      type: "sent",
    },
  ];

  const filteredMessages = messages
    .filter(m => m.type === activeTab)
    .filter(m => 
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.from.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const unreadCount = messages.filter(m => m.unread && m.type === "inbox").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">IU</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-blue-900">IU Portal</h1>
                <p className="text-xs text-blue-600">{t.messages}</p>
              </div>
            </Link>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-2 text-sm bg-slate-100 text-slate-900 rounded-lg border border-slate-200 cursor-pointer"
              >
                <option value="de">DE</option>
                <option value="en">EN</option>
              </select>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-blue-900 mb-2">💬 {t.messages}</h2>
          <p className="text-slate-600">
            {language === "de" ? "Verwalte deine Nachrichten und Kommunikation" : "Manage your messages and communication"}
          </p>
        </div>

        {/* Search & Controls */}
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder={t.search + "..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:border-blue-600"
            />
            <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition">
              ✍️ {t.compose}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === "inbox"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-blue-600"
              }`}
            >
              📥 {t.inbox} {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-2 font-semibold border-b-2 transition ${
                activeTab === "sent"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-600 hover:text-blue-600"
              }`}
            >
              📤 {t.sent}
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-3">
          {filteredMessages.length > 0 ? (
            filteredMessages.map(msg => (
              <div
                key={msg.id}
                className={`rounded-lg border p-4 cursor-pointer transition hover:shadow-md ${
                  msg.unread
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold ${msg.unread ? "text-blue-900" : "text-slate-900"}`}>
                        {msg.from}
                      </h3>
                      {msg.unread && (
                        <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 mb-1">
                      {msg.subject}
                    </p>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {msg.body}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-slate-500 font-semibold">
                      {msg.time}
                    </p>
                    {msg.unread && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-2 inline-block">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200">
              <p className="text-slate-600 text-lg">{t.noMessages}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
