import { expect, test } from "@playwright/test";
import { getProjectView, type Project } from "@/lib/projects";
import { allProjects } from "./support/site";

/**
 * Every picture and film a project points at is in the built site. The
 * paths in src/data/projects.ts are typed by hand and the preview files are
 * named by the slug, so a typo or a file that was never added only shows as
 * a broken picture on the page. Here it fails with the project and the file.
 */

/** Every `src` and `poster` in the project's case, wherever it sits. */
function caseFiles(media: unknown): string[] {
  if (Array.isArray(media)) return media.flatMap(caseFiles);
  if (!media || typeof media !== "object") return [];
  return Object.entries(media).flatMap(([key, value]) =>
    (key === "src" || key === "poster") && typeof value === "string"
      ? [value]
      : caseFiles(value),
  );
}

function projectFiles(project: Project): string[] {
  const { preview } = getProjectView(project);
  return [
    ...new Set([
      preview.large,
      preview.small,
      project.image,
      ...caseFiles(project.detail.media),
    ]),
  ];
}

for (const project of allProjects()) {
  test(`${project.name}: alla bilder och filmer finns`, async ({ request }) => {
    const files = projectFiles(project);
    // The hero image at least, plus the two previews.
    expect(files.length).toBeGreaterThanOrEqual(3);

    const missing: string[] = [];
    for (const path of files) {
      const response = await request.get(path);
      const type = response.headers()["content-type"] ?? "";
      const isMedia = type.startsWith("image/") || type.startsWith("video/");
      if (response.status() !== 200 || !isMedia) {
        missing.push(`${path} (${response.status()}, ${type || "no type"})`);
      }
    }
    expect(missing, `${project.name} (${project.slug}) is missing files`).toEqual(
      [],
    );
  });
}
