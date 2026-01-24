import React from "react";
import { useLanguage } from "~/store/LanguageContext";
import {
  FileText,
  ShieldCheck,
  BookOpen,
  Lock,
  AlertCircle,
} from "lucide-react";
import { TRANSLATIONS } from "~/services/translations/info-center";

// Components
import { InfoCenterHeader } from "~/features/info-center/InfoCenterHeader";
import { InfoCenterCard } from "~/features/info-center/InfoCenterCard";
import { InfoCenterFooter } from "~/features/info-center/InfoCenterFooter";

export default function InfoCenterPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  return (
    <div className="max-w-7xl mx-auto">
      <InfoCenterHeader t={t} />

      {/* Grid Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <InfoCenterCard
          to="/exams"
          icon={FileText}
          backgroundIcon={BookOpen}
          title={t.examGuide}
          description={t.examDesc}
          badge={{ text: t.new, variant: "blue" }}
          t={t}
        />

        <InfoCenterCard
          to="/security"
          icon={ShieldCheck}
          backgroundIcon={Lock}
          title={t.security}
          description={t.securityDesc}
          badge={{ text: t.important, icon: AlertCircle, variant: "amber" }}
          t={t}
        />
      </div>

      <InfoCenterFooter language={language} />
    </div>
  );
}
