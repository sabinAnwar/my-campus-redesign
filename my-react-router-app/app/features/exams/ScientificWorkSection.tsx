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
    <section className="bg-card border border-slate-300 dark:border-slate-700 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-xl transition-all hover:border-slate-400 dark:hover:border-slate-500">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 sm:p-8 hover:bg-muted/30 transition-colors text-left cursor-pointer group"
      >
        <div className="flex items-center gap-4 sm:gap-6 pointer-events-none">
          <div className="p-3 sm:p-4 bg-iu-blue/20 dark:bg-iu-blue rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-iu-blue dark:text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
              {t.scientificWork}
            </h2>
            <p className="text-foreground dark:text-white text-sm sm:text-base font-medium">
              {t.scientificWorkSubtitle}
            </p>
          </div>
        </div>
        <div>
          {isOpen ? (
            <ChevronUp className="w-6 h-6 sm:w-8 sm:h-8 text-foreground dark:text-white" />
          ) : (
            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-foreground dark:text-white" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 sm:p-8 border-t border-border bg-muted/10 space-y-8 sm:space-y-10">
          <div className="bg-iu-blue/5 dark:bg-iu-blue/10 border border-iu-blue/20 dark:border-iu-blue/30 rounded-2xl p-4 sm:p-6 text-sm sm:text-base text-foreground leading-relaxed shadow-inner">
            <p className="font-bold mb-3 flex items-center gap-3 text-iu-blue dark:text-white text-base sm:text-lg">
              <Info className="w-5 h-5 sm:w-6 sm:h-6" />
              {t.versionNote}
            </p>
            <p className="font-medium opacity-90">{t.versionNoteDesc}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-foreground dark:text-white uppercase tracking-[0.2em] px-1">
              {t.basicsGuidelines}
            </h3>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {coreGuidelines.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedDocument(item)}
                  className="flex flex-col items-start gap-4 p-5 sm:p-8 bg-card border border-slate-300 dark:border-slate-700 rounded-[2.5rem] hover:border-slate-400 dark:hover:border-slate-500 transition-all cursor-pointer group text-left shadow-lg hover:-translate-y-1 duration-300"
                >
                  <div
                    className={`p-3 sm:p-4 rounded-2xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform shadow-xl`}
                  >
                    <item.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-foreground group-hover:translate-x-1 transition-transform">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs sm:text-sm text-foreground dark:text-white mt-2 font-medium leading-relaxed">
                        {item.subtitle}
                      </p>
                    )}
                    <div className="mt-5 sm:mt-6 flex items-center gap-3 text-[9px] sm:text-[10px] font-black text-foreground dark:text-white uppercase tracking-widest">
                      <FileText className="w-4 h-4 text-iu-blue dark:text-white" />
                      <span>{t.openDocument}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-foreground dark:text-white uppercase tracking-[0.2em] px-1">
              {t.specialTopics}
            </h3>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topicGuidelines.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedDocument(item)}
                  className="flex items-start sm:items-center gap-4 p-3 sm:p-5 bg-card border border-slate-300 dark:border-slate-700 rounded-2xl hover:border-slate-400 dark:hover:border-slate-500 transition-all cursor-pointer group text-left shadow-sm hover:-translate-y-0.5 min-w-0"
                >
                  <div
                    className={`p-2.5 sm:p-3 rounded-xl ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-foreground group-hover:translate-x-1 transition-transform text-sm leading-snug line-clamp-2 sm:truncate">
                      {item.title}
                    </h3>
                  </div>
                  <FileText className="w-4 h-4 text-foreground transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black text-foreground dark:text-white uppercase tracking-[0.2em] px-1">
              {t.templates}
            </h3>
            <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((item: any, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedDocument(item)}
                  className="flex items-start sm:items-center gap-4 p-3 sm:p-5 bg-card border border-slate-300 dark:border-slate-700 rounded-2xl hover:border-slate-400 dark:hover:border-slate-500 transition-all cursor-pointer group text-left shadow-sm hover:-translate-y-0.5 min-w-0"
                >
                  <div className="p-2.5 sm:p-3 bg-iu-blue rounded-xl text-white transition-all border border-iu-blue/30 shadow-md group-hover:scale-110">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-foreground group-hover:translate-x-1 transition-transform text-sm leading-snug line-clamp-2 sm:truncate">
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-black bg-foreground text-background px-2 py-1 rounded border border-foreground uppercase tracking-widest self-start sm:self-auto mt-0.5 sm:mt-0">
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
