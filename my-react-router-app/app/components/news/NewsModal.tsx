import {
  Newspaper,
  Calendar,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
} from "lucide-react";
import type { NewsModalProps } from "~/types/news";

interface NewsModalComponentProps extends NewsModalProps {
  locale: string;
  labels: {
    categoryFallback: string;
    loading: string;
    published: string;
    author: string;
    close: string;
  };
}

export function NewsModal({
  article,
  loading,
  error,
  atStart,
  atEnd,
  copied,
  copyLink,
  onClose,
  onPrev,
  onNext,
  closeBtnRef,
  locale,
  labels,
}: NewsModalComponentProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-8 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-iu-blue/10 dark:bg-iu-blue rounded-2xl border border-iu-blue/20 dark:border-iu-blue">
              <Newspaper className="h-6 w-6 text-iu-blue dark:text-white" />
            </div>
            <div>
              <span className="text-[10px] px-3 py-1 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white border border-slate-300 dark:border-white/20 font-black uppercase tracking-[0.2em]">
                {article?.category || labels.categoryFallback}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 p-1">
              <button
                onClick={onPrev}
                disabled={atStart}
                className={`p-2.5 rounded-xl transition-all ${
                  atStart
                    ? "opacity-20 cursor-not-allowed"
                    : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-iu-blue dark:hover:text-white"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={onNext}
                disabled={atEnd}
                className={`p-2.5 rounded-xl transition-all ${
                  atEnd
                    ? "opacity-20 cursor-not-allowed"
                    : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-iu-blue dark:hover:text-white"
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={copyLink}
              className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
            >
              {copied ? (
                <Check className="h-5 w-5 text-iu-blue dark:text-white" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 custom-scrollbar bg-white dark:bg-transparent">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="h-12 w-12 border-4 border-iu-blue/20 border-t-iu-blue rounded-full animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs">
                {labels.loading}
              </p>
            </div>
          )}

          {error && (
            <div className="p-8 rounded-[2rem] bg-iu-red/10 border border-iu-red/20 text-iu-red text-center font-bold">
              {error}
            </div>
          )}

          {!loading && !error && article && (
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                  <Calendar className="h-4 w-4 text-iu-blue dark:text-white" />
                  {labels.published}:{" "}
                  {new Date(article.publishedAt).toLocaleDateString(locale)}
                </div>
                {article.author && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                    <User className="h-4 w-4 text-iu-blue dark:text-white" />
                    {labels.author}: {article.author}
                  </div>
                )}
              </div>

              <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.1] uppercase">
                {article.title}
              </h3>

              {article.excerpt && (
                <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-10">
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    "{article.excerpt}"
                  </p>
                </div>
              )}

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-6 font-medium">
                  {article.content
                    ?.split("\n")
                    .map(
                      (paragraph, idx) =>
                        paragraph.trim() && <p key={idx}>{paragraph}</p>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-8 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-10 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black hover:bg-slate-100 dark:hover:bg-white/10 transition-all uppercase tracking-widest text-sm shadow-sm"
          >
            {labels.close}
          </button>
        </div>
      </div>
    </div>
  );
}
