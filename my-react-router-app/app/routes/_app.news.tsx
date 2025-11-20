// app/routes/news.tsx

import {
  Link,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* -----------------------------------
   Types
------------------------------------*/

export interface NewsItem {
  slug: string;
  title: string;
  excerpt?: string;
  content?: string;
  category?: string;
  author?: string;
  featured?: boolean;
  publishedAt: string;
}

export interface NewsResponse {
  items: NewsItem[];
  total: number;
  page: number;
  pageSize: number;
}

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
    `${url.origin}/api/news?search=${encodeURIComponent(search)}&page=${page}`
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

      const res = await fetch(`/api/news/${encodeURIComponent(slug)}`);

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
    if (key.includes("exam")) return "bg-amber-500";
    if (key.includes("it")) return "bg-indigo-500";
    if (key.includes("scholar")) return "bg-emerald-500";
    if (key.includes("library")) return "bg-violet-500";
    if (key.includes("career")) return "bg-cyan-500";
    if (key.includes("academic") || key.includes("module"))
      return "bg-blue-500";
    return "bg-slate-400";
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
  
      <div className="max-w-6xl mx-auto">
        {/* Search */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-foreground">News</h1>

          <form method="get" className="flex items-center gap-2">
            <input
              type="text"
              name="search"
              defaultValue={q}
              placeholder="Search news..."
              className="px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              onChange={(e) => {
                if (e.target.value === "") {
                  submit(e.currentTarget.form!, {
                    method: "get",
                    replace: true,
                  });
                }
              }}
            />

            <button className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
              Search
            </button>

            <Link
              to="/news"
              className="px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Reset
            </Link>
          </form>
        </div>

        {/* Results grid */}
        {items.length === 0 ? (
          <p className="text-muted-foreground">No news found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((n, i) => (
              <article
                key={n.slug}
                className="relative rounded-xl border border-border bg-card text-card-foreground shadow-sm group transition hover:shadow-md"
              >
                <div className={`h-1 w-full ${catColor(n.category)}`} />

                <div className="p-4 flex flex-col h-full">
                  {/* Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground border border-border font-semibold">
                      {n.category || "General"}
                    </span>

                    {n.featured && (
                      <span className="text-[10px] px-2 py-1 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <button
                    type="button"
                    onClick={() => openModal(n.slug, i)}
                    className="text-left w-full"
                  >
                    <h2 className="text-lg font-extrabold text-card-foreground line-clamp-2 hover:underline">
                      {n.title}
                    </h2>
                  </button>

                  {/* Date */}
                  <div className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                    {new Date(n.publishedAt).toLocaleDateString()}
                    {n.author && <span>• {n.author}</span>}
                  </div>

                  {/* Excerpt */}
                  {n.excerpt && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {n.excerpt}
                    </p>
                  )}

                  {/* Read more */}
                  <div className="mt-auto pt-4">
                    <button
                      onClick={() => openModal(n.slug, i)}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground border border-border text-sm font-semibold hover:bg-secondary/80"
                    >
                      Read more →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-8 flex gap-2">
            {Array.from({ length: pages }).map((_, i) => {
              const p = i + 1;
              const sp = new URLSearchParams(params);
              sp.set("page", String(p));
              return (
                <Link
                  key={p}
                  to={`?${sp.toString()}`}
                  className={`px-3 py-1.5 rounded text-sm border ${
                    p === currentPage
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground"
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

interface ModalProps {
  article: NewsItem | null;
  loading: boolean;
  error: string;
  atStart: boolean;
  atEnd: boolean;
  copied: boolean;
  copyLink: () => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  closeBtnRef: React.RefObject<HTMLButtonElement | null>;
}

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-[90vw] max-w-3xl max-h-[85vh] overflow-y-auto bg-card text-card-foreground rounded-2xl shadow-xl border border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground border border-border font-semibold">
              {article?.category || "General"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              onClick={onPrev}
              disabled={atStart}
              className={`p-1.5 rounded border border-border ${
                atStart ? "opacity-40" : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              ←
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              disabled={atEnd}
              className={`p-1.5 rounded border border-border ${
                atEnd ? "opacity-40" : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              →
            </button>

            {/* Copy */}
            <button
              onClick={copyLink}
              className="p-1.5 rounded border border-border hover:bg-accent hover:text-accent-foreground"
            >
              {copied ? "✔" : "⧉"}
            </button>

            {/* Close */}
            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-1.5 rounded hover:bg-accent hover:text-accent-foreground"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          {loading && <p className="text-muted-foreground">Loading…</p>}
          {error && <p className="text-destructive">{error}</p>}

          {!loading && !error && article && (
            <>
              <h3 className="text-2xl font-bold text-card-foreground">{article.title}</h3>

              <div className="mt-2 text-xs text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString()}
                {article.author && ` • ${article.author}`}
              </div>

              {article.excerpt && (
                <p className="mt-3 font-medium text-foreground">
                  {article.excerpt}
                </p>
              )}

              <div className="prose dark:prose-invert mt-4 max-w-none text-foreground">
                <p style={{ whiteSpace: "pre-wrap" }}>{article.content}</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-input hover:bg-accent hover:text-accent-foreground">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
