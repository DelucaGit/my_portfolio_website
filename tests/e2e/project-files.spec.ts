import { expect, test } from "@playwright/test";
import { listProjectFiles } from "@/lib/project-files";
import { allProjects } from "./support/site";

/**
 * Every picture and film a project points at is in the built site. The data
 * names pictures by file name and src/lib/project-files.ts says where they
 * and the previews and films are, so a typo or a file that was never added
 * only shows as a broken picture on the page. Here it fails with the project
 * and the file.
 */
for (const project of allProjects()) {
  test(`${project.name}: alla bilder och filmer finns`, async ({ request }) => {
    const files = listProjectFiles(project);
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
