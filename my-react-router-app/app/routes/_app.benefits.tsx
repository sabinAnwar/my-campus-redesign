import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Search,
  ArrowUpRight,
  Laptop,
  BarChart3,
  GraduationCap,
  Star,
  LifeBuoy,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "~/contexts/LanguageContext";

import {
  TRANSLATIONS,
  getToolCategories,
  categoryBadge,
} from "~/constants/benefits";

// ────────────────────────────────────────────────────────────────────────────
// TOOL DATA (with translation keys)
// ────────────────────────────────────────────────────────────────────────────
import type { BenefitTool as Tool } from "~/types/benefits";



export default function StudentBenefits() {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];
  const toolCategories = getToolCategories(t);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredCategories = toolCategories.filter((category) => {
    if (selectedCategory !== "all" && category.title !== selectedCategory)
      return false;
    if (!search) return true;
    return category.tools.some(
      (tool) =>
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalTools = toolCategories.reduce(
    (sum, cat) => sum + cat.tools.length,
    0
  );

  const featuredTools = toolCategories.flatMap((cat) =>
    cat.tools
      .filter((tool) => tool.featured)
      .map((tool) => ({
        ...tool,
        category: cat.title,
      }))
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
      <header className="mb-6 sm:mb-8 md:mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 md:gap-8">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {t.subtitle(totalTools)}
            </p>

            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full border border-iu-blue/20 bg-iu-blue/10 text-iu-blue text-xs sm:text-sm font-bold w-fit">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t.exclusiveFor}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Tools */}
      {featuredTools.length > 0 && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] bg-iu-blue/5 border border-iu-blue/10 p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-12 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue text-white shadow-lg shadow-iu-blue/30">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground tracking-tight">
              {t.featuredTools}
            </h3>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 md:gap-6 sm:pb-0 scrollbar-hide">
            {featuredTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="min-w-[280px] sm:min-w-0 shrink-0 group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl md:rounded-3xl bg-card/60 backdrop-blur-md border border-border hover:shadow-2xl hover:border-iu-blue/40 hover:bg-card transition-all duration-500"
              >
                <div
                  className={`h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-xl sm:rounded-2xl text-white text-xs sm:text-sm font-bold flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${tool.logo.bg}`}
                >
                  {tool.logo.text}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base md:text-lg tracking-tight leading-tight text-foreground group-hover:text-iu-blue transition-colors">
                    {tool.name}
                  </p>
                  <p className="text-[8px] sm:text-[9px] md:text-[10px] text-muted-foreground/50 font-black uppercase tracking-wide mt-0.5 sm:mt-1">
                    {tool.category}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-iu-blue/40 group-hover:text-iu-blue group-hover:scale-110 transition-all shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="sticky top-4 z-20 relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2rem] px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6 mb-6 sm:mb-8 md:mb-12 bg-card/80 border border-border shadow-2xl backdrop-blur-xl">
        {/* Content */}
        <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-iu-blue transition-colors" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 sm:pl-12 md:pl-14 pr-4 sm:pr-6 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-iu-blue/50 focus:bg-background transition-all text-xs sm:text-sm font-bold"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none w-full sm:w-auto px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-xl sm:rounded-2xl bg-background/50 border border-border text-foreground text-xs sm:text-sm font-bold focus:outline-none focus:border-iu-blue/50 cursor-pointer transition hover:bg-muted/50 sm:min-w-[180px] md:min-w-[200px]"
            >
              <option value="all">{t.allCategories}</option>
              {toolCategories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground rotate-90 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <section className="space-y-8 sm:space-y-12 md:space-y-16">
        {filteredCategories.map((category) => (
          <div key={category.title} className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
              <div
                className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl border shadow-lg transition-transform hover:scale-110 ${categoryBadge[category.color]}`}
              >
                <category.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-current" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-foreground">
                  {category.title}
                </h3>
                <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground/50 font-black uppercase tracking-widest sm:tracking-[0.2em] mt-0.5 sm:mt-1">
                  {category.tools.length} {t.tools}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              {category.tools.map((tool) => (
                <article
                  key={tool.name}
                  className="group relative rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-4 sm:p-6 md:p-8 bg-card/60 border border-border shadow-xl hover:border-iu-blue/30 hover:bg-card hover:shadow-2xl transition-all duration-500 backdrop-blur-xl overflow-hidden"
                >
                  {/* Hover background effect */}
                  <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-iu-blue/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity -mr-24 sm:-mr-32 -mt-24 sm:-mt-32"></div>

                  <div className="flex items-start gap-3 sm:gap-4 md:gap-6 relative z-10">
                    <div
                      className={`h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 rounded-xl sm:rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-xl transition-transform group-hover:scale-110 ${tool.logo.bg}`}
                    >
                      {tool.logo.text}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2 sm:space-y-3 md:space-y-4">
                      <div className="flex items-center justify-between gap-2 sm:gap-4">
                        <p className="text-sm sm:text-base md:text-lg font-bold text-foreground tracking-tight group-hover:text-iu-blue transition-colors">
                          {tool.name}
                        </p>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground/20 group-hover:text-iu-blue group-hover:scale-110 transition-all flex-shrink-0" />
                      </div>

                      <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium leading-relaxed">
                        {tool.description}
                      </p>

                      <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 pt-1 sm:pt-2">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 sm:gap-2 text-iu-blue font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest hover:text-iu-blue/80 transition-all border-b-2 border-iu-blue/10 hover:border-iu-blue/40 pb-0.5 sm:pb-1"
                        >
                          {t.open} <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </a>

                        {tool.support && (
                          <a
                            href={tool.support}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground/50 hover:text-iu-blue font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest transition-all"
                          >
                            <LifeBuoy className="w-3 h-3 sm:w-4 sm:h-4" />
                            {t.support}
                          </a>
                        )}

                        {tool.alt && (
                          <a
                            href={tool.alt}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 sm:gap-2 text-muted-foreground/50 hover:text-iu-blue font-black text-[9px] sm:text-[10px] uppercase tracking-wider sm:tracking-widest transition-all"
                          >
                            {t.alternative}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
