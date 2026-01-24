import type { PraxisReport } from "~/types/praxisbericht";

export const STATUS_STYLES = {
  DUE: {
    bg: "bg-amber-900",
    text: "text-white",
    border: "border-amber-900",
  },
  DRAFT: {
    bg: "bg-sky-900",
    text: "text-white",
    border: "border-sky-900",
  },
  SUBMITTED: {
    bg: "bg-emerald-900",
    text: "text-white",
    border: "border-emerald-900",
  },
  APPROVED: {
    bg: "bg-violet-900",
    text: "text-white",
    border: "border-violet-900",
  },
  EXAM_PHASE: {
    bg: "bg-slate-900",
    text: "text-white",
    border: "border-slate-900",
  },
  ALL: {
    bg: "bg-card/50",
    text: "text-foreground",
    border: "border-border",
  },
};

export const normalizeReport = (report: any): PraxisReport | undefined | null => {
  if (!report) return report;
  const rawStatus =
    typeof report.status === "string" ? report.status.toUpperCase() : "DUE";
  const normalizedStatus =
    rawStatus === "KLAUSUR" ? "KLAUSURPHASE" : rawStatus;
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
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
  // Thursday in current week decides the year
  const dayNum = d.getUTCDay() || 7; // 1..7, Mon..Sun
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
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

export function getSemesterWeekKeys(semStartYear: number, semStartMonth: number) {
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
