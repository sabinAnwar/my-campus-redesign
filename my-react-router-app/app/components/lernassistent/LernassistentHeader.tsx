import React from "react";
import { Brain, Sparkles } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface LernassistentHeaderProps {
  t: any;
}

export function LernassistentHeader({ t }: LernassistentHeaderProps) {
  return (
    <PageHeader
      icon={Brain}
      title={
        <span className="flex items-center gap-2">
          {t.title}
          <Sparkles className="w-6 h-6 text-amber-500" />
        </span>
      }
      subtitle={t.subtitle}
      iconBg="bg-iu-blue/10 dark:bg-iu-blue"
      iconColor="text-iu-blue dark:text-white"
    />
  );
}

