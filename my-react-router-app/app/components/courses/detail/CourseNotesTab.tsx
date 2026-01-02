interface CourseNotesTabProps {
  language: string;
}

export function CourseNotesTab({ language }: CourseNotesTabProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Minimal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
        <div>
          <h3 className="text-4xl lg:text-5xl font-black text-foreground tracking-tighter mb-3">
            Study Scribe
          </h3>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
            {language === "de"
              ? "Dein KI-gestützter Begleiter für strukturierte Notizen."
              : "Your AI-powered companion for structured note-taking."}
          </p>
        </div>
      </div>

      {/* Premium Iframe Container - Simplified to avoid 3-scrollbars */}
      <div className="relative group">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-iu-blue/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative bg-card/20 backdrop-blur-xl rounded-[2.5rem] border border-border/40 shadow-2xl overflow-hidden">
          <div className="w-full relative overflow-hidden forum-container-height">
            <iframe
              src="https://study-scribe-83.lovable.app/"
              title="Study Scribe"
              className="w-full h-full border-none"
              allow="camera; microphone; clipboard-read; clipboard-write;"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
