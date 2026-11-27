import type { MediaSectionCopy, Project } from "@/data/projects";
import { site } from "@/data/site";
import type { PaintingPalette } from "@/components/ui/paintLandscape";
import { getProjectFiles } from "./project-files";
import { getAllProjects } from "./projects";

/**
 * What a project's case page (/projects/<slug>) shows, part by part, with
 * every content rule already applied: which parts the project has, their
 * order, the shared texts from `site.projectPage` where the project has none
 * of its own, and the landscape behind the first picture. The page only draws
 * each kind of section.
 */

/** A picture with a versioned path. */
export type CasePicture = { src: string; alt: string };

/** The texts every section starts with. */
type SectionTop = {
  label: string;
  heading: string;
  /** Left out when the section has no text under its heading */
  support?: string;
};

/** One part of the case page. Their order in `sections` is the page's order. */
export type CaseSection = SectionTop &
  (
    | { kind: "stack"; items: string[] }
    | {
        kind: "duo";
        challenge: { title: string; points: string[] } | null;
        solution: { title: string; points: string[] } | null;
      }
    | { kind: "results"; paragraphs: string[] }
    | {
        kind: "video";
        video: { src: string; poster: string; alt: string };
      }
    /** A picture beside its text; `flip` puts the text first on wide screens */
    | { kind: "row"; support: string; picture: CasePicture; flip: boolean }
    | { kind: "phones"; pictures: CasePicture[] }
    | { kind: "fullPage"; picture: CasePicture }
    | { kind: "gallery"; pictures: CasePicture[] }
  );

export type CasePage = {
  /** The landscape behind the first picture */
  palette: PaintingPalette;
  /** The first picture, shown in a browser window */
  hero: CasePicture;
  sections: CaseSection[];
};

const PALETTES: PaintingPalette[] = ["morgon", "hav", "kvall", "skog"];

/** Neighbouring projects get different landscapes behind their first picture. */
function paletteFor(project: Project): PaintingPalette {
  const position = getAllProjects().findIndex(
    (candidate) => candidate.slug === project.slug,
  );
  return PALETTES[Math.max(position, 0) % PALETTES.length];
}

/** The project's own texts for a section, else the shared ones. */
function top(
  own: MediaSectionCopy | undefined,
  shared: { eyebrow: string; heading: string },
): { label: string; heading: string } {
  return {
    label: own?.eyebrow ?? shared.eyebrow,
    heading: own?.heading ?? shared.heading,
  };
}

export function getCasePage(project: Project): CasePage {
  const { detail } = project;
  const media = getProjectFiles(project).caseMedia;
  const text = site.projectPage;
  const sections: CaseSection[] = [
    {
      kind: "stack",
      label: text.stack.label,
      heading: text.stack.heading,
      items: project.stack,
    },
  ];

  if (detail.challenge || detail.solution) {
    sections.push({
      kind: "duo",
      label: text.duo.label,
      heading: text.duo.heading,
      challenge: detail.challenge
        ? { title: text.duo.challenge, points: detail.challenge }
        : null,
      solution: detail.solution
        ? { title: text.duo.solution, points: detail.solution }
        : null,
    });
  }

  if (detail.results) {
    sections.push({
      kind: "results",
      label: text.results.label,
      heading: text.results.heading,
      paragraphs: detail.results,
    });
  }

  if (media.video) {
    sections.push({
      kind: "video",
      ...top(media.videoCopy, text.video),
      support: media.videoCopy?.support,
      video: media.video,
    });
  }

  if (media.feature) {
    sections.push({
      kind: "row",
      label: text.feature.eyebrow,
      heading: text.feature.heading,
      support: media.feature.alt,
      picture: media.feature,
      flip: false,
    });
  }

  if (media.mobile.length > 0) {
    sections.push({
      kind: "phones",
      label: text.mobile.eyebrow,
      heading: text.mobile.heading,
      support: text.mobile.support,
      pictures: media.mobile,
    });
  }

  if (media.desktop) {
    sections.push({
      kind: "row",
      ...top(media.desktopCopy, text.desktop),
      support: media.desktopCopy?.support ?? media.desktop.alt,
      picture: media.desktop,
      flip: true,
    });
  }

  if (media.fullPage) {
    sections.push({
      kind: "fullPage",
      ...top(media.fullPageCopy, text.fullPage),
      support: media.fullPageCopy?.support ?? text.fullPage.support,
      picture: media.fullPage,
    });
  }

  if (media.gallery && media.gallery.length > 0) {
    sections.push({
      kind: "gallery",
      ...top(media.galleryCopy, text.gallery),
      support: media.galleryCopy?.support,
      pictures: media.gallery,
    });
  }

  // The closing picture borrows the feature's shared texts: it is a detail
  // of the same kind.
  if (media.closing) {
    sections.push({
      kind: "row",
      ...top(media.closingCopy, text.feature),
      support: media.closingCopy?.support ?? media.closing.alt,
      picture: media.closing,
      flip: false,
    });
  }

  return { palette: paletteFor(project), hero: media.hero, sections };
}
