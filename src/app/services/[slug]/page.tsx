import { notFound } from "next/navigation";
import { ServiceCaseStudy } from "@/components/services/ServiceCaseStudy";
import { getServiceBySlug, getServiceSlugs } from "@/lib/services";
import { getServiceMetadata } from "@/lib/seo";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getServiceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return getServiceMetadata(service);
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <main>
      <ServiceCaseStudy service={service} />
    </main>
  );
}
