import { Shield } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface SecurityHeaderProps {
  title: string;
  subtitle: string;
  language: string;
}

export function SecurityHeader({ title, subtitle, language }: SecurityHeaderProps) {
  return (
    <PageHeader
      icon={Shield}
      title={title}
      subtitle={subtitle}
      backTo="/info-center"
      backLabel={language === "de" ? "Zurück zu Info Center" : "Back to Info Center"}
    />
  );
}

