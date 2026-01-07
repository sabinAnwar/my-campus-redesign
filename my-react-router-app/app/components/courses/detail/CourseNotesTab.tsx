interface CourseNotesTabProps {
  language: string;
}

export function CourseNotesTab({ language }: CourseNotesTabProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
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
