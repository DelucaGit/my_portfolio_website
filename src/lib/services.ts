import { services, type Service } from "@/data/services";
import { createCatalog } from "@/lib/catalog";

export type { Service };

/** Services, in the order they're listed in the data. */
export const serviceCatalog = createCatalog({
  entries: services,
  basePath: "/services",
});
