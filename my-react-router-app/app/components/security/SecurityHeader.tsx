import { Shield } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface SecurityHeaderProps {
  title: string;
  subtitle: string;
}

export function SecurityHeader({ title, subtitle }: SecurityHeaderProps) {
  return (
    <PageHeader
      icon={Shield}
      title={title}
      subtitle={subtitle}
    />
  );
}

