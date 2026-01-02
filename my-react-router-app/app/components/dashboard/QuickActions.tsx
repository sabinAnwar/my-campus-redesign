import React from "react";
import { Link } from "react-router";
import { LayoutGrid, type LucideIcon } from "lucide-react";
import { QUICK_ACTION_COLORS } from "~/constants/dashboard";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  link: string;
  color: string;
}

interface QuickActionsProps {
  quickActions: QuickAction[];
  t: any;
}

export function QuickActions({ quickActions, t }: QuickActionsProps) {
  return (
    <div className="mb-4 sm:mb-6 md:mb-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-iu-purple/10 text-iu-purple shadow-sm border border-iu-purple/10">
          <LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
          {t.quickActions}
        </h3>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6">
        {quickActions.map((action, idx) => {
          type ColorKey = keyof typeof QUICK_ACTION_COLORS;
          const colorKey: ColorKey =
            (action.color as ColorKey) in QUICK_ACTION_COLORS
              ? (action.color as ColorKey)
              : "blue";
          const classes = QUICK_ACTION_COLORS[colorKey];

          return (
            <Link
              key={idx}
              to={action.link}
              className={`group p-3 sm:p-4 md:p-6 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-xl ${classes.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col items-center text-center`}
            >
              <div
                className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl ${classes.bg} mb-2 sm:mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-sm`}
              >
                <action.icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ${classes.text}`}
                />
              </div>
              <div className="text-[9px] sm:text-[10px] md:text-xs font-black text-foreground uppercase tracking-wider sm:tracking-widest md:tracking-[0.2em] leading-tight">
                {action.label}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
