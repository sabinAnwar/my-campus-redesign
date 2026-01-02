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
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          {t.streakTitle}
        </h3>
        <span className="text-2xl font-black text-orange-500">{streak}</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{streak} {t.days} 🔥</p>

      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">{t.todayGoal}</span>
          <span className="text-slate-700 dark:text-slate-300">{todayMinutes}/{goalMinutes} min</span>
        </div>
        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all"
            style={{ width: `${(todayMinutes / goalMinutes) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
