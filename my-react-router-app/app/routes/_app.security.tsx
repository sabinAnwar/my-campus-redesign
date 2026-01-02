import {
  Lock,
  Key,
  RefreshCw,
  Mail,
  Smartphone,
  Database,
  Users,
  ShieldAlert,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/security";
import {
  SecurityCard,
  SecurityHeader,
  SecurityReportNote,
} from "~/components/security";

const iconMap = [
  Users,
  ShieldAlert,
  Key,
  RefreshCw,
  Mail,
  Smartphone,
  Database,
  Lock,
];

export default function SecurityGuidelines() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <SecurityHeader
        title={t.title}
        subtitle={t.subtitle}
      />

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {t.guidelines.map((item, index) => (
          <SecurityCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            icon={iconMap[index % iconMap.length]}
            ruleLabel={t.rule}
          />
        ))}
      </div>

      {/* Footer Note */}
      <SecurityReportNote t={t} />
    </div>
  );
}

