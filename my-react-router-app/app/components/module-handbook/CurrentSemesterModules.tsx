import React from "react";
import { getTranslatedDescription } from "~/data/coursesConfig";
import type { Module } from "~/types/module-handbook";
import { TYPE_LABELS } from "~/services/translations/module-handbook";

interface CurrentSemesterModulesProps {
  t: any;
  language: "de" | "en";
  currentSemester: number;
  currentSemesterModules: Module[];
}

export function CurrentSemesterModules({
  t,
  language,
  currentSemester,
  currentSemesterModules,
}: CurrentSemesterModulesProps) {
  return (
    <div className="mb-10 rounded-2xl border-l-4 border-iu-blue bg-iu-blue/5 p-6">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-iu-blue dark:text-iu-blue mb-1">
            {t.currentSemesterTitle(currentSemester)}
          </p>
          <p className="text-sm text-muted-foreground font-bold">
            {t.currentSemesterDesc}
          </p>
        </div>
        <div className="text-xs font-black text-foreground uppercase tracking-widest bg-background px-4 py-2 border border-border rounded-lg">
          {currentSemesterModules.length} {t.module}{" "}
          {currentSemesterModules.reduce((sum, m) => sum + m.ects, 0)} ECTS
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {currentSemesterModules.map((module) => (
          <div
            key={module.code}
            className="rounded-xl border border-border bg-card p-5 shadow-sm hover:border-iu-blue transition-colors group"
          >
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
              <span className="text-iu-blue dark:text-iu-blue">
                {module.code}
              </span>
              <span className="px-2 py-1 rounded bg-iu-blue text-white">
                {TYPE_LABELS[language][module.type]}
              </span>
            </div>
            <h4 className="text-base font-black text-foreground mb-2 group-hover:text-iu-blue transition-colors">
              {module.title}
            </h4>
            <p className="text-xs text-muted-foreground font-bold line-clamp-2 mb-4 leading-relaxed">
              {getTranslatedDescription(module.description || "", language)}
            </p>
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground space-y-2 pt-4 border-t border-border">
              <div className="flex items-center justify-between">
                <span>{t.exam}</span>
                <span className="text-foreground">{module.exam}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ECTS</span>
                <span className="text-iu-blue">{module.ects}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
