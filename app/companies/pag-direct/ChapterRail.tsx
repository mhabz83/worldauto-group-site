"use client";

import { useEffect, useRef, useState } from "react";

/* Left chapter rail for the PAG Direct model page. Same native-scroll,
   rAF-throttled mechanism as the AutoData rail (the shared template grammar),
   but its own three chapters and its own violet fill. Chapter 02 (Certified)
   is the light slide, so the rail flips its neutrals to ink over it.
   On phones it collapses to a slim violet progress bar under the header. */

const CHAPTERS = [
  { id: "shop-online", num: "01", label: "Shop online" },
  { id: "certified", num: "02", label: "Certified" },
  { id: "service", num: "03", label: "Service" },
] as const;

export function ChapterRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const wrapper = document.getElementById("pd-chapters");
    if (!wrapper) return;
    const sections = CHAPTERS.map((c) => document.getElementById(c.id));

    const measure = () => {
      raf.current = 0;
      const vh = window.innerHeight;
      const rect = wrapper.getBoundingClientRect();
      const total = Math.max(rect.height - vh, 1);
      const p = Math.min(Math.max(-rect.top / total, 0), 1);
      setProgress(p);
      setVisible(rect.top < vh * 0.7 && rect.bottom > vh * 0.4);
      const mid = vh * 0.5;
      let current = 0;
      sections.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= mid) current = i;
      });
      setActive(current);
    };

    const onScroll = () => {
      if (!raf.current) raf.current = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <nav
        className="pd-rail"
        aria-label="PAG Direct chapters"
        data-on-light={active === 1 || undefined}
        data-visible={visible || undefined}
      >
        <div className="pd-rail-inner">
          <div className="pd-rail-track" aria-hidden>
            <span
              className="pd-rail-fill"
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>
          <ol className="pd-rail-list">
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={i === active ? "true" : undefined}>
                  <span className="pd-rail-num">{c.num}</span>
                  <span className="pd-rail-label">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div className="pd-rail-bar" aria-hidden data-visible={visible || undefined}>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </>
  );
}
