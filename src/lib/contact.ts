/**
 * The links that reach Malak, built in one place so the contact section, the
 * CV, the footer and the case pages never drift apart.
 */

/** "namn@example.com" -> "mailto:namn@example.com". */
export function mailHref(email: string): string {
  return `mailto:${email}`;
}

/** "073 879 66 01" -> "tel:0738796601": a phone link takes no spaces. */
export function phoneHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

/** "https://www.linkedin.com/in/x" -> "linkedin.com/in/x", to show as text. */
export function withoutProtocol(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "");
}
