import { Calendar, User, ArrowRight, Star } from "lucide-react";
import type { NewsItem } from "~/types/news";

interface NewsCardProps {
  item: NewsItem;
  index: number;
  locale: string;
  categoryColor: string;
  labels: {
    categoryFallback: string;
    featured: string;
    readMore: string;
  };
  onOpen: (slug: string, index: number) => void;
}

export function NewsCard({
  item,
  index,
  locale,
  categoryColor,
  labels,
  onOpen,
}: NewsCardProps) {
  return (
    <article className="group relative flex flex-col bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      {/* Category Bar */}
      <div className={`h-2 w-full ${categoryColor}`} />

      <div className="p-5 sm:p-8 flex flex-col h-full">
        {/* Category & Featured */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <span className="text-[9px] sm:text-[10px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-200 dark:border-white/20 font-black uppercase tracking-[0.2em]">
            {item.category || labels.categoryFallback}
          </span>

          {item.featured && (
            <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] px-3 py-1.5 rounded-xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white border border-iu-blue/20 dark:border-iu-blue font-black uppercase tracking-[0.2em]">
              <Star className="h-3 w-3 fill-current" />
              {labels.featured}
            </span>
          )}
        </div>

        {/* Title */}
        <button
          type="button"
          onClick={() => onOpen(item.slug, index)}
          className="text-left w-full mb-4"
        >
          <h2 className="text-base sm:text-lg font-bold text-foreground line-clamp-2 group-hover:text-iu-blue dark:group-hover:text-white transition-colors uppercase leading-tight">
            {item.title}
          </h2>
        </button>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-5 sm:mb-6">
          <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-200 font-black uppercase tracking-widest">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(item.publishedAt).toLocaleDateString(locale)}
          </div>
          {item.author && (
            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-slate-700 dark:text-slate-200 font-black uppercase tracking-widest">
              <User className="h-3.5 w-3.5" />
              {item.author}
            </div>
          )}
        </div>

        {/* Excerpt */}
        {item.excerpt && (
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 line-clamp-3 font-medium leading-relaxed mb-6 sm:mb-8">
            {item.excerpt}
          </p>
        )}

        {/* Read more */}
        <div className="mt-auto">
          <button
            onClick={() => onOpen(item.slug, index)}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-2xl bg-iu-blue/10 dark:bg-iu-blue text-iu-blue dark:text-white border border-iu-blue/20 dark:border-iu-blue text-[10px] sm:text-xs font-black hover:bg-iu-blue hover:text-white transition-all duration-300 uppercase tracking-widest group/btn"
          >
            {labels.readMore}
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
}
