import { useState, useEffect } from "react";

export function usePomodoro() {
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);

  // Pomodoro timer
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(prev => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      // Timer finished
      if (!isBreak) {
        setPomodorosCompleted(prev => prev + 1);
        setIsBreak(true);
        setPomodoroTime(5 * 60); // 5 min break
      } else {
        setIsBreak(false);
        setPomodoroTime(25 * 60);
      }
      setIsRunning(false);
    }

    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, isBreak]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetPomodoro = () => {
    setIsRunning(false);
    setIsBreak(false);
    setPomodoroTime(25 * 60);
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
