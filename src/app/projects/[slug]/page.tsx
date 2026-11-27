import { notFound } from "next/navigation";
import { ProjectCaseStudy } from "@/components/projects/ProjectCaseStudy";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";
import { getProjectMetadata } from "@/lib/seo";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllProjects().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return getProjectMetadata(project);
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return <ProjectCaseStudy project={project} />;
}
