import { Star, ExternalLink } from "lucide-react";
import type { FeaturedTool } from "~/types/benefits";

interface FeaturedToolsProps {
  t: any;
  featuredTools: FeaturedTool[];
}

export function FeaturedTools({ t, featuredTools }: FeaturedToolsProps) {
  if (featuredTools.length === 0) return null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-card dark:bg-card/30 border border-border/50 dark:border-white/5 shadow-2xl mb-8 sm:mb-12 md:mb-16 group/section">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-iu-blue/5 dark:bg-iu-blue/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-iu-purple/5 dark:bg-iu-purple/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 p-5 sm:p-8 md:p-10">
        {/* Header: Title next to Icon */}
        <div className="flex flex-col items-start gap-5 sm:gap-6 mb-6 sm:mb-10 pl-2">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-iu-blue blur-xl opacity-20 dark:opacity-40 rounded-full animate-pulse" />
              <div className="relative p-3 sm:p-4 rounded-2xl bg-iu-blue text-white shadow-xl shadow-iu-blue/20">
                <Star className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-foreground tracking-tight">
              {t.featuredTools}
            </h3>
          </div>
          <p className="text-[9px] sm:text-xs text-muted-foreground font-black uppercase tracking-[0.25em] pl-1">
            Premium Offers & Access
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredTools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex items-center gap-4 p-4 sm:p-5 rounded-3xl bg-background/50 dark:bg-card/40 backdrop-blur-sm border border-border dark:border-white/5 hover:border-iu-blue/30 dark:hover:border-iu-blue/50 hover:shadow-2xl hover:shadow-iu-blue/5 hover:-translate-y-0.5 transition-all duration-500 overflow-hidden"
            >
              {/* Card Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-iu-blue/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div
                className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl text-white text-[10px] sm:text-xs font-black flex items-center justify-center shadow-lg z-10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0 ${tool.logo.bg}`}
              >
                {tool.logo.text}
              </div>

              <div className="space-y-1.5 z-10 flex-1 min-w-0">
                <p className="font-black text-sm sm:text-base tracking-tight leading-tight text-foreground group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                  {tool.name}
                </p>
                <div className="flex flex-col items-start pt-1">
                  <span className="w-fit px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border leading-none bg-iu-blue/10 border-iu-blue/20 text-iu-blue dark:bg-iu-blue dark:text-white">
                    {tool.category}
                  </span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-muted/50 dark:bg-white/5 border border-border dark:border-white/5 group-hover:border-iu-blue/30 dark:group-hover:border-iu-blue/50 text-muted-foreground/70 dark:text-white/60 group-hover:text-iu-blue dark:group-hover:text-white group-hover:scale-110 transition-all shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
