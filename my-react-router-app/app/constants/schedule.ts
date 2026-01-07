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
    bg: "bg-iu-blue",
    border: "border-iu-blue/30",
    text: "text-white",
    dotColor: "#1f4dd9",
  },
  "Q&A": {
    bg: "bg-iu-teal",
    border: "border-iu-teal/30",
    text: "text-white",
    dotColor: "#1a5b66",
  },
  Vorlesung: {
    bg: "bg-iu-indigo",
    border: "border-iu-indigo/30",
    text: "text-white",
    dotColor: "#2b3f86",
  },
  Tutorium: {
    bg: "bg-iu-green",
    border: "border-iu-green/30",
    text: "text-white",
    dotColor: "#1f7a2e",
  },
  Workshop: {
    bg: "bg-iu-pink",
    border: "border-iu-pink/30",
    text: "text-white",
    dotColor: "#b1008a",
  },
  Prüfung: {
    bg: "bg-iu-red",
    border: "border-iu-red/30",
    text: "text-white",
    dotColor: "#b00020",
  },
  Seminar: {
    bg: "bg-iu-purple",
    border: "border-iu-purple/30",
    text: "text-white",
    dotColor: "#5f2db8",
  },
  Uebung: {
    bg: "bg-iu-orange",
    border: "border-iu-orange/30",
    text: "text-white",
    dotColor: "#a14e00",
  },
};
