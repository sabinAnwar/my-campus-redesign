import React from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/lernassistent";

// Hooks
import { useChat } from "~/hooks/useChat";
import { usePomodoro } from "~/hooks/usePomodoro";
import { useSpeechSynthesis } from "~/hooks/useSpeechSynthesis";

// Components
import { LernassistentHeader } from "~/components/lernassistent/LernassistentHeader";
import { ChatPanel } from "~/components/lernassistent/ChatPanel";
import { PomodoroTimer } from "~/components/lernassistent/PomodoroTimer";
import { LearningStreak } from "~/components/lernassistent/LearningStreak";
import { QuickAccessLinks } from "~/components/lernassistent/QuickAccessLinks";
import { StudyTips } from "~/components/lernassistent/StudyTips";

export const loader = async () => null;

export default function AILernassistent() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  // Streak data (mock)
  const streak = 5;
  const todayMinutes = 45;
  const goalMinutes = 120;

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

  // Speech synthesis hook
  const {
    isSpeaking,
    screenReaderEnabled,
    speechRate,
    setSpeechRate,
    speakText,
    stopSpeaking,
    toggleScreenReader,
  } = useSpeechSynthesis({ language, messages });

  return (
    <main className="max-w-7xl mx-auto">
      <LernassistentHeader t={t} />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Chat */}
        <div className="lg:col-span-2">
          <ChatPanel
            messages={messages}
            input={input}
            setInput={setInput}
            isTyping={isTyping}
            onSend={handleSend}
            screenReaderEnabled={screenReaderEnabled}
            isSpeaking={isSpeaking}
            speechRate={speechRate}
            setSpeechRate={setSpeechRate}
            onToggleScreenReader={toggleScreenReader}
            onStopSpeaking={stopSpeaking}
            onSpeakText={speakText}
            t={t}
          />
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
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

          <QuickAccessLinks t={t} />

          <StudyTips t={t} onTipClick={sendMessage} />
        </div>
      </div>
    </main>
  );
}
