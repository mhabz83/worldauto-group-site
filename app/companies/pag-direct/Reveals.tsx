"use client";

import { useEffect } from "react";

/* Page-local reveal controller for the PAG Direct model page.

   Scoped to [data-pdr], deliberately outside the site-wide [data-reveal]
   system so below-the-fold sections are fully visible by default (static
   captures, OG previews, print and crawlers all get real content). This
   controller only ADDS the .is-in class to play an entrance as elements
   scroll in; anything the observer never reaches simply stays at its visible
   default. Honours prefers-reduced-motion and no-JS. */
export function Reveals() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".pd-page [data-pdr]"),
    );
    if (els.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px 12% 0px", threshold: 0.1 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
