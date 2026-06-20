import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Prevent Turbopack from trying to bundle server-only native packages.
  // puppeteer ships with Chromium (~300MB) — bundling it kills HMR performance.
  serverExternalPackages: ["pdf-parse", "puppeteer", "puppeteer-core"],
};

export default nextConfig;
