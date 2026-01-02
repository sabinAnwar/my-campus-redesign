import React from "react";
import { Lightbulb } from "lucide-react";

interface StudyTip {
  title: string;
  desc: string;
}

interface StudyTipsProps {
  t: any;
  onTipClick: (tipTitle: string) => void;
}

export function StudyTips({ t, onTipClick }: StudyTipsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        {t.studyTipsTitle}
      </h3>
      <div className="space-y-3">
        {t.tips.map((tip: StudyTip, i: number) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            onClick={() => onTipClick(tip.title)}
          >
            <p className="font-medium text-sm text-slate-900 dark:text-white">{tip.title}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
