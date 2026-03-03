import { prisma } from "~/services/prisma";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug = params.slug ?? "";

  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get("lang") || "de";

    let item = await prisma.news.findUnique({ where: { slug } });
    if (!item && /^\d+$/.test(slug)) {
      item = await prisma.news.findUnique({ where: { id: Number(slug) } });
    }
    if (!item) {
      return new Response(JSON.stringify({ error: "News not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const translatedItem = {
      ...item,
      title:
        lang === "en"
          ? item.title_en || item.title
          : item.title_de || item.title,
      excerpt:
        lang === "en"
          ? item.excerpt_en || item.excerpt
          : item.excerpt_de || item.excerpt,
      content:
        lang === "en"
          ? item.content_en || item.content
          : item.content_de || item.content,
      category:
        lang === "en"
          ? item.category_en || item.category
          : item.category_de || item.category,
    };

    return new Response(JSON.stringify({ item: translatedItem }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.warn("/api/news/:slug (RR) fallback:", (err as Error).message);
    const url = new URL(request.url);
    const lang = url.searchParams.get("lang") || "de";
    const now = new Date().toISOString();
    const samples = [
      {
        id: 1,
        slug: "welcome-to-the-portal",
        title_de: "Willkommen in der IU-Studentenplattform",
        title_en: "Welcome to the IU Student Platform",
        content_de:
          "Wir freuen uns, die neue IU-Studentenplattform zu starten. Hier kannst du Noten verwalten, Praxisberichte hochladen und dich über Campus-Updates informieren.",
        content_en:
          "We are excited to launch the new IU Student Platform. Here you can manage your marks, upload your practical reports, and stay informed about the latest campus updates.",
        category_de: "Ankündigungen",
        category_en: "Announcements",
        tags: JSON.stringify(["announcement", "portal"]),
        author: "IU Team",
        cover_image_url: undefined,
        featured: true,
        published_at: now,
      },
      {
        id: 2,
        slug: "exam-schedule-winter",
        title_de: "Winter-Prüfungsplan veröffentlicht",
        title_en: "Winter Exam Schedule Published",
        content_de:
          "Der Winter-Prüfungsplan ist veröffentlicht. Bitte prüfe deine kursspezifischen Termine und melde dich rechtzeitig an.",
        content_en:
          "The winter exam schedule has been published. Please check your course-specific dates and make sure to register before the deadline.",
        category_de: "Prüfungen",
        category_en: "Exams",
        tags: JSON.stringify(["exams", "schedule"]),
        author: "Examination Office",
        cover_image_url: undefined,
        featured: false,
        published_at: now,
      },
      {
        id: 3,
        slug: "campus-maintenance-november",
        title_de: "Geplante Campus-Wartung im November",
        title_en: "Scheduled Campus Maintenance in November",
        content_de:
          "Die IT führt am Wochenende eine geplante Wartung durch. Kurze Serviceunterbrechungen sind möglich.",
        content_en:
          "Our IT department will perform scheduled maintenance on campus systems this weekend. Short service interruptions may occur.",
        category_de: "IT",
        category_en: "IT",
        tags: JSON.stringify(["maintenance", "it"]),
        author: "IT Services",
        cover_image_url: undefined,
        featured: false,
        published_at: now,
      },
      {
        id: 4,
        slug: "new-module-data-analytics",
        title_de: "Neues Modul: Data Analytics mit Python",
        title_en: "New Module: Data Analytics with Python",
        content_de:
          "Wir bieten ein neues Modul zu Data Analytics mit Python an. Themen sind NumPy, pandas, Visualisierung und Grundlagen von ML.",
        content_en:
          "We are excited to offer a new module on Data Analytics with Python. The course covers NumPy, pandas, visualization, and basic ML.",
        category_de: "Akademisches",
        category_en: "Academics",
        tags: JSON.stringify(["module", "python", "analytics"]),
        author: "Faculty of Computer Science",
        cover_image_url: undefined,
        featured: true,
        published_at: now,
      },
      {
        id: 5,
        slug: "scholarship-opportunities-2025",
        title_de: "Stipendien 2025: Jetzt bewerben",
        title_en: "Scholarship Opportunities 2025",
        content_de:
          "Bewerbungen für Stipendien im Studienjahr 2025 sind offen. Bitte vor dem 15. Dezember einreichen.",
        content_en:
          "Applications are open for various scholarships for the 2025 academic year. Submit your application before December 15.",
        category_de: "Stipendien",
        category_en: "Scholarships",
        tags: JSON.stringify(["scholarship", "finance"]),
        author: "Student Office",
        cover_image_url: undefined,
        featured: false,
        published_at: now,
      },
      {
        id: 6,
        slug: "library-extended-hours",
        title_de: "Bibliothek verlängert Öffnungszeiten",
        title_en: "Library Extends Opening Hours",
        content_de:
          "Zur Unterstützung eures Studiums öffnet die Bibliothek werktags bis 00:00 Uhr.",
        content_en:
          "To support your studies, the campus library will extend opening hours to 00:00 from Monday to Friday.",
        category_de: "Bibliothek",
        category_en: "Library",
        tags: JSON.stringify(["library", "hours"]),
        author: "Library Team",
        cover_image_url: undefined,
        featured: false,
        published_at: now,
      },
      {
        id: 7,
        slug: "career-fair-2025",
        title_de: "Karrieremesse 2025: Sei dabei",
        title_en: "Join the 2025 Career Fair",
        content_de:
          "Unsere jährliche Karrieremesse bringt Top-Arbeitgeber auf den Campus. Bereite deinen Lebenslauf vor und triff Recruiter.",
        content_en:
          "Our annual Career Fair brings top employers to campus. Prepare your CV and meet recruiters.",
        category_de: "Karriere",
        category_en: "Careers",
        tags: JSON.stringify(["career", "fair", "jobs"]),
        author: "Career Services",
        cover_image_url: undefined,
        featured: true,
        published_at: now,
      },
    ];
    const item = samples.find((s) => s.slug === slug) || null;
    if (item) {
      const translatedItem = {
        ...item,
        title: lang === "en" ? item.title_en : item.title_de,
        content: lang === "en" ? item.content_en : item.content_de,
        category: lang === "en" ? item.category_en : item.category_de,
      };
      return new Response(JSON.stringify({ item: translatedItem }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "News not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const action = async ({ request, params }: ActionFunctionArgs) =>
  loader({ request, params } as LoaderFunctionArgs);
