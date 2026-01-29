import React from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface QuickAccessItem {
  id: string;
  icon: LucideIcon;
  label: string;
  color: string;
  count: number | string;
}

interface QuickAccessCardsProps {
  items: QuickAccessItem[];
  availableLabel: string;
  activeId: string | null;
  onSelect: (id: string) => void;
}

const COLOR_MAP: Record<string, { bg: string; text: string }> = {
  "iu-blue": {
    bg: "bg-iu-blue/10 dark:bg-iu-blue/20",
    text: "text-iu-blue dark:text-blue-300",
  },
  "success": {
    bg: "bg-iu-green/10 dark:bg-iu-green/20",
    text: "text-iu-green dark:text-green-300",
  },
  "iu-purple": {
    bg: "bg-iu-purple/10 dark:bg-iu-purple/20",
    text: "text-iu-purple dark:text-purple-300",
  },
  "warning": {
    bg: "bg-iu-orange/10 dark:bg-iu-orange/20",
    text: "text-iu-orange dark:text-orange-300",
  },
};

export function QuickAccessCards({ items, availableLabel, activeId, onSelect }: QuickAccessCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12">
      {items.map((item, idx) => {
        const colors = COLOR_MAP[item.color] || COLOR_MAP["iu-blue"];
        const isActive = activeId === item.id;
        
        return (
          <div
            key={idx}
            onClick={() => onSelect(item.id)}
            className={`group relative overflow-hidden rounded-[2.5rem] bg-card/60 backdrop-blur-xl border transition-all cursor-pointer hover:-translate-y-2 ${
              isActive 
                ? "border-slate-400 dark:border-slate-500 shadow-lg ring-2 ring-slate-400/20" 
                : "border-border shadow-2xl hover:border-slate-400 dark:hover:border-slate-600"
            }`}
          >
            <div className="p-5 sm:p-8">
              <div
                className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl mb-4 sm:mb-6 ${colors.bg} group-hover:scale-110 transition-transform duration-500`}
              >
                <item.icon className={`h-7 w-7 sm:h-8 sm:w-8 ${colors.text}`} />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-foreground mb-2 tracking-tight">
                {item.label}
              </h3>
              <p className="text-sm text-foreground font-black">
                {item.count} {availableLabel}
              </p>
            </div>
            <ChevronRight className={`absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 transition-all duration-500 ${
              isActive ? "text-foreground translate-x-2" : "text-muted-foreground group-hover:text-foreground group-hover:translate-x-2"
            }`} />
          </div>
        );
      })}
    </div>
  );
}
