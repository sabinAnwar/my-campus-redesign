import { Link, useLoaderData, useSearchParams, useSubmit } from "react-router";
import { useEffect, useRef, useState } from "react";
import AppShell from "../components/AppShell";

export async function loader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  const page = url.searchParams.get("page") || "1";
  const res = await fetch(`${url.origin}/api/news?search=${encodeURIComponent(search)}&page=${page}`);
  const data = await res.json();
  return data;
}

export default function NewsList() {
  const { items, total, page, pageSize } = useLoaderData();
  const [params] = useSearchParams();
  const q = params.get("search") || "";
  const submit = useSubmit();

  const currentPage = Number(page) || 1;
  const pages = Math.ceil(total / pageSize);

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [article, setArticle] = useState(null);
  const closeBtnRef = useRef(null);

  function closeModal() {
    setIsOpen(false);
    setArticle(null);
    setError("");
  }

  async function openModal(slug) {
    try {
      setLoading(true);
      setError("");
      setIsOpen(true);
      const res = await fetch(`/api/news/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        setError(`Failed to load (status ${res.status})`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setArticle(data.item || null);
    } catch (e) {
      setError("Network error while loading the article.");
    } finally {
      setLoading(false);
    }
  }

  // Allow ESC to close when modal open
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Focus close button when opening and lock background scroll
  useEffect(() => {
    if (isOpen) {
      // focus close button
      setTimeout(() => closeBtnRef.current?.focus(), 0);
      // lock scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // Helpers
  function catColor(cat) {
    const key = String(cat || "General").toLowerCase();
    if (key.includes("exam")) return "bg-amber-500";
    if (key.includes("it")) return "bg-indigo-500";
    if (key.includes("scholar")) return "bg-emerald-500";
    if (key.includes("library")) return "bg-violet-500";
    if (key.includes("career")) return "bg-cyan-500";
    if (key.includes("academic") || key.includes("module")) return "bg-blue-500";
    return "bg-slate-400";
  }

  // Modal navigation (prev/next within current list)
  const [currentIndex, setCurrentIndex] = useState(-1);

  function openByIndex(idx) {
    if (idx < 0 || idx >= items.length) return;
    const slug = items[idx]?.slug;
    if (slug) openModal(slug, idx);
  }

  async function openModal(slug, idx) {
    try {
      setLoading(true);
      setError("");
      setIsOpen(true);
      if (typeof idx === "number" && idx >= 0) setCurrentIndex(idx);
      else setCurrentIndex(items.findIndex((it) => it.slug === slug));
      const res = await fetch(`/api/news/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        setError(`Failed to load (status ${res.status})`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setArticle(data.item || null);
    } catch (e) {
      setError("Network error while loading the article.");
    } finally {
      setLoading(false);
    }
  }

  const atStart = currentIndex <= 0;
  const atEnd = currentIndex < 0 || currentIndex >= items.length - 1;

  const [copied, setCopied] = useState(false);
  function copyCurrentLink() {
    try {
      if (article?.slug) {
        const u = new URL(window.location.href);
        u.pathname = `/news/${article.slug}`;
        navigator.clipboard?.writeText(u.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch {}
  }

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-slate-900">News</h1>
        <form method="get" className="flex items-center gap-2">
          <input
            type="text"
            name="search"
            defaultValue={q}
            placeholder="Search news..."
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm"
            onChange={(e) => {
              // If cleared, auto-submit to reset to all results
              if (e.target.value === "") {
                const form = e.currentTarget.form || e.target.form;
                if (form) submit(form, { method: "get", replace: true });
              }
            }}
          />
          <button className="px-3 py-2 bg-slate-900 text-white rounded-lg text-sm">Search</button>
          <Link
            to="/news"
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 bg-white"
          >
            Reset
          </Link>
        </form>
      </div>

      {items.length === 0 ? (
        <div className="text-slate-500">No news found.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((n, idx) => (
            <article
              key={n.slug}
              className="relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden group transition hover:shadow-md hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-slate-300"
              aria-labelledby={`news-${n.slug}`}
            >
              <div className={`h-1 w-full ${catColor(n.category)}`} />
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded bg-slate-100 border border-slate-200 font-semibold">
                    {n.category || "General"}
                  </span>
                  {n.featured && (
                    <span className="text-[10px] px-2 py-1 rounded bg-amber-100 border border-amber-200 text-amber-800 font-bold">
                      FEATURED
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => openModal(n.slug, idx)}
                  className="text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded"
                >
                  <div className="min-h-[3.5rem]">
                    <h2 id={`news-${n.slug}`} className="text-lg font-extrabold text-slate-900 line-clamp-2 hover:underline hover:underline-offset-2">
                      {n.title}
                    </h2>
                  </div>
                </button>
                <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                    <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                    <path d="M16 2v4"></path>
                    <path d="M8 2v4"></path>
                    <path d="M3 10h18"></path>
                  </svg>
                  <span>{new Date(n.publishedAt).toLocaleDateString()}</span>
                  {n.author ? <span>• {n.author}</span> : null}
                </div>
                <div className="mt-1 min-h-[3.75rem]">
                  {n.excerpt && (
                    <p className="text-sm text-slate-600 line-clamp-3">{n.excerpt}</p>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between mt-auto">
                  <button
                    type="button"
                    onClick={() => openModal(n.slug, idx)}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-slate-900 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200"
                    aria-label={`Read more about ${n.title}`}
                  >
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-8 flex items-center gap-2">
          {Array.from({ length: pages }).map((_, i) => {
            const p = i + 1;
            const sp = new URLSearchParams(params);
            sp.set("page", String(p));
            return (
              <Link
                key={p}
                to={`?${sp.toString()}`}
                className={`px-3 py-1.5 rounded border text-sm ${p === currentPage ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300"}`}
              >
                {p}
              </Link>
            );
          })}
        </div>
      )}
      
      {/* Modal for article preview */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
          aria-describedby="news-modal-desc"
        >
          <div className="absolute inset-0 bg-black/50 modal-overlay" onClick={closeModal} />
          <div className="relative z-10 w-[92vw] max-w-3xl max-h-[86vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-200 modal-content">
            <p id="news-modal-desc" className="sr-only">Preview of the selected news article. Press Escape or click outside to close.</p>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="text-[11px] px-2 py-1 rounded bg-slate-100 border border-slate-200 font-semibold">
                  {article?.category || "General"}
                </span>
                {article?.featured && (
                  <span className="text-[10px] px-2 py-1 rounded bg-amber-100 border border-amber-200 text-amber-800 font-bold">FEATURED</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openByIndex(currentIndex - 1)}
                  disabled={atStart}
                  className={`p-1.5 rounded border ${atStart ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100"}`}
                  aria-label="Previous article"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <button
                  type="button"
                  onClick={() => openByIndex(currentIndex + 1)}
                  disabled={atEnd}
                  className={`p-1.5 rounded border ${atEnd ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100"}`}
                  aria-label="Next article"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <button
                  type="button"
                  onClick={copyCurrentLink}
                  className="p-1.5 rounded border hover:bg-slate-100"
                  aria-label="Copy link"
                  title="Copy link"
                >
                  {copied ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  )}
                </button>
                <button ref={closeBtnRef} onClick={closeModal} className="p-1.5 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
            <div className="px-5 py-5">
              {loading && (
                <div>
                  <div className="skeleton skeleton-title" />
                  <div className="mt-4">
                    <div className="skeleton skeleton-text" />
                    <div className="skeleton skeleton-text" />
                    <div className="skeleton skeleton-text short" />
                  </div>
                </div>
              )}
              {error && <div className="text-sm text-red-600">{error}</div>}
              {!loading && !error && article && (
                <div>
                  <h3 id="news-modal-title" className="text-2xl font-black text-slate-900 leading-snug">
                    {article.title}
                  </h3>
                  <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
                      <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                      <path d="M16 2v4"></path>
                      <path d="M8 2v4"></path>
                      <path d="M3 10h18"></path>
                    </svg>
                    <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    {article.author ? <span>• {article.author}</span> : null}
                  </div>
                  {article.excerpt && (
                    <p className="mt-3 text-slate-700 font-medium">{article.excerpt}</p>
                  )}
                  <div className="prose prose-slate mt-4">
                    <p style={{whiteSpace:"pre-wrap"}}>{article.content}</p>
                  </div>
                  {/* Tags removed for a cleaner, more professional layout */}
                </div>
              )}
            </div>
            <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button onClick={closeModal} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppShell>
  );
}
