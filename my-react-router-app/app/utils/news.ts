import type { NewsItem, NewsResponse } from "~/types/news";

type RawNewsItem = Record<string, any>;

type RawNewsResponse = {
  items?: RawNewsItem[];
  total?: number;
  page?: number;
  pageSize?: number;
};

function toString(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function normalizeNewsItem(item: RawNewsItem): NewsItem {
  const id = typeof item.id === "number" ? item.id : undefined;
  const slug = toString(item.slug).trim() || (id != null ? String(id) : "");
  const publishedAt =
    toString(item.publishedAt) ||
    toString(item.published_at) ||
    toString(item.publishedAt) ||
    "";

  return {
    id,
    slug,
    title: toString(item.title),
    excerpt: toString(item.excerpt) || undefined,
    content: toString(item.content) || undefined,
    category: toString(item.category) || undefined,
    author: toString(item.author) || undefined,
    featured: typeof item.featured === "boolean" ? item.featured : undefined,
    publishedAt,
    coverImageUrl: toString(item.coverImageUrl) || toString(item.cover_image_url) || undefined,
    tags: toString(item.tags) || undefined,
  };
}

export function normalizeNewsResponse(data: RawNewsResponse): NewsResponse {
  const items = Array.isArray(data.items) ? data.items.map(normalizeNewsItem) : [];
  return {
    items,
    total: typeof data.total === "number" ? data.total : items.length,
    page: typeof data.page === "number" ? data.page : 1,
    pageSize: typeof data.pageSize === "number" ? data.pageSize : items.length,
  };
}
