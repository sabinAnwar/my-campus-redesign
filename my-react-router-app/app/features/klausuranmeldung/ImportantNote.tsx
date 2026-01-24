import React from "react";
import { AlertCircle } from "lucide-react";

interface ImportantNoteProps {
  t: any;
}

export function ImportantNote({ t }: ImportantNoteProps) {
  return (
    <div className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-8">
      <div className="flex items-center gap-3 mb-4 text-amber-500">
        <AlertCircle size={20} />
        <h4 className="font-bold">{t.importantNote}</h4>
      </div>
      <p className="text-sm text-amber-700 dark:text-amber-400/80 font-medium leading-relaxed">
        {t.noteText}
      </p>
    </div>
  );
}
