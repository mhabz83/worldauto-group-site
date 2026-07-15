"use client";

/**
 * Flicker reveal system — port of the recovered text-FX layer.
 *
 * - `title` reveals: per-char flicker (flicker-text 0.2s cubic-bezier(.7,0,.3,1),
 *   10 ms/char stagger)
 * - `text` reveals: same per word (10 ms/word)
 * - `flicker-in`: whole-block opacity staircase, 0.3 s
 * - `fade-in slow`: 1.2 s opacity ease cubic-bezier(.25,.74,.22,.99)
 *
 * All copy is real SSR DOM text (chars/words are wrapped in spans at render
 * time, with an aria-label carrying the plain string). Reveals are
 * enhancement-only: the pre-reveal `opacity: .005` state is gated on
 * `html.gsap` (set by the root layout before paint, never for no-JS visitors)
 * and a failsafe timer reveals anything on screen.
 */

import {
  CSSProperties,
  ReactNode,
  createElement,
  useEffect,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/* split helpers                                                       */
/* ------------------------------------------------------------------ */

export type TitleSegment =
  | string
  | "\n"
  | { text: string; className?: string };

function segText(seg: TitleSegment): string {
  if (seg === "\n") return " ";
  return typeof seg === "string" ? seg : seg.text;
}

export function plainLabel(segments: TitleSegment[]): string {
  return segments.map(segText).join("").replace(/\s+/g, " ").trim();
}

/** Split a string into word spans of char spans; char indices continue from
    `start`. Returns [nodes, nextIndex]. */
function splitChars(text: string, start: number, key: string): [ReactNode[], number] {
  let index = start;
  const nodes: ReactNode[] = [];
  const words = text.split(" ");
  words.forEach((word, w) => {
    if (w > 0) nodes.push(" ");
    if (!word) return;
    nodes.push(
      <span key={`${key}-${w}`} className="ax-word">
        {Array.from(word).map((ch, c) => (
          <span
            key={c}
            className="char"
            style={{ "--char-index": index++ } as CSSProperties}
          >
            {ch}
          </span>
        ))}
      </span>,
    );
  });
  return [nodes, index];
}

function splitWords(text: string, start: number, key: string): [ReactNode[], number] {
  let index = start;
  const nodes: ReactNode[] = [];
  text.split(" ").forEach((word, w) => {
    if (w > 0) nodes.push(" ");
    if (!word) return;
    nodes.push(
      <span
        key={`${key}-${w}`}
        className="word-wrap"
        style={{ "--word-index": index++ } as CSSProperties}
      >
        {word}
      </span>,
    );
  });
  return [nodes, index];
}

/* ------------------------------------------------------------------ */
/* components                                                          */
/* ------------------------------------------------------------------ */

type RevealElementProps = {
  as?: keyof HTMLElementTagNameMap;
  className?: string;
  segments: TitleSegment[];
  /** reveal on scroll ("title" | "text") — omit for swap-driven blocks */
  reveal?: "title" | "text";
  /** swap-driven blocks: re-runs the flicker whenever `runKey` changes */
  runKey?: string | number;
};

function buildSegments(
  segments: TitleSegment[],
  splitter: typeof splitChars,
): ReactNode[] {
  let index = 0;
  const out: ReactNode[] = [];
  segments.forEach((seg, s) => {
    if (seg === "\n") {
      out.push(<br key={`br-${s}`} />);
      return;
    }
    const text = typeof seg === "string" ? seg : seg.text;
    const className = typeof seg === "string" ? undefined : seg.className;
    const [nodes, next] = splitter(text, index, `s${s}`);
    index = next;
    out.push(
      className ? (
        <span key={`seg-${s}`} className={className}>
          {nodes}
        </span>
      ) : (
        <span key={`seg-${s}`}>{nodes}</span>
      ),
    );
  });
  return out;
}

/** Heading with per-char flicker. */
export function FlickerTitle({
  as = "h2",
  className,
  segments,
  reveal,
  runKey,
}: RevealElementProps) {
  const children = (
    <span aria-hidden="true" key={runKey}>
      {buildSegments(segments, splitChars)}
    </span>
  );
  return createElement(
    as,
    {
      className: [className, "ax-fx-title", runKey !== undefined ? "fx-run" : ""]
        .filter(Boolean)
        .join(" "),
      "aria-label": plainLabel(segments),
      ...(reveal ? { "data-about-reveal": reveal } : {}),
    },
    children,
  );
}

/** Body copy with per-word flicker. */
export function FlickerText({
  as = "p",
  className,
  segments,
  reveal,
  runKey,
}: RevealElementProps) {
  const children = (
    <span aria-hidden="true" key={runKey}>
      {buildSegments(segments, splitWords)}
    </span>
  );
  return createElement(
    as,
    {
      className: [className, "ax-fx-text", runKey !== undefined ? "fx-run" : ""]
        .filter(Boolean)
        .join(" "),
      "aria-label": plainLabel(segments),
      ...(reveal ? { "data-about-reveal": reveal } : {}),
    },
    children,
  );
}

/** char-split label for glitch-hover buttons (btn--glitch port) */
export function GlitchLabel({ text }: { text: string }) {
  return (
    <span aria-hidden="true">
      {text.split(" ").map((word, w) => (
        <span key={w}>
          {w > 0 ? " " : ""}
          <span className="ax-word">
            {Array.from(word).map((ch, c) => (
              <span key={c} className="char">
                {ch}
              </span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* hooks                                                               */
/* ------------------------------------------------------------------ */

/** IntersectionObserver reveal manager: −100 px inset, threshold 0, 30 ms
    base delay, one-shot — plus the failsafe pass. */
export function useRevealManager(rootRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-about-reveal]"));
    if (els.length === 0) return;

    const show = (el: HTMLElement) => el.classList.add("is-revealed");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(show);
      return;
    }

    const timers = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          io.unobserve(el);
          const t = window.setTimeout(() => show(el), 30);
          timers.add(t);
        }
      },
      { rootMargin: "0px 0px -100px 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));

    /* failsafe: anything on screen is revealed even if IO never fired */
    const failsafe = window.setTimeout(() => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) show(el);
      });
    }, 1600);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [rootRef]);
}

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Track previous value of a swap index (for direction-aware out states). */
export function usePrevious<T>(value: T): T | undefined {
  const [state, setState] = useState<{ current: T; prev?: T }>({ current: value });
  if (!Object.is(state.current, value)) {
    setState({ current: value, prev: state.current });
    return state.current;
  }
  return state.prev;
}
