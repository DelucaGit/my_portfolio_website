import { services, type Service } from "@/data/services";
import { getAdjacent } from "./adjacent";

export type { Service };

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((service) => service.slug);
}

export function getAdjacentServices(slug: string): {
  prev: Service | null;
  next: Service | null;
} {
  return getAdjacent(services, slug);
}
