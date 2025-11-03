import React from "react";
import AppShell from "../components/AppShell";

export default function StudentIdPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">Studentenausweis</h1>
        <p className="text-slate-600 mt-2">Hier kannst du deinen Studentenausweis ansehen/herunterladen. Inhalte folgen.</p>
      </div>
    </AppShell>
  );
}
