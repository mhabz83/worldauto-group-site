"use client";

import { useEffect } from "react";

/* Page-local reveal controller for the AutoData model page.

   Deliberately scoped to [data-adr], NOT the site-wide [data-reveal] system.
   The site-wide system hides every reveal element (opacity 0) until scroll
   brings it in, which leaves below-the-fold sections blank in static captures,
   OG previews, print and for crawlers. Here the default state is fully visible
   (see .ad-page [data-adr] in autodata.css). This controller only ADDS the
   .is-in class to play an entrance animation as elements scroll into view.
   Anything the observer never reaches simply stays at its visible default.

   Honours prefers-reduced-motion (no class added, base stays visible) and
   no-JS (nothing runs, base stays visible). */
export function Reveals() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".ad-page [data-adr]"),
    );
    if (els.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // base state is already the visible, settled state

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      // Fire a little before the element clears the fold so the entrance has
      // settled by the time it is fully on screen.
      { rootMargin: "0px 0px 12% 0px", threshold: 0.1 },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
