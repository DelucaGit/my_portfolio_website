import type { Project, ProjectMedia } from "@/data/projects";
import { asset } from "@/lib/asset";

/**
 * Where a project's files are, in one place. The data in
 * src/data/projects.ts names pictures by file name alone; everything else
 * follows from the slug:
 *
 *   public/projects/<slug>/<file>       the main picture and the case's pictures
 *   public/previews/<slug>.webp         the 2:1 screenshot, 1280 x 640
 *   public/previews/<slug>-sm.webp      the same, 640 x 320
 *   public/walkthroughs/<slug>.webm     the recorded walkthrough,
 *                     .mp4, .webp       and its still image
 *
 * Every path that leaves this module is versioned with `asset()`, so it can go
 * straight into the HTML.
 */

/** The project's folder in public/projects/: always its slug. */
function folderOf(project: Project): string {
  return `/projects/${project.slug}`;
}

/** A project's screenshot in the preview format: 2:1, in two sizes. */
export type ProjectPreview = {
  /** 1280 x 640 */
  large: string;
  /** 640 x 320 */
  small: string;
};

/** The files of a recorded walkthrough. */
export type WalkthroughFilms = {
  webm: string;
  mp4: string;
  /** The still image shown before the film plays, and instead of it when motion is not wanted */
  poster: string;
};

/** Every file a project shows, versioned. */
export type ProjectFiles = {
  preview: ProjectPreview;
  /** The main picture */
  image: string;
  /** The walkthrough's films, or null when the project has none */
  films: WalkthroughFilms | null;
  /** The case page's pictures: the data's media with every file resolved */
  caseMedia: ProjectMedia;
};

/** The case page's pictures, with every `src` and `poster` made a full path. */
function resolveCaseMedia(project: Project): ProjectMedia {
  const folder = folderOf(project);
  const file = (name: string) => asset(`${folder}/${name}`);
  const picture = <T extends { src: string }>(item: T): T => ({
    ...item,
    src: file(item.src),
  });
  const media = project.detail.media;
  return {
    ...media,
    hero: picture(media.hero),
    feature: media.feature && picture(media.feature),
    mobile: media.mobile.map(picture),
    fullPage: media.fullPage && picture(media.fullPage),
    desktop: media.desktop && picture(media.desktop),
    gallery: media.gallery?.map(picture),
    closing: media.closing && picture(media.closing),
    video: media.video && {
      ...picture(media.video),
      poster: file(media.video.poster),
    },
  };
}

export function getProjectFiles(project: Project): ProjectFiles {
  const folder = folderOf(project);
  const filmBase = `/walkthroughs/${project.slug}`;
  return {
    preview: {
      large: asset(`/previews/${project.slug}.webp`),
      small: asset(`/previews/${project.slug}-sm.webp`),
    },
    image: asset(`${folder}/${project.image}`),
    films: project.walkthrough
      ? {
          webm: asset(`${filmBase}.webm`),
          mp4: asset(`${filmBase}.mp4`),
          poster: asset(`${filmBase}.webp`),
        }
      : null,
    caseMedia: resolveCaseMedia(project),
  };
}

/**
 * Every `src` and `poster` in the case's media, wherever it sits. Walking the
 * whole value (instead of naming the fields) means a field that was added to
 * the media but not to `resolveCaseMedia` still shows up, as a bare file name
 * the built site does not have.
 */
function filesIn(media: unknown): string[] {
  if (Array.isArray(media)) return media.flatMap(filesIn);
  if (!media || typeof media !== "object") return [];
  return Object.entries(media).flatMap(([key, value]) =>
    (key === "src" || key === "poster") && typeof value === "string"
      ? [value]
      : filesIn(value),
  );
}

/**
 * Every file the built site must have for the project, once each: what the
 * test for the project's files asks the built site for.
 */
export function listProjectFiles(project: Project): string[] {
  const { preview, image, films, caseMedia } = getProjectFiles(project);
  return [
    ...new Set([
      preview.large,
      preview.small,
      image,
      ...(films ? [films.webm, films.mp4, films.poster] : []),
      ...filesIn(caseMedia),
    ]),
  ];
}
