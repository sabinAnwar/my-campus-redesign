import { useLoaderData, useLocation } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "~/store/LanguageContext";
import {
  NewsDetailError,
  NewsDetailHero,
  NewsDetailContent,
} from "~/features/news";
import { normalizeNewsItem } from "~/utils/news";

export async function loader({ params, request }) {
  const url = new URL(request.url);
  const langParam = url.searchParams.get("lang");
  const acceptLanguage = request.headers.get("accept-language") || "";
  const inferredLang = acceptLanguage.toLowerCase().startsWith("en") ? "en" : "de";
  const lang = langParam || inferredLang;
  try {
    const res = await fetch(
      `${url.origin}/api/news/${encodeURIComponent(params.slug || "")}?lang=${lang}`
    );
    if (!res.ok) {
      return {
        notFound: res.status === 404,
        error: `Failed to load (status ${res.status})`,
      };
    }
    const data = await res.json();
    if (data?.item) {
      return { ...data, item: normalizeNewsItem(data.item) };
    }
    return data;
  } catch (err) {
    return { error: "Network error while loading the article." };
  }
}

const TRANSLATIONS = {
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
};

export default function NewsDetail() {
  const data = useLoaderData();
  const { language } = useLanguage();
  const locale = language === "de" ? "de-DE" : "en-US";
  const t = TRANSLATIONS[language];
  const location = useLocation();
  const backSearch = location.search || "";
  const [copied, setCopied] = useState(false);

  if (data?.notFound) {
    return (
      <NewsDetailError
        message={t.notFound}
        backLabel={t.back}
        backSearch={backSearch}
      />
    );
  }

  if (data?.error && !data?.item) {
    return (
      <NewsDetailError
        message={data.error || t.errorFallback}
        backLabel={t.back}
        backSearch={backSearch}
      />
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
      <NewsDetailHero
        title={item.title}
        category={item.category}
        featured={item.featured}
        publishedAt={item.publishedAt}
        author={item.author}
        coverImageUrl={item.coverImageUrl}
        locale={locale}
        labels={{
          categoryFallback: t.categoryFallback,
          featured: t.featured,
        }}
      />

      <NewsDetailContent
        content={item.content}
        excerpt={item.excerpt}
        tags={tags}
        backSearch={backSearch}
        copied={copied}
        onCopyLink={copyLink}
        labels={{
          back: t.back,
          copy: t.copy,
          copied: t.copied,
        }}
      />
    </div>
  );
}
