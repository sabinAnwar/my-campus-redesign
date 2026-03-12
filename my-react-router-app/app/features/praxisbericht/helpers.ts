import type { PraxisReport } from "~/types/praxisbericht";
import type { StudyPlan, DayStatus } from "~/utils/studyPlans";
import { getBlockStatusForDate } from "~/utils/studyPlans";

export const STATUS_STYLES = {
  DUE: {
    bg: "bg-amber-200 dark:bg-amber-500/30",
    text: "text-amber-950 dark:text-amber-100",
    border: "border-amber-400 dark:border-amber-500/40",
  },
  DRAFT: {
    bg: "bg-sky-200 dark:bg-sky-500/30",
    text: "text-sky-950 dark:text-sky-100",
    border: "border-sky-400 dark:border-sky-500/40",
  },
  SUBMITTED: {
    bg: "bg-emerald-200 dark:bg-emerald-500/30",
    text: "text-emerald-950 dark:text-emerald-100",
    border: "border-emerald-400 dark:border-emerald-500/40",
  },
  APPROVED: {
    bg: "bg-violet-200 dark:bg-violet-500/30",
    text: "text-violet-950 dark:text-violet-100",
    border: "border-violet-400 dark:border-violet-500/40",
  },
  EXAM_PHASE: {
    bg: "bg-slate-200 dark:bg-slate-500/30",
    text: "text-slate-950 dark:text-slate-100",
    border: "border-slate-400 dark:border-slate-500/40",
  },
  // Studienplan-synced phase colors
  THEORIE: {
    bg: "bg-stone-200 dark:bg-stone-500/30",
    text: "text-stone-950 dark:text-stone-100",
    border: "border-stone-400 dark:border-stone-500/40",
  },
  KLAUSUR: {
    bg: "bg-rose-200 dark:bg-rose-500/30",
    text: "text-rose-950 dark:text-rose-100",
    border: "border-rose-400 dark:border-rose-500/40",
  },
  NACHPRUEFUNG: {
    bg: "bg-indigo-200 dark:bg-indigo-500/30",
    text: "text-indigo-950 dark:text-indigo-100",
    border: "border-indigo-400 dark:border-indigo-500/40",
  },
  FEIERTAG: {
    bg: "bg-orange-200 dark:bg-orange-500/30",
    text: "text-orange-950 dark:text-orange-100",
    border: "border-orange-400 dark:border-orange-500/40",
  },
  ALL: {
    bg: "bg-card/50",
    text: "text-foreground",
    border: "border-border",
  },
};

export const normalizeReport = (
  report: any,
): PraxisReport | undefined | null => {
  if (!report) return report;
  const rawStatus =
    typeof report.status === "string" ? report.status.toUpperCase() : "DUE";
  const normalizedStatus = rawStatus === "KLAUSUR" ? "KLAUSURPHASE" : rawStatus;
  return {
    ...report,
    status: normalizedStatus,
    isoWeekKey: report.isoWeekKey || report.iso_week_key,
    editedAt: report.editedAt || report.edited_at,
    approvedAt: report.approvedAt || report.approved_at,
    createdAt: report.createdAt || report.created_at,
  };
};

// Helpers
export function getISOWeekKey(date: Date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  // Thursday in current week decides the year
  const dayNum = d.getUTCDay() || 7; // 1..7, Mon..Sun
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );
  const weekStr = String(weekNo).padStart(2, "0");
  return `${d.getUTCFullYear()}-W${weekStr}`;
}

export function parseISOWeekStart(weekKey: string | null | undefined) {
  // weekKey format: YYYY-Www
  try {
    if (typeof weekKey !== "string") return null;
    const [y, w] = weekKey.split("-W");
    const year = parseInt(y, 10);
    const week = parseInt(w, 10);
    if (!year || !week) return null;
    // Start from Jan 1 and add (week-1)*7 days, then adjust to Monday
    const simple = new Date(year, 0, 1 + (week - 1) * 7);
    const day = simple.getDay(); // 0=Sun..6=Sat
    const diffToMonday = (day + 6) % 7; // 0 if Monday
    simple.setDate(simple.getDate() - diffToMonday);
    return new Date(simple.getFullYear(), simple.getMonth(), simple.getDate());
  } catch (_e) {
    return null;
  }
}

export function buildMonth(year: number, month: number) {
  // Build a 6x7 grid starting Monday
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7; // 0=Mon
  const start = new Date(year, month, 1 - startOffset);
  const weeks = [];
  for (let w = 0; w < 6; w++) {
    const row = [];
    for (let d = 0; d < 7; d++) {
      const current = new Date(start);
      current.setDate(start.getDate() + w * 7 + d);
      row.push(current);
    }
    weeks.push(row);
  }
  return weeks;
}

export function getMonthWeekKeys(year: number, month: number) {
  // Collect unique ISO week keys that intersect the given month (1..last day)
  const keys = new Set();
  const lastDay = new Date(year, month + 1, 0).getDate();
  for (let day = 1; day <= lastDay; day++) {
    const d = new Date(year, month, day);
    keys.add(getISOWeekKey(d));
  }
  return keys;
}

export function getSemesterWeekKeys(
  semStartYear: number,
  semStartMonth: number,
) {
  const keys = new Set();
  for (let i = 0; i < 6; i++) {
    const d = new Date(semStartYear, semStartMonth + i, 1);
    const monthKeys = getMonthWeekKeys(d.getFullYear(), d.getMonth());
    monthKeys.forEach((k) => keys.add(k));
  }
  return keys;
}

export function parseToMinutes(t: string | null | undefined): number | null {
  if (typeof t !== "string" || !t.includes(":")) return null;
  const [hh, mm] = t.split(":");
  const h = Number(hh);
  const m = Number(mm);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/**
 * Determine the dominant study phase for a given ISO week.
 * Returns "praxis" if any weekday (Mon-Fri) in the week falls in a praxis block,
 * "klausurphase"/"nachpruefung" if the week is in exam periods,
 * "theoriephase" for theory weeks, or null if no plan data.
 */
export function getWeekPhase(
  weekKey: string,
  studyPlan: StudyPlan | null | undefined,
): DayStatus | null {
  if (!studyPlan) return null;
  const start = parseISOWeekStart(weekKey);
  if (!start) return null;

  const phases: (DayStatus | null)[] = [];
  // Check Mon-Fri (index 0-4)
  for (let i = 0; i < 5; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    phases.push(getBlockStatusForDate(studyPlan, d));
  }

  // Priority: if any day is klausurphase or nachpruefung, treat it as exam week
  if (phases.includes("klausurphase")) return "klausurphase";
  if (phases.includes("nachpruefung")) return "nachpruefung";
  // If any weekday is praxis, it's a praxis week → report is DUE
  if (phases.includes("praxis")) return "praxis";
  // Otherwise theoriephase or vorlesung
  if (phases.includes("theoriephase")) return "theoriephase";
  if (phases.includes("vorlesung")) return "vorlesung";
  // All holidays
  if (phases.every((p) => p === "feiertag")) return "feiertag";
  return phases[0];
}
