import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cookieParser from "cookie-parser";
import { createRequestHandler } from "@react-router/express";
import path from "path";

// Route imports
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import reminderRoutes from "./routes/reminders";
import newsRoutes from "./routes/news";
import praxisRoutes from "./routes/praxisberichte";
import cronRoutes from "./routes/cron";

// In Vercel, process.cwd() is the project root
const clientBuildPath = path.join(process.cwd(), "build/client");

const app = express();

// Ensure Express knows it's behind a proxy (Vercel) so secure cookies work correctly
app.set("trust proxy", 1);

// Middleware
app.use(cookieParser()); // Populate req.cookies for auth/session

// Catch special browser/devtools requests BEFORE React Router
app.use((req: Request, res: Response, next: NextFunction) => {
  // Handle /.well-known/* requests
  if (req.path.startsWith("/.well-known/")) {
    return res.status(404).json({ error: "Not found" });
  }
  // Handle other special files
  if (
    req.path === "/robots.txt" ||
    req.path === "/sitemap.xml" ||
    req.path.includes("devtools") ||
    req.path.includes(".json")
  ) {
    if (req.path === "/robots.txt" || req.path === "/sitemap.xml") {
      // Allow falling through to specific handlers below
      return next();
    }
    return res.status(404).json({ error: "Not found" });
  }
  next();
});

// Ignore browser requests for special files
app.get("/.well-known/appspecific/:filename", (req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

app.get("/robots.txt", (req: Request, res: Response) => {
  res.type("text/plain").send("User-agent: *\nDisallow: /admin\n");
});

app.get("/sitemap.xml", (req: Request, res: Response) => {
  res
    .type("text/xml")
    .send(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
    );
});

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => res.json({ ok: true }));

// API Routes
app.use("/api", authRoutes); // /api/logout, /api/request-password-reset, etc.
app.use("/api/user", userRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/praxisberichte", praxisRoutes);
app.use("/api/cron", cronRoutes);

// Serve static files from build/client BEFORE React Router handler
app.use(
  express.static(clientBuildPath, {
    maxAge: "1d",
    etag: false,
  })
);

// React Router handler (catches everything else)
// Dynamically import the build to avoid require()ing ESM
// Use pathToFileURL to ensure Windows compatibility and correct URL format for dynamic import
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buildPath = path.join(process.cwd(), "build/server/nodejs_eyJydW50aW1lIjoibm9kZWpzIn0/index.js");
    const { pathToFileURL } = await import("url");
    // @ts-ignore - build path depends on build process
    const build = await import(pathToFileURL(buildPath).href);
    
    return createRequestHandler({
      build,
      mode: "production",
    })(req, res, next);
  } catch (error) {
    console.error("Failed to load server build:", error);
    next(error);
  }
});

// Vercel expects export, not app.listen()
export default app;
