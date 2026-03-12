export type DayStatus =
  | "praxis"
  | "vorlesung"
  | "theoriephase"
  | "klausurphase"
  | "nachpruefung"
  | "wochenende"
  | "feiertag";

export type PaletteEntry = {
  label: string;
  bg: string;
  text: string;
  ring: string;
  textSoft?: string; // Text color for soft backgrounds (Light Mode)
  darkTextSoft?: string; // Text color for soft backgrounds (Dark Mode)
};

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
    textSoft: "text-iu-green",
    darkTextSoft: "text-emerald-50",
  },
  vorlesung: {
    label: "Vorlesungstermine",
    bg: "bg-primary/10",
    text: "text-primary",
    ring: "ring-primary/20",
    textSoft: "text-foreground",
    darkTextSoft: "text-foreground",
  },
  theoriephase: {
    label: "Theoriewoche",
    bg: "bg-iu-purple",
    text: "text-white",
    ring: "ring-iu-purple/30",
    textSoft: "text-iu-purple",
    darkTextSoft: "text-violet-100",
  },
  klausurphase: {
    label: "Klausurwoche",
    bg: "bg-iu-red",
    text: "text-white",
    ring: "ring-iu-red/30",
    textSoft: "text-iu-red",
    darkTextSoft: "text-rose-100",
  },
  nachpruefung: {
    label: "Nachprüfungsphase",
    bg: "bg-iu-indigo",
    text: "text-white",
    ring: "ring-iu-indigo/30",
    textSoft: "text-iu-indigo",
    darkTextSoft: "text-indigo-100",
  },
  wochenende: {
    label: "Wochenenden (frei von Praxis)",
    bg: "bg-iu-orange",
    text: "text-white",
    ring: "ring-iu-orange/30",
    textSoft: "text-iu-orange",
    darkTextSoft: "text-orange-100",
  },
  feiertag: {
    label: "Feiertag",
    bg: "bg-iu-gold",
    text: "text-white",
    ring: "ring-iu-gold/30",
    textSoft: "text-iu-gold",
    darkTextSoft: "text-yellow-50",
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
        textSoft: "text-violet-950",
        darkTextSoft: "text-violet-50",
      },
      praxis: {
        label: "Praxiswochen",
        bg: "bg-iu-green",
        text: "text-white",
        ring: "ring-iu-green/30",
        textSoft: "text-emerald-950",
        darkTextSoft: "text-emerald-50",
      },
      klausurphase: {
        label: "Klausurwoche",
        bg: "bg-iu-red",
        text: "text-white",
        ring: "ring-iu-red/30",
        textSoft: "text-red-900",
        darkTextSoft: "text-rose-100",
      },
      nachpruefung: {
        label: "Nachprüfungsphase",
        bg: "bg-iu-indigo",
        text: "text-white",
        ring: "ring-iu-indigo/30",
        textSoft: "text-indigo-900",
        darkTextSoft: "text-indigo-100",
      },
      wochenende: {
        label: "Wochenenden (max. 2/Monat arbeiten)",
        bg: "bg-iu-orange",
        text: "text-white",
        ring: "ring-iu-orange/30",
        textSoft: "text-orange-900",
        darkTextSoft: "text-orange-100",
      },
      feiertag: {
        label: "Nationaler Feiertag",
        bg: "bg-iu-gold",
        text: "text-white",
        ring: "ring-iu-gold/30",
        textSoft: "text-yellow-900",
        darkTextSoft: "text-yellow-50",
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
        textSoft: "text-indigo-900",
        darkTextSoft: "text-violet-100",
      },
      praxis: {
        label: "Praxiswochen",
        bg: "bg-iu-green",
        text: "text-white",
        ring: "ring-iu-green/30",
        textSoft: "text-emerald-900",
        darkTextSoft: "text-emerald-50",
      },
      klausurphase: {
        label: "Klausurwoche",
        bg: "bg-iu-red",
        text: "text-white",
        ring: "ring-iu-red/30",
        textSoft: "text-red-900",
        darkTextSoft: "text-rose-100",
      },
      nachpruefung: {
        label: "Nachprüfungsphase",
        bg: "bg-iu-indigo",
        text: "text-white",
        ring: "ring-iu-indigo/30",
        textSoft: "text-indigo-900",
        darkTextSoft: "text-indigo-100",
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
        label: "",
        bg: "bg-iu-green",
        text: "text-white",
        ring: "ring-iu-green/30",
        textSoft: "text-emerald-900",
        darkTextSoft: "text-emerald-50",
      },
      theoriephase: {
        label: "Theorieblock",
        bg: "bg-iu-purple",
        text: "text-white",
        ring: "ring-iu-purple/30",
        textSoft: "text-indigo-900",
        darkTextSoft: "text-violet-100",
      },
      klausurphase: {
        label: "Klausurwoche",
        bg: "bg-iu-red",
        text: "text-white",
        ring: "ring-iu-red/30",
        textSoft: "text-red-900",
        darkTextSoft: "text-rose-100",
      },
    },
    blocks: [
      ...COMMON_BLOCKS,
      { start: "2026-05-25", end: "2026-05-29", status: "klausurphase" },
      { start: "2026-06-15", end: "2026-06-19", status: "nachpruefung" },
      { start: "2026-04-01", end: "2026-05-31", status: "theoriephase" },
      { start: "2026-06-01", end: "2026-07-31", status: "praxis" },
      { start: "2026-08-01", end: "2026-08-10", status: "klausurphase" },
    ],
  },
];

// Helper function to find study plan by Studiengang name
// Merges the matched plan with fallback plans (no studiengangPattern) so that
// all semesters are covered, not just the current one.
export function getStudyPlanByStudiengang(
  studiengangName: string | null | undefined,
): StudyPlan {
  // Find the primary plan matching the Studiengang
  let primaryPlan: StudyPlan | undefined;

  if (studiengangName) {
    primaryPlan = STUDY_PLANS.find((plan) => {
      if (!plan.studiengangPattern) return false;
      return plan.studiengangPattern.some((pattern) =>
        studiengangName.toLowerCase().includes(pattern.toLowerCase()),
      );
    });
  }

  if (!primaryPlan) primaryPlan = STUDY_PLANS[0];

  // Gather fallback plans (those without studiengangPattern) that cover other semesters
  const fallbackPlans = STUDY_PLANS.filter(
    (plan) => !plan.studiengangPattern && plan.id !== primaryPlan!.id,
  );

  if (fallbackPlans.length === 0) return primaryPlan;

  // Merge: primary plan blocks first (higher priority), then fallback blocks for uncovered periods
  return {
    ...primaryPlan,
    blocks: [...primaryPlan.blocks, ...fallbackPlans.flatMap((p) => p.blocks)],
  };
}

export function getBlockStatusForDate(
  plan: StudyPlan,
  date: Date,
): DayStatus | null {
  const dateStr = toISODate(date);

  // 1. Check for holidays first
  const holiday = plan.blocks.find(
    (b) => b.status === "feiertag" && dateStr >= b.start && dateStr <= b.end,
  );
  if (holiday) return "feiertag";

  // 2. Check for Priority Blocks (Exams/Resits) BEFORE Split Logic
  const priorityBlock = plan.blocks.find(
    (b) =>
      (b.status === "klausurphase" || b.status === "nachpruefung") &&
      dateStr >= b.start &&
      dateStr <= b.end,
  );
  if (priorityBlock) return priorityBlock.status;

  // 3. Special Logic for SS26 (Split Week) overrides generic blocks
  if (dateStr >= "2026-04-01" && dateStr <= "2026-06-30") {
    const day = date.getDay();
    if (day >= 1 && day <= 3) return "praxis";
    if (day >= 4 && day <= 5) return "theoriephase";
  }

  // 4. Find regular block
  const block = plan.blocks.find((b) => dateStr >= b.start && dateStr <= b.end);
  return block ? block.status : null;
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
      Math.min(...blocks.map((b) => new Date(b.start).getTime())),
    );
    const maxEnd = new Date(
      Math.max(...blocks.map((b) => new Date(b.end).getTime())),
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
    new Date(Math.min(...starts.map((d) => d.getTime()))),
  );
  const maxEnd = endOfMonth(
    new Date(Math.max(...ends.map((d) => d.getTime()))),
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
