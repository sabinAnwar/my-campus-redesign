import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Clock, ChevronRight } from "lucide-react";

interface QuickAccessLinksProps {
  t: any;
}

export function QuickAccessLinks({ t }: QuickAccessLinksProps) {
  const links = [
    { to: "/courses", icon: BookOpen, label: t.viewCourses },
    { to: "/library", icon: FileText, label: t.viewLibrary },
    { to: "/courses/schedule", icon: Clock, label: t.viewSchedule },
  ];

  return (
    <div className="rounded-[2rem] border border-border bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
      <h3 className="font-black text-foreground mb-4 sm:mb-6">{t.quickActionsTitle}</h3>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.to}
            className="flex items-center gap-3 p-3 sm:p-4 rounded-xl hover:bg-muted/40 transition-colors group"
          >
            <div className="p-2 rounded-xl bg-iu-blue text-white group-hover:scale-110 transition-transform">
              <link.icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-foreground group-hover:text-iu-blue transition-colors">{link.label}</span>
            <ChevronRight className="w-4 h-4 ml-auto text-foreground/60 group-hover:text-iu-blue group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
