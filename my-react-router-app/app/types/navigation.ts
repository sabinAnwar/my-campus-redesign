import React from "react";

export type NavKey =
  | "dashboard"
  | "courseSchedule"
  | "courses"
  | "recentFiles"
  | "tasks"
  | "praxisReport"
  | "infoCenter"
  | "benefits"
  | "socialMedia"
  | "news"
  | "faq"
  | "studyOrg"
  | "contact"
  | "roomBooking"
  | "library"
  | "lernassistent";

import type { LucideIcon } from "lucide-react";

export type MenuItemProps = {
  to: string;
  icon: LucideIcon;
  label: string;
  danger?: boolean;
};
