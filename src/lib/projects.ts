import { projects, type Project } from "@/data/projects";
import { createCatalog } from "@/lib/catalog";

export type { Project };

/** Projects, newest year first; projects from the same year keep their data order. */
export const projectCatalog = createCatalog({
  entries: projects,
  basePath: "/projects",
  order: (a, b) => b.year - a.year,
});
