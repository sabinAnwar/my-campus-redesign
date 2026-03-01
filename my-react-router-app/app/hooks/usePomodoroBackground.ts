import { useEffect } from "react";

export function usePomodoroBackground(pathname: string) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pathname.startsWith("/lernassistent")) return;

    const interval = setInterval(() => {
      const running = localStorage.getItem("pomodoro:running") === "true";
      if (!running) return;

      const storedTime = parseInt(localStorage.getItem("pomodoro:time") || "", 10);
      const storedBreak = localStorage.getItem("pomodoro:break") === "true";
      const storedCompleted = parseInt(localStorage.getItem("pomodoro:completed") || "0", 10);
      const storedLastTick = parseInt(localStorage.getItem("pomodoro:lastTick") || "", 10);
      const focusDuration = parseInt(localStorage.getItem("pomodoro:focusDuration") || "10", 10);
      const breakDuration = parseInt(localStorage.getItem("pomodoro:breakDuration") || "10", 10);

      if (Number.isNaN(storedTime) || Number.isNaN(storedLastTick)) return;

      const now = Date.now();
      const elapsed = Math.max(1, Math.floor((now - storedLastTick) / 1000));
      let remaining = storedTime - elapsed;
      let breakMode = storedBreak;
      let completed = Number.isNaN(storedCompleted) ? 0 : storedCompleted;

      while (remaining <= 0) {
        if (!breakMode) {
          completed += 1;
        }
        breakMode = !breakMode;
        remaining += breakMode ? breakDuration : focusDuration;
      }

      localStorage.setItem("pomodoro:time", String(remaining));
      localStorage.setItem("pomodoro:break", String(breakMode));
      localStorage.setItem("pomodoro:completed", String(completed));
      localStorage.setItem("pomodoro:lastTick", String(now));
    }, 1000);

    return () => clearInterval(interval);
  }, [pathname]);
}
