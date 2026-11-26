import { site } from "@/data/site";

export type TimelineKind = "education" | "work";

export type TimelineStep = {
  kind: TimelineKind;
  title: string;
  place: string;
  /** As written in the CV data, for example "2022 – nu". */
  period: string;
};

/** "2022 – 2024" -> [2022, 2024]. A period without an end year is still going. */
function years(period: string): [number, number] {
  const [start = 0, end = Number.POSITIVE_INFINITY] = (
    period.match(/\d{4}/g) ?? []
  ).map(Number);
  return [start, end];
}

/**
 * Education and work from the CV as one timeline, latest first.
 * Steps that started the same year: the one that goes on longest comes first.
 */
export function getTimeline(): TimelineStep[] {
  const { education, experience } = site.cv;
  const steps: TimelineStep[] = [
    ...education.map(({ title, place, period }) => ({
      kind: "education" as const,
      title,
      place,
      period,
    })),
    ...experience.map(({ title, place, period }) => ({
      kind: "work" as const,
      title,
      place,
      period,
    })),
  ];

  return steps.sort((a, b) => {
    const [aStart, aEnd] = years(a.period);
    const [bStart, bEnd] = years(b.period);
    if (aStart !== bStart) return bStart - aStart;
    if (aEnd !== bEnd) return bEnd > aEnd ? 1 : -1;
    return 0;
  });
}
