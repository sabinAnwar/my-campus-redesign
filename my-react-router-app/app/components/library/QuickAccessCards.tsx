import React from "react";
import { ChevronRight, Database, BookOpen, Newspaper, Play, type LucideIcon } from "lucide-react";

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

export function QuickAccessCards({ items, availableLabel }: QuickAccessCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="group relative overflow-hidden rounded-[2.5rem] bg-card/60 backdrop-blur-xl border border-border p-8 shadow-2xl hover:shadow-iu-blue/10 transition-all cursor-pointer hover:-translate-y-2"
        >
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-${item.color}/10 group-hover:scale-110 transition-transform duration-500`}
          >
            <item.icon className={`h-8 w-8 text-${item.color}`} />
          </div>
          <h3 className="text-xl font-black text-foreground mb-2 tracking-tight">
            {item.label}
          </h3>
          <p className="text-sm text-muted-foreground font-bold">
            {item.count} {availableLabel}
          </p>
          <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground/30 group-hover:text-iu-blue group-hover:translate-x-2 transition-all duration-500" />
        </div>
      ))}
    </div>
  );
}
