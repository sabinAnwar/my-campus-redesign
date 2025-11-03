import React from "react";
import AppShell from "../components/AppShell";

export default function CurriculumPage() {
  return (
    <AppShell>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900">Studienplan</h1>
        <p className="text-slate-600 mt-2">
          Übersicht deines Curriculums. Inhalte folgen.
        </p>
      </div>
    </AppShell>
  );
}
