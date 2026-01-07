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
  // Link to Studiengang - can be ID or name pattern
  studiengangPattern?: string[];
};

export const DEFAULT_PALETTE: Record<DayStatus, PaletteEntry> = {
  praxis: {
    label: "Praxiszeit",
    bg: "bg-iu-green",
    text: "text-white",
    ring: "ring-iu-green/30",
  },
  vorlesung: {
    label: "Vorlesungstermine",
    bg: "bg-primary/10",
    text: "text-primary",
    ring: "ring-primary/20",
  },
  theoriephase: {
    label: "Theoriewoche",
    bg: "bg-iu-purple",
    text: "text-white",
    ring: "ring-iu-purple/30",
  },
  klausurphase: {
    label: "Klausurwoche",
    bg: "bg-iu-red",
    text: "text-white",
    ring: "ring-iu-red/30",
  },
  nachpruefung: {
    label: "Nachprüfungsphase",
    bg: "bg-iu-indigo",
    text: "text-white",
    ring: "ring-iu-indigo/30",
  },
  wochenende: {
    label: "Wochenenden (frei von Praxis)",
    bg: "bg-iu-orange",
    text: "text-white",
    ring: "ring-iu-orange/30",
  },
  feiertag: {
    label: "Feiertag",
    bg: "bg-iu-gold",
    text: "text-white",
    ring: "ring-iu-gold/30",
  },
};

const COMMON_BLOCKS: StudyBlock[] = [
  // 2025 Holidays
  { start: "2025-01-01", end: "2025-01-01", status: "feiertag" },
  { start: "2025-04-18", end: "2025-04-18", status: "feiertag" },
  { start: "2025-04-21", end: "2025-04-21", status: "feiertag" },
  { start: "2025-05-01", end: "2025-05-01", status: "feiertag" },
  { start: "2025-05-29", end: "2025-05-29", status: "feiertag" },
  { start: "2025-06-09", end: "2025-06-09", status: "feiertag" },
  { start: "2025-10-03", end: "2025-10-03", status: "feiertag" },
  { start: "2025-12-25", end: "2025-12-26", status: "feiertag" },
  // 2026 Holidays
  { start: "2026-01-01", end: "2026-01-01", status: "feiertag" },
  { start: "2026-04-03", end: "2026-04-03", status: "feiertag" },
  { start: "2026-04-06", end: "2026-04-06", status: "feiertag" },
  { start: "2026-05-01", end: "2026-05-01", status: "feiertag" },
  { start: "2026-05-14", end: "2026-05-14", status: "feiertag" },
  { start: "2026-05-25", end: "2026-05-25", status: "feiertag" },
  { start: "2026-10-03", end: "2026-10-03", status: "feiertag" },
  { start: "2026-12-25", end: "2026-12-26", status: "feiertag" },
];

export const STUDY_PLANS: StudyPlan[] = [
  {
    id: "ws25-26-informatik",
    label: "7. Semester (Blockmodell) Okt 2025 – Mär 2026 - Informatik",
    description:
      "Plan für Informatik-Studiengänge inkl. Theorie-/Klausurphasen.",
    autoWeekends: true,
    // Matches Studiengang names containing these patterns
    studiengangPattern: ["Informatik", "Software", "Data Science", "IT"],
    paletteOverrides: {
      theoriephase: {
        label: "Theoriewoche",
        bg: "bg-iu-purple",
        text: "text-white",
        ring: "ring-iu-purple/30",
      },
      praxis: {
        label: "Praxiswochen",
        bg: "bg-iu-green",
        text: "text-white",
        ring: "ring-iu-green/30",
      },
      klausurphase: {
        label: "Klausurwoche",
        bg: "bg-iu-red",
        text: "text-white",
        ring: "ring-iu-red/30",
      },
      nachpruefung: {
        label: "Nachprüfungsphase",
        bg: "bg-iu-indigo",
        text: "text-white",
        ring: "ring-iu-indigo/30",
      },
      wochenende: {
        label: "Wochenenden (max. 2/Monat arbeiten)",
        bg: "bg-iu-orange",
        text: "text-white",
        ring: "ring-iu-orange/30",
      },
      feiertag: {
        label: "Nationaler Feiertag",
        bg: "bg-iu-gold",
        text: "text-white",
        ring: "ring-iu-gold/30",
      },
    },
    blocks: [
      ...COMMON_BLOCKS,
      { start: "2026-02-15", end: "2026-02-21", status: "klausurphase" },
      { start: "2026-03-10", end: "2026-03-20", status: "nachpruefung" },
      { start: "2025-10-01", end: "2025-12-31", status: "praxis" },
      { start: "2026-01-01", end: "2026-03-31", status: "theoriephase" },
    ],
  },
  {
    id: "ws25-26-bwl",
    label: "7. Semester (Blockmodell) Okt 2025 – Mär 2026 - BWL",
    description: "Plan für BWL-Studiengänge mit anderen Klausurzeiten.",
    autoWeekends: true,
    // Matches Studiengang names containing these patterns
    studiengangPattern: [
      "BWL",
      "Business",
      "Marketing",
      "Wirtschaft",
      "Management",
    ],
    paletteOverrides: {
      theoriephase: {
        label: "Theoriewoche",
        bg: "bg-iu-purple",
        text: "text-white",
        ring: "ring-iu-purple/30",
      },
      praxis: {
        label: "Praxiswochen",
        bg: "bg-iu-green",
        text: "text-white",
        ring: "ring-iu-green/30",
      },
      klausurphase: {
        label: "Klausurwoche",
        bg: "bg-iu-red",
        text: "text-white",
        ring: "ring-iu-red/30",
      },
      nachpruefung: {
        label: "Nachprüfungsphase",
        bg: "bg-iu-indigo",
        text: "text-white",
        ring: "ring-iu-indigo/30",
      },
    },
    blocks: [
      ...COMMON_BLOCKS,
      { start: "2026-02-23", end: "2026-02-28", status: "klausurphase" },
      { start: "2026-03-15", end: "2026-03-25", status: "nachpruefung" },
      { start: "2025-10-01", end: "2025-11-30", status: "praxis" },
      { start: "2025-12-01", end: "2026-02-22", status: "theoriephase" },
      { start: "2026-03-01", end: "2026-03-31", status: "praxis" },
    ],
  },
  {
    id: "ss26",
    label: "Sommersemester Beispiel 2026",
    description: "Fallback-Plan für alle Studiengänge im SS26.",
    autoWeekends: true,
    // No pattern = default fallback
    paletteOverrides: {
      praxis: {
        label: "Praxisphase",
        bg: "bg-iu-green",
        text: "text-white",
        ring: "ring-iu-green/30",
      },
      theoriephase: {
        label: "Theorieblock",
        bg: "bg-iu-purple",
        text: "text-white",
        ring: "ring-iu-purple/30",
      },
      klausurphase: {
        label: "Klausurwoche",
        bg: "bg-iu-red",
        text: "text-white",
        ring: "ring-iu-red/30",
      },
    },
    blocks: [
      ...COMMON_BLOCKS,
      { start: "2026-04-01", end: "2026-05-31", status: "theoriephase" },
      { start: "2026-06-01", end: "2026-07-31", status: "praxis" },
      { start: "2026-08-01", end: "2026-08-10", status: "klausurphase" },
    ],
  },
];

// Helper function to find study plan by Studiengang name
export function getStudyPlanByStudiengang(studiengangName: string | null | undefined): StudyPlan {
  if (!studiengangName) return STUDY_PLANS[0]; // Default fallback
  
  // Find plan that matches the Studiengang pattern
  const matchingPlan = STUDY_PLANS.find(plan => {
    if (!plan.studiengangPattern) return false;
    return plan.studiengangPattern.some(pattern => 
      studiengangName.toLowerCase().includes(pattern.toLowerCase())
    );
  });
  
  return matchingPlan || STUDY_PLANS[0]; // Return matching or default
}

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
