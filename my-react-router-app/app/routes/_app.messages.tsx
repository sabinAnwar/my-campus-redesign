import React from "react";

export default function MessagesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Nachrichten
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Hier werden zukünftig Nachrichten und Benachrichtigungen angezeigt.
        </p>
      </header>

      <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Momentan sind keine Nachrichten vorhanden.
        </p>
      </div>
    </div>
  );
}

