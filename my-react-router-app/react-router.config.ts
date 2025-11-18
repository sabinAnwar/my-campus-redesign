import { vercelPreset } from "@vercel/react-router/vite";
import type { Config } from "@react-router/dev/config";

const config: Config = {
  ssr: true,
  presets: [vercelPreset()],
};

export default config;
