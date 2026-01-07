import React from "react";
import { Flame } from "lucide-react";

interface LearningStreakProps {
  t: any;
  streak: number;
  todayMinutes: number;
  goalMinutes: number;
}

export function LearningStreak({
  t,
  streak,
  todayMinutes,
  goalMinutes,
}: LearningStreakProps) {
  return (
    <div className="rounded-[2rem] border border-border bg-gradient-to-br from-iu-orange/10 to-iu-pink/10 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-black text-foreground flex items-center gap-3">
          <div className="p-2 rounded-xl bg-iu-orange text-white">
            <Flame className="w-5 h-5" />
          </div>
          {t.streakTitle}
        </h3>
        <span className="text-2xl font-black text-iu-orange">{streak}</span>
      </div>
      <p className="text-sm text-muted-foreground font-bold">{streak} {t.days}</p>

      <div className="mt-4 sm:mt-6">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted-foreground font-bold">{t.todayGoal}</span>
          <span className="text-foreground font-black">{todayMinutes}/{goalMinutes} min</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-iu-orange to-iu-pink rounded-full transition-all progress-bar"
            style={{ width: `${(todayMinutes / goalMinutes) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
