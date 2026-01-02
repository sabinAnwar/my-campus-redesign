import { MessageSquare } from "lucide-react";
import { PageHeader } from "~/components/shared/PageHeader";

interface ContactHeaderProps {
  t: any;
}

export function ContactHeader({ t }: ContactHeaderProps) {
  return (
    <PageHeader
      icon={MessageSquare}
      title={t.title}
      subtitle={t.subtitle}
    />
  );
}
