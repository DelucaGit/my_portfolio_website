import SiteLink from "@/components/SiteLink";
import { ArrowOut } from "@/components/ui/ArrowOut";
import { site as copy } from "@/data/site";
import type { ProjectSite } from "@/lib/projects";
import shared from "@/styles/shared.module.css";

type VisitSiteLinkProps = {
  /** The project's name, read out with the button: "Besök sidan: TakKoll". */
  name: string;
  /**
   * The state of the project's live site, from the project layer
   * (`getProjectView(project).site`). With no
   * site nothing is rendered.
   */
  site: ProjectSite;
  className?: string;
};

/**
 * The "Besök sidan" button, the same wherever a project is shown (the
 * featured card, the split view's preview window and the project pages).
 * This is the one place to change how the button to a project's live site
 * looks and behaves.
 *
 * When the customer has closed the site the button is not a link any more:
 * it stands there switched off with the text "Kunden har avslutat projektet".
 * It cannot be clicked or reached with Tab, and a screen reader announces it
 * as a link that is unavailable.
 */
export default function VisitSiteLink({
  name,
  site,
  className,
}: VisitSiteLinkProps) {
  if (site.state === "none") return null;
  const { visitSite, siteEnded } = copy.projects.buttons;

  if (site.state === "ended") {
    return (
      <span
        role="link"
        aria-disabled="true"
        aria-label={`${siteEnded}: ${name}`}
        className={[shared.pill, shared.pillOff, className]
          .filter(Boolean)
          .join(" ")}
      >
        {siteEnded}
      </span>
    );
  }

  return (
    <SiteLink
      href={site.url}
      external
      className={[shared.pill, shared.pillSoft, className]
        .filter(Boolean)
        .join(" ")}
      aria-label={`${visitSite}: ${name}`}
    >
      {visitSite}
      <ArrowOut />
    </SiteLink>
  );
}
