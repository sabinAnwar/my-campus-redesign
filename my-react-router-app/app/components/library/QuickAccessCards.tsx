import React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface QuickAccessItem {
  icon: LucideIcon;
  label: string;
  color: string;
  count: number | string;
}

interface QuickAccessCardsProps {
  items: QuickAccessItem[];
  availableLabel: string;
}

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  "iu-blue": {
    bg: "bg-iu-blue/10 dark:bg-iu-blue",
    text: "text-iu-blue dark:text-white",
  },
  "success": {
    bg: "bg-iu-green/10 dark:bg-iu-green",
    text: "text-iu-green dark:text-white",
  },
  "iu-purple": {
    bg: "bg-iu-purple/10 dark:bg-iu-purple",
    text: "text-iu-purple dark:text-white",
  },
  "warning": {
    bg: "bg-iu-orange/10 dark:bg-iu-orange",
    text: "text-iu-orange dark:text-white",
  },
};

export function QuickAccessCards({ items, availableLabel }: QuickAccessCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
      {items.map((item, idx) => {
        const colors = COLOR_MAP[item.color] || COLOR_MAP["iu-blue"];
        return (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border p-5 sm:p-8 shadow-2xl hover:shadow-iu-blue/10 transition-all cursor-pointer hover:-translate-y-2"
          >
            <div
              className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-4 sm:mb-6 ${colors.bg} group-hover:scale-110 transition-transform duration-500`}
            >
              <item.icon className={`h-7 w-7 sm:h-8 sm:w-8 ${colors.text}`} />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 tracking-tight">
              {item.label}
            </h3>
            <p className="text-sm text-muted-foreground font-bold">
              {item.count} {availableLabel}
            </p>
            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/30 group-hover:text-iu-blue group-hover:translate-x-2 transition-all duration-500" />
          </div>
        );
      })}
    </div>
  );
}
