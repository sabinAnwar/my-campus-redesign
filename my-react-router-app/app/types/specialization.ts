import type { LucideIcon } from "lucide-react";

export type VertiefungId =
  | "datenanalyse"
  | "softwareengineering"
  | "projektmanagement";

export interface VertiefungCourse {
  id: string;
  code: string;
  name: string;
  credits: number;
  semester: number;
  description?: string;
  topics: string[];
}

export interface Vertiefung {
  id: string;
  name: string;
  nameEn: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  darkGradient: string;
  description: string;
  highlights: string[];
  courses: VertiefungCourse[];
  careerPaths: string[];
}
