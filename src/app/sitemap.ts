import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { projectCatalog } from "@/lib/projects";
import { serviceCatalog } from "@/lib/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = site.url;
  const lastModified = new Date();

  const entryUrls = [
    ...projectCatalog.all().map((project) => projectCatalog.href(project)),
    ...serviceCatalog.all().map((service) => serviceCatalog.href(service)),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}${projectCatalog.indexHref}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...entryUrls,
  ];
}
