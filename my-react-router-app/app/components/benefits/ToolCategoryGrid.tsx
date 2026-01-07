import { ToolCard } from "./ToolCard";
import type { ToolCategory } from "~/types/benefits";
import { categoryBadge } from "~/constants/benefits";

interface ToolCategoryGridProps {
  t: any;
  category: ToolCategory;
}

export function ToolCategoryGrid({ t, category }: ToolCategoryGridProps) {
  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        <div
          className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border shadow-lg transition-transform hover:scale-110 ${categoryBadge[category.color]}`}
        >
          <category.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-current" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-foreground">
            {category.title}
          </h3>
          <p className="text-[9px] sm:text-[10px] md:text-xs text-foreground/70 dark:text-white/70 font-black uppercase tracking-widest sm:tracking-[0.2em] mt-0.5 sm:mt-1">
            {category.tools.length} {t.tools}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {category.tools.map((tool) => (
          <ToolCard key={tool.name} t={t} tool={tool} />
        ))}
      </div>
    </div>
  );
}
