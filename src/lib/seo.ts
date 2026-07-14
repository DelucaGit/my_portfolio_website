import type { Metadata } from "next";
import { site } from "@/data/site";
import type { Project } from "@/data/projects";
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
      locale: "en_US",
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

export function getProjectMetadata(project: Project): Metadata {
  const title = project.detail.seo.title ?? project.name;
  const description = project.detail.seo.description;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/projects/${project.slug}`,
      type: "article",
      images: [{ url: project.image, alt: project.imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.image],
    },
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
  };
}

export function getServiceMetadata(service: Service): Metadata {
  const title = service.title;
  const description = service.detailDescription;
  const image = service.images[0];
  const imageAlt = service.imagesAlt[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/services/${service.slug}`,
      type: "website",
      images: image ? [{ url: image, alt: imageAlt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
    alternates: {
      canonical: `/services/${service.slug}`,
    },
  };
}
