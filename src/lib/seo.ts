import type { Metadata } from "next";
import { site } from "@/data/site";
import { projectCatalog, type Project } from "@/lib/projects";
import { serviceCatalog, type Service } from "@/lib/services";

const siteUrl = new URL(site.url);

export function getDefaultMetadata(): Metadata {
  const title = `${site.name} | ${site.title}`;

  return {
    metadataBase: siteUrl,
    title: {
      default: title,
      template: `%s | ${site.name}`,
    },
    description: site.description,
    openGraph: {
      title,
      description: site.description,
      url: site.url,
      siteName: site.name,
      locale: "sv_SE",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: site.description,
    },
    alternates: {
      canonical: "/",
    },
  };
}

export function getProjectsIndexMetadata(): Metadata {
  const title = "Projekt";
  const description =
    "Alla projekt, webbappar, hemsidor och system som Marcel Deluca har byggt.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/projects",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: "/projects",
    },
  };
}

export function getProjectMetadata(project: Project): Metadata {
  return getEntryMetadata({
    title: project.detail.seo.title ?? project.name,
    description: project.detail.seo.description,
    path: projectCatalog.href(project),
    image: { src: project.image, alt: project.imageAlt },
  });
}

export function getServiceMetadata(service: Service): Metadata {
  return getEntryMetadata({
    title: service.detail.seo.title ?? service.title,
    description: service.detail.seo.description,
    path: serviceCatalog.href(service),
    image: { src: service.image, alt: service.imageAlt },
  });
}

/** Metadata for one catalog entry's page (a Project or a Service). */
function getEntryMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image: { src: string; alt: string };
}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: path,
      type: "article",
      images: [{ url: image.src, alt: image.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.src],
    },
    alternates: {
      canonical: path,
    },
  };
}
