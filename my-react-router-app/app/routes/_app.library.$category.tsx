import React from "react";
import { useParams } from "react-router";
import { useLanguage } from "~/store/LanguageContext";
import {
  TRANSLATIONS,
  DATABASES,
  TUTORIALS,
} from "~/config/library";

// Components
import { DatabasesSection } from "~/features/library/DatabasesSection";
import { TutorialsSection } from "~/features/library/TutorialsSection";

export default function LibraryCategory() {
  const { category } = useParams();
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  
  const activeFilter = category as "databases" | "ebooks" | "journals" | "tutorials";

  return (
    <div className="space-y-6 sm:space-y-8">
      {activeFilter !== "tutorials" ? (
        <DatabasesSection
          databases={DATABASES as any}
          activeFilter={activeFilter}
          language={language}
          title={t[activeFilter as keyof typeof t] || t.popularDatabases}
          subtitle={language === "de" ? "Deine wichtigsten Recherche-Tools" : "Your essential research tools"}
          viewAllLabel={t.viewAll}
        />
      ) : (
        <TutorialsSection
          tutorials={TUTORIALS as any}
          language={language}
          title={t.helpGuides}
          subtitle={language === "de" ? "Lerne, unsere Ressourcen optimal zu nutzen" : "Learn to make the most of our resources"}
        />
      )}
    </div>
  );
}
