import React, { useRef, useEffect } from "react";
import { Brain, Send } from "lucide-react";

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
              <span className="text-iu-blue">•</span>
              <span>{typeof content === 'string' ? content.replace(/^[•-]\s*/, '') : content}</span>
            </div>
          );
        }

        // Numbered
        if (/^\d+\.\s/.test(line.trim())) {
          const num = line.match(/^(\d+)\./)?.[1];
          return (
            <div key={i} className="flex items-start gap-2 ml-2">
              <span className="text-iu-blue font-semibold">{num}.</span>
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
  t: any;
}

export function ChatPanel({
  messages,
  input,
  setInput,
  isTyping,
  onSend,
  t,
}: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="rounded-[2rem] border border-border bg-card/60 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="h-1.5 bg-gradient-to-r from-iu-blue via-iu-purple to-iu-pink" />
      <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-iu-blue to-iu-purple flex items-center justify-center shadow-lg shadow-iu-blue/20">
              <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-iu-blue rounded-full border-2 border-card animate-pulse" />
          </div>
          <div>
            <h3 className="font-black text-foreground">Lern-KI</h3>
            <p className="text-xs text-iu-blue font-bold">Online</p>
          </div>
        </div>

      </div>

      {/* Messages */}
      <div className="h-[400px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-muted/20">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${
              msg.isUser
                ? 'bg-foreground'
                : 'bg-gradient-to-br from-iu-blue to-iu-purple shadow-lg shadow-iu-blue/20'
            }`}>
              {msg.isUser ? (
                <span className="text-xs font-black text-background">DU</span>
              ) : (
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              )}
            </div>
            <div className={`max-w-[80%] ${msg.isUser ? '' : 'group'}`}>
              <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${
                msg.isUser
                  ? 'bg-foreground text-background'
                  : 'bg-card text-foreground shadow-sm border border-border'
              }`}
                role="article"
                aria-label={msg.isUser ? 'Deine Nachricht' : 'Antwort vom Lernassistenten'}
              >
                {msg.isUser ? msg.text : <SimpleMarkdown text={msg.text} />}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-iu-blue to-iu-purple flex items-center justify-center shadow-lg shadow-iu-blue/20">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="bg-card rounded-2xl px-4 py-3 border border-border">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-iu-blue rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-iu-blue rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-iu-blue rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 sm:p-6 border-t border-border bg-card">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend()}
            placeholder={t.placeholder}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-muted text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-iu-blue/50 font-medium"
          />
          <button
            onClick={onSend}
            disabled={!input.trim()}
            className="px-4 py-3 rounded-xl bg-iu-blue text-white font-black hover:bg-iu-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-iu-blue/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
