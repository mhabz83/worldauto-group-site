"use client";

import { useEffect, useRef, useState } from "react";

/* Left chapter rail for the FastTrack model page.
   Three numbered stops (01 Forecourt / 02 Service / 03 Inspection) with a blue
   progress hairline, always readable without interaction. On phones it becomes a
   slim progress bar under the header. Native scroll only, rAF-throttled.
   Namespaced ft- so it is fully independent of the AutoData page. */

const CHAPTERS = [
  { id: "forecourt", num: "01", label: "On the forecourt" },
  { id: "service", num: "02", label: "Quick service" },
  { id: "inspection", num: "03", label: "Before you buy" },
] as const;

export function ChapterRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const wrapper = document.getElementById("ft-chapters");
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
        className="ft-rail"
        aria-label="FastTrack chapters"
        data-on-light={active === 1 || undefined}
        data-visible={visible || undefined}
      >
        <div className="ft-rail-inner">
          <div className="ft-rail-track" aria-hidden>
            <span
              className="ft-rail-fill"
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>
          <ol className="ft-rail-list">
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={i === active ? "true" : undefined}>
                  <span className="ft-rail-num">{c.num}</span>
                  <span className="ft-rail-label">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div className="ft-rail-bar" aria-hidden data-visible={visible || undefined}>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </>
  );
}
