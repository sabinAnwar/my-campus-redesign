import { ExternalLink, ArrowUpRight, LifeBuoy } from "lucide-react";
import type { BenefitTool } from "~/types/benefits";

interface ToolCardProps {
  t: any;
  tool: BenefitTool;
}

export function ToolCard({ t, tool }: ToolCardProps) {
  return (
    <article className="group relative rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 bg-card/60 border border-border shadow-xl hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500 backdrop-blur-xl overflow-hidden">
      {/* Hover background effect */}
      <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>

      <div className="flex items-start gap-3 sm:gap-4 md:gap-6 relative z-10">
        <div
          className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-xl transition-transform group-hover:scale-110 ${tool.logo.bg}`}
        >
          {tool.logo.text}
        </div>

        <div className="flex-1 min-w-0 space-y-2 sm:space-y-3 md:space-y-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <p className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-tight group-hover:text-iu-blue transition-colors">
              {tool.name}
            </p>
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/20 group-hover:text-iu-blue group-hover:scale-110 transition-all flex-shrink-0" />
          </div>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
            {tool.description}
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 pt-1 sm:pt-2">
            <a
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-iu-blue font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest hover:text-iu-blue/80 transition-all border-b-2 border-iu-blue/10 hover:border-iu-blue/40 pb-0.5 sm:pb-1"
            >
              {t.open} <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </a>

            {tool.support && (
              <a
                href={tool.support}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground/50 hover:text-iu-blue font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest transition-all"
              >
                <LifeBuoy className="w-3 h-3 sm:w-4 sm:h-4" />
                {t.support}
              </a>
            )}

            {tool.alt && (
              <a
                href={tool.alt}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground/50 hover:text-iu-blue font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest transition-all"
              >
                {t.alternative}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
