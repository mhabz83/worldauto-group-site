"use client";

import { useEffect } from "react";

/* Page-local reveal controller for the FastTrack model page.

   Scoped to [data-ftr] (not the site-wide [data-reveal], which hides elements
   until scroll and so ships blank sections in static captures and to crawlers).
   Here every reveal target is fully visible by default (see .ft-page [data-ftr]
   in fasttrack.css); this only ADDS .is-in to play an entrance whose end state
   equals that default. Honours reduced-motion and no-JS: base stays visible. */
export function Reveals() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".ft-page [data-ftr]"),
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
