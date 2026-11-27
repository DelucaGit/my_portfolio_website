import { expect, test } from "@playwright/test";
import { getProjectView } from "@/lib/projects";
import { allProjects } from "./support/site";

/**
 * Every recorded walkthrough, not only the featured project's: the day
 * another project is featured, its film has to be there and its step line
 * has to fit the film.
 */
const recorded = allProjects().flatMap((project) => {
  const { walkthrough } = getProjectView(project);
  return walkthrough ? [{ project, walkthrough }] : [];
});

test("ingen film ligger kvar utan att projektets data nämner den", async ({
  request,
}) => {
  // A film is only played when the project's data has a `walkthrough`. A
  // film on the server for a project without one is a recording that was
  // never switched on (or an old one that should be deleted).
  expect(recorded.length).toBeGreaterThan(0);
  const withFilm = new Set(recorded.map(({ project }) => project.slug));
  for (const project of allProjects()) {
    if (withFilm.has(project.slug)) continue;
    for (const ending of ["mp4", "webm", "webp"]) {
      const path = `/walkthroughs/${project.slug}.${ending}`;
      expect((await request.get(path)).status(), path).toBe(404);
    }
  }
});

for (const { project, walkthrough } of recorded) {
  test.describe(`Genomgången av ${project.name}`, () => {
    test("har film i två format och en stillbild", async ({ request }) => {
      const files: [string, string][] = [
        [walkthrough.mp4, "video/mp4"],
        [walkthrough.webm, "video/webm"],
        [walkthrough.poster, "image/webp"],
      ];
      for (const [path, type] of files) {
        const response = await request.get(path);
        expect(response.status(), path).toBe(200);
        expect(response.headers()["content-type"], path).toBe(type);
        expect((await response.body()).length, path).toBeGreaterThan(5_000);
      }
    });

    test("stegen följer filmen: de kommer i ordning och ryms i filmens längd @webkit", async ({
      page,
      browserName,
    }) => {
      // Safari plays the MP4 file, the others the WebM file.
      const film = browserName === "webkit" ? walkthrough.mp4 : walkthrough.webm;
      await page.goto("/cv/");
      const length = await page.evaluate(
        (src) =>
          new Promise<number>((resolve, reject) => {
            const video = document.createElement("video");
            video.muted = true;
            video.preload = "metadata";
            video.onloadedmetadata = () => resolve(video.duration);
            video.onerror = () => reject(new Error(`cannot play ${src}`));
            video.src = src;
          }),
        film,
      );

      expect(Math.abs(length - walkthrough.duration)).toBeLessThan(0.5);

      const starts = walkthrough.steps.map((step) => step.at);
      expect(starts[0]).toBe(0);
      expect(starts).toEqual([...starts].sort((a, b) => a - b));
      expect(new Set(starts).size).toBe(starts.length);
      expect(starts.at(-1)!).toBeLessThan(length - 1);
      for (const step of walkthrough.steps) {
        expect(step.text.trim()).not.toBe("");
      }
    });
  });
}
