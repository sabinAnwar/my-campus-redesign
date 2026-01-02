import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/contact";

// Components
import { ContactHeader } from "~/components/contact/ContactHeader";
import { ContactForm } from "~/components/contact/ContactForm";
import { SupportHours } from "~/components/contact/SupportHours";
import { EmergencyContact } from "~/components/contact/EmergencyContact";
import { ContactMethods } from "~/components/contact/ContactMethods";
import { FAQLink } from "~/components/contact/FAQLink";
import { CampusLocations } from "~/components/contact/CampusLocations";

export default function Contact() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 pb-20 px-4 sm:px-6 lg:px-8">
      <ContactHeader t={t} />

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 sm:gap-12">
        {/* Main Content: Form and Hours/Emergency */}
        <div className="flex flex-col gap-8 sm:gap-12 lg:col-span-2">
          <ContactForm t={t} language={language} />

          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 items-stretch">
            <SupportHours t={t} />
            <EmergencyContact t={t} />
          </div>
        </div>

        {/* Sidebar: Methods, FAQ, and Locations */}
        <div className="flex flex-col gap-8 sm:gap-12">
          <ContactMethods t={t} />
          <FAQLink t={t} />
          <CampusLocations t={t} />
        </div>
      </div>
    </div>
  );
}
