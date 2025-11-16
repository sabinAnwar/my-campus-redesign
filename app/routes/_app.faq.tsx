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
    icon: "⚡",
    title: "Sofortige Antworten",
    body: "Erhalte verifizierte Antworten in wenigen Sekunden.",
    accent: "from-cyan-400/60 to-blue-500/60",
  },
  {
    icon: "🧠",
    title: "Intelligent",
    body: "KI-gestützter Assistent mit IU-spezifischem Wissen.",
    accent: "from-violet-400/50 to-fuchsia-500/60",
  },
  {
    icon: "📚",
    title: "Umfassend",
    body: "Alle Themen von Bewerbungen bis Notenverwaltung.",
    accent: "from-emerald-400/60 to-lime-500/60",
  },
  {
    icon: "🛟",
    title: "24/7 Support",
    body: "Stelle jederzeit Fragen und erhalte Hilfe.",
    accent: "from-amber-400/60 to-orange-500/60",
  },
];

const SUGGESTIONS = [
  {
    text: "📧 IU Mail einrichten",
    question: "Wie nutze ich meine IU E-Mail-Adresse?",
  },
  {
    text: "📝 Prüfung wiederholen",
    question: "Wie oft kann ich eine Prüfung wiederholen?",
  },
  {
    text: "🌍 Erasmus Programm",
    question: "Ist die IU Teil des Erasmus-Programms?",
  },
  {
    text: "💼 Praxisbericht",
    question: "Wie reiche ich meinen Praxisbericht ein?",
  },
];

const HomePage = ({ onNavigate }) => (
  <section className="rounded-[32px] border border-white/30 bg-gradient-to-br from-slate-900 via-slate-900/80 to-slate-950 text-white shadow-2xl shadow-cyan-500/20 dark:border-slate-800/60">
    <div className="grid gap-10 p-8 md:p-12 lg:grid-cols-2 lg:gap-16">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100">
          <Sparkles className="h-4 w-4" />
          IU FAQ
        </div>
        <h1 className="text-4xl font-black leading-tight md:text-5xl">
          IU AI FAQ Assistent
        </h1>
        <p className="text-lg text-slate-200">
          Dein smarter Begleiter für Studienorganisation, Prüfungen, Campusleben
          und mehr. Stelle deine Fragen und erhalte sofortige Unterstützung.
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate("chat")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-slate-900 shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5"
          >
            Chat starten
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => window.open("mailto:support@iu.org", "_blank")}
            className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Support kontaktieren
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {FEATURE_CARDS.map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-lg transition hover:-translate-y-1 hover:bg-white/10"
          >
            <div
              className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-2xl`}
            >
              {card.icon}
            </div>
            <h3 className="mt-4 text-lg font-bold">{card.title}</h3>
            <p className="text-sm text-slate-200">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ChatPage = ({ onNavigate, faqs }) => {
  const [messages, setMessages] = useState([
    {
      text: "Hallo! ✨ Ich bin dein IU FAQ Assistent. Wobei kann ich dir helfen?",
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
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

      return "Entschuldigung, ich habe keine passende Antwort gefunden. Bitte versuche es anders zu formulieren oder schreibe an support@iu.org.";
    },
    [faqs]
  );

  const sendMessage = useCallback(
    (question) => {
      const trimmed = question.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { text: trimmed, isUser: true }]);
      setTimeout(() => {
        const answer = findAnswer(trimmed);
        setMessages((prev) => [...prev, { text: answer, isUser: false }]);
      }, 500);
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
        text: "Hallo! ✨ Ich bin dein IU FAQ Assistent. Wobei kann ich dir helfen?",
        isUser: false,
      },
    ]);
    setInputValue("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="rounded-[32px] border border-white/50 bg-white/90 shadow-2xl shadow-slate-200/70 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80 dark:shadow-cyan-500/10">
      <header className="flex flex-col gap-4 border-b border-slate-100/80 px-6 py-6 dark:border-slate-800/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
              IU FAQ Assistant
            </p>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Chat
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate("home")}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/70"
            >
              Übersicht
            </button>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/25 transition hover:-translate-y-0.5"
            >
              <RefreshCcw className="h-4 w-4" />
              Neu starten
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug.text}
              onClick={() => handleSuggestion(sug.question)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-400 hover:text-cyan-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-cyan-400 dark:hover:text-cyan-300"
            >
              {sug.text}
            </button>
          ))}
        </div>
      </header>

      <div className="h-[420px] space-y-4 overflow-y-auto px-6 py-6">
        {messages.map((msg, idx) => (
          <div
            key={`${msg.text}-${idx}`}
            className={`flex gap-3 ${msg.isUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xl shadow-lg ${
                msg.isUser
                  ? "border-orange-300/60 bg-gradient-to-br from-orange-400 to-pink-500 text-white"
                  : "border-slate-200/80 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              }`}
            >
              {msg.isUser ? "🧑‍🎓" : "✨"}
            </div>
            <div
              className={`max-w-[70%] rounded-3xl px-5 py-3 text-sm leading-relaxed shadow-lg ${
                msg.isUser
                  ? "bg-slate-900 text-white dark:bg-slate-900/80"
                  : "border border-slate-200/70 bg-white text-slate-800 dark:border-slate-800/60 dark:bg-slate-900/70 dark:text-slate-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="space-y-4 border-t border-slate-100/80 px-6 py-6 dark:border-slate-800/70">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Stelle deine Frage ..."
            className="flex-1 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-inner focus:border-cyan-400 focus:outline-none dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-50"
          />
          <button
            onClick={handleSend}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-orange-500 px-6 py-3 text-sm font-black uppercase tracking-[0.3em] text-white shadow-lg shadow-cyan-500/30 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!inputValue.trim()}
          >
            Senden
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tipp: Je präziser deine Frage gestellt ist, desto schneller findet der
          Assistent eine passende Antwort.
        </p>
      </footer>
    </section>
  );
};

export default function FAQRoute() {
  const { faqs } = useLoaderData();
  const [currentPage, setCurrentPage] = useState("chat");

  const navigate = (page) => setCurrentPage(page);

  return (
  
      <div className="space-y-8">
        {currentPage === "home" && <HomePage onNavigate={navigate} />}
        {currentPage === "chat" && (
          <ChatPage onNavigate={navigate} faqs={faqs} />
        )}
      </div>
   
  );
}
