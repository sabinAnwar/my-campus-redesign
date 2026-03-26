import React from "react";
import { Link } from "react-router";
import { Newspaper, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface NewsItem {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  published_at: string;
  featured: boolean;
}

interface NewsSliderProps {
  newsItems: NewsItem[];
  currentNewsIndex: number;
  setCurrentNewsIndex: (index: number) => void;
  onNewsClick: (index: number) => void;
  t: any;
}

export function NewsSlider({
  newsItems,
  currentNewsIndex,
  setCurrentNewsIndex,
  onNewsClick,
  t,
}: NewsSliderProps) {
  const getCategoryColor = (category?: string | null) => {
    const key = (category || "").toLowerCase();
    if (key.includes("exam")) return "from-iu-orange to-iu-red";
    if (key.includes("it") || key.includes("tech"))
      return "from-iu-purple to-iu-pink";
    if (key.includes("scholar")) return "from-iu-green to-iu-blue";
    if (key.includes("library")) return "from-iu-purple to-iu-blue";
    if (key.includes("career")) return "from-iu-blue to-iu-purple";
    if (key.includes("academic") || key.includes("module"))
      return "from-iu-blue to-iu-purple";
    return "from-primary to-iu-purple";
  };

  const nextNews = () => {
    setCurrentNewsIndex((currentNewsIndex + 1) % newsItems.length);
  };

  const prevNews = () => {
    setCurrentNewsIndex(
      (currentNewsIndex - 1 + newsItems.length) % newsItems.length
    );
  };

  if (newsItems.length === 0) return null;

  return (
    <div data-onboard="dashboard-news" className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm border border-iu-blue/10 dark:bg-iu-blue dark:text-white dark:border-iu-blue/40">
          <Newspaper className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="text-base sm:text-lg md:text-xl font-black text-foreground flex items-center gap-2 sm:gap-3">
          {t.latestNews}
        </h3>
      </div>
      {/* Compact News Banner */}
      <div
        onClick={() => onNewsClick(currentNewsIndex)}
        className="group block relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-[2.5rem] border border-border bg-card/60 backdrop-blur-xl hover:bg-card hover:border-iu-blue/30 hover:shadow-2xl transition-all duration-500 cursor-pointer"
      >
        {/* Gradient Top Line */}
        <div
          className={`h-1 w-full bg-gradient-to-r ${getCategoryColor(newsItems[currentNewsIndex]?.category)}`}
        />

        <div className="p-2.5 sm:p-4 md:p-4 lg:p-5 flex items-center gap-2 sm:gap-4 md:gap-4 lg:gap-6">
          {/* News Icon */}
          <div
            className={`flex-shrink-0 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br ${getCategoryColor(newsItems[currentNewsIndex]?.category)} shadow-lg`}
          >
            <Newspaper className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 lg:gap-3 mb-0.5">
              <span
                className={`px-1.5 sm:px-2 md:px-2.5 lg:px-3 py-0.5 rounded-full text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r ${getCategoryColor(newsItems[currentNewsIndex]?.category)} text-white shadow-sm shrink-0`}
              >
                {newsItems[currentNewsIndex]?.category || "News"}
              </span>
              <span className="hidden xs:block text-[8px] sm:text-[9px] md:text-[9px] lg:text-[10px] font-black text-foreground/70 dark:text-slate-100 uppercase tracking-widest mt-0.5">
                {new Date(
                  newsItems[currentNewsIndex]?.published_at
                ).toLocaleDateString("de-DE", {
                  day: "2-digit",
                  month: "short",
                })}
              </span>
            </div>
            <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-foreground leading-tight truncate group-hover:text-amber-500 dark:group-hover:text-white transition-colors">
              {newsItems[currentNewsIndex]?.title}
            </h3>
          </div>

          {/* Navigation & Link */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
            {/* Dots */}
            <div className="hidden lg:flex items-center gap-1.5">
              {newsItems.slice(0, 5).map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentNewsIndex(idx);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentNewsIndex
                      ? "w-8 h-2 bg-iu-blue dark:bg-white"
                      : "w-2 h-2 bg-muted hover:bg-muted-foreground/50 dark:bg-slate-700 dark:hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-1 md:gap-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevNews();
                }}
                className="p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl bg-muted border border-border hover:bg-iu-blue hover:text-white hover:border-iu-blue transition-all active:scale-95 dark:bg-slate-800 dark:text-white dark:border-slate-700"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextNews();
                }}
                className="p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-lg sm:rounded-xl lg:rounded-2xl bg-muted border border-border hover:bg-iu-blue hover:text-white hover:border-iu-blue transition-all active:scale-95 dark:bg-slate-800 dark:text-white dark:border-slate-700"
              >
                <ChevronRight className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
              </button>
            </div>

            {/* All News Link */}
            <Link
              to="/news"
              onClick={(e) => e.stopPropagation()}
              className="hidden md:flex lg:flex items-center gap-2 text-[10px] lg:text-xs text-iu-indigo font-black uppercase tracking-widest hover:translate-x-1 transition-transform dark:text-slate-50 cursor-pointer"
            >
              LESEN <ArrowRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
