import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
  ],
  resolve: {
    alias: {
      "~": resolve(__dirname, "./app"),
    },
  },
  ssr: {
    noExternal: ["@vercel/analytics", "@vercel/speed-insights"],
  },
  esbuild: {
    // Force ESM output for client build, ignoring tsconfig "module": "Node16"
    format: "esm", 
  },
});
