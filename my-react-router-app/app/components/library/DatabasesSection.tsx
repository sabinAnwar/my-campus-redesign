import React from "react";
import { Database, ExternalLink, ChevronRight } from "lucide-react";
import { DynamicIcon } from "../ui/DynamicIcon";

interface DatabaseItem {
  id: string;
  name: string;
  description: string;
  descriptionEn: string;
  url: string;
  icon: any;
  featured?: boolean;
}

interface DatabasesSectionProps {
  databases: DatabaseItem[];
  language: "de" | "en";
  title: string;
  subtitle: string;
  viewAllLabel: string;
}

export function DatabasesSection({
  databases,
  language,
  title,
  subtitle,
  viewAllLabel,
}: DatabasesSectionProps) {
  const featuredDatabases = databases.filter((db) => db.featured);
  const otherDatabases = databases.filter((db) => !db.featured);

  return (
    <div className="bg-card/60 backdrop-blur-xl rounded-[2.5rem] border border-border p-6 sm:p-10 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-iu-blue/10 rounded-2xl">
            <Database className="h-7 w-7 sm:h-8 sm:w-8 text-iu-blue" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest mt-1">
              {subtitle}
            </p>
          </div>
        </div>
        <button className="px-5 sm:px-6 py-2.5 bg-iu-blue/10 text-iu-blue font-black rounded-full hover:bg-iu-blue hover:text-white transition-all text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 w-fit">
          {viewAllLabel} <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {featuredDatabases.map((db) => (
          <a
            key={db.id}
            href={db.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-3xl border border-border/50 hover:border-iu-blue/50 hover:bg-iu-blue/5 transition-all duration-300"
          >

            <div className="p-3 sm:p-4 rounded-2xl bg-iu-blue/10 group-hover:scale-110 transition-transform duration-500">
              <DynamicIcon name={db.icon} className="h-5 w-5 sm:h-6 sm:w-6 text-iu-blue" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-black text-foreground group-hover:text-iu-blue transition-colors">
                  {db.name}
                </h3>
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
              </div>
              <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                {language === "de" ? db.description : db.descriptionEn}
              </p>
            </div>
          </a>
        ))}
      </div>

      {otherDatabases.length > 0 && (
        <div className="mt-8 pt-8 border-t border-border/50">
          <div className="flex flex-wrap gap-3">
            {otherDatabases.map((db) => (
              <a
                key={db.id}
                href={db.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black bg-muted/50 text-muted-foreground hover:bg-iu-blue/10 hover:text-iu-blue transition-all hover:scale-105 uppercase tracking-widest"
              >
                {db.name}
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
