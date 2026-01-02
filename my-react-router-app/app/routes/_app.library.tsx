import React, { useState } from "react";
import { Database, BookOpen, Newspaper, Play } from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";
import {
  TRANSLATIONS,
  DATABASES,
  SERVICES,
  TUTORIALS,
} from "~/constants/library";

// Components
import { LibraryHeader } from "~/components/library/LibraryHeader";
import { LibrarySearch } from "~/components/library/LibrarySearch";
import { QuickAccessCards } from "~/components/library/QuickAccessCards";
import { DatabasesSection } from "~/components/library/DatabasesSection";
import { ServicesSection } from "~/components/library/ServicesSection";
import { TutorialsSection } from "~/components/library/TutorialsSection";
import { LibrarySidebar } from "~/components/library/LibrarySidebar";

export const loader = async () => null;

export default function LibraryPage() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(
        `https://search.ebscohost.com/login.aspx?direct=true&scope=site&type=0&site=eds-live&lang=de&authtype=sso&custid=s6068579&groupid=main&bquery=${encodeURIComponent(searchQuery)}`,
        "_blank"
      );
    }
  };

  const quickAccessItems = [
    { icon: Database, label: t.databases, color: "iu-blue", count: DATABASES.length },
    { icon: BookOpen, label: t.ebooks, color: "iu-green", count: "50k+" },
    { icon: Newspaper, label: t.journals, color: "iu-purple", count: "10k+" },
    { icon: Play, label: t.tutorials, color: "iu-orange", count: TUTORIALS.length },
  ];

  const openingHours = [
    { day: t.monday, hours: "08:00 - 22:00" },
    { day: t.tuesday, hours: "08:00 - 22:00" },
    { day: t.wednesday, hours: "08:00 - 22:00" },
    { day: t.thursday, hours: "08:00 - 22:00" },
    { day: t.friday, hours: "08:00 - 20:00" },
    { day: t.saturday, hours: "10:00 - 18:00" },
    { day: t.sunday, hours: t.closed },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <LibraryHeader title={t.heroKicker} subtitle={t.heroSubtitle} />

      <LibrarySearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
        placeholder={t.searchPlaceholder}
        searchLabel={language === "de" ? "Suchen" : "Search"}
      />

      <QuickAccessCards
        items={quickAccessItems}
        availableLabel={language === "de" ? "verfügbar" : "available"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <DatabasesSection
            databases={DATABASES}
            language={language}
            title={t.popularDatabases}
            subtitle={language === "de" ? "Deine wichtigsten Recherche-Tools" : "Your essential research tools"}
            viewAllLabel={t.viewAll}
          />

          <ServicesSection
            services={SERVICES}
            language={language}
            title={t.services}
          />

          <TutorialsSection
            tutorials={TUTORIALS}
            language={language}
            title={t.helpGuides}
            subtitle={language === "de" ? "Lerne, unsere Ressourcen optimal zu nutzen" : "Learn to make the most of our resources"}
          />
        </div>

        {/* Sidebar */}
        <LibrarySidebar
          t={t}
          language={language}
          openingHours={openingHours}
        />
      </div>
    </div>
  );
}
