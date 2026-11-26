"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

type SmoothScrollProps = {
  children: ReactNode;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(listener: () => void) {
  const media = window.matchMedia(REDUCED_MOTION);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

function hashTarget(): HTMLElement | null {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return id ? document.getElementById(id) : null;
}

/**
 * Lenis keeps its own scroll position, so a Next.js page navigation doesn't
 * reset it the way native scroll would: the new page can open wherever the
 * old page was scrolled to. On every route change this jumps to the section
 * in the address (for example /#kontakt from the menu on another page), or
 * to the top when there is none.
 *
 * Lenis reads scroll-padding-top (globals.css) itself, here and for anchor
 * clicks, so sections land below the sticky menu without an offset.
 */
function ScrollOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const target = hashTarget();
    // Lenis still remembers how tall the previous page was and would stop the
    // scroll there. Measure the new page first.
    lenis.resize();
    lenis.scrollTo(target ?? 0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}

/**
 * Reduced motion: no Lenis, so this does both of its jobs with native,
 * instant scrolling. It scrolls on route changes like ScrollOnNavigate, and
 * it scrolls to the section when a link to a section on this page is clicked
 * (SiteLink tells Next.js not to scroll for those).
 */
function NativeScrollOnNavigate() {
  const pathname = usePathname();

  useEffect(() => {
    const target = hashTarget();
    // scrollIntoView respects scroll-padding-top, so the menu doesn't cover it
    if (target) target.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = event
        .composedPath()
        .find(
          (node): node is HTMLAnchorElement =>
            node instanceof HTMLAnchorElement && Boolean(node.href),
        );
      if (!link) return;
      const url = new URL(link.href);
      if (
        url.host !== window.location.host ||
        url.pathname !== window.location.pathname ||
        !url.hash
      ) {
        return;
      }
      document
        .getElementById(decodeURIComponent(url.hash.slice(1)))
        ?.scrollIntoView();
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  return null;
}

/**
 * Smooth scrolling for the whole site. Lenis scrolls the real page (root
 * mode), so position: sticky keeps working: the menu and anything else that
 * follows the scroll need no special handling.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  const reducedMotion = usePrefersReducedMotion();

  // Lenis sits beside the page instead of around it, so switching it on or
  // off never remounts the page.
  return (
    <>
      {reducedMotion ? (
        <NativeScrollOnNavigate />
      ) : (
        <>
          <ReactLenis
            root
            options={{
              autoRaf: true,
              lerp: 0.08,
              smoothWheel: true,
              anchors: true,
            }}
          />
          <ScrollOnNavigate />
        </>
      )}
      {children}
    </>
  );
}
