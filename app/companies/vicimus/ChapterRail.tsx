"use client";

import { useEffect, useRef, useState } from "react";

/* Left chapter rail for the Vicimus model page. A visible vertical rail on the
   left edge (01 / 02 / 03 with a green progress hairline), the page's single
   ordinal. On phones it collapses to a slim green progress bar under the header.
   Native scroll only: rAF-throttled scroll math, no hijacking. */

const CHAPTERS = [
  { id: "retention", num: "01", label: "Retention" },
  { id: "intelligence", num: "02", label: "Intelligence" },
  { id: "journey", num: "03", label: "The journey" },
] as const;

export function ChapterRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const wrapper = document.getElementById("vc-chapters");
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
        className="vc-rail"
        aria-label="Vicimus chapters"
        data-on-light={active === 1 || undefined}
        data-visible={visible || undefined}
      >
        <div className="vc-rail-inner">
          <div className="vc-rail-track" aria-hidden>
            <span
              className="vc-rail-fill"
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>
          <ol className="vc-rail-list">
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={i === active ? "true" : undefined}>
                  <span className="vc-rail-num">{c.num}</span>
                  <span className="vc-rail-label">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div className="vc-rail-bar" aria-hidden data-visible={visible || undefined}>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </>
  );
}
