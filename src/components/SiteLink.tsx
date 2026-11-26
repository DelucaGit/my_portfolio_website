import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

type SiteLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  /** Opens in a new tab. Only for links that leave the site. */
  external?: boolean;
};

/**
 * Every link in the frame and in the sections goes through here.
 *
 * - "/cv", "/projects/x": a page on the site (Next.js link).
 * - "/#kontakt": a section on the start page. Next.js is told not to scroll;
 *   SmoothScroll owns all scrolling to sections, so the two never fight.
 * - Anything else (https:, mailto:, tel:): a plain link.
 */
export default function SiteLink({
  href,
  external = false,
  ...rest
}: SiteLinkProps) {
  if (href.startsWith("/")) {
    return <Link href={href} scroll={!href.includes("#")} {...rest} />;
  }
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    />
  );
}
