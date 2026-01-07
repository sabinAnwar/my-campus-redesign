import React from "react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

interface DynamicIconProps extends LucideProps {
  name: string;
}

/**
 * A component that renders a Lucide icon by its string name.
 * This is useful for data-driven icons that might be serialized.
 */
export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Icon = (LucideIcons as any)[name];

  if (!Icon) {
    // Fallback to a default icon or null if the icon name is invalid
    return <LucideIcons.HelpCircle {...props} />;
  }

  return <Icon {...props} />;
}
