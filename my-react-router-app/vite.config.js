import { defineConfig } from "vite";
import { vercelPreset } from "@vercel/react-router/vite";
import { reactRouter } from "@react-router/dev/vite";

export default defineConfig({
  ssr: true,
  presets: [vercelPreset()],
  plugins: [reactRouter()],
  ssrBuild: {
    outDir: "build/server", // <--- force static output
  },
  server: {
    middlewares: [
      {
        apply: "serve",
        use: (req, res, next) => {
          // Block special browser requests from reaching React Router
          if (
            req.url.startsWith("/.well-known/") ||
            req.url === "/robots.txt" ||
            req.url === "/sitemap.xml" ||
            req.url.includes("devtools") ||
            (req.url.includes(".json") && !req.url.includes("/api/"))
          ) {
            res.statusCode = 404;
            res.end("Not found");
            return;
          }
          next();
        },
      },
    ],
  },
});
