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
    <div className="rounded-[2rem] border border-border bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
      <h3 className="font-black text-foreground mb-4 sm:mb-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-iu-orange text-white">
          <Lightbulb className="w-5 h-5" />
        </div>
        {t.studyTipsTitle}
      </h3>
      <div className="space-y-3">
        {t.tips.map((tip: StudyTip, i: number) => (
          <div
            key={i}
            className="p-3 sm:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => onTipClick(tip.title)}
          >
            <p className="font-bold text-sm text-foreground group-hover:text-iu-blue transition-colors">{tip.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
