"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Site-wide scroll effects, mounted once in the root layout.
   - [data-reveal]   : fades + rises in, triggered by IntersectionObserver (fires
     for elements already on screen at load, unlike ScrollTrigger.batch). GSAP
     runs the animation. A short failsafe reveals any on-screen item that IO
     hasn't handled, so content can never stay hidden.
   - [data-parallax] : subtle vertical drift via ScrollTrigger scrub. Only ever
     transforms, so it can never hide content.
   Honours prefers-reduced-motion and no-JS (content always ends visible).
   Re-scans on route change. */
export function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(items, { clearProps: "all", opacity: 1, y: 0 });
      return;
    }

    gsap.set(items, { opacity: 0, y: 26 });

    const done = new WeakSet<HTMLElement>();
    const reveal = (el: HTMLElement) => {
      if (done.has(el)) return;
      done.add(el);
      gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", overwrite: true });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));

    // Failsafe: if IO/rAF are ever delayed, still reveal anything on screen so
    // above-the-fold content is never left invisible. Off-screen items keep
    // their scroll-reveal.
    const failsafe = window.setTimeout(() => {
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) reveal(el);
      });
    }, 1600);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = parseFloat(el.dataset.parallax || "") || 8;
        gsap.to(el, {
          yPercent: -amount,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    });

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
