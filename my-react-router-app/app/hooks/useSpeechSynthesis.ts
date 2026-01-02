import { useState, useEffect, useCallback } from "react";

// Clean text for speech (remove markdown and emojis)
const cleanTextForSpeech = (text: string): string => {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold markers
    .replace(/[📅📝🔄📊🏥📆🎯📄📚📧📖🏫🪪💰🌍📞🧠👋✅❌⚠️💡🎥🗂️💪💵⏱️🍅🤔→•]/g, '') // Remove emojis
    .replace(/[#*_~`]/g, '') // Remove markdown
    .replace(/\n+/g, '. ') // Replace newlines with pauses
    .trim();
};

interface UseSpeechSynthesisParams {
  language: "de" | "en";
  messages: { text: string; isUser: boolean }[];
}

export function useSpeechSynthesis({ language, messages }: UseSpeechSynthesisParams) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Speak text function
  const speakText = useCallback((text: string) => {
    if (!speechSynthesis) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const cleanedText = cleanTextForSpeech(text);
    const utterance = new SpeechSynthesisUtterance(cleanedText);

    // Set language based on current language
    utterance.lang = language === 'de' ? 'de-DE' : 'en-US';
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [speechSynthesis, language, speechRate]);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [speechSynthesis]);

  // Toggle screen reader
  const toggleScreenReader = useCallback(() => {
    if (screenReaderEnabled) {
      stopSpeaking();
    }
    setScreenReaderEnabled(!screenReaderEnabled);
  }, [screenReaderEnabled, stopSpeaking]);

  // Auto-read new messages when screen reader is enabled
  useEffect(() => {
    if (screenReaderEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) {
        // Small delay to ensure message is rendered
        setTimeout(() => speakText(lastMessage.text), 100);
      }
    }
  }, [messages, screenReaderEnabled, speakText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  return {
    isSpeaking,
    screenReaderEnabled,
    speechRate,
    setSpeechRate,
    speakText,
    stopSpeaking,
    toggleScreenReader,
  };
}
