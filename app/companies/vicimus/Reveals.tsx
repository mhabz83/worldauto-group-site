"use client";

import { useEffect } from "react";

/* Page-local reveal controller for the Vicimus model page.

   Scoped to [data-adr], not the site-wide [data-reveal] system. The default
   state here is fully visible (see .vc-page [data-adr] in vicimus.css); this
   controller only ADDS the .is-in class to play an entrance as elements scroll
   into view, so nothing below the fold ships blank in static captures, OG
   previews, print or to crawlers. Honours prefers-reduced-motion and no-JS
   (the base state is already the settled, visible state). */
export function Reveals() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".vc-page [data-adr]"),
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
