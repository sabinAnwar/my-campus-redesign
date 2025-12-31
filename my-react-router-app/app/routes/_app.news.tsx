// app/routes/news.tsx

import {
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "~/contexts/LanguageContext";
import { TRANSLATIONS, CATEGORY_COLORS } from "~/constants/news";
import {
  Search,
  RotateCcw,
  Newspaper,
  Calendar,
  User,
  ArrowRight,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Star,
  ExternalLink,
  Clock,
} from "lucide-react";

/* -----------------------------------
   Types
------------------------------------*/

import type { NewsItem, NewsResponse } from "~/types/news";
export type { NewsItem, NewsResponse };

/* -----------------------------------
   Loader
------------------------------------*/

export async function loader({
  request,
}: {
  request: Request;
}): Promise<NewsResponse> {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const page = url.searchParams.get("page") || "1";

  const res = await fetch(
    `${url.origin}/api/news?search=${encodeURIComponent(search)}&page=${page}&lang=${url.searchParams.get("lang") || "de"}`
  );

  if (!res.ok) {
    throw new Response("Failed to load news", { status: res.status });
  }

  return await res.json();
}

/* -----------------------------------
   Component
------------------------------------*/

export default function NewsList() {
  const { items, total, page, pageSize } = useLoaderData() as NewsResponse;
  const { language } = useLanguage();
  const locale = language === "de" ? "de-DE" : "en-US";
  const t = TRANSLATIONS[language];

  const [params] = useSearchParams();
  const submit = useSubmit();

  const q = params.get("search") || "";
  const currentPage = Number(page) || 1;
  const pages = Math.ceil(total / pageSize);

  /* -------- Modal State -------- */
  const [isOpen, setIsOpen] = useState(false);
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(-1);

  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const atStart = currentIndex <= 0;
  const atEnd = currentIndex >= items.length - 1 || currentIndex < 0;

  /* -----------------------------------
     Modal Functions
  ------------------------------------*/

  function closeModal() {
    setIsOpen(false);
    setArticle(null);
    setError("");
  }

  async function openModal(slug: string, index?: number) {
    try {
      setLoading(true);
      setError("");
      setIsOpen(true);

      if (typeof index === "number") {
        setCurrentIndex(index);
      } else {
        setCurrentIndex(items.findIndex((i) => i.slug === slug));
      }

      const res = await fetch(
        `/api/news/${encodeURIComponent(slug)}?lang=${language}`
      );

      if (!res.ok) {
        setError(`Failed to load (status ${res.status})`);
        return;
      }

      const data = await res.json();
      setArticle(data.item ?? null);
    } catch {
      setError("Network error while loading the article.");
    } finally {
      setLoading(false);
    }
  }

  function openByIndex(index: number) {
    if (index < 0 || index >= items.length) return;
    openModal(items[index].slug, index);
  }

  /* -----------------------------------
     Modal Behavior
  ------------------------------------*/

  // ESC close
  useEffect(() => {
    if (!isOpen) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Focus + scroll lock
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeBtnRef.current?.focus(), 0);

      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  /* -----------------------------------
     Helpers
  ------------------------------------*/

  const catColor = (cat?: string) => {
    const key = (cat || "General").toLowerCase();
    if (key.includes("exam")) return CATEGORY_COLORS.exam;
    if (key.includes("it")) return CATEGORY_COLORS.it;
    if (key.includes("scholar")) return CATEGORY_COLORS.scholar;
    if (key.includes("library")) return CATEGORY_COLORS.library;
    if (key.includes("career")) return CATEGORY_COLORS.career;
    if (key.includes("academic") || key.includes("module"))
      return CATEGORY_COLORS.academic;
    return CATEGORY_COLORS.default;
  };

  const [copied, setCopied] = useState(false);

  function copyCurrentLink() {
    if (!article?.slug) return;

    const u = new URL(window.location.href);
    u.pathname = `/news/${article.slug}`;
    navigator.clipboard.writeText(u.toString());

    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  /* -----------------------------------
     Render
  ------------------------------------*/

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-iu-blue/10 text-iu-blue shadow-sm">
                <Newspaper size={28} />
              </div>
              <h1 className="text-4xl font-black text-foreground tracking-tight">
                {t.title}
              </h1>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              Stay updated with the latest campus news and announcements.
            </p>
          </div>

          <form
            method="get"
            className="flex items-center gap-3 w-full lg:w-auto bg-white dark:bg-white/5 backdrop-blur-xl p-2 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl"
          >
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={q}
                placeholder={t.searchPlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none text-sm font-bold"
                onChange={(e) => {
                  if (e.target.value === "") {
                    submit(e.currentTarget.form!, {
                      method: "get",
                      replace: true,
                    });
                  }
                }}
              />
            </div>

            <button className="hidden md:block px-6 py-3 bg-iu-blue text-white rounded-2xl text-sm font-black hover:bg-iu-blue/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-iu-blue/20 uppercase tracking-widest">
              {t.search}
            </button>

            <Link
              to="/news"
              className="p-3 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
              title={t.reset}
            >
              <RotateCcw className="h-5 w-5" />
            </Link>
          </form>
        </div>
      </header>

      {/* Results grid */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-20 text-center shadow-2xl">
          <div className="inline-flex p-6 bg-slate-100 dark:bg-white/5 rounded-3xl mb-6">
            <Newspaper className="h-12 w-12 text-slate-400" />
          </div>
          <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
            {t.noResults}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((n, i) => (
            <article
              key={n.slug}
              className="group relative flex flex-col bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Category Bar */}
              <div className={`h-2 w-full ${catColor(n.category)}`} />

              <div className="p-8 flex flex-col h-full">
                {/* Category & Featured */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 font-black uppercase tracking-[0.2em]">
                    {n.category || t.categoryFallback}
                  </span>

                  {n.featured && (
                    <span className="flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-xl bg-iu-blue/10 text-iu-blue dark:text-iu-blue border border-iu-blue/20 font-black uppercase tracking-[0.2em]">
                      <Star className="h-3 w-3 fill-current" />
                      {t.featured}
                    </span>
                  )}
                </div>

                {/* Title */}
                <button
                  type="button"
                  onClick={() => openModal(n.slug, i)}
                  className="text-left w-full mb-4"
                >
                  <h2 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-iu-blue transition-colors uppercase leading-tight">
                    {n.title}
                  </h2>
                </button>

                {/* Meta */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(n.publishedAt).toLocaleDateString(locale)}
                  </div>
                  {n.author && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                      <User className="h-3.5 w-3.5" />
                      {n.author}
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                {n.excerpt && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 font-medium leading-relaxed mb-8">
                    {n.excerpt}
                  </p>
                )}

                {/* Read more */}
                <div className="mt-auto">
                  <button
                    onClick={() => openModal(n.slug, i)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-iu-blue/10 text-iu-blue border border-iu-blue/20 text-xs font-black hover:bg-iu-blue hover:text-white transition-all duration-300 uppercase tracking-widest group/btn"
                  >
                    {t.readMore}
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-3">
          {Array.from({ length: pages }).map((_, i) => {
            const p = i + 1;
            const sp = new URLSearchParams(params);
            sp.set("page", String(p));
            return (
              <Link
                key={p}
                to={`?${sp.toString()}`}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl text-sm font-black transition-all duration-300 border ${
                  p === currentPage
                    ? "bg-iu-blue text-white border-iu-blue shadow-lg shadow-iu-blue/20 scale-110"
                    : "bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-iu-blue/50"
                }`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <NewsModal
          article={article}
          loading={loading}
          error={error}
          onClose={closeModal}
          atStart={atStart}
          atEnd={atEnd}
          onPrev={() => openByIndex(currentIndex - 1)}
          onNext={() => openByIndex(currentIndex + 1)}
          copied={copied}
          copyLink={copyCurrentLink}
          closeBtnRef={closeBtnRef}
        />
      )}
    </div>
  );
}

/* -----------------------------------
   Modal Component (Typed)
------------------------------------*/

import type { NewsModalProps as ModalProps } from "~/types/news";

function NewsModal({
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
}: ModalProps) {
  const { language } = useLanguage();
  const locale = language === "de" ? "de-DE" : "en-US";
  const t = {
    de: {
      categoryFallback: "Allgemein",
      loading: "Lade...",
      close: "Schließen",
      author: "Autor",
      published: "Veröffentlicht",
    },
    en: {
      categoryFallback: "General",
      loading: "Loading…",
      close: "Close",
      author: "Author",
      published: "Published",
    },
  }[language];

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
            <div className="p-3 bg-iu-blue/10 rounded-2xl border border-iu-blue/20">
              <Newspaper className="h-6 w-6 text-iu-blue" />
            </div>
            <div>
              <span className="text-[10px] px-3 py-1 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10 font-black uppercase tracking-[0.2em]">
                {article?.category || t.categoryFallback}
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
                    : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-iu-blue"
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
                    : "hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-iu-blue"
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
                <Check className="h-5 w-5 text-iu-blue" />
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
                {t.loading}
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
                  <Calendar className="h-4 w-4 text-iu-blue" />
                  {t.published}:{" "}
                  {new Date(article.publishedAt).toLocaleDateString(locale)}
                </div>
                {article.author && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                    <User className="h-4 w-4 text-iu-blue" />
                    {t.author}: {article.author}
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
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
}
