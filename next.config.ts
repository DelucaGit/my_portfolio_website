import type { NextConfig } from "next";

/**
 * Only the Playwright suite sets these two. It builds two more copies of the
 * site, and neither can end up in out/, which is the only folder deployed:
 *  - E2E_ENDED_PROJECT: one project counts as ended (see hasEndedSite in
 *    src/lib/projects.ts). Written to out-ended/.
 *  - E2E_FEATURED_PROJECT: another project is the featured one (see
 *    featuredSlug in src/lib/projects.ts). Written to out-featured/.
 * Here they only pick the folder; the site itself reads them in
 * src/lib/build-inputs.ts.
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
