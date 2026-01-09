import { prisma } from "../../lib/prisma";

function toInt(value: string | null, def: number) {
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) && n > 0 ? n : def;
}

export async function loader({ request }: { request: Request }) {
  if (request.method !== "GET") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const url = new URL(request.url);
  const page = toInt(url.searchParams.get("page"), 1);
  const pageSize = Math.min(toInt(url.searchParams.get("pageSize"), 12), 50);
  const search = (url.searchParams.get("search") || "").trim();
  const category = (url.searchParams.get("category") || "").trim();
  const tag = (url.searchParams.get("tag") || "").trim();
  const skip = (page - 1) * pageSize;

  try {
    const where = {
      status: "PUBLISHED",
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { excerpt: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category: { equals: category, mode: "insensitive" } }),
    };

    const lang = url.searchParams.get("lang") || "de";

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: [{ featured: "desc" }, { published_at: "desc" }],
        take: pageSize,
        skip,
        select: {
          id: true,
          slug: true,
          title: true,
          title_de: true,
          title_en: true,
          excerpt: true,
          excerpt_de: true,
          excerpt_en: true,
          category: true,
          category_de: true,
          category_en: true,
          tags: true,
          author: true,
          cover_image_url: true,
          featured: true,
          published_at: true,
        },
      }),
      prisma.news.count({ where }),
    ]);

    const translatedItems = items.map((item: any) => ({
      ...item,
      title: lang === "en" ? (item.title_en || item.title) : (item.title_de || item.title),
      excerpt: lang === "en" ? (item.excerpt_en || item.excerpt) : (item.excerpt_de || item.excerpt),
      category: lang === "en" ? (item.category_en || item.category) : (item.category_de || item.category),
    }));

    const filtered = tag
      ? translatedItems.filter((n: { tags: any; }) => {
          try {
            const arr = JSON.parse(n.tags || "[]");
            return (
              Array.isArray(arr) &&
              arr.some((t) => String(t).toLowerCase() === tag.toLowerCase())
            );
          } catch (_) {
            return false;
          }
        })
      : items;

    return Response.json({ items: filtered, total, page, pageSize });
  } catch (err) {
    // err is unknown; narrow to Error to safely access message
    if (err instanceof Error) {
      console.warn("/api/news (RR) fallback:", err.message);
    } else {
      console.warn("/api/news (RR) fallback:", String(err));
    }
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") || "").trim();
    const category = (url.searchParams.get("category") || "").trim();
    const tag = (url.searchParams.get("tag") || "").trim();
    const page = toInt(url.searchParams.get("page"), 1);
    const pageSize = Math.min(toInt(url.searchParams.get("pageSize"), 12), 50);
    const skip = (page - 1) * pageSize;
    const now = new Date();
    const daysAgo = (d: number) => {
      const t = new Date(now);
      t.setDate(now.getDate() - d);
      return t.toISOString();
    };
    const all = [
      { id: 7, slug: "career-fair-2025", title: "Join the 2025 Career Fair", excerpt: "Meet employers, attend workshops, and grow your network.", content: "Career fair details", category: "Careers", tags: JSON.stringify(["career","fair","jobs"]), author: "Career Services", cover_image_url: undefined, featured: true, published_at: daysAgo(0) },
      { id: 4, slug: "new-module-data-analytics", title: "New Module: Data Analytics with Python", excerpt: "Enroll now for the upcoming semester to learn modern analytics.", content: "Module details", category: "Academics", tags: JSON.stringify(["module","python","analytics"]), author: "Faculty of Computer Science", cover_image_url: undefined, featured: true, published_at: daysAgo(2) },
      { id: 1, slug: "welcome-to-the-portal", title: "Welcome to the IU Student Portal", excerpt: "Everything you need in one place: marks, applications, modules, and more.", content: "Welcome content", category: "Announcements", tags: JSON.stringify(["announcement","portal"]), author: "IU Team", cover_image_url: undefined, featured: false, published_at: daysAgo(3) },
      { id: 2, slug: "exam-schedule-winter", title: "Winter Exam Schedule Published", excerpt: "Check the dates and registration deadlines for the winter term.", content: "Exam schedule details", category: "Exams", tags: JSON.stringify(["exams","schedule"]), author: "Examination Office", cover_image_url: undefined, featured: false, published_at: daysAgo(4) },
      { id: 3, slug: "campus-maintenance-november", title: "Scheduled Campus Maintenance in November", excerpt: "Short downtimes may occur on selected services next weekend.", content: "Maintenance details", category: "IT", tags: JSON.stringify(["maintenance","it"]), author: "IT Services", cover_image_url: undefined, featured: false, published_at: daysAgo(5) },
      { id: 5, slug: "scholarship-opportunities-2025", title: "Scholarship Opportunities 2025", excerpt: "Multiple scholarships for outstanding students now available.", content: "Scholarship details", category: "Scholarships", tags: JSON.stringify(["scholarship","finance"]), author: "Student Office", cover_image_url: undefined, featured: false, published_at: daysAgo(7) },
      { id: 6, slug: "library-extended-hours", title: "Library Extends Opening Hours", excerpt: "From next month, the library will be open until midnight.", content: "Library details", category: "Library", tags: JSON.stringify(["library","hours"]), author: "Library Team", cover_image_url: undefined, featured: false, published_at: daysAgo(9) },
    ];
    const q = search.toLowerCase();
    let filtered = all;
    if (q) {
      filtered = filtered.filter((n) => [n.title, n.excerpt, n.content].some((t) => (t || "").toLowerCase().includes(q)));
    }
    if (category) {
      filtered = filtered.filter((n) => (n.category || "").toLowerCase() === category.toLowerCase());
    }
    if (tag) {
      filtered = filtered.filter((n) => {
        try {
          const arr = JSON.parse(n.tags || "[]");
          return Array.isArray(arr) && arr.some((t) => String(t).toLowerCase() === tag.toLowerCase());
        } catch {
          return false;
        }
      });
    }
    filtered = filtered.sort((a, b) => {
      if (a.featured === b.featured) {
        return Date.parse(String(b.published_at)) - Date.parse(String(a.published_at));
      }
      return a.featured ? -1 : 1;
    });
    const total = filtered.length;
    const items = filtered.slice(skip, skip + pageSize).map(({ content, ...rest }) => rest);
    return Response.json({ items, total, page, pageSize });
  }
}

export const action = loader;
