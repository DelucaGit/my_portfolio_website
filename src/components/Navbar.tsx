"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { site } from "@/data/site";
import styles from "./Navbar.module.css";

const links = site.nav.filter((item) => item.name !== "Kontakt");
const contact = site.nav.find((item) => item.name === "Kontakt");

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <Link href="/" className={styles.brand}>
          {site.name}
        </Link>

        <nav className={styles.desktopNav} aria-label="Huvudmeny">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive(item.href) ? styles.linkActive : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={styles.desktopActions}>
          {contact && (
            <Link href={contact.href} className={styles.cta}>
              {contact.name}
            </Link>
          )}
        </div>

        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Stäng meny" : "Öppna meny"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={`${styles.burger} ${open ? styles.burgerOpen : ""}`} />
        </button>
      </div>

      <div
        className={`${styles.backdrop} ${open ? styles.backdropOpen : ""}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      />

      <nav
        id={panelId}
        className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}
        aria-label="Mobilmeny"
        aria-hidden={!open}
      >
        <div className={styles.drawerTop}>
          <p className={styles.drawerLabel}>Meny</p>
          <button
            type="button"
            className={styles.drawerClose}
            aria-label="Stäng meny"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <ul className={styles.drawerList}>
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${styles.drawerLink} ${isActive(item.href) ? styles.drawerLinkActive : ""}`}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
