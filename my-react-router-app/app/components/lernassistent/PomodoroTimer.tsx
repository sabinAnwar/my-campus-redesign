import React from "react";
import { Timer, Play, Pause, RotateCcw, Trophy } from "lucide-react";

interface PomodoroTimerProps {
  t: any;
  pomodoroTime: number;
  isRunning: boolean;
  isBreak: boolean;
  pomodorosCompleted: number;
  onToggleTimer: () => void;
  onReset: () => void;
  formatTime: (seconds: number) => string;
}

export function PomodoroTimer({
  t,
  pomodoroTime,
  isRunning,
  isBreak,
  pomodorosCompleted,
  onToggleTimer,
  onReset,
  formatTime,
}: PomodoroTimerProps) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
      <h3 className="font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
        <Timer className="w-5 h-5 text-rose-500" />
        {t.pomodoroTitle}
      </h3>

      <div className="text-center">
        <div className={`text-5xl font-mono font-bold mb-2 ${
          isBreak ? 'text-iu-blue' : 'text-violet-600 dark:text-violet-400'
        }`}>
          {formatTime(pomodoroTime)}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {isBreak ? t.breakTime : t.focusTime}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onToggleTimer}
            className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-violet-600 hover:bg-violet-700 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                {t.pause}
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                {t.start}
              </>
            )}
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {pomodorosCompleted > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Trophy className="w-4 h-4 text-amber-500" />
            {pomodorosCompleted} Pomodoro{pomodorosCompleted > 1 ? 's' : ''} heute
          </div>
        )}
      </div>
    </div>
  );
}
