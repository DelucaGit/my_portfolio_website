import { services, type Service } from "@/data/services";

export type { Service };

export function getAllServices(): Service[] {
  return services;
}
