"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { site } from "@/data/site";
import shared from "@/styles/shared.module.css";
import BrandMark from "./BrandMark";
import SiteLink from "./SiteLink";
import ThemeSwitcher from "./ThemeSwitcher";
import styles from "./Navbar.module.css";

/**
 * The sticky menu. From 900px the links sit in the bar. Below that they are
 * in a panel that opens from the menu button, with large touch targets.
 */
export default function Navbar() {
  const pathname = usePathname();
  const panelId = useId();
  // The panel is open only on the page where it was opened, so it closes by
  // itself when the visitor moves to another page.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const close = () => setOpenOn(null);
  const { nav } = site;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={styles.nav}>
      <div className={`${shared.wrap} ${styles.bar}`}>
        <SiteLink
          href="/"
          className={styles.brand}
          aria-label={nav.brandLabel}
          onClick={close}
        >
          <BrandMark />
          {site.name}
        </SiteLink>

        <nav
          id={panelId}
          className={`${styles.links} ${open ? styles.linksOpen : ""}`}
          aria-label={nav.label}
        >
          <ul>
            {nav.links.map((link) => (
              <li key={link.href}>
                <SiteLink href={link.href} onClick={close}>
                  {link.name}
                </SiteLink>
              </li>
            ))}
          </ul>
          <div className={styles.themeSmall}>
            <ThemeSwitcher />
          </div>
          <div className={styles.themeLarge}>
            <span aria-hidden="true">{site.ui.theme.label}</span>
            <ThemeSwitcher size="large" />
          </div>
        </nav>

        <div className={styles.actions}>
          <SiteLink
            href={nav.cv.href}
            className={`${shared.pill} ${shared.pillSm} ${shared.pillLine} ${styles.cta} ${styles.cv}`}
            onClick={close}
          >
            {nav.cv.name}
          </SiteLink>
          <SiteLink
            href={nav.contact.href}
            className={`${shared.pill} ${shared.pillSm} ${shared.pillInk} ${styles.cta}`}
            onClick={close}
          >
            {nav.contact.name}
          </SiteLink>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? nav.menuButton.close : nav.menuButton.open}
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" />
              ) : (
                <path d="M3 6.5h14M3 13.5h14" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
