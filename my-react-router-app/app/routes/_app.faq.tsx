import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import { useLoaderData } from "react-router-dom";
import { prisma } from "../lib/prisma";
import {
  MessageCircle,
  RefreshCcw,
  ArrowRight,
  Sparkles,
  Send,
  Cpu,
  Zap,
  Globe,
  Shield,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { KNOWLEDGE_BASE, findBestAnswer, getQuickSuggestions } from "~/data/chatbotKnowledge";
import { CARD_COLORS, TEXT } from "~/constants/faq";

// Icon mapping for dynamic rendering
const ICON_MAP = {
  Zap,
  Cpu,
  Globe,
  Shield,
};

export const loader = async () => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { category: "asc" },
    });
    return { faqs };
  } catch (error) {
    console.error("Error loading FAQs:", error);
    return { faqs: [] };
  }
};

const BackgroundGradient = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-transparent transition-colors duration-500">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-iu-blue/20 to-transparent blur-[120px]" />
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-iu-pink/10 blur-[150px] rounded-full" />
    <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-iu-blue/10 blur-[100px] rounded-full" />
  </div>
);

// Helper function to get features with icons
const getFeatures = (lang: "de" | "en") => {
  return TEXT[lang].features.map((feature) => {
    const IconComponent = ICON_MAP[feature.iconName as keyof typeof ICON_MAP];
    return {
      ...feature,
      icon: IconComponent ? <IconComponent className="h-5 w-5" /> : null,
    };
  });
};

const HomePage = ({ onNavigate, t, features }) => (
  <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-6 py-20 text-center">
    <div className="relative z-10 max-w-4xl space-y-12">
      <div className="inline-flex items-center gap-3 rounded-full border border-iu-blue/20 bg-iu-blue/10 px-8 py-3 shadow-2xl backdrop-blur-xl">
        <Sparkles className="h-5 w-5 text-iu-blue animate-pulse" />
        <span className="text-[10px] font-black tracking-[0.4em] text-iu-blue uppercase">
          IU AI Assistant 2.0
        </span>
      </div>

      <h1 className="text-6xl font-bold tracking-tight text-foreground md:text-8xl leading-tight">
        {t.heroLine1} <br />
        <span className="bg-gradient-to-r from-iu-blue via-iu-purple to-iu-pink bg-clip-text text-transparent">
          {t.heroLine2}
        </span>
      </h1>

      <p className="mx-auto max-w-2xl text-xl leading-relaxed text-muted-foreground font-medium">
        {t.heroSubtitle}
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        <button
          onClick={() => onNavigate("chat")}
          className="group relative inline-flex items-center gap-4 rounded-[2rem] bg-foreground px-12 py-6 text-lg font-bold text-background shadow-2xl transition-all hover:-translate-y-1 hover:opacity-90 active:scale-95"
        >
          {t.chatCta}
          <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-2" />
        </button>
      </div>

      <div className="grid gap-6 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((card, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card/60 p-8 text-left shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-card backdrop-blur-xl"
            style={{ animationDelay: card.delay }}
          >
            {/* Hover background effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-iu-blue/5 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <div className="mb-6 inline-flex rounded-2xl p-4 bg-iu-blue/10 text-iu-blue group-hover:bg-iu-blue group-hover:text-white transition-all duration-500 shadow-lg">
                {card.icon}
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground tracking-tight">
                {card.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                {card.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const IULogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="100" height="100" rx="0" fill="#245eeb" />
    <text
      x="50"
      y="75"
      fontFamily="Source Sans Pro, sans-serif"
      fontSize="65"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
    >
      IU
    </text>
  </svg>
);

// Simple Markdown renderer for chat messages
const SimpleMarkdown = ({ text }: { text: string }) => {
  // Convert markdown to HTML-safe JSX
  const renderMarkdown = (input: string) => {
    const lines = input.split("\n");

    return lines.map((line, lineIndex) => {
      // Process the line for inline formatting
      let processed: (string | JSX.Element)[] = [line];

      // Bold: **text**
      processed = processed.flatMap((part, i) => {
        if (typeof part !== "string") return part;
        const segments: (string | JSX.Element)[] = [];
        const regex = /\*\*(.+?)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(part)) !== null) {
          if (match.index > lastIndex) {
            segments.push(part.slice(lastIndex, match.index));
          }
          segments.push(
            <strong
              key={`bold-${lineIndex}-${i}-${match.index}`}
              className="font-bold text-iu-blue"
            >
              {match[1]}
            </strong>
          );
          lastIndex = regex.lastIndex;
        }

        if (lastIndex < part.length) {
          segments.push(part.slice(lastIndex));
        }

        return segments.length > 0 ? segments : [part];
      });

      // Check if line is a list item
      const isBullet =
        line.trim().startsWith("- ") || line.trim().startsWith("• ");
      const isNumbered = /^\d+\.\s/.test(line.trim());
      const isEmoji =
        /^[📅📝🔄📊🏥📆🎯📄📚📧📖🏫🪪💰🌍📞🧠👋✅❌⚠️💡🎥🗂️💪💰💵]/.test(
          line.trim()
        );

      if (isBullet) {
        return (
          <div key={lineIndex} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="text-iu-blue font-bold">•</span>
            <span className="font-bold">
              {processed
                .slice(0)
                .map((p, i) =>
                  typeof p === "string" ? p.replace(/^[-•]\s*/, "") : p
                )}
            </span>
          </div>
        );
      }

      if (isNumbered) {
        const num = line.trim().match(/^(\d+)\./)?.[1];
        return (
          <div key={lineIndex} className="flex items-start gap-2 ml-2 my-0.5">
            <span className="text-iu-blue font-bold">{num}.</span>
            <span className="font-bold">
              {processed.map((p, i) =>
                typeof p === "string" ? p.replace(/^\d+\.\s*/, "") : p
              )}
            </span>
          </div>
        );
      }

      if (line.trim() === "") {
        return <div key={lineIndex} className="h-2" />;
      }

      return (
        <div
          key={lineIndex}
          className={isEmoji ? "mt-3 first:mt-0 font-bold" : "font-bold"}
        >
          {processed}
        </div>
      );
    });
  };

  return <div className="space-y-0.5">{renderMarkdown(text)}</div>;
};

const ChatPage = ({ onNavigate, faqs, t }) => {
  const [messages, setMessages] = useState([
    {
      text: t.greeting,
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Improved findAnswer function using the knowledge base
  const findAnswer = useCallback(
    (question: string) => {
      // First, try the knowledge base (pre-trained data)
      const knowledgeMatch = findBestAnswer(question, KNOWLEDGE_BASE);
      if (knowledgeMatch) {
        return knowledgeMatch.answer;
      }

      // Fallback: Check database FAQs
      const normalizedQuestion = question.toLowerCase().trim();

      // Exact match
      for (const faq of faqs) {
        if (faq.question.toLowerCase() === normalizedQuestion) {
          return faq.answer;
        }
      }

      // Partial match
      for (const faq of faqs) {
        const faqQuestion = faq.question.toLowerCase();
        if (
          normalizedQuestion.includes(faqQuestion) ||
          faqQuestion.includes(normalizedQuestion)
        ) {
          return faq.answer;
        }
      }

      // Keyword match from DB
      for (const faq of faqs) {
        if (faq.keywords) {
          try {
            const keywords = JSON.parse(faq.keywords);
            if (
              keywords.some((keyword: string) =>
                normalizedQuestion.includes(keyword.toLowerCase())
              )
            ) {
              return faq.answer;
            }
          } catch (error) {
            console.error("Invalid keywords JSON:", error);
          }
        }
      }

      return t.noAnswer;
    },
    [faqs, t.noAnswer]
  );

  const sendMessage = useCallback(
    (question) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { text: trimmed, isUser: true }]);
      setIsTyping(true);

      // Simulate network delay for more natural feel
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

  const handleSuggestion = (question) => {
    setInputValue("");
    sendMessage(question);
  };

  const handleClear = () => {
    setMessages([
      {
        text: t.greeting,
        isUser: false,
      },
    ]);
    setInputValue("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="relative mx-auto flex h-[88vh] max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-border bg-card/60 shadow-2xl text-foreground backdrop-blur-xl">
      {/* Premium Gradient Top Border */}
      <div className="h-1.5 w-full bg-gradient-to-r from-iu-blue via-iu-purple to-iu-pink" />

      {/* Header */}
      <header className="relative z-30 flex shrink-0 flex-col gap-6 border-b border-border bg-background/40 px-10 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-iu-blue shadow-2xl shadow-iu-blue/20 transition-transform hover:scale-110">
            <span className="text-2xl font-bold text-white">IU</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              IU Assistant
            </h2>
            <p className="text-[10px] font-black text-iu-blue uppercase tracking-[0.4em]">
              AI Learning Partner
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onNavigate("home")}
            className="rounded-2xl border border-border px-8 py-3 text-sm font-bold text-muted-foreground hover:bg-card hover:text-foreground transition-all active:scale-95 shadow-lg"
          >
            Beenden
          </button>
          <button
            onClick={handleClear}
            className="rounded-2xl bg-iu-blue/10 border border-iu-blue/20 p-3 text-iu-blue hover:bg-iu-blue hover:text-white transition-all active:scale-95 shadow-lg"
            title="Chat neu starten"
          >
            <RefreshCcw className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="relative z-20 flex-1 space-y-10 overflow-y-auto p-10 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border">
        {messages.map((msg, idx) => (
          <div
            key={`${msg.text}-${idx}`}
            className={`flex w-full gap-6 ${msg.isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-2xl transition-transform hover:scale-110 ${
                msg.isUser
                  ? "bg-foreground text-background"
                  : "bg-iu-blue text-white"
              }`}
            >
              {msg.isUser ? (
                <span className="text-[10px] font-black uppercase tracking-widest">
                  DU
                </span>
              ) : (
                <span className="text-lg font-bold">IU</span>
              )}
            </div>

            <div
              className={`flex max-w-[80%] flex-col ${msg.isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`relative rounded-[2rem] px-8 py-5 text-lg font-medium leading-relaxed shadow-2xl ${
                  msg.isUser
                    ? "bg-foreground text-background"
                    : "bg-card border border-border text-foreground"
                }`}
              >
                {msg.isUser ? msg.text : <SimpleMarkdown text={msg.text} />}
              </div>
              <span className="mt-3 px-4 text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em] opacity-50">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex w-full gap-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-iu-blue text-white shadow-2xl">
              <span className="text-lg font-bold">IU</span>
            </div>
            <div className="flex items-center gap-2 rounded-[2rem] bg-card px-8 py-5 border border-border shadow-xl">
              <div className="h-2 w-2 animate-bounce rounded-full bg-iu-blue [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-iu-blue [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-iu-blue"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-30 border-t border-border bg-background/60 p-10 backdrop-blur-xl">
        <div className="mb-8 flex gap-4 overflow-x-auto pb-4 scrollbar-none">
          {t.suggestions.map((sug) => (
            <button
              key={sug.text}
              onClick={() => handleSuggestion(sug.question)}
              className="group flex items-center gap-3 whitespace-nowrap rounded-full border border-border bg-card px-6 py-3 text-xs font-bold text-muted-foreground transition-all hover:border-iu-blue hover:text-iu-blue hover:bg-iu-blue/5 shadow-md"
            >
              {sug.text}
            </button>
          ))}
        </div>

        <div className="relative flex items-end gap-6">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder={t.placeholder}
              rows={1}
              className="max-h-40 min-h-[4.5rem] w-full resize-none rounded-[2rem] border border-border bg-background/50 px-8 py-5 text-lg font-medium text-foreground placeholder-muted-foreground focus:border-iu-blue focus:outline-none focus:ring-4 focus:ring-iu-blue/10 transition-all shadow-inner"
              style={{ height: "auto", minHeight: "4.5rem" }}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height =
                  e.currentTarget.scrollHeight + "px";
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="group mb-1 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-foreground text-background transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-2xl active:scale-95"
          >
            <Send className="h-7 w-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default function FAQRoute() {
  const { faqs } = useLoaderData();
  const [currentPage, setCurrentPage] = useState("home");
  const { language } = useLanguage();
  const t = TEXT[language];
  const features = getFeatures(language);

  const navigate = (page) => setCurrentPage(page);

  return (
    <div className="min-h-screen text-foreground">
      <BackgroundGradient />
      {/* Reduced padding from p-4 md:p-8 to p-2 md:p-4 to minimize space */}
      <div className="relative z-10">
        {currentPage === "home" && (
          <HomePage onNavigate={navigate} t={t} features={features} />
        )}
        {currentPage === "chat" && (
          <ChatPage onNavigate={navigate} faqs={faqs} t={t} />
        )}
      </div>
    </div>
  );
}
