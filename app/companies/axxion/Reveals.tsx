"use client";

import { useEffect } from "react";

/* Page-local reveal controller for the Axxion model page.

   Scoped to [data-axr], NOT the site-wide [data-reveal] system (which hides
   every element at opacity 0 until scroll, leaving below-the-fold sections
   blank in static captures, OG previews, print and for crawlers). Here the
   default state is fully visible (see .ax-page [data-axr] in axxion.css). This
   controller only ADDS the .is-in class to play an entrance as elements scroll
   into view. Anything the observer never reaches stays at its visible default.

   Honours prefers-reduced-motion (no class added) and no-JS (nothing runs). */
export function Reveals() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".ax-page [data-axr]"),
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
