import type { Metadata } from "next";
import { site } from "@/data/site";
import { getProjectView, type Project } from "@/lib/projects";
import type { Service } from "@/data/services";

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
  const title = project.detail.seo.title ?? project.name;
  const description = project.detail.seo.description;
  // The case address and the share picture (versioned like every other
  // picture) come from the project layer, like everywhere else on the site.
  const { caseHref, image } = getProjectView(project);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: caseHref,
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
      canonical: caseHref,
    },
  };
}

export function getServiceMetadata(service: Service): Metadata {
  const title = service.detail.seo.title ?? service.title;
  const description = service.detail.seo.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/services/${service.slug}`,
      type: "article",
      images: [{ url: service.image, alt: service.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [service.image],
    },
    alternates: {
      canonical: `/services/${service.slug}`,
    },
  };
}
