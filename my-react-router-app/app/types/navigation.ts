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

export type MenuItemProps = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  danger?: boolean;
};
