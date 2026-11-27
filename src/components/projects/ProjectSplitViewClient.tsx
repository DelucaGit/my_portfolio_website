"use client";

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import SiteLink from "@/components/SiteLink";
import { ArrowOut } from "@/components/ui/ArrowOut";
import { BrowserWindow } from "@/components/ui/BrowserWindow";
import { PaintedScene } from "@/components/ui/Painting";
import { site } from "@/data/site";
import shared from "@/styles/shared.module.css";
import styles from "./ProjectSplitView.module.css";
import type { SplitViewProject } from "./ProjectSplitView";
import VisitSiteLink from "./VisitSiteLink";

type ProjectSplitViewClientProps = {
  /** What the split view shows of each project, see `SplitViewProject`. */
  projects: SplitViewProject[];
  label: string;
  header?: ReactNode;
  footer?: ReactNode;
};

/**
 * The one place that decides between the split view and the rows. The CSS
 * reads the result from `data-mode` on the root element and has no width
 * rule of its own, so layout and behaviour cannot disagree.
 */
const SPLIT_QUERY = "(min-width: 1024px)";

/** The scroll line: the project that crosses this share of the window height is active. */
const SCROLL_LINE = 0.45;
/** How far the line stays from the ends of the list when it slides towards them (px). */
const LINE_INSET = 48;
/** After pointing, the page has to scroll this far before the scroll decides again (px). */
const SCROLL_TAKES_OVER = 48;
/** After scrolling, the pointer has to move this far before it decides again (px). */
const POINTER_TAKES_OVER = 6;
/**
 * How much further the page can scroll, as a share of the window height,
 * after the last project became active and before the window lets go.
 */
const LAST_STAYS = 0.2;
/** How many projects on each side of the active one have their screenshot fetched ahead. */
const FETCH_AHEAD = 2;

/** The size of the window's screenshot on screen. It is not shown below the split view. */
const SHOT_SIZES = `${SPLIT_QUERY} 50vw, 1px`;

/**
 * Sets the mode before the first paint, so a wide screen never shows the rows
 * first. It only exists in the HTML from the server (see `useHydrating`).
 */
const MODE_SCRIPT = `(function(){var s=document.currentScript,e=s&&s.parentElement;if(e&&window.matchMedia&&window.matchMedia(${JSON.stringify(SPLIT_QUERY)}).matches)e.setAttribute("data-mode","split")})()`;

function subscribeToSplit(listener: () => void) {
  const media = window.matchMedia(SPLIT_QUERY);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

/** True when the screen is wide enough for the split view. False without JavaScript. */
function useSplitMode(): boolean {
  return useSyncExternalStore(
    subscribeToSplit,
    () => window.matchMedia(SPLIT_QUERY).matches,
    () => false,
  );
}

const never = () => () => {};

/** True only while React takes over the HTML from the server. */
function useHydrating(): boolean {
  return useSyncExternalStore(
    never,
    () => false,
    () => true,
  );
}

const twoDigits = (n: number) => String(n).padStart(2, "0");

const srcSet = (project: SplitViewProject) =>
  `${project.preview.small} 640w, ${project.preview.large} 1280w`;

const screenshotAlt = (project: SplitViewProject) =>
  `${site.projects.splitView.screenshot} ${project.name}`;

/**
 * Picks the active project in the split view. Two rules, and they never
 * alternate:
 *
 * - Scroll: the project that crosses the scroll line is active. Near the top
 *   and the bottom of the page the line cannot reach the first and the last
 *   project, so there it slides towards them.
 * - Point: a pointer that really moves over a name, or keyboard focus on a
 *   name, takes over until the page has scrolled a bit further. The scroll
 *   decides again only after that, and the pointer only after it has moved.
 */
function useActiveProject(
  listRef: RefObject<HTMLOListElement | null>,
  split: boolean,
): number {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const list = listRef.current;
    if (!split || !list) return;

    let mode: "scroll" | "point" = "scroll";
    /** Where the page was when pointing took over. NaN: not known yet. */
    let lockedAt = 0;
    /** Where the pointer was first seen since the last scroll. */
    let anchor: [number, number] | null = null;
    let frame = 0;

    const links = () =>
      Array.from(list.querySelectorAll<HTMLAnchorElement>("a[data-index]"));
    const indexOf = (target: EventTarget | null) => {
      const link =
        target instanceof Element ? target.closest("a[data-index]") : null;
      return link && list.contains(link)
        ? Number(link.getAttribute("data-index"))
        : -1;
    };

    // Everything is measured when it is needed, so a new window size, a late
    // font or content that grows above the list never leaves stale positions.
    const projectAtScrollLine = () => {
      const scrolled = window.scrollY;
      const height = window.innerHeight;
      const box = list.getBoundingClientRect();
      const end = Math.max(
        0,
        document.documentElement.scrollHeight - height,
      );
      const line = height * SCROLL_LINE;
      const reach = Math.min(line, end / 2) || 1;
      const atTop = Math.min(line, box.top + scrolled + LINE_INSET);
      const atEnd = Math.max(line, box.bottom + scrolled - LINE_INSET - end);
      let offset = line;
      if (scrolled < reach) {
        offset = atTop + (line - atTop) * (scrolled / reach);
      } else if (end - scrolled < reach) {
        offset = atEnd + (line - atEnd) * ((end - scrolled) / reach);
      }
      let index = 0;
      links().forEach((link, n) => {
        if (link.getBoundingClientRect().top <= offset) index = n;
      });
      return index;
    };

    const followScroll = () => {
      frame = 0;
      const scrolled = window.scrollY;
      if (mode === "point") {
        // The jump the browser makes to show a focused name does not count.
        if (Number.isNaN(lockedAt)) lockedAt = scrolled;
        if (Math.abs(scrolled - lockedAt) < SCROLL_TAKES_OVER) return;
      }
      mode = "scroll";
      anchor = null;
      setActive(projectAtScrollLine());
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(followScroll);
    };

    // pointermove, not mouseover: a name that scrolls in under a resting
    // pointer has not been pointed at.
    const onPointerMove = (event: PointerEvent) => {
      const index = indexOf(event.target);
      if (index < 0 || event.pointerType === "touch") return;
      if (mode === "scroll") {
        if (!anchor) {
          anchor = [event.clientX, event.clientY];
          return;
        }
        const moved =
          Math.abs(event.clientX - anchor[0]) +
          Math.abs(event.clientY - anchor[1]);
        if (moved < POINTER_TAKES_OVER) return;
      }
      mode = "point";
      lockedAt = window.scrollY;
      setActive(index);
    };

    const onFocusIn = (event: FocusEvent) => {
      const index = indexOf(event.target);
      if (index < 0) return;
      mode = "point";
      lockedAt = Number.NaN;
      setActive(index);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("load", onScroll);
    list.addEventListener("pointermove", onPointerMove, { passive: true });
    list.addEventListener("focusin", onFocusIn);
    // The page can already be scrolled: a reload further down, or a window
    // that was just made wide enough for the split view.
    onScroll();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      list.removeEventListener("pointermove", onPointerMove);
      list.removeEventListener("focusin", onFocusIn);
    };
  }, [listRef, split]);

  return active;
}

/**
 * Keeps the window in place until the last project is active. The window
 * lets go when the view ends, and the last name only becomes active at the
 * scroll line, so a short tail is added under the list when the view would
 * otherwise end too soon. The CSS reads it from `--tail` on the root.
 */
function useRoomForLastProject(
  split: boolean,
  parts: {
    root: RefObject<HTMLDivElement | null>;
    list: RefObject<HTMLOListElement | null>;
    pane: RefObject<HTMLElement | null>;
    footer: RefObject<HTMLDivElement | null>;
  },
) {
  const { root: rootRef, list: listRef, pane: paneRef, footer: footerRef } = parts;

  useEffect(() => {
    const root = rootRef.current;
    const list = listRef.current;
    const pane = paneRef.current;
    if (!split || !root || !list || !pane) return;
    const footer = footerRef.current;

    const fit = () => {
      const last = list.querySelector("li:last-child a");
      if (!last) return;
      const stuckAt = parseFloat(getComputedStyle(pane).top) || 0;
      const needed =
        stuckAt +
        pane.offsetHeight +
        window.innerHeight * (LAST_STAYS - SCROLL_LINE);
      const end = (footer ?? list).getBoundingClientRect().bottom;
      const tail = Math.ceil(needed - (end - last.getBoundingClientRect().top));
      root.style.setProperty("--tail", `${Math.max(0, tail)}px`);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(list);
    observer.observe(pane);
    if (footer) observer.observe(footer);
    window.addEventListener("resize", fit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fit);
      root.style.removeProperty("--tail");
    };
  }, [split, rootRef, listRef, paneRef, footerRef]);
}

type PreviewShotProps = {
  projects: SplitViewProject[];
  active: number;
  /** False below the split view: nothing is shown, so nothing is fetched. */
  on: boolean;
};

/**
 * The screenshot in the preview window: two images on top of each other. The
 * new one loads unseen on top and fades in over the old one when it is ready,
 * so the window is never empty. The screenshots of the nearest projects are
 * fetched ahead.
 *
 * The two images are steered by hand (source, opacity, order): React renders
 * them once and never changes them again.
 */
function PreviewShot({ projects, active, on }: PreviewShotProps) {
  const first = projects[0];
  const layerA = useRef<HTMLImageElement>(null);
  const layerB = useRef<HTMLImageElement>(null);
  const stack = useRef({
    /** Which of the two layers is the one the visitor sees */
    front: 0,
    /** The project each layer holds */
    holds: [0, -1],
    /** What to do when a layer's image has loaded */
    arrive: [null, null] as [(() => void) | null, (() => void) | null],
  });
  const fetched = useRef(new Map<number, HTMLImageElement>());

  useEffect(() => {
    const layers = [layerA.current, layerB.current];
    const state = stack.current;
    const frontImage = layers[state.front];
    const back = 1 - state.front;
    const backImage = layers[back];
    const project = projects[active];
    if (!on || !frontImage || !backImage || !project) return;

    for (let n = active - FETCH_AHEAD; n <= active + FETCH_AHEAD; n++) {
      const near = projects[n];
      if (!near || n === active || fetched.current.has(n)) continue;
      const image = new Image();
      image.sizes = SHOT_SIZES;
      image.srcset = srcSet(near);
      image.src = near.preview.large;
      fetched.current.set(n, image);
    }

    state.arrive[back] = null;
    if (state.holds[state.front] === active) return;

    // Finish a fade that is still running, so the layer below can change unseen.
    frontImage.style.transition = "none";
    frontImage.style.opacity = "1";
    frontImage.style.zIndex = "1";
    backImage.style.transition = "none";
    backImage.style.opacity = "0";
    backImage.style.zIndex = "2";

    const arrive = () => {
      state.arrive[back] = null;
      void backImage.offsetWidth;
      backImage.style.transition = "";
      backImage.style.opacity = "1";
      backImage.alt = screenshotAlt(project);
      frontImage.alt = "";
      state.front = back;
    };
    state.arrive[back] = arrive;

    if (state.holds[back] === active) {
      if (backImage.complete && backImage.naturalWidth > 0) arrive();
    } else {
      state.holds[back] = active;
      backImage.srcset = srcSet(project);
      backImage.src = project.preview.large;
    }
  }, [projects, active, on]);

  const loadedA = () => stack.current.arrive[0]?.();
  const loadedB = () => stack.current.arrive[1]?.();

  return (
    <div className={styles.shot}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={layerA}
        src={first.preview.large}
        srcSet={srcSet(first)}
        sizes={SHOT_SIZES}
        width={1280}
        height={640}
        alt={screenshotAlt(first)}
        style={{ opacity: 1 }}
        loading="lazy"
        decoding="async"
        onLoad={loadedA}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={layerB}
        sizes={SHOT_SIZES}
        width={1280}
        height={640}
        alt=""
        decoding="async"
        onLoad={loadedB}
      />
    </div>
  );
}

export default function ProjectSplitViewClient({
  projects,
  label,
  header,
  footer,
}: ProjectSplitViewClientProps) {
  const split = useSplitMode();
  const hydrating = useHydrating();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const paneRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const active = useActiveProject(listRef, split);
  useRoomForLastProject(split, {
    root: rootRef,
    list: listRef,
    pane: paneRef,
    footer: footerRef,
  });
  const copy = site.projects.splitView;
  const buttons = site.projects.buttons;
  // The list can become shorter while a later project is active.
  const shown = Math.min(active, projects.length - 1);
  const project = projects[shown];

  // In the split view the list is one tab stop: the arrows move between the
  // projects and Tab goes on to the buttons in the window.
  const onKeyDown = (event: KeyboardEvent<HTMLOListElement>) => {
    if (!split) return;
    const links = Array.from(
      event.currentTarget.querySelectorAll<HTMLAnchorElement>("a[data-index]"),
    );
    const from = links.findIndex((link) => link === document.activeElement);
    const last = links.length - 1;
    const to =
      event.key === "ArrowDown"
        ? from + 1
        : event.key === "ArrowUp"
          ? from - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (from < 0 || to < 0 || to > last) return;
    event.preventDefault();
    if (to !== from) links[to].focus();
  };

  return (
    <div
      ref={rootRef}
      className={styles.root}
      data-mode={split ? "split" : undefined}
      suppressHydrationWarning
    >
      {/*
        The order here is the tab order: the list, then the window's buttons,
        then whatever follows the list. The grid puts the window beside them.
      */}
      {header && <div className={styles.header}>{header}</div>}
      <ol
        ref={listRef}
        // Safari drops the list role from a list without markers.
        role="list"
        className={styles.list}
        aria-label={label}
        onKeyDown={onKeyDown}
      >
        {projects.map((item, index) => (
          <li key={item.slug}>
            <SiteLink
              href={item.caseHref}
              className={styles.link}
              data-index={index}
              tabIndex={split ? (index === shown ? 0 : -1) : undefined}
              aria-current={split && index === shown ? "true" : undefined}
            >
              <span className={styles.thumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.preview.small}
                  width={640}
                  height={320}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span className={styles.number} aria-hidden="true">
                {twoDigits(index + 1)}
              </span>
              <span className={styles.text}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.about}>
                  <span className={styles.year}>{item.year}</span>{" "}
                  {item.tagline}
                </span>
              </span>
            </SiteLink>
          </li>
        ))}
      </ol>

      <aside ref={paneRef} className={styles.pane} aria-label={copy.preview}>
        <PaintedScene palette="hav" rounded className={styles.stage}>
          <BrowserWindow
            title={project.host}
            note={`${twoDigits(shown + 1)} / ${twoDigits(projects.length)}`}
            className={styles.window}
          >
            <PreviewShot projects={projects} active={shown} on={split} />
          </BrowserWindow>
        </PaintedScene>
        <dl className={styles.facts}>
          <div>
            <dt>{copy.year}</dt>
            <dd>{project.year}</dd>
          </div>
          <div>
            <dt>{copy.type}</dt>
            <dd>{project.facts.type}</dd>
          </div>
          <div className={styles.twoLines}>
            <dt>{copy.builtWith}</dt>
            <dd>{project.facts.builtWith}</dd>
          </div>
        </dl>
        <p className={styles.actions}>
          <SiteLink
            href={project.caseHref}
            className={`${shared.pill} ${shared.pillInk}`}
            aria-label={`${buttons.readCase}: ${project.name}`}
          >
            {buttons.readCase}
            <ArrowOut />
          </SiteLink>
          <VisitSiteLink name={project.name} siteState={project.site} />
          {project.githubUrl && (
            <SiteLink
              href={project.githubUrl}
              external
              className={styles.code}
              aria-label={`${buttons.code}: ${project.name}`}
            >
              {buttons.code} <span aria-hidden="true">↗</span>
            </SiteLink>
          )}
        </p>
        <p className={`${styles.help} ${shared.mono}`}>{copy.keyboardHelp}</p>
      </aside>

      {footer && (
        <div ref={footerRef} className={styles.footer}>
          {footer}
        </div>
      )}

      {hydrating && <script dangerouslySetInnerHTML={{ __html: MODE_SCRIPT }} />}
    </div>
  );
}
