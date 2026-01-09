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
  Lecture: Presentation,
  Seminar: MessageSquare,
  Sprint: MessageSquare,
  "Q&A": MessageCircleQuestion,
  Other: MessageCircleQuestion,
  Exam: FileCheck,
  Tutorium: Users,
  Workshop: Wrench,
  Praxis: PenTool,
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
  // Distinct AAA colors for each type
  Lecture: {
    bg: "bg-iu-purple",
    border: "border-iu-purple/50",
    text: "text-white",
    dotColor: "#421a66",
  },
  Seminar: {
    bg: "bg-iu-indigo",
    border: "border-iu-indigo/50",
    text: "text-white",
    dotColor: "#1e266d",
  },
  Sprint: {
    bg: "bg-iu-brown",
    border: "border-iu-brown/50",
    text: "text-white",
    dotColor: "#66301a",
  },
  Exam: {
    bg: "bg-iu-red",
    border: "border-iu-red/50",
    text: "text-white",
    dotColor: "#6d091e",
  },
  "Q&A": {
    bg: "bg-iu-orange",
    border: "border-iu-orange/50",
    text: "text-white",
    dotColor: "#6b2f06",
  },
  Other: {
    bg: "bg-iu-gold",
    border: "border-iu-gold/50",
    text: "text-white",
    dotColor: "#705100",
  },
  Tutorium: {
    bg: "bg-iu-teal",
    border: "border-iu-teal/50",
    text: "text-white",
    dotColor: "#05616b",
  },
  Workshop: {
    bg: "bg-iu-pink",
    border: "border-iu-pink/50",
    text: "text-white",
    dotColor: "#650b4b",
  },
  Integriert: {
    bg: "bg-iu-blue",
    border: "border-iu-blue/50",
    text: "text-white",
    dotColor: "#111f60",
  },
  Praxis: {
    bg: "bg-iu-green",
    border: "border-iu-green/50",
    text: "text-white",
    dotColor: "#174f26",
  },
};
