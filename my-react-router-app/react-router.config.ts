import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  // Enable SSR
  ssr: true,
  // Ensure React Router build is compatible with Vercel
  presets: [vercelPreset()],
} satisfies Config;
