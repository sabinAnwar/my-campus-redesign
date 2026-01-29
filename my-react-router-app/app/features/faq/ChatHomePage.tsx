import { Sparkles, ArrowRight, Zap, Cpu, Globe, Shield } from "lucide-react";

const ICON_MAP = { Zap, Cpu, Globe, Shield };

interface ChatHomePageProps {
  onNavigate: (page: string) => void;
  t: any;
  features: any[];
}

export function ChatHomePage({ onNavigate, t, features }: ChatHomePageProps) {
  const featuresWithIcons = features.map((feature) => {
    const IconComponent = ICON_MAP[feature.iconName as keyof typeof ICON_MAP];
    return {
      ...feature,
      icon: IconComponent ? <IconComponent className="h-5 w-5" /> : null,
    };
  });

  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center px-4 sm:px-6 py-12 sm:py-20 text-center">
      <div className="relative z-10 max-w-4xl space-y-8 sm:space-y-12">
        <div className="inline-flex items-center gap-2 sm:gap-3 rounded-full border border-iu-blue bg-iu-blue px-4 sm:px-8 py-2 sm:py-3 shadow-lg backdrop-blur-xl">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-pulse" />
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.4em] text-white uppercase">
            IU AI Assistant 2.0
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight text-foreground leading-tight">
          {t.heroLine1} <br />
          <span className="text-foreground">
            {t.heroLine2}
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-muted-foreground font-medium px-2">
          {t.heroSubtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
          <button
            onClick={() => onNavigate("chat")}
            className="group relative inline-flex items-center gap-2 sm:gap-4 rounded-xl sm:rounded-[2rem] bg-foreground px-6 sm:px-12 py-3 sm:py-6 text-sm sm:text-lg font-bold text-background shadow-xl transition-all hover:-translate-y-1 hover:opacity-90 active:scale-95"
          >
            {t.chatCta}
            <ArrowRight className="h-4 w-4 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-2" />
          </button>
        </div>

        <div className="grid gap-3 sm:gap-6 pt-8 sm:pt-12 grid-cols-2 lg:grid-cols-4">
          {featuresWithIcons.map((card, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-xl sm:rounded-[2rem] border border-border bg-card/60 p-4 sm:p-8 text-left shadow-lg transition-all duration-500 hover:-translate-y-1 hover:bg-card backdrop-blur-xl"
              style={{ animationDelay: card.delay }}
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-iu-blue/5 blur-[40px] sm:blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-12 -mt-12"></div>

              <div className="relative z-10">
                <div className="mb-3 sm:mb-6 inline-flex rounded-lg sm:rounded-2xl p-2.5 sm:p-4 bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white group-hover:bg-iu-blue group-hover:text-white transition-all duration-500 shadow">
                  {card.icon}
                </div>
                <h3 className="mb-1.5 sm:mb-3 text-sm sm:text-xl font-bold text-foreground tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
