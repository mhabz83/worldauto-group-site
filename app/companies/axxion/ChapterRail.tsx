"use client";

import { useEffect, useRef, useState } from "react";

/* Left chapter rail for the Axxion model page: a visible vertical index
   (01 / 02 / 03 with an ember progress hairline) that stays readable without
   interaction, collapsing to a slim ember progress bar under the header on
   phones. Native scroll only: rAF-throttled scroll math, no hijacking. */

const CHAPTERS = [
  { id: "operation", num: "01", label: "The operation" },
  { id: "governance", num: "02", label: "Governance" },
  { id: "intelligence", num: "03", label: "The intelligence" },
] as const;

export function ChapterRail() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const raf = useRef(0);

  useEffect(() => {
    const wrapper = document.getElementById("ax-chapters");
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
        className="ax-rail"
        aria-label="Axxion chapters"
        data-on-light={active === 1 || undefined}
        data-visible={visible || undefined}
      >
        <div className="ax-rail-inner">
          <div className="ax-rail-track" aria-hidden>
            <span
              className="ax-rail-fill"
              style={{ transform: `scaleY(${progress})` }}
            />
          </div>
          <ol className="ax-rail-list">
            {CHAPTERS.map((c, i) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={i === active ? "true" : undefined}>
                  <span className="ax-rail-num">{c.num}</span>
                  <span className="ax-rail-label">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <div className="ax-rail-bar" aria-hidden data-visible={visible || undefined}>
        <span style={{ transform: `scaleX(${progress})` }} />
      </div>
    </>
  );
}
