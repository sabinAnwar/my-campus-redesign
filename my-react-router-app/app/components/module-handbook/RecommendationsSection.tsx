import React from "react";

interface Recommendation {
  code: string;
  title: string;
  description: string;
}

interface RecommendationsSectionProps {
  t: any;
  focus: string;
  recommendations: Recommendation[];
}

export function RecommendationsSection({
  t,
  focus,
  recommendations,
}: RecommendationsSectionProps) {
  return (
    <div className="rounded-2xl bg-card border border-border p-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black text-foreground uppercase tracking-widest">
          {t.recommendationTitle(focus)}
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white border border-iu-blue/20 dark:border-iu-blue">
          {t.recommendationChip}
        </span>
      </div>
      <ol className="space-y-6">
        {recommendations.map((rec, idx) => (
          <li key={rec.code} className="flex items-start gap-6 group">
            <span className="mt-1 h-8 w-8 rounded-full bg-iu-blue text-white flex items-center justify-center text-sm font-black shrink-0 group-hover:bg-iu-pink transition-colors">
              {idx + 1}
            </span>
            <div>
              <p className="font-black text-foreground text-lg group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                {rec.title} ({rec.code})
              </p>
              <p className="mt-1 text-sm text-muted-foreground font-bold leading-relaxed">
                {rec.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
