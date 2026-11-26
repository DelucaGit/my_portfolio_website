import type { NextConfig } from "next";

/**
 * Only the Playwright suite sets these two, for two extra copies of the site
 * that it builds. Hostinger runs its own build from the repository, where
 * neither is set, so they never reach the published site. Each copy is
 * written to its own folder, so it never overwrites a local out/:
 *  - E2E_ENDED_PROJECT: one project gets `siteStatus: "ended"` (see the top
 *    of src/lib/projects.ts). Written to out-ended/.
 *  - E2E_FEATURED_PROJECT: another project is the featured one (see
 *    featuredSlug in src/lib/projects.ts). Written to out-featured/.
 */
const testBuildDir = process.env.E2E_ENDED_PROJECT
  ? "out-ended"
  : process.env.E2E_FEATURED_PROJECT
    ? "out-featured"
    : undefined;

const nextConfig: NextConfig = {
  output: "export",
  ...(testBuildDir ? { distDir: testBuildDir } : {}),
  trailingSlash: true,
  devIndicators: false,
};

export default nextConfig;
