import { ExternalLink, ArrowUpRight, LifeBuoy } from "lucide-react";
import type { BenefitTool } from "~/types/benefits";

interface ToolCardProps {
  t: any;
  tool: BenefitTool;
}

export function ToolCard({ t, tool }: ToolCardProps) {
  return (
    <article className="group relative rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 bg-card/40 dark:bg-card/30 border border-slate-300/80 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-card dark:hover:bg-card/50 shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl overflow-hidden group/card flex flex-col sm:flex-row gap-4 sm:gap-8 items-start sm:items-center">
      {/* Hover background effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 dark:bg-slate-800/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-32 -mt-32 pointer-events-none" />

      <div
        className={`h-14 w-14 sm:h-20 sm:w-20 rounded-[1.25rem] sm:rounded-[1.75rem] flex-shrink-0 flex items-center justify-center text-white text-sm sm:text-lg font-black shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 relative z-10 ${tool.logo.bg}`}
      >
        {tool.logo.text}
      </div>

      <div className="flex-1 min-w-0 space-y-3 sm:space-y-4 relative z-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-base sm:text-xl font-black text-foreground tracking-tight group-hover:translate-x-1 transition-transform">
            {tool.name}
          </p>
          <div className="p-2 ml-auto rounded-xl bg-white/90 dark:bg-slate-900 border border-slate-300/80 dark:border-slate-700 group-hover:border-slate-400 dark:group-hover:border-slate-500 text-foreground group-hover:scale-110 transition-all shadow-sm">
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>

        <p className="text-xs sm:text-base text-foreground font-bold leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-foreground font-black text-[10px] uppercase tracking-[0.2em] border-b-2 border-slate-200 dark:border-slate-700 hover:border-slate-900 dark:hover:border-white transition-all pb-1 group/link"
          >
            {t.open} 
            <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
          </a>

          {tool.support && (
            <a
              href={tool.support}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-foreground hover:text-slate-600 dark:hover:text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
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
              className="inline-flex items-center gap-2 text-foreground hover:text-slate-600 dark:hover:text-slate-300 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
            >
              {t.alternative}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
