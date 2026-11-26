import type { NextConfig } from "next";

/**
 * Only the Playwright suite sets E2E_ENDED_PROJECT: it builds a second copy of
 * the site in which one project counts as ended (see hasEndedSite in
 * src/lib/projects.ts). That copy is written to out-ended/, never to out/,
 * and only out/ is deployed.
 */
const endedTestBuild = Boolean(process.env.E2E_ENDED_PROJECT);

const nextConfig: NextConfig = {
  output: "export",
  ...(endedTestBuild ? { distDir: "out-ended" } : {}),
  trailingSlash: true,
  devIndicators: false,
};

export default nextConfig;
