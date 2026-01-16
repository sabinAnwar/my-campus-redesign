import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS, getFormDefinitions, MOCK_ITEMS } from "~/constants/antragsverwaltung";
import type { ApplicationItem, FormDefinition } from "~/types/antragsverwaltung";

// Components
import { AntragsHeader } from "~/components/antragsverwaltung/AntragsHeader";
import { ApplicationStats } from "~/components/antragsverwaltung/ApplicationStats";
import { FilterBar } from "~/components/antragsverwaltung/FilterBar";
import { ApplicationCard } from "~/components/antragsverwaltung/ApplicationCard";
import { ApplicationFormModal } from "~/components/antragsverwaltung/ApplicationFormModal";

export default function AntragsVerwaltung() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];

  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedForm, setSelectedForm] = useState<FormDefinition | null>(null);
  const [activeApplicationId, setActiveApplicationId] = useState<string | null>(null);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("iu_applications_state");
    if (saved) {
      setApplications(JSON.parse(saved));
    } else {
      setApplications(MOCK_ITEMS);
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("iu_applications_state", JSON.stringify(applications));
    }
  }, [applications, isLoaded]);

  const FORM_DEFINITIONS = useMemo(() => getFormDefinitions(t), [t]);

  const stats = useMemo(() => {
    return {
      total: applications.length,
      new: applications.filter((i) => i.status === "new").length,
      pending: applications.filter((i) => i.status === "pending").length,
      approved: applications.filter((i) => i.status === "approved").length,
      rejected: applications.filter((i) => i.status === "rejected").length,
    };
  }, [applications]);

  const filteredItems = useMemo(() => {
    return applications.filter((item) => {
      const title = t.itemTitles[item.id as keyof typeof t.itemTitles] || item.titleKey;
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = activeStatus === "all" || item.status === activeStatus;
      const matchesCategory = activeCategory === "all" || item.categoryKey === activeCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, activeStatus, activeCategory, t, applications]);

  // Split items for logical separation
  const activeApplications = filteredItems.filter(i => i.status !== "new");
  const allApplications = filteredItems; // Shows all 17 files as default library

  const handleOpenForm = (application: ApplicationItem) => {
    const form = (FORM_DEFINITIONS as any)[application.id] || (FORM_DEFINITIONS as any).default;
    setSelectedForm(form);
    setActiveApplicationId(application.id);
  };

  const handleStartApplication = () => {
    if (!activeApplicationId) return;
    setApplications(prev => prev.map(app => 
      app.id === activeApplicationId && app.status === "new"
        ? { ...app, status: "pending", updatedAt: new Date().toISOString() }
        : app
    ));
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-iu-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-iu-blue/3 blur-[100px] rounded-full pointer-events-none" />

      <main className="relative z-10 max-w-[1400px] mx-auto py-2">
        <AntragsHeader t={t} language={language} />

        <ApplicationStats stats={stats} t={t} />

        <div className="my-6 sm:my-8">
          <FilterBar
            t={t}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeStatus={activeStatus}
            setActiveStatus={setActiveStatus}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        {/* Section 1: Active Applications */}
        {activeApplications.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-iu-blue">Meine Aktiven Anträge</h2>
              <div className="h-px flex-1 bg-iu-blue/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {activeApplications.map((application) => (
                <ApplicationCard
                  key={`active-${application.id}`}
                  application={application}
                  t={t}
                  language={language}
                  onOpen={handleOpenForm}
                />
              ))}
            </div>
          </div>
        )}

        {/* Section 2: All Default Applications */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Alle Anträge</h2>
            <div className="h-px flex-1 bg-border/50" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {allApplications.map((application) => (
              <ApplicationCard
                key={`all-${application.id}`}
                application={application}
                t={t}
                language={language}
                onOpen={handleOpenForm}
              />
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-10 sm:py-16 bg-card/50 backdrop-blur-xl border border-border border-dashed rounded-[2rem] sm:rounded-[3rem]">
            <p className="text-sm sm:text-base text-muted-foreground font-medium">{t.noResults}</p>
          </div>
        )}
      </main>

      {/* Form Modal */}
      {selectedForm && (
        <ApplicationFormModal
          t={t}
          formDef={selectedForm}
          onClose={() => setSelectedForm(null)}
          onStarted={handleStartApplication}
          language={language}
        />
      )}
    </div>
  );
}

