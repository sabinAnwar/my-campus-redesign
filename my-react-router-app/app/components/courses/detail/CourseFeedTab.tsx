import { ArrowLeft, Rss } from "lucide-react";

interface CourseFeedTabProps {
  language: string;
}

export function CourseFeedTab({ language }: CourseFeedTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-3xl font-black text-foreground tracking-tight">
            Course Feed
          </h3>
          <p className="text-muted-foreground mt-1 font-medium">
            {language === "de"
              ? "Bleibe auf dem Laufenden mit dem offiziellen Kurs-Feed."
              : "Stay up to date with the official course feed."}
          </p>
        </div>
      </div>

      <div className="rounded-[3rem] border border-border bg-card/50 backdrop-blur-xl p-16 text-center max-w-3xl mx-auto relative overflow-hidden group shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-iu-blue/10 rounded-full blur-3xl -mr-40 -mt-40 group-hover:bg-iu-blue/20 transition-colors duration-700" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-iu-purple/5 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="relative z-10">
          <div className="w-28 h-28 rounded-[2.5rem] bg-iu-blue/10 dark:bg-iu-blue flex items-center justify-center mx-auto mb-10 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
            <Rss size={56} className="text-iu-blue dark:text-white" />
          </div>

          <h3 className="text-4xl font-black text-foreground mb-6 tracking-tight">
            Course Feed
          </h3>

          <p className="text-muted-foreground text-xl mb-12 leading-relaxed max-w-lg mx-auto font-medium">
            {language === "de"
              ? "Interagieren Sie mit Ihren Online-Tutoren und Mitstudierenden, stellen Sie Fragen und nehmen Sie an Live-Lehrveranstaltungen teil."
              : "Interact with your online tutors and fellow students, ask questions and participate in live teaching events."}
          </p>

          <button className="px-12 py-5 bg-iu-blue text-white font-black rounded-2xl hover:bg-iu-blue transition-all shadow-xl shadow-iu-blue/25 active:scale-95 group/btn">
            <span className="flex items-center gap-3">
              {language === "de" ? "Jetzt Anmelden" : "Sign up Now"}
              <ArrowLeft
                size={20}
                className="rotate-180 group-hover:translate-x-1 transition-transform"
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
