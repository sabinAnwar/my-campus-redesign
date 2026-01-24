import { useMemo, useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { 
  BookOpen, 
  Award, 
  BadgeCheck, 
  Library, 
  CalendarDays, 
  FileSearch, 
  CheckSquare, 
  FolderOpen, 
  Gift, 
  Newspaper, 
  Brain, 
  BookOpenCheck 
} from "lucide-react";

import { useLanguage } from "~/store/LanguageContext";
import { getCourseConfig } from "~/data/coursesConfig";
import { SHELL_TRANSLATIONS } from "~/services/translations/navigation";
import { TRANSLATIONS as ANTRAG_TRANSLATIONS } from "~/services/translations/antragsverwaltung";

/**
 * Represents a searchable item in the global search.
 */
export interface SearchItem {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  link: string;
  code?: string;
}

export function useAppShellSearch(searchQuery: string) {
  const { language } = useLanguage();
  const shellText = SHELL_TRANSLATIONS[language];
  const [dbSearchItems, setDbSearchItems] = useState<SearchItem[]>([]);

  // Fetch all courses from DB to ensure "every" course is searchable
  useEffect(() => {
    async function fetchAllCourses() {
      try {
        const res = await fetch("/api/courses");
        if (res.ok) {
          const data = await res.json();
          if (data?.courses && Array.isArray(data.courses)) {
            const mapped: SearchItem[] = data.courses.map((c: any) => ({
              id: `db-course-${c.code || c.id}`,
              title: language === "de" ? (c.name_de || c.name) : (c.name_en || c.name),
              code: c.code,
              category: shellText?.search?.categories?.courses || "Kurse",
              icon: BookOpen,
              link: `/courses/${(c.code || c.id).toString().toLowerCase()}`,
            }));
            setDbSearchItems(mapped);
          }
        } else {
          console.warn("Global Search: API returned error", res.status);
        }
      } catch (err) {
        console.warn("Global Search: Failed to fetch DB courses", err);
      }
    }
    fetchAllCourses();
  }, [language, shellText?.search?.categories?.courses]);

  /**
   * Builds the complete list of searchable items including courses
   * and static navigation items.
   */
  const searchableData = useMemo((): SearchItem[] => {
    const s = shellText.search;
    const nav = shellText.nav;
    const menu = shellText.menu;

    // Static/Config course items
    const courseConfig = getCourseConfig(language);
    const configCourseItems: SearchItem[] = courseConfig.map((course) => ({
      id: `course-${course.code}`,
      title: course.title,
      code: course.code,
      category: s.categories.courses,
      icon: BookOpen,
      link: `/courses/${course.code.toLowerCase()}`,
    }));

    // Navigation items
    const navItems: SearchItem[] = [
      { id: "nav-dashboard", title: nav.dashboard, category: s.categories.library, icon: Library, link: "/dashboard" },
      { id: "nav-schedule", title: nav.courseSchedule, category: s.categories.courses, icon: CalendarDays, link: "/courses/schedule" },
      { id: "nav-courses", title: nav.courses, category: s.categories.courses, icon: BookOpen, link: "/courses" },
      { id: "nav-recent", title: nav.recentFiles, category: s.categories.documents, icon: FileSearch, link: "/files/recent" },
      { id: "nav-tasks", title: nav.tasks, category: s.categories.faq, icon: CheckSquare, link: "/tasks" },
      { id: "nav-praxis", title: nav.praxisReport, category: s.categories.documents, icon: FolderOpen, link: "/praxisbericht2" },
      { id: "nav-benefits", title: nav.benefits, category: s.categories.faq, icon: Gift, link: "/benefits" },
      { id: "nav-news", title: nav.news, category: s.categories.library, icon: Newspaper, link: "/news" },
      { id: "nav-library", title: nav.library, category: s.categories.library, icon: Library, link: "/library" },
      { id: "nav-ai", title: nav.lernassistent, category: s.categories.faq, icon: Brain, link: "/lernassistent" },
      { id: "nav-antrag", title: nav.antragsverwaltung, category: s.categories.documents, icon: FileSearch, link: "/antragsverwaltung" },
    ];

    // Menu / Account items
    const menuItems: SearchItem[] = [
      { id: "menu-settings", title: menu.settings, category: s.categories.account || "Account", icon: BadgeCheck, link: "/settings" },
      { id: "menu-transcript", title: menu.transcript, category: s.categories.grades, icon: Award, link: "/certificates/transcript" },
      { id: "menu-id", title: menu.studentId, category: s.categories.account || "Account", icon: BadgeCheck, link: "/student-id" },
      { id: "menu-handbook", title: menu.moduleHandbook, category: s.categories.documents, icon: BookOpenCheck, link: "/module-handbook" },
    ];

    // Antragsverwaltung specific items
    const antragT = ANTRAG_TRANSLATIONS[language as keyof typeof ANTRAG_TRANSLATIONS];
    const antragItems: SearchItem[] = Object.entries(antragT.itemTitles).map(([id, title]) => ({
      id: `antrag-item-${id}`,
      title: title as string,
      category: nav.antragsverwaltung || "Anträge",
      icon: FileSearch,
      link: `/antragsverwaltung#${id}`,
    }));

    // Combine all sources, prioritizing database items
    const combined = [...dbSearchItems, ...configCourseItems, ...navItems, ...menuItems, ...antragItems];
    
    // Deduplicate by link
    const seenLinks = new Set<string>();
    return combined.filter(item => {
      const link = (item.link || "").toLowerCase();
      if (!link || seenLinks.has(link)) return false;
      seenLinks.add(link);
      return true;
    });
  }, [shellText, language, dbSearchItems]);

  /**
   * Filters search results based on the current query.
   */
  const filteredResults = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return [];

    const normalize = (value: any) => {
      if (!value || typeof value !== "string") return "";
      return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // remove accents
        .replace(/ß/g, "ss")
        .replace(/ae/g, "a")
        .replace(/oe/g, "o")
        .replace(/ue/g, "u")
        .trim()
        .replace(/\s+/g, " ");
    };

    const normalizedQuery = normalize(trimmedQuery);
    const queryTerms = normalizedQuery.split(/\s+/).filter(Boolean);
    
    if (queryTerms.length === 0) return [];

    // Filter and sort by relevance
    const matches = searchableData.filter((item) => {
      const normalizedTitle = normalize(item.title);
      const normalizedCategory = normalize(item.category);
      const normalizedCode = normalize(item.code);
      
      return queryTerms.every((term: string) => 
        normalizedTitle.includes(term) || 
        normalizedCategory.includes(term) ||
        normalizedCode.includes(term)
      );
    });

    return matches.slice(0, 10);
  }, [searchQuery, searchableData]);


  return {
    searchableData,
    filteredResults,
  };
}
