import { prisma } from "~/services/prisma";

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
      title:
        lang === "en"
          ? item.title_en || item.title
          : item.title_de || item.title,
      excerpt:
        lang === "en"
          ? item.excerpt_en || item.excerpt
          : item.excerpt_de || item.excerpt,
      category:
        lang === "en"
          ? item.category_en || item.category
          : item.category_de || item.category,
    }));

    let filtered = translatedItems;
    if (tag) {
      filtered = translatedItems.filter((n: { tags: any }) => {
        try {
          const arr = JSON.parse(n.tags || "[]");
          return (
            Array.isArray(arr) &&
            arr.some((t) => String(t).toLowerCase() === tag.toLowerCase())
          );
        } catch (_) {
          return false;
        }
      });
    }

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
    const lang = url.searchParams.get("lang") || "de";
    const daysAgo = (d: number) => {
      const t = new Date(now);
      t.setDate(now.getDate() - d);
      return t.toISOString();
    };
    const all = [
      {
        id: 7,
        slug: "career-fair-2025",
        title_de: "Karrieremesse 2025: Jetzt teilnehmen",
        title_en: "Join the 2025 Career Fair",
        excerpt_de:
          "Triff Arbeitgeber, nimm an Workshops teil und erweitere dein Netzwerk.",
        excerpt_en: "Meet employers, attend workshops, and grow your network.",
        content_de: "Details zur Karrieremesse",
        content_en: "Career fair details",
        category_de: "Karriere",
        category_en: "Careers",
        tags: JSON.stringify(["career", "fair", "jobs"]),
        author: "Career Services",
        cover_image_url: undefined,
        featured: true,
        published_at: daysAgo(0),
      },
      {
        id: 4,
        slug: "new-module-data-analytics",
        title_de: "Neues Modul: Data Analytics mit Python",
        title_en: "New Module: Data Analytics with Python",
        excerpt_de:
          "Jetzt für das kommende Semester einschreiben und moderne Analytics lernen.",
        excerpt_en:
          "Enroll now for the upcoming semester to learn modern analytics.",
        content_de: "Moduldetails",
        content_en: "Module details",
        category_de: "Akademisches",
        category_en: "Academics",
        tags: JSON.stringify(["module", "python", "analytics"]),
        author: "Faculty of Computer Science",
        cover_image_url: undefined,
        featured: true,
        published_at: daysAgo(2),
      },
      {
        id: 1,
        slug: "welcome-to-the-portal",
        title_de: "Willkommen in der IU-Studentenplattform",
        title_en: "Welcome to the IU Student Platform",
        excerpt_de: "Alles an einem Ort: Noten, Anträge, Module und mehr.",
        excerpt_en:
          "Everything you need in one place: marks, applications, modules, and more.",
        content_de: "Willkommensinhalt",
        content_en: "Welcome content",
        category_de: "Ankündigungen",
        category_en: "Announcements",
        tags: JSON.stringify(["announcement", "portal"]),
        author: "IU Team",
        cover_image_url: undefined,
        featured: false,
        published_at: daysAgo(3),
      },
      {
        id: 2,
        slug: "exam-schedule-winter",
        title_de: "Winter-Prüfungsplan veröffentlicht",
        title_en: "Winter Exam Schedule Published",
        excerpt_de:
          "Prüfungstermine und Anmeldefristen für das Wintersemester.",
        excerpt_en:
          "Check the dates and registration deadlines for the winter term.",
        content_de: "Details zum Prüfungsplan",
        content_en: "Exam schedule details",
        category_de: "Prüfungen",
        category_en: "Exams",
        tags: JSON.stringify(["exams", "schedule"]),
        author: "Examination Office",
        cover_image_url: undefined,
        featured: false,
        published_at: daysAgo(4),
      },
      {
        id: 3,
        slug: "campus-maintenance-november",
        title_de: "Geplante Campus-Wartung im November",
        title_en: "Scheduled Campus Maintenance in November",
        excerpt_de:
          "Kurze Ausfälle ausgewählter Dienste am Wochenende möglich.",
        excerpt_en:
          "Short downtimes may occur on selected services next weekend.",
        content_de: "Wartungsdetails",
        content_en: "Maintenance details",
        category_de: "IT",
        category_en: "IT",
        tags: JSON.stringify(["maintenance", "it"]),
        author: "IT Services",
        cover_image_url: undefined,
        featured: false,
        published_at: daysAgo(5),
      },
      {
        id: 5,
        slug: "scholarship-opportunities-2025",
        title_de: "Stipendien 2025: Jetzt bewerben",
        title_en: "Scholarship Opportunities 2025",
        excerpt_de: "Mehrere Stipendien für engagierte Studierende verfügbar.",
        excerpt_en:
          "Multiple scholarships for outstanding students now available.",
        content_de: "Stipendien-Details",
        content_en: "Scholarship details",
        category_de: "Stipendien",
        category_en: "Scholarships",
        tags: JSON.stringify(["scholarship", "finance"]),
        author: "Student Office",
        cover_image_url: undefined,
        featured: false,
        published_at: daysAgo(7),
      },
      {
        id: 6,
        slug: "library-extended-hours",
        title_de: "Bibliothek verlängert Öffnungszeiten",
        title_en: "Library Extends Opening Hours",
        excerpt_de: "Ab nächstem Monat ist die Bibliothek bis 00:00 geöffnet.",
        excerpt_en: "From next month, the library will be open until midnight.",
        content_de: "Bibliotheks-Details",
        content_en: "Library details",
        category_de: "Bibliothek",
        category_en: "Library",
        tags: JSON.stringify(["library", "hours"]),
        author: "Library Team",
        cover_image_url: undefined,
        featured: false,
        published_at: daysAgo(9),
      },
    ];
    const translated = all.map((item) => ({
      ...item,
      title: lang === "en" ? item.title_en : item.title_de,
      excerpt: lang === "en" ? item.excerpt_en : item.excerpt_de,
      content: lang === "en" ? item.content_en : item.content_de,
      category: lang === "en" ? item.category_en : item.category_de,
    }));
    const q = search.toLowerCase();
    let filtered = translated;
    if (q) {
      filtered = filtered.filter((n) =>
        [n.title, n.excerpt, n.content].some((t) =>
          (t || "").toLowerCase().includes(q),
        ),
      );
    }
    if (category) {
      filtered = filtered.filter(
        (n) => (n.category || "").toLowerCase() === category.toLowerCase(),
      );
    }
    if (tag) {
      filtered = filtered.filter((n) => {
        try {
          const arr = JSON.parse(n.tags || "[]");
          return (
            Array.isArray(arr) &&
            arr.some((t) => String(t).toLowerCase() === tag.toLowerCase())
          );
        } catch {
          return false;
        }
      });
    }
    filtered = filtered.sort((a, b) => {
      if (a.featured === b.featured) {
        return (
          Date.parse(String(b.published_at)) -
          Date.parse(String(a.published_at))
        );
      }
      return a.featured ? -1 : 1;
    });
    const total = filtered.length;
    const items = filtered
      .slice(skip, skip + pageSize)
      .map(({ content, ...rest }) => rest);
    return Response.json({ items, total, page, pageSize });
  }
}

export const action = loader;
