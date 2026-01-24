import { Settings as SettingsIcon } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface SettingsHeaderProps {
  title: string;
  subtitle: string;
}

export function SettingsHeader({ title, subtitle }: SettingsHeaderProps) {
  return (
    <PageHeader
      icon={SettingsIcon}
      title={title}
      subtitle={subtitle}
      backTo="/dashboard"
      backLabel="Dashboard"
    />
  );
}

