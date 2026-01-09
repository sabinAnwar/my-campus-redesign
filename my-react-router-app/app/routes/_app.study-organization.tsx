import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS } from "~/services/translations/study-organization";
import { NAVIGATION_CARDS, QUICK_LINKS } from "~/constants/study-organization";
import {
  PageHeader,
  NavigationCardComponent,
  QuickLinksSection,
} from "~/components/study-organization";

//// COMPONENT
//
export default function StudyOrganization() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  return (
    <main className="max-w-7xl mx-auto relative z-10">
      <PageHeader
        title={t.title}
        subtitle={t.subtitle}
        badge={t.studentPortal}
      />

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {NAVIGATION_CARDS.map((card, index) => (
          <NavigationCardComponent
            key={card.to}
            card={card}
            title={t[card.titleKey]}
            description={t[card.descKey]}
            index={index}
          />
        ))}
      </div>

      <QuickLinksSection links={QUICK_LINKS} translations={t} />
    </main>
  );
}
