// react-router.config.js
import { vercelPreset } from "@vercel/react-router/vite";

/** @type {import('@react-router/dev/config').Config} */
export default {
  // SSR ist hier richtig, weil du kein index.html hast
  ssr: true,
  presets: [vercelPreset()],
};
