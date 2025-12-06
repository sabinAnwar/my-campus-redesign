export type DayStatus =
  | "praxis"
  | "vorlesung"
  | "theoriephase"
  | "klausurphase"
  | "nachpruefung"
  | "wochenende"
  | "feiertag";

export type PaletteEntry = { label: string; bg: string; text: string; ring: string };

export type StudyBlock = { start: string; end: string; status: DayStatus };

export type StudyPlan = {
  id: string;
  label: string;
  description?: string;
  blocks: StudyBlock[];
  paletteOverrides?: Partial<Record<DayStatus, PaletteEntry>>;
  autoWeekends?: boolean;
};

export const DEFAULT_PALETTE: Record<DayStatus, PaletteEntry> = {
  praxis: {
    label: "Praxiszeit",
    bg: "bg-emerald-300 dark:bg-emerald-700/50",
    text: "text-emerald-900 dark:text-emerald-50",
    ring: "ring-emerald-500 dark:ring-emerald-400",
  },
  vorlesung: {
    label: "Vorlesungstermine",
    bg: "bg-blue-300 dark:bg-blue-700/50",
    text: "text-blue-900 dark:text-blue-50",
    ring: "ring-blue-500 dark:ring-blue-400",
  },
  theoriephase: {
    label: "Theoriewoche",
    bg: "bg-fuchsia-300 dark:bg-fuchsia-700/50",
    text: "text-fuchsia-900 dark:text-fuchsia-50",
    ring: "ring-fuchsia-500 dark:ring-fuchsia-400",
  },
  klausurphase: {
    label: "Prüfungsphase",
    bg: "bg-red-400 dark:bg-red-700/60",
    text: "text-red-950 dark:text-red-50",
    ring: "ring-red-600 dark:ring-red-400",
  },
  nachpruefung: {
    label: "Nachprüfungsphase",
    bg: "bg-slate-300 dark:bg-slate-600/50",
    text: "text-slate-900 dark:text-slate-50",
    ring: "ring-slate-500 dark:ring-slate-400",
  },
  wochenende: {
    label: "Wochenenden (frei von Praxis)",
    bg: "bg-amber-300 dark:bg-amber-700/50",
    text: "text-amber-900 dark:text-amber-50",
    ring: "ring-amber-500 dark:ring-amber-400",
  },
  feiertag: {
    label: "Feiertag",
    bg: "bg-slate-800 dark:bg-slate-900",
    text: "text-white",
    ring: "ring-slate-700 dark:ring-slate-500",
  },
};

export const STUDY_PLANS: StudyPlan[] = [
  {
    id: "ws25-26",
    label: "7. Semester (Blockmodell) Okt 2025 – Mär 2026",
    description:
      "Angelehnt an den Plan im Screenshot, inkl. Theorie-/Prüfungsphasen.",
    autoWeekends: true,
    paletteOverrides: {
      theoriephase: {
        label: "Theoriewoche (Jan bis Mär)",
        bg: "bg-fuchsia-300 dark:bg-fuchsia-500/20",
        text: "text-fuchsia-900 dark:text-fuchsia-100",
        ring: "ring-fuchsia-500/70 dark:ring-fuchsia-500/50",
      },
      praxis: {
        label: "Praxiswochen (Okt bis Dez)",
        bg: "bg-lime-300 dark:bg-lime-500/20",
        text: "text-lime-900 dark:text-lime-100",
        ring: "ring-lime-500/70 dark:ring-lime-500/50",
      },
      klausurphase: {
        label: "Prüfungswoche",
        bg: "bg-red-400 dark:bg-red-500/20",
        text: "text-red-50 dark:text-red-100",
        ring: "ring-red-500/70 dark:ring-red-500/50",
      },
      nachpruefung: {
        label: "Nachprüfungsphase",
        bg: "bg-slate-400 dark:bg-slate-700",
        text: "text-slate-900 dark:text-slate-100",
        ring: "ring-slate-500/70",
      },
      wochenende: {
        label: "Wochenenden (max. 2/Monat arbeiten)",
        bg: "bg-amber-300 dark:bg-amber-500/20",
        text: "text-amber-900 dark:text-amber-100",
        ring: "ring-amber-500/70 dark:ring-amber-500/50",
      },
      feiertag: {
        label: "Nationaler Feiertag",
        bg: "bg-slate-800 text-white",
        text: "text-white",
        ring: "ring-slate-600/70",
      },
    },
    blocks: [
      { start: "2025-10-01", end: "2025-12-31", status: "praxis" },
      { start: "2026-01-01", end: "2026-03-31", status: "theoriephase" },
      { start: "2026-02-15", end: "2026-02-21", status: "klausurphase" },
      { start: "2026-03-10", end: "2026-03-20", status: "nachpruefung" },
      { start: "2025-12-24", end: "2025-12-26", status: "feiertag" },
    ],
  },
  {
    id: "ss26",
    label: "Sommersemester Beispiel 2026",
    description: "Abweichende Farben und Blöcke, falls sich der Plan ändert.",
    autoWeekends: true,
    paletteOverrides: {
      praxis: {
        label: "Praxisphase",
        bg: "bg-emerald-300 dark:bg-emerald-500/20",
        text: "text-emerald-900 dark:text-emerald-100",
        ring: "ring-emerald-500/70 dark:ring-emerald-500/50",
      },
      theoriephase: {
        label: "Theorieblock",
        bg: "bg-indigo-300 dark:bg-indigo-500/20",
        text: "text-indigo-900 dark:text-indigo-100",
        ring: "ring-indigo-500/70 dark:ring-indigo-500/50",
      },
      klausurphase: {
        label: "Prüfungen",
        bg: "bg-rose-400 dark:bg-rose-500/20",
        text: "text-rose-50 dark:text-rose-100",
        ring: "ring-rose-500/70 dark:ring-rose-500/50",
      },
    },
    blocks: [
      { start: "2026-04-01", end: "2026-05-31", status: "theoriephase" },
      { start: "2026-06-01", end: "2026-07-31", status: "praxis" },
      { start: "2026-08-01", end: "2026-08-10", status: "klausurphase" },
    ],
  },
];

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export function addDays(date: Date, delta: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}

export function toISODate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getMonthDays(month: Date): Date[] {
  const days: Date[] = [];
  const end = endOfMonth(month).getDate();
  for (let i = 1; i <= end; i++) {
    days.push(new Date(month.getFullYear(), month.getMonth(), i));
  }
  return days;
}

export function expandBlocksToMap(blocks: StudyBlock[], autoWeekends: boolean) {
  const map = new Map<string, DayStatus>();
  blocks.forEach((b) => {
    const start = new Date(b.start);
    const end = new Date(b.end);
    for (
      let d = new Date(start);
      d.getTime() <= end.getTime();
      d = addDays(d, 1)
    ) {
      map.set(toISODate(d), b.status);
    }
  });
  if (autoWeekends) {
    // Fill weekends if not already set
    const minStart = new Date(
      Math.min(...blocks.map((b) => new Date(b.start).getTime()))
    );
    const maxEnd = new Date(
      Math.max(...blocks.map((b) => new Date(b.end).getTime()))
    );
    for (
      let d = new Date(minStart);
      d.getTime() <= maxEnd.getTime();
      d = addDays(d, 1)
    ) {
      const iso = toISODate(d);
      if (!map.has(iso)) {
        const day = d.getDay();
        if (day === 0 || day === 6) {
          map.set(iso, "wochenende");
        }
      }
    }
  }
  return map;
}

export function listMonthsForBlocks(blocks: StudyBlock[]) {
  const starts = blocks.map((b) => new Date(b.start));
  const ends = blocks.map((b) => new Date(b.end));
  const minStart = startOfMonth(
    new Date(Math.min(...starts.map((d) => d.getTime())))
  );
  const maxEnd = endOfMonth(
    new Date(Math.max(...ends.map((d) => d.getTime())))
  );

  const months: Date[] = [];
  let cursor = new Date(minStart);
  while (
    cursor.getFullYear() < maxEnd.getFullYear() ||
    (cursor.getFullYear() === maxEnd.getFullYear() &&
      cursor.getMonth() <= maxEnd.getMonth())
  ) {
    months.push(new Date(cursor));
    cursor = addMonths(cursor, 1);
  }
  return months;
}
