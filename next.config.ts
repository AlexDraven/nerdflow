import type { NextConfig } from "next";

const basePath = process.env.BASE_URL || "";
const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Webflow Cloud proxies requests, so x-forwarded-host is an internal host
      // that never matches the browser origin; without this, every action is rejected.
      allowedOrigins: ["nerdflow-2026.webflow.io"],
    },
  },
  ...(basePath && {
    basePath,
    assetPrefix: process.env.ASSETS_PREFIX || basePath,
  }),
};

export default nextConfig;

// Enable getCloudflareContext() in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
