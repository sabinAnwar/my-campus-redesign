import React from "react";
import { getTranslatedDescription } from "~/data/coursesConfig";
import type { Module } from "~/types/module-handbook";
import { TYPE_LABELS, STATUS_LABELS } from "~/services/translations/module-handbook";

interface ModuleGridProps {
  t: any;
  language: "de" | "en";
  filteredModules: Module[];
}

export function ModuleGrid({ t, language, filteredModules }: ModuleGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {filteredModules.map((module) => (
        <article
          key={module.code}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-iu-blue transition-all group"
        >
          <div
            className={`absolute right-0 top-0 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 border-l border-b rounded-bl-xl ${
              module.type === "Pflicht"
                ? "bg-iu-blue text-white border-iu-blue"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {TYPE_LABELS[language][module.type]}
          </div>
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest mb-4">
            <span className="px-3 py-1 bg-muted text-iu-blue border border-border rounded-lg">
              {module.code}
            </span>
            <span className="text-muted-foreground">
              {t.semester} {module.semester}
            </span>
            <span className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  module.status === "laufend"
                    ? "bg-iu-blue animate-pulse"
                    : module.status === "abgeschlossen"
                      ? "bg-iu-blue"
                      : "bg-amber-400"
                }`}
              />
              <span className="text-muted-foreground">
                {STATUS_LABELS[language][module.status]}
              </span>
            </span>
          </div>

          <h3 className="text-xl font-black text-foreground mb-3 group-hover:text-iu-blue transition-colors">
            {module.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {module.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 rounded-md bg-muted/50 text-muted-foreground text-[10px] font-bold uppercase tracking-wider"
              >
                {skill}
              </span>
            ))}
          </div>

          <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-6 line-clamp-2">
            {getTranslatedDescription(module.description || "", language)}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                {t.exam}
              </p>
              <p className="text-sm font-bold text-foreground">
                {module.exam}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                {t.workload}
              </p>
              <p className="text-sm font-bold text-foreground">
                {module.workload}h / {module.ects} ECTS
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
