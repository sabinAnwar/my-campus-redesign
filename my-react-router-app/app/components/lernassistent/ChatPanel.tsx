import React, { useRef, useEffect } from "react";
import { Brain, Send, Volume2, VolumeX } from "lucide-react";

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

interface ChatMessage {
  text: string;
  isUser: boolean;
}

interface ChatPanelProps {
  messages: ChatMessage[];
  input: string;
  setInput: (val: string) => void;
  isTyping: boolean;
  onSend: () => void;
  screenReaderEnabled: boolean;
  isSpeaking: boolean;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  onToggleScreenReader: () => void;
  onStopSpeaking: () => void;
  onSpeakText: (text: string) => void;
  t: any;
}

export function ChatPanel({
  messages,
  input,
  setInput,
  isTyping,
  onSend,
  screenReaderEnabled,
  isSpeaking,
  speechRate,
  setSpeechRate,
  onToggleScreenReader,
  onStopSpeaking,
  onSpeakText,
  t,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xl">
      {/* Chat Header */}
      <div className="h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500" />
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-iu-blue rounded-full border-2 border-white dark:border-slate-900" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 dark:text-white">Lern-KI</h3>
            <p className="text-xs text-iu-blue dark:text-iu-blue">Online</p>
          </div>
        </div>

        {/* Screen Reader Controls */}
        <div className="flex items-center gap-2">
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

          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors"
              aria-label="Vorlesen stoppen"
              title="Stoppen"
            >
              <VolumeX className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onToggleScreenReader}
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
              {!msg.isUser && (
                <button
                  onClick={() => onSpeakText(msg.text)}
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
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder={t.placeholder}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          />
          <button
            onClick={onSend}
            disabled={!input.trim()}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
