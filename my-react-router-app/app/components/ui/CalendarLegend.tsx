import React from 'react';
import { Info, CalendarIcon } from 'lucide-react';

type LegendProps = {
  items: Array<{
    key: string;
    label: string;
    abbreviation: string;
    bg: string;
    text: string;
    ring: string;
    description?: string;
  }>;
  language: 'de' | 'en';
};

export function CalendarLegend({ items, language }: LegendProps) {
  const t = {
    de: {
      title: 'Kalender-Legende',
      subtitle: 'Verstehe deine Phasen auf einen Blick',
      phaseLabel: 'Phase',
      abbreviationLabel: 'Kürzel',
      todayIndicator: 'Heute',
      todayDesc: 'Orange Punkt = Heutiger Tag',
      eventIndicator: 'Termine',
      eventDesc: 'Blaue Zahl = Pflichttermine, Grüne Zahl = Optionale Termine',
    },
    en: {
      title: 'Calendar Legend',
      subtitle: 'Understand your phases at a glance',
      phaseLabel: 'Phase',
      abbreviationLabel: 'Abbrev.',
      todayIndicator: 'Today',
      todayDesc: 'Orange dot = Today',
      eventIndicator: 'Events',
      eventDesc: 'Blue number = Mandatory, Green number = Optional',
    },
  }[language];

  return (
    <div className="mb-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950/30 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t.title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{t.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phase Colors */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            {t.phaseLabel}
          </div>
          <div className="grid gap-2">
            {items.map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700"
              >
                <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.text} flex items-center justify-center font-black text-sm ring-2 ${item.ring}`}>
                  {item.abbreviation}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Symbole
          </div>
          
          {/* Today Indicator */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
            <div className="relative mt-1">
              <div className="w-6 h-6 bg-white dark:bg-slate-800 rounded border-2 border-orange-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-orange-900 dark:text-orange-100">
                {t.todayIndicator}
              </div>
              <div className="text-xs text-orange-700 dark:text-orange-300">
                {t.todayDesc}
              </div>
            </div>
          </div>

          {/* Event Indicators */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="flex gap-1 mt-1">
              <div className="flex items-center gap-0.5 bg-blue-600 text-white px-2 py-1 rounded-full text-[10px] font-bold">
                <CalendarIcon className="h-3 w-3" />
                2
              </div>
              <div className="flex items-center gap-0.5 bg-iu-blue text-white px-2 py-1 rounded-full text-[10px] font-bold">
                <Info className="h-3 w-3" />
                1
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {t.eventIndicator}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                {t.eventDesc}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
