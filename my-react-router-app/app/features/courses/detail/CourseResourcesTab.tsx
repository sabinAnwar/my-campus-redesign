import {
  ChevronDown,
  ClipboardCheck,
  FileText,
  Play,
  Upload,
} from "lucide-react";
import type {
  Course,
  CourseResource,
  ResourceSection,
} from "~/types/courseDetail";

interface CourseResourcesTabProps {
  course: Course;
  language: string;
  expandedSections: Record<string, boolean>;
  toggleSection: (id: string) => void;
  onFileClick: (item: CourseResource, sectionId: string) => void;
}

export function CourseResourcesTab({
  course,
  language,
  expandedSections,
  toggleSection,
  onFileClick,
}: CourseResourcesTabProps) {
  const sections: ResourceSection[] = [
    {
      id: "scripts",
      label: language === "de" ? "Skripte" : "Scripts",
      icon: Play,
      color: "amber",
      defaultExpanded: false,
      items: course.resources?.filter((r) => r.type === "script") || [],
    },
    {
      id: "slides",
      label: language === "de" ? "Folien" : "Slides",
      icon: FileText,
      color: "cyan",
      defaultExpanded: false,
      items: course.resources?.filter((r) => r.type === "slides") || [],
    },
    {
      id: "exams",
      label: language === "de" ? "Musterklausuren" : "Sample Exams",
      icon: ClipboardCheck,
      color: "rose",
      defaultExpanded: false,
      items: course.resources?.filter((r) => r.type === "exam") || [],
    },
    {
      id: "podcasts",
      label: language === "de" ? "Podcasts" : "Podcasts",
      icon: Play,
      color: "amber",
      defaultExpanded: false,
      items: course.resources?.filter((r) => r.type === "podcast") || [],
    },
    {
      id: "material",
      label: language === "de" ? "Kursmaterial" : "Course Material",
      icon: FileText,
      color: "purple",
      defaultExpanded: false,
      items: course.resources?.filter((r) => r.type === "reading") || [],
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="grid gap-4 sm:gap-6">
        {sections.map((section) => {
          const isExpanded =
            expandedSections[section.id] ?? section.defaultExpanded;
          const colorClass = {
            cyan: "text-iu-blue dark:text-white bg-iu-blue/10 dark:bg-iu-blue",
            amber:
              "text-iu-orange dark:text-white bg-iu-orange/10 dark:bg-iu-orange",
            purple:
              "text-iu-purple dark:text-white bg-iu-purple/10 dark:bg-iu-purple",
            red: "text-iu-red dark:text-white bg-iu-red/10 dark:bg-iu-red",
            rose: "text-iu-red dark:text-white bg-iu-red/10 dark:bg-iu-red", // Fallback for rose to red if not defined in Tailwind
          }[section.color];

          return (
            <div
              key={section.id}
              className="group/section rounded-3xl border border-border/40 bg-card/40 backdrop-blur-xl overflow-hidden transition-all hover:border-iu-blue/20 shadow-sm"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-5 sm:px-8 py-4 sm:py-7 flex items-center justify-between hover:bg-muted/30 transition-all text-left group"
              >
                <div className="flex items-center gap-4 sm:gap-5">
                  <div
                    className={`p-2.5 sm:p-4 rounded-xl sm:rounded-2xl ${colorClass} group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-sm`}
                  >
                    <section.icon size={20} />
                  </div>
                  <div>
                    <span className="text-base sm:text-xl font-black text-foreground block group-hover:text-iu-blue dark:group-hover:text-white transition-colors">
                      {section.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1 block">
                      {section.items.length}{" "}
                      {language === "de" ? "Elemente" : "Elements"}
                    </span>
                  </div>
                </div>
                <div
                  className={`p-2 rounded-xl bg-muted/50 text-muted-foreground transition-all duration-300 group-hover:text-iu-blue dark:group-hover:text-foreground dark:text-white ${isExpanded ? "rotate-180 bg-iu-blue/10 dark:bg-iu-blue" : ""}`}
                >
                  <ChevronDown size={20} />
                </div>
              </button>

              <div
                className={`px-5 sm:px-8 transition-all duration-500 ease-in-out ${isExpanded ? "max-h-[1000px] pb-6 sm:pb-8 opacity-100" : "max-h-0 pb-0 opacity-0 overflow-hidden"}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-border/20">
                  {section.items.length > 0 ? (
                    section.items.map((item) => (
                      <a
                        key={item.id}
                        href={item.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onFileClick(item, section.id)}
                        className="flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/30 hover:border-iu-blue/30 hover:bg-iu-blue/5 transition-all cursor-pointer group/item shadow-sm hover:shadow-iu-blue/5"
                      >
                        <div className="p-2 sm:p-3 rounded-xl bg-card border border-border/50 text-iu-blue dark:text-white dark:bg-iu-blue dark:border-iu-blue group-hover/item:scale-110 transition-transform">
                          {item.type === "podcast" ? (
                            <Play size={20} className="fill-current" />
                          ) : (
                            <FileText size={20} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-black text-foreground truncate group-hover/item:text-iu-blue dark:group-hover/item:text-white transition-colors">
                            {item.title}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            {item.size && (
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-2 py-0.5 rounded bg-muted/50 border border-border/50">
                                {item.size}
                              </span>
                            )}
                            {item.duration && (
                              <span className="text-[9px] font-black text-iu-blue dark:text-white uppercase tracking-widest px-2 py-0.5 rounded bg-iu-blue/5 dark:bg-iu-blue/20 border border-iu-blue/10 dark:border-iu-blue/40">
                                {item.duration}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="p-2 rounded-lg opacity-0 group-hover/item:opacity-100 transition-all bg-iu-blue text-white shadow-lg translate-x-2 group-hover/item:translate-x-0">
                          <Upload size={14} className="rotate-90" />
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="col-span-full py-6 sm:py-10 text-center">
                      <p className="text-sm text-muted-foreground font-bold italic opacity-40">
                        {language === "de"
                          ? "Keine Einträge in dieser Kategorie"
                          : "No entries in this category"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
