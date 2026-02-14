// app/routes/news.tsx

import { useLoaderData, useSearchParams, useSubmit } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "~/store/LanguageContext";
import { CATEGORY_COLORS } from "~/config/news";
import { TRANSLATIONS } from "~/services/translations/news";
import {
  NewsHeader,
  NewsCard,
  NewsPagination,
  NewsEmptyState,
  NewsModal,
} from "~/features/news";

/* -----------------------------------
   Types
------------------------------------*/

import type { NewsItem, NewsResponse } from "~/types/news";
import { normalizeNewsItem, normalizeNewsResponse } from "~/utils/news";
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
  const data = normalizeNewsResponse(useLoaderData() as NewsResponse);
  const { items, total, page, pageSize } = data;
  const { language } = useLanguage();
  const locale = language === "de" ? "de-DE" : "en-US";
  const t = TRANSLATIONS[language];

  const [params, setParams] = useSearchParams();
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

  useEffect(() => {
    if (params.get("lang") === language) return;
    const next = new URLSearchParams(params);
    next.set("lang", language);
    setParams(next, { replace: true });
  }, [language, params, setParams]);

  /* -----------------------------------
     Modal Functions
  ------------------------------------*/

  function closeModal() {
    setIsOpen(false);
    setArticle(null);
    setError("");
  }

  async function openModal(slug: string, index?: number) {
    if (!slug) {
      setError("Article link is missing.");
      setIsOpen(true);
      return;
    }
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
      setArticle(data.item ? normalizeNewsItem(data.item) : null);
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
      <NewsHeader
        title={t.title}
        subtitle={t.stayUpdated}
        searchPlaceholder={t.searchPlaceholder}
        searchButtonLabel={t.search}
        resetTitle={t.reset}
        lang={language}
        searchValue={q}
        onSearchClear={(form) => submit(form, { method: "get", replace: true })}
      />

      {/* Results grid */}
      {items.length === 0 ? (
        <NewsEmptyState message={t.noResults} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {items.map((n, i) => (
            <NewsCard
              key={n.slug}
              item={n}
              index={i}
              locale={locale}
              categoryColor={catColor(n.category)}
              labels={{
                categoryFallback: t.categoryFallback,
                featured: t.featured,
                readMore: t.readMore,
              }}
              onOpen={openModal}
            />
          ))}
        </div>
      )}

      <NewsPagination pages={pages} currentPage={currentPage} params={params} />

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
          locale={locale}
          labels={{
            categoryFallback: t.categoryFallback,
            loading: t.loading,
            published: t.published,
            author: t.author,
            close: t.close,
          }}
        />
      )}
    </div>
  );
}
