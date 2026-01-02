import { useState, useMemo } from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS, getToolCategories } from "~/constants/benefits";
import type { BenefitTool, ToolCategory, FeaturedTool } from "~/types/benefits";

// Components
import { BenefitsHeader } from "~/components/benefits/BenefitsHeader";
import { FeaturedTools } from "~/components/benefits/FeaturedTools";
import { BenefitsSearch } from "~/components/benefits/BenefitsSearch";
import { ToolCategoryGrid } from "~/components/benefits/ToolCategoryGrid";

const ALL_CATEGORIES = "all";

function matchesSearch(tool: BenefitTool, query: string): boolean {
  const lowerQuery = query.toLowerCase();
  return (
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery)
  );
}

function filterCategories(
  categories: ToolCategory[],
  selectedCategory: string,
  searchQuery: string
): ToolCategory[] {
  return categories.filter((category) => {
    const matchesCategory =
      selectedCategory === ALL_CATEGORIES ||
      category.title === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery) return true;
    return category.tools.some((tool) => matchesSearch(tool, searchQuery));
  });
}

function extractFeaturedTools(categories: ToolCategory[]): FeaturedTool[] {
  return categories.flatMap((cat) =>
    cat.tools
      .filter((tool) => tool.featured)
      .map((tool) => ({ ...tool, category: cat.title }))
  );
}

function countTotalTools(categories: ToolCategory[]): number {
  return categories.reduce((sum, cat) => sum + cat.tools.length, 0);
}

import { PageHeader } from "~/components/shared/PageHeader";
import { Star } from "lucide-react";

export default function StudentBenefits() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS];
  const toolCategories = getToolCategories(t) as ToolCategory[];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES);

  const totalTools = useMemo(
    () => countTotalTools(toolCategories),
    [toolCategories]
  );

  const featuredTools = useMemo(
    () => extractFeaturedTools(toolCategories),
    [toolCategories]
  );

  const filteredCategories = useMemo(
    () => filterCategories(toolCategories, selectedCategory, searchQuery),
    [toolCategories, selectedCategory, searchQuery]
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
      <PageHeader
        icon={Star}
        title={t.title}
        subtitle={t.subtitle(totalTools)}
      >
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-xs sm:text-sm font-bold w-fit">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{t.exclusiveFor}</span>
        </div>
      </PageHeader>

      <FeaturedTools t={t} featuredTools={featuredTools} />

      <BenefitsSearch
        t={t}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        toolCategories={toolCategories}
        ALL_CATEGORIES={ALL_CATEGORIES}
      />

      <section className="space-y-8 sm:space-y-12 md:space-y-16">
        {filteredCategories.map((category) => (
          <ToolCategoryGrid
            key={category.title}
            t={t}
            category={category}
          />
        ))}
      </section>
    </div>
  );
}
