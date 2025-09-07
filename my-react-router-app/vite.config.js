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
});
