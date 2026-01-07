import { useState, useMemo } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const FORM_DEFINITIONS = useMemo(() => getFormDefinitions(t), [t]);

  const stats = useMemo(() => {
    return {
      total: MOCK_ITEMS.length,
      pending: MOCK_ITEMS.filter((i) => i.status === "pending").length,
      approved: MOCK_ITEMS.filter((i) => i.status === "approved").length,
      rejected: MOCK_ITEMS.filter((i) => i.status === "rejected").length,
    };
  }, []);

  const filteredItems = useMemo(() => {
    return MOCK_ITEMS.filter((item) => {
      const title = t.itemTitles[item.id as keyof typeof t.itemTitles] || item.titleKey;
      const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = activeStatus === "all" || item.status === activeStatus;
      const matchesCategory = activeCategory === "all" || item.categoryKey === activeCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, activeStatus, activeCategory, t]);

  const handleOpenForm = (application: ApplicationItem) => {
    const form = (FORM_DEFINITIONS as any)[application.id] || (FORM_DEFINITIONS as any).default;
    setSelectedForm(form);
    setFormData({});
  };

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setSelectedForm(null);
    setFormData({});
    alert(t.submitSuccess);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-iu-blue/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-iu-blue/3 blur-[100px] rounded-full pointer-events-none" />

      <main className="relative z-10 max-w-[1400px] mx-auto py-8 sm:py-12">
        {/* Navigation */}
        <AntragsHeader t={t} language={language} />


        <ApplicationStats stats={stats} t={t} />

        {/* Filters Section */}
        <div className="my-8">
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

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              t={t}
              language={language}
              onOpen={handleOpenForm}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-card/50 backdrop-blur-xl border border-border border-dashed rounded-[3rem]">
            <p className="text-muted-foreground font-medium">{t.noResults}</p>
          </div>
        )}
      </main>

      {/* Form Modal */}
      {selectedForm && (
        <ApplicationFormModal
          t={t}
          formDef={selectedForm}
          formData={formData}
          onClose={() => setSelectedForm(null)}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          language={language}
        />
      )}
    </div>
  );
}
