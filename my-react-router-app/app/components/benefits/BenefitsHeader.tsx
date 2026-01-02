import { Star } from "lucide-react";

interface BenefitsHeaderProps {
  t: any;
  totalTools: number;
}

export function BenefitsHeader({ t, totalTools }: BenefitsHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8 md:mb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 md:gap-8">
        <div className="space-y-2 sm:space-y-3 md:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              {t.title}
            </h1>
          </div>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {t.subtitle(totalTools)}
          </p>

          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-xs sm:text-sm font-bold w-fit">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>{t.exclusiveFor}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
