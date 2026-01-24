import { ArrowLeft, CheckCircle, Send, User } from "lucide-react";
import React from "react";

interface NewTopicModalProps {
  language: string;
  showModal: boolean;
  newTopicTitle: string;
  newTopicContent: string;
  onClose: () => void;
  onTitleChange: (val: string) => void;
  onContentChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function NewTopicModal({
  language,
  showModal,
  newTopicTitle,
  newTopicContent,
  onClose,
  onTitleChange,
  onContentChange,
  onSubmit,
}: NewTopicModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-xl flex items-center justify-center z-[100] animate-in fade-in duration-300 sm:p-4 p-0">
      <div className="bg-card/90 backdrop-blur-2xl sm:rounded-[2rem] rounded-none shadow-2xl sm:p-10 p-6 w-full max-w-2xl relative animate-in zoom-in-95 duration-300 border border-border/50 overflow-hidden sm:max-h-[90vh] max-h-screen h-full sm:h-auto overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-iu-blue/10 rounded-full blur-3xl -mr-16 sm:-mr-32 -mt-16 sm:-mt-32" />

        <div className="relative flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
          <button
            onClick={onClose}
            className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-muted/20 hover:bg-muted/40 transition-colors shrink-0"
          >
            <ArrowLeft size={20} className="sm:hidden" />
            <ArrowLeft size={24} className="hidden sm:block" />
          </button>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {language === "de"
                ? "Neue Diskussion starten"
                : "Start New Discussion"}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground font-medium mt-1">
              {language === "de"
                ? "Teile deine Fragen oder Gedanken mit dem Kurs."
                : "Share your questions or thoughts with the course."}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-sm font-black text-muted-foreground uppercase tracking-widest pl-2">
              {language === "de" ? "Titel" : "Title"}
            </label>
            <input
              type="text"
              required
              value={newTopicTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/50 focus:border-iu-blue/50 focus:bg-card focus:ring-4 focus:ring-iu-blue/5 transition-all text-base sm:text-lg font-bold"
              placeholder={
                language === "de"
                  ? "Worum geht es?"
                  : "What is this about?"
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-muted-foreground uppercase tracking-widest pl-2">
              {language === "de" ? "Inhalt" : "Content"}
            </label>
            <div className="relative">
              <div className="absolute left-4 sm:left-6 top-4 sm:top-6 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-muted/50 text-muted-foreground">
                <User size={18} className="sm:hidden" />
                <User size={20} className="hidden sm:block" />
              </div>
              <textarea
                required
                value={newTopicContent}
                onChange={(e) => onContentChange(e.target.value)}
                className="w-full pl-16 sm:pl-20 pr-5 sm:pr-6 py-4 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] bg-muted/30 border border-border/50 focus:border-iu-blue/50 focus:bg-card focus:ring-4 focus:ring-iu-blue/5 transition-all min-h-[150px] sm:min-h-[200px] resize-none text-base sm:text-lg font-medium leading-relaxed"
                placeholder={
                  language === "de"
                    ? "Schreibe deinen Beitrag..."
                    : "Write your post..."
                }
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={!newTopicTitle.trim() || !newTopicContent.trim()}
              className="w-full sm:w-auto px-10 py-3.5 sm:py-4 bg-iu-blue text-white font-black rounded-xl sm:rounded-2xl hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Send size={20} className="fill-current" />
              {language === "de" ? "Veröffentlichen" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
