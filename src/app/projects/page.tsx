import type { Metadata } from "next";
import { ProjectsArchive } from "@/components/projects/ProjectsArchive";
import { getProjectsIndexMetadata } from "@/lib/seo";

export const metadata: Metadata = getProjectsIndexMetadata();

export default function ProjectsPage() {
  return (
    <main>
      <ProjectsArchive />
    </main>
  );
}
