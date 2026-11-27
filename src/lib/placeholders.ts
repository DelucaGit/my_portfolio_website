/**
 * What a placeholder such as `{featured}` in a text from src/data stands for:
 * plain text, or a link when it has an `href`.
 */
export type Fill = { text: string; href?: string };

/** A piece of a filled-in text: plain text, or a link. */
export type TextPart =
  | { kind: "text"; text: string }
  | { kind: "link"; text: string; href: string };

const PLACEHOLDER = /\{(\w+)\}/g;

/**
 * The template split into text and link parts, with every `{name}` that has a
 * fill replaced by it. A placeholder without a fill stays as it is, so a typo
 * in the data shows on the page instead of disappearing.
 */
export function fillPlaceholders(
  template: string,
  fills: Record<string, Fill>,
): TextPart[] {
  const parts: TextPart[] = [];
  let text = "";
  let end = 0;
  for (const match of template.matchAll(PLACEHOLDER)) {
    const fill = fills[match[1]];
    if (!fill) continue;
    text += template.slice(end, match.index);
    end = match.index + match[0].length;
    if (fill.href === undefined) {
      text += fill.text;
      continue;
    }
    parts.push({ kind: "text", text });
    parts.push({ kind: "link", text: fill.text, href: fill.href });
    text = "";
  }
  parts.push({ kind: "text", text: text + template.slice(end) });
  return parts;
}

/** The template with every placeholder filled in, as one plain string. */
export function fillText(template: string, fills: Record<string, Fill>) {
  return fillPlaceholders(template, fills)
    .map((part) => part.text)
    .join("");
}
