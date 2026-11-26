"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { paintLandscape, type PaintingPalette } from "./paintLandscape";
import styles from "./Painting.module.css";

export type { PaintingPalette };

type PaintingProps = {
  /** The colours: morgon (morning), hav (sea), kvall (evening) or skog (forest). */
  palette: PaintingPalette;
  /** Another seed gives another landscape in the same colours. Default: the palette's own. */
  seed?: number;
  className?: string;
};

/** How close to the screen a painting has to be before it is painted. */
const NEAR = "600px";

/**
 * A painted landscape that fills its nearest positioned parent. It is painted
 * once, the first time it comes near the screen; a hidden one never is. The
 * dark theme dims it (`--paint-dim`), with no repaint.
 */
export function Painting({ palette, seed, className }: PaintingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!("IntersectionObserver" in window)) {
      paintLandscape(canvas, palette, seed);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        paintLandscape(canvas, palette, seed);
      },
      { rootMargin: NEAR },
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [palette, seed]);

  return (
    <canvas
      ref={canvasRef}
      className={[styles.painting, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}

type PaintedSceneProps = PaintingProps & {
  /** The large corner radius, for a scene that stands on its own. */
  rounded?: boolean;
  /** What stands on the painting, usually a BrowserWindow. */
  children?: ReactNode;
};

/**
 * A stage with a painting behind its content. Until the painting is there
 * (and without JavaScript) a soft gradient holds its place.
 */
export function PaintedScene({
  palette,
  seed,
  rounded = false,
  className,
  children,
}: PaintedSceneProps) {
  return (
    <div
      className={[styles.scene, rounded && styles.rounded, className]
        .filter(Boolean)
        .join(" ")}
    >
      <Painting palette={palette} seed={seed} />
      {children}
    </div>
  );
}
