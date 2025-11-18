// react-router.config.js
import { vercelPreset } from "@vercel/react-router/vite";

/** @type {import('@react-router/dev/config').Config} */
export default {
  ssr: true,
  presets: [vercelPreset()],
  ssrBuild: {
    outDir: "build/server", // <--- force static output
  },
};
