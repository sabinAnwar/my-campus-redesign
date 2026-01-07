import React from "react";
import { GraduationCap, ChevronDown, ChevronUp, Info, FileText } from "lucide-react";
import { guidelines, templates } from "~/data/documents";

interface ScientificWorkSectionProps {
  t: any;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setSelectedDocument: (doc: any) => void;
}

export function ScientificWorkSection({
  t,
  isOpen,
  setIsOpen,
  setSelectedDocument,
}: ScientificWorkSectionProps) {
  const coreGuidelines = guidelines.slice(0, 3);
  const topicGuidelines = guidelines.slice(3);

  return (
    <section className="bg-card/50 border border-border rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl transition-all hover:bg-card/80">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-8 hover:bg-muted/30 transition-colors text-left cursor-pointer group"
      >
        <div className="flex items-center gap-6 pointer-events-none">
          <div className="p-4 bg-iu-blue/20 dark:bg-iu-blue rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
            <GraduationCap className="w-8 h-8 text-iu-blue dark:text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {t.scientificWork}
            </h2>
            <p className="text-muted-foreground text-base font-medium opacity-70">
              {t.scientificWorkSubtitle}
            </p>
          </div>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="w-8 h-8 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-8 border-t border-border bg-muted/10 space-y-10">
          <div className="bg-iu-blue/5 dark:bg-iu-blue/10 border border-iu-blue/20 dark:border-iu-blue/30 rounded-2xl p-6 text-base text-foreground leading-relaxed shadow-inner">
            <p className="font-bold mb-3 flex items-center gap-3 text-iu-blue dark:text-white text-lg">
              <Info className="w-6 h-6" />
              {t.versionNote}
            </p>
            <p className="font-medium opacity-90">{t.versionNoteDesc}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
              {t.basicsGuidelines}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {coreGuidelines.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedDocument(item)}
                  className="flex flex-col items-start gap-4 p-8 bg-card/60 border border-border rounded-[2.5rem] hover:border-primary/50 hover:bg-card transition-all cursor-pointer group text-left shadow-lg hover:-translate-y-1 duration-300"
                >
                  <div
                    className={`p-4 rounded-2xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform shadow-xl`}
                  >
                    <item.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-sm text-muted-foreground mt-2 font-medium leading-relaxed opacity-70">
                        {item.subtitle}
                      </p>
                    )}
                    <div className="mt-6 flex items-center gap-3 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity">
                      <FileText className="w-4 h-4 text-iu-blue dark:text-white" />
                      <span>{t.openDocument}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
              {t.specialTopics}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topicGuidelines.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedDocument(item)}
                  className="flex items-center gap-4 p-5 bg-card/50 border border-border rounded-2xl hover:border-primary/40 hover:bg-card transition-all cursor-pointer group text-left shadow-sm hover:-translate-y-0.5"
                >
                  <div
                    className={`p-3 rounded-xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors text-sm truncate">
                      {item.title}
                    </h3>
                  </div>
                  <FileText className="w-4 h-4 text-muted-foreground/30 group-hover:text-iu-blue/50 dark:group-hover:text-white/50 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-muted-foreground uppercase tracking-[0.2em] px-1">
              {t.templates}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedDocument(item)}
                  className="flex items-center gap-4 p-5 bg-card/50 border border-border rounded-2xl hover:border-primary/40 hover:bg-card transition-all cursor-pointer group text-left shadow-sm hover:-translate-y-0.5"
                >
                  <div className="p-3 bg-muted/50 rounded-xl text-muted-foreground group-hover:text-white group-hover:bg-iu-blue transition-all border border-border/50">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors text-sm truncate">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-[10px] font-black bg-muted text-muted-foreground px-2 py-1 rounded border border-border uppercase tracking-widest">
                    {item.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
