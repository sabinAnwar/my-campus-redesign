import React from "react";
import { Info } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface InfoCenterHeaderProps {
  t: any;
}

export function InfoCenterHeader({ t }: InfoCenterHeaderProps) {
  return (
    <PageHeader
      icon={Info}
      title={t.title}
      subtitle={t.subtitle}
    />
  );
}

