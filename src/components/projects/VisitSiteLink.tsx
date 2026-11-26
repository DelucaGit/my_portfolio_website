import SiteLink from "@/components/SiteLink";
import { ArrowOut } from "@/components/ui/ArrowOut";
import { site } from "@/data/site";
import shared from "@/styles/shared.module.css";

type VisitSiteLinkProps = {
  /** The project's name, read out with the button: "Besök sidan: TakKoll". */
  name: string;
  /** The live site. Empty when the project has none: then nothing is rendered. */
  siteUrl: string;
  className?: string;
};

/**
 * The "Besök sidan" button, the same wherever a project is shown (the
 * featured card and the split view's preview window). This is the one place
 * to change how the button to a project's live site looks and behaves.
 */
export default function VisitSiteLink({
  name,
  siteUrl,
  className,
}: VisitSiteLinkProps) {
  if (!siteUrl) return null;
  const label = site.projects.buttons.visitSite;
  return (
    <SiteLink
      href={siteUrl}
      external
      className={[shared.pill, shared.pillSoft, className]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${label}: ${name}`}
    >
      {label}
      <ArrowOut />
    </SiteLink>
  );
}
