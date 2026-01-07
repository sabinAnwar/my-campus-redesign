import { useEffect, useRef, useState } from "react";

export function usePomodoro() {
  const focusDuration = 10;
  const breakDuration = 10;
  const [pomodoroTime, setPomodoroTime] = useState(focusDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  const lastTickRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedTime = parseInt(localStorage.getItem("pomodoro:time") || "", 10);
    const storedRunning = localStorage.getItem("pomodoro:running") === "true";
    const storedBreak = localStorage.getItem("pomodoro:break") === "true";
    const storedCompleted = parseInt(localStorage.getItem("pomodoro:completed") || "0", 10);
    const storedLastTick = parseInt(localStorage.getItem("pomodoro:lastTick") || "", 10);

    setPomodorosCompleted(Number.isNaN(storedCompleted) ? 0 : storedCompleted);
    setIsBreak(storedBreak);
    setIsRunning(storedRunning);

    const baseTime = storedBreak ? breakDuration : focusDuration;
    let nextTime = Number.isNaN(storedTime) ? baseTime : storedTime;
    if (storedRunning && !Number.isNaN(storedLastTick)) {
      const elapsed = Math.floor((Date.now() - storedLastTick) / 1000);
      let remaining = nextTime - elapsed;
      let breakMode = storedBreak;
      let completed = Number.isNaN(storedCompleted) ? 0 : storedCompleted;

      while (remaining <= 0) {
        if (!breakMode) {
          completed += 1;
        }
        breakMode = !breakMode;
        remaining += breakMode ? breakDuration : focusDuration;
      }

      setPomodorosCompleted(completed);
      setIsBreak(breakMode);
      nextTime = remaining;
      lastTickRef.current = Date.now();
    }

    setPomodoroTime(nextTime);
  }, [breakDuration, focusDuration]);

  const playFinishSound = () => {
    if (typeof window === "undefined") return;
    if (!audioCtxRef.current) {
      audioCtxRef.current =
        new (window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.value = 0.05;
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15);
  };

  // Pomodoro timer
  useEffect(() => {
    if (!isRunning) return;

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      const lastTick = lastTickRef.current ?? now;
      const elapsed = Math.max(1, Math.floor((now - lastTick) / 1000));
      lastTickRef.current = now;

      setPomodoroTime((prev) => {
        let remaining = prev - elapsed;
        let breakMode = isBreak;
        let completed = pomodorosCompleted;

        while (remaining <= 0) {
          playFinishSound();
          if (!breakMode) {
            completed += 1;
          }
          breakMode = !breakMode;
          remaining += breakMode ? breakDuration : focusDuration;
        }

        if (breakMode !== isBreak) {
          setIsBreak(breakMode);
        }
        if (completed !== pomodorosCompleted) {
          setPomodorosCompleted(completed);
        }

        return remaining;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [
    isRunning,
    isBreak,
    pomodorosCompleted,
    breakDuration,
    focusDuration,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("pomodoro:time", String(pomodoroTime));
    localStorage.setItem("pomodoro:running", String(isRunning));
    localStorage.setItem("pomodoro:break", String(isBreak));
    localStorage.setItem("pomodoro:completed", String(pomodorosCompleted));
    localStorage.setItem("pomodoro:focusDuration", String(focusDuration));
    localStorage.setItem("pomodoro:breakDuration", String(breakDuration));
    if (isRunning && lastTickRef.current) {
      localStorage.setItem("pomodoro:lastTick", String(lastTickRef.current));
    }
  }, [pomodoroTime, isRunning, isBreak, pomodorosCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning((prev) => {
      const next = !prev;
      if (next) {
        lastTickRef.current = Date.now();
        if (typeof window !== "undefined") {
          localStorage.setItem("pomodoro:lastTick", String(lastTickRef.current));
          localStorage.setItem("pomodoro:running", "true");
        }
      } else if (typeof window !== "undefined") {
        localStorage.setItem("pomodoro:running", "false");
      }
      return next;
    });
  };

  const resetPomodoro = () => {
    setIsRunning(false);
    setIsBreak(false);
    setPomodoroTime(focusDuration);
    setPomodorosCompleted(0);
    lastTickRef.current = null;
  };

  return {
    pomodoroTime,
    isRunning,
    isBreak,
    pomodorosCompleted,
    formatTime,
    toggleTimer,
    resetPomodoro,
  };
}
