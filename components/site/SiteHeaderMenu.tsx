"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";

/* Mobile navigation for inner pages: hamburger toggle + full-screen overlay.
   Mirrors the homepage journey menu so the chrome feels identical across
   the site. Renders nothing on md-up (CSS-gated). */
export function SiteHeaderMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="site-menu-toggle"
        aria-expanded={open}
        aria-controls="site-mobile-menu"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      <nav
        id="site-mobile-menu"
        className={`site-mobile-menu${open ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        {nav.links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
          >
            <span>{l.label}</span>
            <span aria-hidden="true">→</span>
          </Link>
        ))}
        <Link
          href={nav.cta.href}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className="site-mobile-menu-cta"
        >
          <span>{nav.cta.label}</span>
          <span aria-hidden="true">→</span>
        </Link>
      </nav>
    </>
  );
}
