import React, { useState, useCallback } from "react";
import { RefreshCcw, Send } from "lucide-react";
import { SimpleMarkdown } from "./SimpleMarkdown";
import { KNOWLEDGE_BASE, findBestAnswer } from "~/data/chatbotKnowledge";

interface ChatInterfaceProps {
  onNavigate: (page: string) => void;
  faqs: any[];
  t: any;
}

export function ChatInterface({ onNavigate, faqs, t }: ChatInterfaceProps) {
  const [messages, setMessages] = useState([
    {
      text: t.greeting,
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const findAnswer = useCallback(
    (question: string) => {
      const knowledgeMatch = findBestAnswer(question, KNOWLEDGE_BASE);
      if (knowledgeMatch) return knowledgeMatch.answer;

      const normalizedQuestion = question.toLowerCase().trim();

      for (const faq of faqs) {
        if (faq.question.toLowerCase() === normalizedQuestion) return faq.answer;
      }

      for (const faq of faqs) {
        const faqQuestion = faq.question.toLowerCase();
        if (normalizedQuestion.includes(faqQuestion) || faqQuestion.includes(normalizedQuestion)) {
          return faq.answer;
        }
      }

      for (const faq of faqs) {
        if (faq.keywords) {
          try {
            const keywords = JSON.parse(faq.keywords);
            if (keywords.some((keyword: string) => normalizedQuestion.includes(keyword.toLowerCase()))) {
              return faq.answer;
            }
          } catch (error) {}
        }
      }

      return t.noAnswer;
    },
    [faqs, t.noAnswer]
  );

  const sendMessage = useCallback(
    (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { text: trimmed, isUser: true }]);
      setIsTyping(true);

      setTimeout(() => {
        const answer = findAnswer(trimmed);
        setMessages((prev) => [...prev, { text: answer, isUser: false }]);
        setIsTyping(false);
      }, 800);
    },
    [findAnswer]
  );

  const handleSend = () => {
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleSuggestion = (question: string) => {
    setInputValue("");
    sendMessage(question);
  };

  const handleClear = () => {
    setMessages([{ text: t.greeting, isUser: false }]);
    setInputValue("");
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="relative mx-2 sm:mx-auto flex min-h-[500px] sm:min-h-[600px] max-w-5xl flex-col rounded-xl sm:rounded-[2rem] border border-border bg-card/60 shadow-xl text-foreground backdrop-blur-xl">
      <div className="h-1 w-full bg-gradient-to-r from-iu-blue via-iu-purple to-iu-pink flex-shrink-0" />

      <header className="relative z-30 flex shrink-0 flex-col gap-3 sm:gap-6 border-b border-border bg-background/40 px-3 sm:px-8 py-3 sm:py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="relative flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-iu-blue shadow-lg shadow-iu-blue/20 transition-transform hover:scale-110">
            <span className="text-base sm:text-xl font-bold text-white">IU</span>
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-bold tracking-tight text-foreground">IU Assistant</h2>
            <p className="text-[8px] sm:text-[10px] font-bold text-iu-blue dark:text-white uppercase tracking-[0.2em] sm:tracking-[0.3em]">AI Learning Partner</p>
          </div>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button onClick={() => onNavigate("home")} className="rounded-lg sm:rounded-xl border border-border px-3 sm:px-6 py-1.5 sm:py-2.5 text-xs font-bold text-muted-foreground hover:bg-card hover:text-foreground transition-all active:scale-95 shadow">Beenden</button>
          <button onClick={handleClear} className="rounded-lg sm:rounded-xl bg-iu-blue/10 dark:bg-iu-blue border border-iu-blue/20 dark:border-iu-blue p-1.5 sm:p-2.5 text-iu-blue dark:text-white hover:bg-iu-blue hover:text-white transition-all active:scale-95 shadow" title="Chat neu starten">
            <RefreshCcw className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </header>

      <div className="relative z-20 p-3 sm:p-8 space-y-4 sm:space-y-8">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex w-full gap-2 sm:gap-4 ${msg.isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className={`flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl shadow-lg transition-transform hover:scale-110 ${msg.isUser ? "bg-foreground text-background" : "bg-iu-blue text-white"}`}>
              {msg.isUser ? <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wide">DU</span> : <span className="text-sm sm:text-lg font-bold">IU</span>}
            </div>
            <div className={`flex max-w-[85%] sm:max-w-[80%] flex-col ${msg.isUser ? "items-end" : "items-start"}`}>
              <div className={`relative rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium leading-relaxed shadow-lg ${msg.isUser ? "bg-foreground text-background" : "bg-card border border-border text-foreground"}`}>
                {msg.isUser ? msg.text : <SimpleMarkdown text={msg.text} />}
              </div>
              <span className="mt-1.5 sm:mt-2 px-2 text-[8px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wide opacity-50">
                {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex w-full gap-2 sm:gap-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex h-8 w-8 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-iu-blue text-white shadow-lg">
              <span className="text-sm sm:text-lg font-bold">IU</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-card px-4 sm:px-6 py-3 sm:py-4 border border-border shadow">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-iu-blue dark:bg-white [animation-delay:-0.3s]"></div>
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-iu-blue dark:bg-white [animation-delay:-0.15s]"></div>
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-iu-blue dark:bg-white"></div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-30 flex-shrink-0 border-t border-border bg-background/60 p-3 sm:p-6 backdrop-blur-xl sticky bottom-0">
        <div className="mb-3 sm:mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {t.suggestions.map((sug: any) => (
            <button key={sug.text} onClick={() => handleSuggestion(sug.question)} className="group flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-full border border-border bg-card px-3 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-xs font-bold text-muted-foreground transition-all hover:border-iu-blue dark:hover:border-white hover:text-iu-blue dark:hover:text-foreground dark:text-white hover:bg-iu-blue/5 shadow">
              {sug.text}
            </button>
          ))}
        </div>

        <div className="relative flex items-end gap-2 sm:gap-4">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t.placeholder}
              rows={1}
              className="min-h-[2.5rem] sm:min-h-[3.5rem] w-full resize-none rounded-lg sm:rounded-xl border border-border bg-background/50 px-3 sm:px-5 py-2.5 sm:py-3.5 text-sm font-medium text-foreground focus:border-iu-blue focus:outline-none focus:ring-2 focus:ring-iu-blue/10 transition-all font-bold overflow-hidden"
              style={{ height: "auto" }}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
              }}
            />
          </div>
          <button onClick={handleSend} disabled={!inputValue.trim()} className="group mb-0.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-foreground text-background transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg active:scale-95">
            <Send className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
