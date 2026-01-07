import { ExternalLink, ArrowUpRight, LifeBuoy } from "lucide-react";
import type { BenefitTool } from "~/types/benefits";

interface ToolCardProps {
  t: any;
  tool: BenefitTool;
}

export function ToolCard({ t, tool }: ToolCardProps) {
  return (
    <article className="group relative rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 bg-card/40 dark:bg-card/30 border border-border/50 dark:border-white/5 shadow-xl hover:border-iu-blue/30 dark:hover:border-iu-blue/50 hover:bg-card dark:hover:bg-card/50 hover:shadow-2xl hover:shadow-iu-blue/5 transition-all duration-500 backdrop-blur-xl overflow-hidden group/card flex flex-col sm:flex-row gap-5 sm:gap-8 items-start sm:items-center">
      {/* Hover background effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-32 -mt-32 pointer-events-none" />

      <div
        className={`h-16 w-16 sm:h-20 sm:w-20 rounded-[1.25rem] sm:rounded-[1.75rem] flex-shrink-0 flex items-center justify-center text-white text-base sm:text-lg font-black shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10 ${tool.logo.bg}`}
      >
        {tool.logo.text}
      </div>

      <div className="flex-1 min-w-0 space-y-3 sm:space-y-4 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg sm:text-xl font-black text-foreground tracking-tight group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
            {tool.name}
          </p>
          <div className="p-2 ml-auto rounded-xl bg-muted/50 dark:bg-white/5 border border-border dark:border-white/5 group-hover:border-iu-blue/30 dark:group-hover:border-iu-blue/50 text-muted-foreground/70 dark:text-white/60 group-hover:text-iu-blue dark:group-hover:text-white group-hover:scale-110 transition-all">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>

        <p className="text-sm sm:text-base text-muted-foreground dark:text-white/70 font-medium leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-iu-blue dark:text-white font-black text-[10px] uppercase tracking-[0.2em] border-b-2 border-iu-blue/10 dark:border-iu-blue/30 hover:border-iu-blue dark:hover:border-white transition-all pb-1 group/link"
          >
            {t.open} 
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>

          {tool.support && (
            <a
              href={tool.support}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground dark:text-white/50 hover:text-iu-blue dark:hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              {t.support}
            </a>
          )}

          {tool.alt && (
            <a
              href={tool.alt}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-muted-foreground dark:text-white/50 hover:text-iu-blue dark:hover:text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              {t.alternative}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
