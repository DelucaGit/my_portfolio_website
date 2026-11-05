import type { Metadata } from "next";
import CvPage from "@/components/cv/CvPage";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "CV",
  description: `CV för ${site.name}. ${site.title}. Ladda ner PDF eller läs sammanfattningen här.`,
  alternates: {
    canonical: "/cv",
  },
};

export default function Page() {
  return <CvPage />;
}
