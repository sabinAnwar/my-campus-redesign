import { useLanguage } from "~/store/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/contact";

// Components
import { ContactHeader } from "~/features/contact/ContactHeader";
import { ContactForm } from "~/features/contact/ContactForm";
import { SupportHours } from "~/features/contact/SupportHours";
import { EmergencyContact } from "~/features/contact/EmergencyContact";
import { ContactMethods } from "~/features/contact/ContactMethods";
import { FAQLink } from "~/features/contact/FAQLink";
import { CampusLocations } from "~/features/contact/CampusLocations";

export default function Contact() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-10 pb-12 sm:pb-16">
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
