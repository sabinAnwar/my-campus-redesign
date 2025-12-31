import { Link, useLoaderData, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "~/contexts/LanguageContext";

export async function loader({ params, request }) {
  const url = new URL(request.url);
  try {
    const res = await fetch(
      `${url.origin}/api/news/${encodeURIComponent(params.slug)}`
    );
    if (!res.ok) {
      return {
        notFound: res.status === 404,
        error: `Failed to load (status ${res.status})`,
      };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return { error: "Network error while loading the article." };
  }
}

export default function NewsDetail() {
  const data = useLoaderData();
  const { language } = useLanguage();
  const locale = language === "de" ? "de-DE" : "en-US";
  const t = {
    de: {
      notFound: "News-Artikel nicht gefunden.",
      back: "Zurück zu den News",
      errorFallback: "Fehler beim Laden der News.",
      categoryFallback: "Allgemein",
      featured: "FEATURED",
      copy: "Link kopieren",
      copied: "Kopiert!",
    },
    en: {
      notFound: "News article not found.",
      back: "Back to News",
      errorFallback: "Failed to load news.",
      categoryFallback: "General",
      featured: "FEATURED",
      copy: "Copy link",
      copied: "Copied!",
    },
  }[language];
  const location = useLocation();
  const backSearch = location.search || "";
  const [copied, setCopied] = useState(false);
  if (data?.notFound) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-400 font-bold">{t.notFound}</p>
          <Link
            to={`/news${backSearch}`}
            className="inline-block mt-4 text-sm font-black text-iu-blue uppercase tracking-wider hover:underline"
          >
            {t.back}
          </Link>
        </div>
      </div>
    );
  }
  if (data?.error && !data?.item) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-400 font-bold">{data.error || t.errorFallback}</p>
          <Link
            to={`/news${backSearch}`}
            className="inline-block mt-4 text-sm font-black text-iu-blue uppercase tracking-wider hover:underline"
          >
            {t.back}
          </Link>
        </div>
      </div>
    );
  }
  const { item } = data;
  const tags = (() => {
    try {
      return JSON.parse(item.tags || "[]");
    } catch {
      return [];
    }
  })();

  function copyLink() {
    try {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (_) {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20">
      {/* Optional hero when cover image exists */}
      {item.coverImageUrl ? (
        <header className="relative w-full">
          <div
            className="h-60 md:h-96 w-full bg-slate-900"
            style={{
              backgroundImage: `url(${item.coverImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-3xl mx-auto w-full px-4 pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] px-3 py-1 rounded-none bg-iu-blue text-white font-black uppercase tracking-widest">
                  {item.category || t.categoryFallback}
                </span>
                {item.featured && (
                  <span className="text-[10px] px-3 py-1 rounded-none bg-iu-orange text-slate-950 font-black uppercase tracking-widest">
                    {t.featured}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                {item.title}
              </h1>
              <div className="mt-4 text-sm text-slate-400 font-bold flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="0"></rect>
                    <path d="M16 2v4"></path>
                    <path d="M8 2v4"></path>
                    <path d="M3 10h18"></path>
                  </svg>
                  <span>{new Date(item.publishedAt).toLocaleDateString(locale)}</span>
                </div>
                {item.author ? (
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 bg-slate-600 rounded-full" />
                    <span>{item.author}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>
      ) : (
        <div className="max-w-3xl mx-auto px-4 pt-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] px-3 py-1 rounded-none bg-iu-blue text-white font-black uppercase tracking-widest">
              {item.category || t.categoryFallback}
            </span>
            {item.featured && (
              <span className="text-[10px] px-3 py-1 rounded-none bg-iu-orange text-slate-950 font-black uppercase tracking-widest">
                {t.featured}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            {item.title}
          </h1>
          <div className="mt-4 text-sm text-slate-400 font-bold flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="0"></rect>
                <path d="M16 2v4"></path>
                <path d="M8 2v4"></path>
                <path d="M3 10h18"></path>
              </svg>
              <span>{new Date(item.publishedAt).toLocaleDateString(locale)}</span>
            </div>
            {item.author ? (
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 bg-slate-600 rounded-full" />
                <span>{item.author}</span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mt-8 pb-8 border-b border-slate-800">
          <Link
            to={`/news${backSearch}`}
            className="inline-flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest px-4 py-2 rounded-none bg-slate-900 hover:bg-iu-blue transition-colors border border-slate-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            {t.back}
          </Link>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-2 text-xs font-black text-white uppercase tracking-widest px-4 py-2 rounded-none bg-slate-900 hover:bg-iu-pink transition-colors border border-slate-800"
          >
            {copied ? (
              <>
                {t.copied}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </>
            ) : (
              <>
                {t.copy}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="0" ry="0" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </>
            )}
          </button>
        </div>

        {item.excerpt && (
          <p className="mt-10 text-xl text-slate-200 font-bold leading-relaxed italic border-l-4 border-iu-blue pl-6">
            {item.excerpt}
          </p>
        )}

        <div className="prose prose-invert prose-slate max-w-none mt-10 whitespace-pre-wrap text-slate-300 font-medium leading-loose">
          {item.content}
        </div>

        {tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap gap-3">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[10px] px-3 py-1 rounded-none bg-slate-900 border border-slate-800 font-black text-slate-400 uppercase tracking-widest hover:text-iu-blue hover:border-iu-blue transition-colors cursor-default"
              >
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
