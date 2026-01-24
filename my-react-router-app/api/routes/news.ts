import express, { type Request, type Response } from "express";
import { prisma } from "../utils/db";
import { toInt } from "../utils/helpers";
import { FALLBACK_NEWS_ITEMS } from "../data/news-data";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const page = toInt(req.query.page, 1);
  const pageSize = Math.min(toInt(req.query.pageSize, 12), 50);
  const search = (req.query.search || "").toString().trim();
  const category = (req.query.category || "").toString().trim();
  const tag = (req.query.tag || "").toString().trim();
  const skip = (page - 1) * pageSize;

  try {
    const where = {
      status: "PUBLISHED",
      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                excerpt: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                content: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
      ...(category
        ? {
            category: {
              equals: category,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where: where as any,
        orderBy: [{ featured: "desc" }, { published_at: "desc" }],
        take: pageSize,
        skip,
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          tags: true,
          author: true,
          cover_image_url: true,
          featured: true,
          published_at: true,
        },
      }),
      prisma.news.count({ where: where as any }),
    ]);

    // optional tag filter on result set (tags stored as JSON string)
    const filtered = tag
      ? items.filter((n: { tags: any }) => {
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

    return res.json({ items: filtered, total, page, pageSize });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err && typeof err === "object" && "message" in err) {
      message = String((err as any).message);
    } else if (typeof err === "string") {
      message = err;
    }
    console.warn("/api/news fallback due to error:", message);
    
    // Fallback using exported data
    const q = (search || "").toLowerCase();
    let filtered = FALLBACK_NEWS_ITEMS;
    
    if (q) {
      filtered = filtered.filter((n) =>
        [n.title, n.excerpt, n.content].some((t) =>
          (t || "").toLowerCase().includes(q)
        )
      );
    }
    if (category) {
      filtered = filtered.filter(
        (n) => (n.category || "").toLowerCase() === category.toLowerCase()
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
    // Sort featured first, then by publishedAt desc
    filtered = filtered.sort((a, b) => {
      if (a.featured === b.featured) {
        return (
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
      }
      return a.featured ? -1 : 1;
    });
    const total = filtered.length;
    const items = filtered
      .slice(skip, skip + pageSize)
      .map(({ content, ...rest }) => rest);
    return res.json({ items, total, page, pageSize });
  }
});

router.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    let item = await prisma.news.findUnique({ where: { slug } });
    if (!item && /^\d+$/.test(slug)) {
      item = await prisma.news.findUnique({ where: { id: Number(slug) } });
    }
    if (!item) {
      return res.status(404).json({ error: "News not found" });
    }
    return res.json({ item });
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err && typeof err === "object" && "message" in err) {
      message = String((err as any).message);
    } else if (typeof err === "string") {
      message = err;
    }
    console.warn("/api/news/:slug fallback due to error:", message);
    
    // Fallback using exported data
    const item = FALLBACK_NEWS_ITEMS.find((s) => s.slug === slug) || null;
    if (item) return res.json({ item });
    return res.status(404).json({ error: "News not found" });
  }
});

export default router;
