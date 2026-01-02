import {
  BookOpen,
  MessageCircleQuestion,
  Presentation,
  Users,
  Wrench,
  FileCheck,
  MessageSquare,
  PenTool,
  type LucideIcon,
} from "lucide-react";

export const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export const EVENT_ICONS: Record<string, LucideIcon> = {
  Integriert: BookOpen,
  "Q&A": MessageCircleQuestion,
  Vorlesung: Presentation,
  Tutorium: Users,
  Workshop: Wrench,
  Prüfung: FileCheck,
  Seminar: MessageSquare,
  Uebung: PenTool,
};

export const EVENT_COLORS: Record<
  string,
  {
    bg: string;
    border: string;
    text: string;
    dotColor: string;
  }
> = {
  Integriert: {
    bg: "bg-iu-blue/10",
    border: "border-iu-blue/30",
    text: "text-iu-blue dark:text-iu-blue",
    dotColor: "#10b981",
  },
  "Q&A": {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-600 dark:text-amber-400",
    dotColor: "#f59e0b",
  },
  Vorlesung: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-600 dark:text-blue-400",
    dotColor: "#3b82f6",
  },
  Tutorium: {
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    text: "text-teal-600 dark:text-teal-400",
    dotColor: "#14b8a6",
  },
  Workshop: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-600 dark:text-indigo-400",
    dotColor: "#6366f1",
  },
  Prüfung: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-600 dark:text-rose-400",
    dotColor: "#f43f5e",
  },
  Seminar: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-600 dark:text-purple-400",
    dotColor: "#a855f7",
  },
  Uebung: {
    bg: "bg-lime-500/10",
    border: "border-lime-500/30",
    text: "text-lime-600 dark:text-lime-400",
    dotColor: "#84cc16",
  },
};
