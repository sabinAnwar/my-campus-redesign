import React, { useEffect, useState } from "react";
import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/lernassistent";

// Hooks
import { useChat } from "~/hooks/useChat";
import { usePomodoro } from "~/hooks/usePomodoro";

// Components
import { LernassistentHeader } from "~/features/lernassistent/LernassistentHeader";
import { ChatPanel } from "~/features/lernassistent/ChatPanel";
import { PomodoroTimer } from "~/features/lernassistent/PomodoroTimer";
import { LearningStreak } from "~/features/lernassistent/LearningStreak";
import { QuickAccessLinks } from "~/features/lernassistent/QuickAccessLinks";
import { StudyTips } from "~/features/lernassistent/StudyTips";

export const loader = async () => null;

export default function AILernassistent() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const goalMinutes = 120;
  const [streak, setStreak] = useState(1);
  const [todayMinutes, setTodayMinutes] = useState(0);

  // Chat hook
  const {
    messages,
    input,
    setInput,
    isTyping,
    handleSend,
    sendMessage,
  } = useChat({
    greeting: t.greeting,
    noAnswer: t.noAnswer,
    commonQuestions: t.commonQuestions,
    fallbackSuffix: t.fallbackSuffix,
    language,
  });

  // Pomodoro hook
  const {
    pomodoroTime,
    isRunning,
    isBreak,
    pomodorosCompleted,
    formatTime,
    toggleTimer,
    resetPomodoro,
  } = usePomodoro();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedStreak = parseInt(localStorage.getItem("mycampus:streak") || "1", 10);
    const storedMinutes = parseInt(localStorage.getItem("mycampus:todayMinutes") || "0", 10);
    setStreak(Number.isNaN(storedStreak) ? 1 : storedStreak);
    setTodayMinutes(Number.isNaN(storedMinutes) ? 0 : storedMinutes);
  }, []);

  useEffect(() => {
    if (!isRunning || isBreak) return;
    const interval = setInterval(() => {
      setTodayMinutes((prev) => {
        const next = prev + 1;
        if (typeof window !== "undefined") {
          localStorage.setItem("mycampus:todayMinutes", String(next));
        }
        return next;
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak]);

  return (
    <main className="max-w-7xl mx-auto">
      <LernassistentHeader t={t} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Chat */}
        <div className="lg:col-span-2 space-y-6">
          <ChatPanel
            messages={messages}
            input={input}
            setInput={setInput}
            isTyping={isTyping}
            onSend={handleSend}
            t={t}
          />
          <QuickAccessLinks t={t} />
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          <StudyTips t={t} onTipClick={sendMessage} />

          <PomodoroTimer
            t={t}
            pomodoroTime={pomodoroTime}
            isRunning={isRunning}
            isBreak={isBreak}
            pomodorosCompleted={pomodorosCompleted}
            onToggleTimer={toggleTimer}
            onReset={resetPomodoro}
            formatTime={formatTime}
          />

          <LearningStreak
            t={t}
            streak={streak}
            todayMinutes={todayMinutes}
            goalMinutes={goalMinutes}
          />
        </div>
      </div>
    </main>
  );
}
