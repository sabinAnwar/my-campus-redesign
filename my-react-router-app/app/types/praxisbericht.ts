export interface PraxisDayEntry {
  from?: string;
  till?: string;
  notes?: string;
  holiday?: boolean;
  hold?: boolean;
  mood?: string;
}

export interface PraxisReport {
  id?: number | string;
  isoWeekKey: string;
  status: "DUE" | "DRAFT" | "SUBMITTED" | "APPROVED" | "KLAUSURPHASE" | "KLAUSUR";
  normStatus?: string;
  tasks: string;
  days: Record<string, PraxisDayEntry>; // e.g., "Mon", "Tue" mapped to entry
  weekTotal?: number;
  
  // Timestamps
  createdAt?: string | Date;
  updatedAt?: string | Date; // often "editedAt" in local normalizers
  editedAt?: string | Date;
  approvedAt?: string | Date;
  
  // User/Reference
  user_id?: number;
}

export type StatusFilter = "ALL" | "DUE" | "DRAFT" | "SUBMITTED" | "APPROVED" | "KLAUSURPHASE";

export interface PraxisStats {
  submitted: number;
  due: number;
  klausur: number;
  completion: number;
  drafts: number;
  approved: number;
  satisfied: number;
}
