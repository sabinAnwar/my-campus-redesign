import React from "react";
import { BookOpen } from "lucide-react";
import { EVENT_ICONS } from "~/constants/schedule";

interface EventIconProps {
  type: string;
  className?: string;
}

export const EventIcon: React.FC<EventIconProps> = ({
  type,
  className = "h-4 w-4",
}) => {
  const Icon = EVENT_ICONS[type] || BookOpen;
  return <Icon className={className} />;
};
