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
    <div className="rounded-[2rem] border border-border bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
      <h3 className="font-black text-foreground mb-4 sm:mb-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-destructive text-white">
          <Timer className="w-5 h-5" />
        </div>
        {t.pomodoroTitle}
      </h3>

      <div className="text-center">
        <div className={`text-4xl sm:text-5xl font-mono font-black mb-2 text-foreground`}>
          {formatTime(pomodoroTime)}
        </div>
        <p className="text-sm text-muted-foreground font-bold mb-4 sm:mb-6">
          {isBreak ? t.breakTime : t.focusTime}
        </p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onToggleTimer}
            className={`px-6 py-2.5 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg ${
              isRunning
                ? 'bg-iu-orange hover:bg-iu-orange/90 text-white shadow-iu-orange/20'
                : 'bg-iu-blue hover:bg-iu-blue/90 text-white shadow-iu-blue/20'
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
            className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {pomodorosCompleted > 0 && (
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground font-bold">
            <Trophy className="w-4 h-4 text-iu-orange" />
            {pomodorosCompleted} Pomodoro{pomodorosCompleted > 1 ? 's' : ''} heute
          </div>
        )}
      </div>
    </div>
  );
}
