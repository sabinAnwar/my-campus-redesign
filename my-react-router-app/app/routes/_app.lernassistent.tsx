import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  Brain,
  BookOpen,
  Sparkles,
  Send,
  Timer,
  Target,
  Lightbulb,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  GraduationCap,
  Zap,
  FileText,
  MessageCircle,
  Coffee,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  CheckCircle2,
  ArrowLeft,
  Clock,
  BarChart3,
  Flame,
  Trophy,
  Star,
} from "lucide-react";

export const loader = async () => null;

// Translations
const TRANSLATIONS = {
  de: {
    title: "KI Lernassistent",
    subtitle: "Dein intelligenter Begleiter für effektives Lernen",
    greeting: "Hallo! 👋 Ich bin dein KI-Lernassistent. Ich helfe dir beim Lernen, erkläre Konzepte und gebe dir Tipps für effektives Studieren. Was möchtest du heute lernen?",
    placeholder: "Frag mich etwas zum Lernen...",
    pomodoroTitle: "Pomodoro Timer",
    focusTime: "Fokuszeit",
    breakTime: "Pause",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    minutes: "min",
    studyTipsTitle: "Lerntipps",
    quickActionsTitle: "Schnellzugriff",
    streakTitle: "Lernstreak",
    days: "Tage",
    todayGoal: "Heutiges Ziel",
    completed: "abgeschlossen",
    resources: "Ressourcen",
    viewCourses: "Kurse öffnen",
    viewLibrary: "Bibliothek",
    viewSchedule: "Stundenplan",
    back: "Zurück",
    studyModes: {
      focus: "Fokus-Modus",
      review: "Wiederholung",
      practice: "Übung",
    },
    tips: [
      { title: "Pomodoro-Technik", desc: "25 Min lernen, 5 Min Pause", icon: "timer" },
      { title: "Aktives Erinnern", desc: "Teste dich selbst regelmäßig", icon: "brain" },
      { title: "Spaced Repetition", desc: "Wiederhole in Intervallen", icon: "repeat" },
      { title: "Feynman-Methode", desc: "Erkläre es einfach", icon: "lightbulb" },
    ],
  },
  en: {
    title: "AI Learning Assistant",
    subtitle: "Your intelligent companion for effective learning",
    greeting: "Hello! 👋 I'm your AI learning assistant. I help you study, explain concepts, and give you tips for effective learning. What would you like to learn today?",
    placeholder: "Ask me something about learning...",
    pomodoroTitle: "Pomodoro Timer",
    focusTime: "Focus Time",
    breakTime: "Break",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    minutes: "min",
    studyTipsTitle: "Study Tips",
    quickActionsTitle: "Quick Access",
    streakTitle: "Learning Streak",
    days: "days",
    todayGoal: "Today's Goal",
    completed: "completed",
    resources: "Resources",
    viewCourses: "Open Courses",
    viewLibrary: "Library",
    viewSchedule: "Schedule",
    back: "Back",
    studyModes: {
      focus: "Focus Mode",
      review: "Review",
      practice: "Practice",
    },
    tips: [
      { title: "Pomodoro Technique", desc: "25 min study, 5 min break", icon: "timer" },
      { title: "Active Recall", desc: "Test yourself regularly", icon: "brain" },
      { title: "Spaced Repetition", desc: "Review at intervals", icon: "repeat" },
      { title: "Feynman Method", desc: "Explain it simply", icon: "lightbulb" },
    ],
  },
};

// AI Learning Knowledge Base
const LEARNING_KNOWLEDGE = [
  {
    keywords: ["pomodoro", "timer", "pause", "konzentration", "fokus"],
    answer: `⏱️ **Die Pomodoro-Technik:**

Die Pomodoro-Technik ist eine bewährte Zeitmanagement-Methode:

**So funktioniert's:**
1. Wähle eine Aufgabe
2. Stelle den Timer auf **25 Minuten**
3. Arbeite konzentriert bis der Timer klingelt
4. Mache eine **5-Minuten-Pause**
5. Nach 4 Pomodoros: längere Pause (15-30 Min)

**Vorteile:**
• 🎯 Bessere Konzentration
• ⚡ Weniger Prokrastination
• 📊 Messbare Fortschritte

Nutze den Timer rechts, um direkt loszulegen! →`
  },
  {
    keywords: ["lernen", "vorbereiten", "tipps", "effektiv", "strategie", "methode"],
    answer: `📚 **Effektive Lernstrategien:**

**Top 5 Lerntechniken:**

1. **Aktives Erinnern (Active Recall)**
   Teste dich selbst, anstatt nur zu lesen
   
2. **Spaced Repetition**
   Wiederhole in immer größeren Abständen
   
3. **Feynman-Methode**
   Erkläre das Thema so einfach wie möglich
   
4. **Mind Mapping**
   Visualisiere Zusammenhänge
   
5. **Interleaving**
   Mische verschiedene Themen beim Lernen

**Mein Tipp:** Starte mit der Pomodoro-Technik und kombiniere sie mit Active Recall!`
  },
  {
    keywords: ["motivation", "keine lust", "prokrastination", "aufschieben", "anfangen"],
    answer: `💪 **Motivation beim Lernen:**

**Wenn du keine Motivation hast:**

1. **2-Minuten-Regel**
   Fang nur 2 Minuten an - der Rest kommt von allein
   
2. **Kleine Ziele setzen**
   "Ich lerne 1 Seite" statt "Ich lerne alles"
   
3. **Belohnungssystem**
   Nach jeder Lerneinheit kleine Belohnung
   
4. **Lernumgebung ändern**
   Neuer Ort = neue Energie
   
5. **Warum erinnern**
   Was ist dein großes Ziel?

**Quick Win:** Starte JETZT einen 25-Min Pomodoro! 🍅`
  },
  {
    keywords: ["prüfung", "klausur", "vorbereitung", "angst", "stress"],
    answer: `📝 **Prüfungsvorbereitung:**

**2 Wochen vor der Prüfung:**
• Erstelle einen Lernplan
• Sammle alle Materialien
• Identifiziere Schwerpunkte

**1 Woche vorher:**
• Aktives Lernen (nicht nur Lesen!)
• Übungsaufgaben lösen
• Lerngruppe nutzen

**1 Tag vorher:**
• Nur leichte Wiederholung
• Früh schlafen gehen
• Materialien bereitlegen

**Am Prüfungstag:**
• Gutes Frühstück
• Früh da sein
• Ruhig atmen

**Bei Prüfungsangst:** 
Atme 4 Sekunden ein, halte 4 Sek., atme 4 Sek. aus 🧘`
  },
  {
    keywords: ["gedächtnis", "merken", "vergessen", "erinnern", "behalten"],
    answer: `🧠 **Besser Merken:**

**Die Vergessenskurve überwinden:**

Nach 1 Tag vergisst du ~70% ohne Wiederholung!

**Strategien:**

1. **Wiederholungsintervalle**
   • Nach 1 Tag
   • Nach 3 Tagen
   • Nach 1 Woche
   • Nach 2 Wochen

2. **Verknüpfungen bilden**
   Verbinde Neues mit Bekanntem

3. **Visualisierung**
   Erstelle mentale Bilder

4. **Storytelling**
   Baue eine Geschichte

5. **Schlaf**
   Im Schlaf wird gelernt! 😴

**Tool-Tipp:** Nutze Anki für Spaced Repetition!`
  },
  {
    keywords: ["konzentration", "ablenkung", "fokus", "handy", "social media"],
    answer: `🎯 **Konzentration verbessern:**

**Ablenkungen eliminieren:**

📱 **Handy:**
• Flugmodus aktivieren
• In anderen Raum legen
• App-Blocker nutzen

💻 **Computer:**
• Unnötige Tabs schließen
• Website-Blocker (z.B. Cold Turkey)
• Vollbild-Modus

🏠 **Umgebung:**
• Aufgeräumter Schreibtisch
• Gute Beleuchtung
• Bequemer Stuhl

**Fokus-Booster:**
• Wasser trinken 💧
• Kurze Bewegung
• Tiefes Atmen

Starte jetzt den Fokus-Timer! →`
  },
  {
    keywords: ["hallo", "hi", "hey", "hilfe", "help"],
    answer: `Hallo! 👋 Schön, dass du hier bist!

**Ich kann dir helfen mit:**

📚 **Lernstrategien**
"Wie lerne ich effektiv?"

⏱️ **Zeitmanagement**
"Erkläre die Pomodoro-Technik"

🎯 **Motivation**
"Ich habe keine Motivation"

📝 **Prüfungsvorbereitung**
"Wie bereite ich mich auf Klausuren vor?"

🧠 **Gedächtnistechniken**
"Wie merke ich mir Dinge besser?"

Was möchtest du wissen?`
  },
];

// Find answer function
function findLearningAnswer(query: string): string | null {
  const normalized = query.toLowerCase();
  
  for (const item of LEARNING_KNOWLEDGE) {
    const matchCount = item.keywords.filter(k => normalized.includes(k)).length;
    if (matchCount >= 1) {
      return item.answer;
    }
  }
  
  return null;
}

// Simple Markdown renderer
const SimpleMarkdown = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        // Bold
        let content: React.ReactNode = line;
        const boldParts = line.split(/\*\*(.+?)\*\*/g);
        if (boldParts.length > 1) {
          content = boldParts.map((part, j) => 
            j % 2 === 1 ? <strong key={j} className="font-bold">{part}</strong> : part
          );
        }
        
        // Bullet
        if (line.trim().startsWith('• ') || line.trim().startsWith('- ')) {
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-primary">•</span>
              <span>{typeof content === 'string' ? content.replace(/^[•-]\s*/, '') : content}</span>
            </div>
          );
        }
        
        // Numbered
        if (/^\d+\.\s/.test(line.trim())) {
          const num = line.match(/^(\d+)\./)?.[1];
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-primary font-semibold">{num}.</span>
              <span>{typeof content === 'string' ? content.replace(/^\d+\.\s*/, '') : content}</span>
            </div>
          );
        }
        
        // Empty line
        if (line.trim() === '') return <div key={i} className="h-2" />;
        
        return <div key={i}>{content}</div>;
      })}
    </div>
  );
};

export default function AILernassistent() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  // Chat state
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: t.greeting, isUser: false }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Pomodoro state
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [pomodorosCompleted, setPomodorosCompleted] = useState(0);
  
  // Streak data (mock)
  const streak = 5;
  const todayMinutes = 45;
  const goalMinutes = 120;
  
  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
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
      // Could play sound here
    }
    
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, isBreak]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { text: input, isUser: true }]);
    setInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      const answer = findLearningAnswer(input) || 
        `Das ist eine interessante Frage! 🤔

Ich bin spezialisiert auf Lernthemen. Frag mich gerne:
• Wie lerne ich effektiv?
• Erkläre die Pomodoro-Technik
• Tipps gegen Prokrastination
• Prüfungsvorbereitung

Oder nutze den Pomodoro-Timer rechts, um direkt loszulegen! →`;
      
      setMessages(prev => [...prev, { text: answer, isUser: false }]);
      setIsTyping(false);
    }, 800);
  };
  
  const resetPomodoro = () => {
    setIsRunning(false);
    setIsBreak(false);
    setPomodoroTime(25 * 60);
  };

  // Screen Reader / Text-to-Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Clean text for speech (remove markdown and emojis)
  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold markers
      .replace(/[📅📝🔄📊🏥📆🎯📄📚📧📖🏫🪪💰🌍📞🧠👋✅❌⚠️💡🎥🗂️💪💵⏱️🍅🤔→•]/g, '') // Remove emojis
      .replace(/[#*_~`]/g, '') // Remove markdown
      .replace(/\n+/g, '. ') // Replace newlines with pauses
      .trim();
  };

  // Speak text function
  const speakText = (text: string) => {
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
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle screen reader
  const toggleScreenReader = () => {
    if (screenReaderEnabled) {
      stopSpeaking();
    }
    setScreenReaderEnabled(!screenReaderEnabled);
  };

  // Auto-read new messages when screen reader is enabled
  useEffect(() => {
    if (screenReaderEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (!lastMessage.isUser) {
        // Small delay to ensure message is rendered
        setTimeout(() => speakText(lastMessage.text), 100);
      }
    }
  }, [messages, screenReaderEnabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.back}
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              {t.title}
              <Sparkles className="w-6 h-6 text-amber-500" />
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Chat */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
            {/* Chat Header */}
            <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">Lern-KI</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Online</p>
                </div>
              </div>
              
              {/* Screen Reader Controls */}
              <div className="flex items-center gap-2">
                {/* Speed Control */}
                {screenReaderEnabled && (
                  <select
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    className="text-xs px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    aria-label="Sprechgeschwindigkeit"
                  >
                    <option value={0.5}>0.5x</option>
                    <option value={0.75}>0.75x</option>
                    <option value={1.0}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                )}
                
                {/* Stop Speaking Button */}
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
                    aria-label="Vorlesen stoppen"
                    title="Stoppen"
                  >
                    <VolumeX className="w-4 h-4" />
                  </button>
                )}
                
                {/* Screen Reader Toggle */}
                <button
                  onClick={toggleScreenReader}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs transition-all ${
                    screenReaderEnabled
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                  aria-label={screenReaderEnabled ? 'Screen Reader deaktivieren' : 'Screen Reader aktivieren'}
                  aria-pressed={screenReaderEnabled}
                  title={screenReaderEnabled ? 'Vorlesen aktiv' : 'Vorlesen aktivieren'}
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline">{screenReaderEnabled ? 'Vorlesen An' : 'Vorlesen'}</span>
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    msg.isUser 
                      ? 'bg-slate-900 dark:bg-white' 
                      : 'bg-gradient-to-br from-violet-500 to-purple-600'
                  }`}>
                    {msg.isUser ? (
                      <span className="text-xs font-bold text-white dark:text-slate-900">DU</span>
                    ) : (
                      <Brain className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className={`max-w-[80%] ${msg.isUser ? '' : 'group'}`}>
                    <div className={`rounded-xl px-4 py-3 text-sm ${
                      msg.isUser
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700'
                    }`}
                      role="article"
                      aria-label={msg.isUser ? 'Deine Nachricht' : 'Antwort vom Lernassistenten'}
                    >
                      {msg.isUser ? msg.text : <SimpleMarkdown text={msg.text} />}
                    </div>
                    {/* Individual message speaker button */}
                    {!msg.isUser && (
                      <button
                        onClick={() => speakText(msg.text)}
                        className="mt-1 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
                        aria-label="Diese Nachricht vorlesen"
                        title="Vorlesen"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Vorlesen</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-100 dark:border-slate-700">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t.placeholder}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Pomodoro Timer */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-lg">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Timer className="w-5 h-5 text-rose-500" />
              {t.pomodoroTitle}
            </h3>
            
            <div className="text-center">
              <div className={`text-5xl font-mono font-bold mb-2 ${
                isBreak ? 'text-emerald-500' : 'text-violet-600 dark:text-violet-400'
              }`}>
                {formatTime(pomodoroTime)}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                {isBreak ? t.breakTime : t.focusTime}
              </p>
              
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                    isRunning
                      ? 'bg-amber-500 hover:bg-amber-600 text-white'
                      : 'bg-violet-600 hover:bg-violet-700 text-white'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4" />
                      {t.pause}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      {t.start}
                    </>
                  )}
                </button>
                <button
                  onClick={resetPomodoro}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              
              {pomodorosCompleted > 0 && (
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  {pomodorosCompleted} Pomodoro{pomodorosCompleted > 1 ? 's' : ''} heute
                </div>
              )}
            </div>
          </div>

          {/* Learning Streak */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                {t.streakTitle}
              </h3>
              <span className="text-2xl font-black text-orange-500">{streak}</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{streak} {t.days} 🔥</p>
            
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{t.todayGoal}</span>
                <span className="text-slate-700 dark:text-slate-300">{todayMinutes}/{goalMinutes} min</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all"
                  style={{ width: `${(todayMinutes / goalMinutes) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Access */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">{t.quickActionsTitle}</h3>
            <div className="space-y-2">
              <Link
                to="/courses"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.viewCourses}</span>
                <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/library"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.viewLibrary}</span>
                <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/courses/schedule"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.viewSchedule}</span>
                <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Study Tips */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              {t.studyTipsTitle}
            </h3>
            <div className="space-y-3">
              {t.tips.map((tip, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={() => {
                    setInput(tip.title);
                    handleSend();
                  }}
                >
                  <p className="font-medium text-sm text-slate-900 dark:text-white">{tip.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
