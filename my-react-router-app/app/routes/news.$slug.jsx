import { Link, useLoaderData, useLocation } from "react-router";
import { useState } from "react";
import AppShell from "../components/AppShell";

export async function loader({ params, request }) {
  const url = new URL(request.url);
  try {
    const res = await fetch(`${url.origin}/api/news/${encodeURIComponent(params.slug)}`);
    if (!res.ok) {
      return { notFound: res.status === 404, error: `Failed to load (status ${res.status})` };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return { error: "Network error while loading the article." };
  }
}

export default function NewsDetail() {
  const data = useLoaderData();
  const location = useLocation();
  const backSearch = location.search || "";
  const [copied, setCopied] = useState(false);
  if (data?.notFound) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-600">News article not found.</p>
          <Link to={`/news${backSearch}`} className="inline-block mt-4 text-sm font-bold text-slate-900 underline">Back to News</Link>
        </div>
      </AppShell>
    );
  }
  if (data?.error && !data?.item) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <p className="text-slate-600">{data.error}</p>
          <Link to={`/news${backSearch}`} className="inline-block mt-4 text-sm font-bold text-slate-900 underline">Back to News</Link>
        </div>
      </AppShell>
    );
  }
  const { item } = data;
  const tags = (() => {
    try { return JSON.parse(item.tags || "[]"); } catch { return []; }
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
    <AppShell>
      {/* Optional hero when cover image exists */}
      {item.coverImageUrl ? (
        <header className="relative w-full">
          <div
            className="h-60 md:h-80 w-full bg-slate-200"
            style={{
              backgroundImage: `url(${item.coverImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-3xl mx-auto w-full px-4 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] px-2 py-1 rounded bg-white/80 text-slate-800 border border-white/80 font-semibold backdrop-blur">
                  {item.category || "General"}
                </span>
                {item.featured && (
                  <span className="text-[10px] px-2 py-1 rounded bg-amber-200/90 border border-amber-300 text-amber-900 font-bold backdrop-blur">FEATURED</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow">{item.title}</h1>
              <div className="mt-2 text-sm text-white/90 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-90">
                  <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                  <path d="M16 2v4"></path>
                  <path d="M8 2v4"></path>
                  <path d="M3 10h18"></path>
                </svg>
                <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                {item.author ? <span>• {item.author}</span> : null}
              </div>
            </div>
          </div>
        </header>
      ) : (
        <div className="max-w-3xl mx-auto px-4 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs px-2 py-1 rounded bg-slate-100 border border-slate-200 font-semibold">
              {item.category || "General"}
            </span>
            {item.featured && (
              <span className="text-[10px] px-2 py-1 rounded bg-amber-100 border border-amber-200 text-amber-800 font-bold">FEATURED</span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-black text-slate-900">{item.title}</h1>
          <div className="mt-2 text-sm text-slate-500 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70">
              <rect width="18" height="18" x="3" y="4" rx="2"></rect>
              <path d="M16 2v4"></path>
              <path d="M8 2v4"></path>
              <path d="M3 10h18"></path>
            </svg>
            <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
            {item.author ? <span>• {item.author}</span> : null}
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4">
        <div className="flex items-center justify-between mt-4">
          <Link to={`/news${backSearch}`} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            All News
          </Link>
          <button onClick={copyLink} className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200">
            {copied ? (
              <>
                Copied
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              </>
            ) : (
              <>
                Copy link
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              </>
            )}
          </button>
        </div>

        {item.excerpt && (
          <p className="mt-6 text-lg text-slate-700">{item.excerpt}</p>
        )}

        <div className="prose prose-slate mt-6 whitespace-pre-wrap">
          {item.content}
        </div>

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded bg-slate-100 border border-slate-200 font-semibold">
                #{t}
              </span>
            ))}
          </div>
        )}
      </article>
    </AppShell>
  );
}
