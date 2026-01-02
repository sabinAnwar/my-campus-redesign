import { useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { BookOpen, Award, BadgeCheck, Library } from "lucide-react";

import { useLanguage } from "~/contexts/LanguageContext";
import { getCourseConfig } from "~/data/coursesConfig";
import { SHELL_TRANSLATIONS } from "~/services/translations/navigation";

/**
 * Represents a searchable item in the global search.
 */
export interface SearchItem {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  link: string;
}

/**
 * Custom hook that provides searchable data and filtered results
 * for the global search functionality in the app shell.
 *
 * @param searchQuery - Current search query string
 * @returns Object containing searchableData array and filtered results
 *
 * @example
 * const { searchableData, filteredResults } = useAppShellSearch(searchQuery);
 */
export function useAppShellSearch(searchQuery: string) {
  const { language } = useLanguage();
  const shellText = SHELL_TRANSLATIONS[language];

  /**
   * Builds the complete list of searchable items including courses
   * and static navigation items.
   */
  const searchableData = useMemo((): SearchItem[] => {
    const s = shellText.search;

    // Dynamic course items from configuration
    const courseConfig = getCourseConfig(language);
    const courseItems: SearchItem[] = courseConfig.map((course) => ({
      id: course.code,
      title: course.title,
      category: s.categories.courses,
      icon: BookOpen,
      link: `/courses/${course.code.toLowerCase()}`,
    }));

    // Static navigation items
    const staticItems: SearchItem[] = [
      {
        id: "lib1",
        title: s.items.library,
        category: s.categories.library,
        icon: Library,
        link: "/library/search",
      },
      {
        id: "g1",
        title: s.items.transcript,
        category: s.categories.grades,
        icon: Award,
        link: "/certificates/transcript",
      },
      {
        id: "g2",
        title: s.items.performanceOverview,
        category: s.categories.grades,
        icon: Award,
        link: "/notenverwaltung",
      },
      {
        id: "st1",
        title: s.items.studentId,
        category: s.categories.account,
        icon: BadgeCheck,
        link: "/student-id",
      },
    ];

    return [...courseItems, ...staticItems];
  }, [shellText, language]);

  /**
   * Filters search results based on the current query.
   * Returns empty array if query is empty.
   */
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return searchableData.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [searchQuery, searchableData]);

  return {
    searchableData,
    filteredResults,
  };
}
