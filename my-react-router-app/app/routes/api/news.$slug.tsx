import { prisma } from "../../lib/prisma";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router-dom";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const slug = params.slug ?? "";

  try {
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
    return new Response(JSON.stringify({ item }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.warn("/api/news/:slug (RR) fallback:", (err as Error).message);
    const now = new Date().toISOString();
    const samples = [
      { id: 1, slug: "welcome-to-the-portal", title: "Welcome to the IU Student Portal", content: "We are excited to launch the new IU Student Portal. Here you can manage your marks, upload your practical reports, and stay informed about the latest campus updates.", category: "Announcements", tags: JSON.stringify(["announcement","portal"]), author: "IU Team", coverImageUrl: undefined, featured: true, publishedAt: now },
      { id: 2, slug: "exam-schedule-winter", title: "Winter Exam Schedule Published", content: "The winter exam schedule has been published. Please check your course-specific dates and make sure to register before the deadline.", category: "Exams", tags: JSON.stringify(["exams","schedule"]), author: "Examination Office", coverImageUrl: undefined, featured: false, publishedAt: now },
      { id: 3, slug: "campus-maintenance-november", title: "Scheduled Campus Maintenance in November", content: "Our IT department will perform scheduled maintenance on campus systems this weekend. Short service interruptions may occur.", category: "IT", tags: JSON.stringify(["maintenance","it"]), author: "IT Services", coverImageUrl: undefined, featured: false, publishedAt: now },
      { id: 4, slug: "new-module-data-analytics", title: "New Module: Data Analytics with Python", content: "We are excited to offer a new module on Data Analytics with Python. The course covers NumPy, pandas, visualization, and basic ML.", category: "Academics", tags: JSON.stringify(["module","python","analytics"]), author: "Faculty of Computer Science", coverImageUrl: undefined, featured: true, publishedAt: now },
      { id: 5, slug: "scholarship-opportunities-2025", title: "Scholarship Opportunities 2025", content: "Applications are open for various scholarships for the 2025 academic year. Submit your application before December 15.", category: "Scholarships", tags: JSON.stringify(["scholarship","finance"]), author: "Student Office", coverImageUrl: undefined, featured: false, publishedAt: now },
      { id: 6, slug: "library-extended-hours", title: "Library Extends Opening Hours", content: "To support your studies, the campus library will extend opening hours to 00:00 from Monday to Friday.", category: "Library", tags: JSON.stringify(["library","hours"]), author: "Library Team", coverImageUrl: undefined, featured: false, publishedAt: now },
      { id: 7, slug: "career-fair-2025", title: "Join the 2025 Career Fair", content: "Our annual Career Fair brings top employers to campus. Prepare your CV and meet recruiters.", category: "Careers", tags: JSON.stringify(["career","fair","jobs"]), author: "Career Services", coverImageUrl: undefined, featured: true, publishedAt: now },
    ];
    const item = samples.find((s) => s.slug === slug) || null;
    if (item) {
      return new Response(JSON.stringify({ item }), {
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
