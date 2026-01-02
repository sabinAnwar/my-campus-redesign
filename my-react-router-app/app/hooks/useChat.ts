import { useState, useEffect, useCallback } from "react";
import { LEARNING_KNOWLEDGE } from "~/services/translations/lernassistent";

interface ChatMessage {
  text: string;
  isUser: boolean;
}

// Find answer function
function findLearningAnswer(query: string, language: "de" | "en"): string | null {
  const normalized = query.toLowerCase();
  const knowledge = LEARNING_KNOWLEDGE[language];

  for (const item of knowledge) {
    const matchCount = item.keywords.filter(k => normalized.includes(k)).length;
    if (matchCount >= 1) {
      return item.answer;
    }
  }

  return null;
}

interface UseChatParams {
  greeting: string;
  noAnswer: string;
  commonQuestions: string[];
  fallbackSuffix: string;
  language: "de" | "en";
}

export function useChat({
  greeting,
  noAnswer,
  commonQuestions,
  fallbackSuffix,
  language,
}: UseChatParams) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: greeting, isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isUser: true }]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const answer = findLearningAnswer(currentInput, language) ||
        `${noAnswer}\n${commonQuestions.map((q: string) => `• ${q}`).join('\n')}\n\n${fallbackSuffix}`;

      setMessages(prev => [...prev, { text: answer, isUser: false }]);
      setIsTyping(false);
    }, 800);
  }, [input, language, noAnswer, commonQuestions, fallbackSuffix]);

  const sendMessage = useCallback((text: string) => {
    setInput(text);
    // Need to trigger send after state update
    setTimeout(() => {
      setMessages(prev => [...prev, { text, isUser: true }]);
      setIsTyping(true);

      setTimeout(() => {
        const answer = findLearningAnswer(text, language) ||
          `${noAnswer}\n${commonQuestions.map((q: string) => `• ${q}`).join('\n')}\n\n${fallbackSuffix}`;

        setMessages(prev => [...prev, { text: answer, isUser: false }]);
        setIsTyping(false);
      }, 800);
    }, 0);
  }, [language, noAnswer, commonQuestions, fallbackSuffix]);

  return {
    messages,
    input,
    setInput,
    isTyping,
    handleSend,
    sendMessage,
  };
}
