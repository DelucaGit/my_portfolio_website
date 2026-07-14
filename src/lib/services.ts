import { services, type Service }  from "@/data/services";
export type { Service };    

export function getAllServices(): Service[] {
    return services;
}

export function getServiceBySlug(slug: string): Service | undefined {
    return services.find((service) => service.slug === slug);
}

export function getServiceSlugs(): string[] {
    return services.map((service) => service.slug);
}