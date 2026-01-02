import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, FileText, Clock, ChevronRight } from "lucide-react";

interface QuickAccessLinksProps {
  t: any;
}

export function QuickAccessLinks({ t }: QuickAccessLinksProps) {
  const links = [
    { to: "/courses", icon: BookOpen, color: "blue", label: t.viewCourses },
    { to: "/library", icon: FileText, color: "blue", label: t.viewLibrary },
    { to: "/courses/schedule", icon: Clock, color: "purple", label: t.viewSchedule },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <h3 className="font-black text-slate-900 dark:text-white mb-4">{t.quickActionsTitle}</h3>
      <div className="space-y-2">
        {links.map((link, idx) => (
          <Link
            key={idx}
            to={link.to}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
          >
            <div className={`p-2 rounded-lg bg-${link.color}-500/10`}>
              <link.icon className={`w-4 h-4 text-${link.color}-600`} />
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{link.label}</span>
            <ChevronRight className="w-4 h-4 ml-auto text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </div>
    </div>
  );
}
