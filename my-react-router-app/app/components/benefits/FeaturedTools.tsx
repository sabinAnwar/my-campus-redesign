import { Star, ExternalLink } from "lucide-react";
import type { FeaturedTool } from "~/types/benefits";

interface FeaturedToolsProps {
  t: any;
  featuredTools: FeaturedTool[];
}

export function FeaturedTools({ t, featuredTools }: FeaturedToolsProps) {
  if (featuredTools.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] bg-iu-blue/5 border border-iu-blue/10 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue text-white shadow-lg shadow-iu-blue/30">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground tracking-tight">
          {t.featuredTools}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {featuredTools.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-3xl bg-card/60 backdrop-blur-md border border-border hover:shadow-2xl hover:border-iu-blue/40 hover:bg-card transition-all duration-500"
          >
            <div
              className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl sm:rounded-2xl text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${tool.logo.bg}`}
            >
              {tool.logo.text}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm sm:text-base md:text-lg tracking-tight leading-tight text-foreground group-hover:text-iu-blue transition-colors">
                {tool.name}
              </p>
              <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground/50 font-black uppercase tracking-wide mt-0.5 sm:mt-1">
                {tool.category}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-iu-blue/40 group-hover:text-iu-blue group-hover:scale-110 transition-all shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
