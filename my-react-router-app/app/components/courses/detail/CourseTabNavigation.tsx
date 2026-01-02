import { LucideIcon } from "lucide-react";

interface Tab {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface CourseTabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function CourseTabNavigation({ tabs, activeTab, onTabChange }: CourseTabNavigationProps) {
  return (
    <div className="border-t border-border/30 bg-card/10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-1 overflow-x-auto py-2 sm:py-3 px-2 sm:px-4 lg:px-8 no-scrollbar scroll-smooth">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-5 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold sm:font-black transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-iu-blue text-white shadow-lg shadow-iu-blue/30 scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline sm:inline">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
