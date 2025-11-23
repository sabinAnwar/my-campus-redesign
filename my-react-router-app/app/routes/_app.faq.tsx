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
  Terminal,
} from "lucide-react";

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

const FEATURE_CARDS = [
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Sofortige Antworten",
    body: "Verifizierte Antworten in Echtzeit.",
    color: "blue",
    delay: "0s",
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: "Intelligent",
    body: "KI-gestütztes IU-Wissen.",
    color: "violet",
    delay: "0.1s",
  },
  {
    icon: <Globe className="h-5 w-5" />,
    title: "Umfassend",
    body: "Von Bewerbung bis Abschluss.",
    color: "emerald",
    delay: "0.2s",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "24/7 Support",
    body: "Rund um die Uhr für dich da.",
    color: "amber",
    delay: "0.3s",
  },
];

const SUGGESTIONS = [
  {
    text: "IU Mail einrichten",
    question: "Wie nutze ich meine IU E-Mail-Adresse?",
  },
  {
    text: "Prüfung wiederholen",
    question: "Wie oft kann ich eine Prüfung wiederholen?",
  },
  {
    text: "Erasmus Programm",
    question: "Ist die IU Teil des Erasmus-Programms?",
  },
  {
    text: "Praxisbericht",
    question: "Wie reiche ich meinen Praxisbericht ein?",
  },
];

const BackgroundGradient = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-50 dark:bg-black transition-colors duration-500">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 dark:to-transparent blur-3xl" />
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-violet-100/40 dark:bg-violet-900/10 blur-[100px] rounded-full" />
    <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-cyan-100/40 dark:bg-cyan-900/10 blur-[80px] rounded-full" />
  </div>
);

const CARD_COLORS = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border-t-blue-500",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400 border-t-violet-500",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border-t-emerald-500",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border-t-amber-500",
};

const HomePage = ({ onNavigate }) => (
  <section className="relative flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
    <div className="relative z-10 max-w-3xl space-y-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/50 px-4 py-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
        <Sparkles className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
        <span className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-300">
          IU AI Assistant 2.0
        </span>
      </div>

      <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white md:text-7xl">
        Dein Studium. <br />
        <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400">
          Einfach erklärt.
        </span>
      </h1>

      <p className="mx-auto max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
        Der intelligente Begleiter für deinen Studienerfolg. Stelle Fragen zu Organisation, Prüfungen und Campusleben.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={() => onNavigate("chat")}
          className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/30 dark:bg-white dark:text-slate-900 dark:shadow-blue-500/10"
        >
          Chat starten
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURE_CARDS.map((card, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-[#09090b] border-t-4 ${CARD_COLORS[card.color].split(' ').pop()}`}
            style={{ animationDelay: card.delay }}
          >
            <div className={`mb-3 inline-flex rounded-lg p-2.5 ${CARD_COLORS[card.color].replace(/border-t-\w+-\d+/, '')}`}>
              {card.icon}
            </div>
            <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">
              {card.title}
            </h3>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {card.body}
            </p>
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
    <rect width="100" height="100" rx="24" fill="black" />
    <text
      x="50"
      y="75"
      fontFamily="Inter, sans-serif"
      fontSize="65"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
    >
      IU
    </text>
  </svg>
);

const ChatPage = ({ onNavigate, faqs }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hallo! Ich bin dein IU Assistant. Wie kann ich dir heute helfen?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const findAnswer = useCallback(
    (question) => {
      const normalizedQuestion = question.toLowerCase().trim();
      for (const faq of faqs) {
        if (faq.question.toLowerCase() === normalizedQuestion) {
          return faq.answer;
        }
      }

      for (const faq of faqs) {
        const faqQuestion = faq.question.toLowerCase();
        if (
          normalizedQuestion.includes(faqQuestion) ||
          faqQuestion.includes(normalizedQuestion)
        ) {
          return faq.answer;
        }
      }

      for (const faq of faqs) {
        if (faq.keywords) {
          try {
            const keywords = JSON.parse(faq.keywords);
            if (
              keywords.some((keyword) =>
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

      return "Entschuldigung, dazu habe ich keine Informationen gefunden. Bitte versuche es anders zu formulieren oder wende dich an den Support.";
    },
    [faqs]
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
        text: "Hallo! Ich bin dein IU Assistant. Wie kann ich dir heute helfen?",
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
    <section className="relative mx-auto flex h-[85vh] max-w-5xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#09090b] dark:text-white">
      {/* News-style Top Border Line - Blue to Yellow/Orange */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-amber-500" />
      
      {/* Header */}
      <header className="relative z-30 flex shrink-0 flex-col gap-6 border-b border-slate-100 bg-white px-6 py-5 dark:border-white/10 dark:bg-[#09090b] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 min-h-[3.5rem] min-w-[3.5rem] shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5">
             <IULogo className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              IU Assistant
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Faculty of Artificial Intelligence
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate("home")}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
          >
            Beenden
          </button>
          <button
            onClick={handleClear}
            className="rounded-lg bg-slate-100 px-3 py-2 text-slate-500 hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
            title="Chat neu starten"
          >
            <RefreshCcw className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="relative z-20 flex-1 space-y-6 overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
        {messages.map((msg, idx) => (
          <div
            key={`${msg.text}-${idx}`}
            className={`flex w-full gap-4 ${msg.isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <div
              className={`flex h-12 w-12 min-h-[3rem] min-w-[3rem] shrink-0 items-center justify-center rounded-2xl ${
                msg.isUser
                  ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                  : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
              }`}
            >
              {msg.isUser ? (
                 <span className="text-sm font-black">DU</span>
              ) : (
                <IULogo className="h-9 w-9" />
              )}
            </div>
            
            <div className={`flex max-w-[85%] flex-col ${msg.isUser ? "items-end" : "items-start"}`}>
              <div
                className={`relative rounded-xl px-5 py-3 text-sm font-medium leading-relaxed ${
                  msg.isUser
                    ? "bg-slate-900 text-white dark:bg-white dark:text-black"
                    : "bg-slate-50 text-slate-700 dark:bg-white/5 dark:text-slate-200"
                }`}
              >
                {msg.text}
              </div>
              <span className="mt-1 px-1 text-[10px] text-slate-400">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex w-full gap-4 animate-in fade-in slide-in-from-bottom-2">
             <div className="flex h-12 w-12 min-h-[3rem] min-w-[3rem] shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/10">
                <IULogo className="h-9 w-9" />
             </div>
             <div className="flex items-center gap-1.5 rounded-xl bg-slate-50 px-4 py-3 dark:bg-white/5">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></div>
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></div>
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-30 border-t border-slate-100 bg-white p-6 dark:border-white/10 dark:bg-[#09090b]">
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug.text}
              onClick={() => handleSuggestion(sug.question)}
              className="group flex items-center gap-2 whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 transition-all hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-blue-400 dark:hover:text-blue-400"
            >
              {sug.text}
            </button>
          ))}
        </div>
        
        <div className="relative flex items-end gap-3">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Frag deinen IU Assistant..."
              rows={1}
              className="max-h-32 min-h-[3rem] w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-slate-500 dark:focus:border-blue-400"
              style={{ height: 'auto', minHeight: '3rem' }}
              onInput={(e) => {
                e.currentTarget.style.height = 'auto';
                e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
              }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="group mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default function FAQRoute() {
  const { faqs } = useLoaderData();
  const [currentPage, setCurrentPage] = useState("home");

  const navigate = (page) => setCurrentPage(page);

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">
      <BackgroundGradient />
      {/* Reduced padding from p-4 md:p-8 to p-2 md:p-4 to minimize space */}
      <div className="relative z-10 p-2 md:p-4">
        {currentPage === "home" && <HomePage onNavigate={navigate} />}
        {currentPage === "chat" && (
          <ChatPage onNavigate={navigate} faqs={faqs} />
        )}
      </div>
    </div>
  );
}
