"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/cn";

type SerifHeadlineProps = {
  /** One string per visual line; each line gets its own clip-path wipe. */
  lines: readonly string[];
  /** A single word (must appear in one of the lines) set in italic. */
  italicWord?: string;
  size?: "editorial" | "sub";
  as?: "h1" | "h2" | "p";
  /** Per-line indent steps for the Metalab stagger, e.g. [0, 1]. */
  indents?: readonly number[];
  className?: string;
};

function renderLine(line: string, italicWord?: string) {
  if (!italicWord || !line.includes(italicWord)) return line;
  const [before, after] = line.split(italicWord);
  return (
    <>
      {before}
      <em className="serif-italic">{italicWord}</em>
      {after}
    </>
  );
}

/**
 * Editorial serif statement with per-line clip-path wipe reveal.
 * KineticHeadline is the same engine re-exported with the hero defaults.
 */
export function SerifHeadline({
  lines,
  italicWord,
  size = "editorial",
  as: Tag = "h2",
  indents,
  className,
}: SerifHeadlineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (inView) setAnimate(true);
  }, [inView]);

  return (
    <div ref={ref}>
      <Tag
        className={cn(
          size === "editorial" ? "type-editorial" : "type-editorial-sub",
          className,
        )}
      >
        {lines.map((line, i) => (
          <span
            key={line}
            data-animate={animate}
            className="line-wipe block"
            style={{
              ["--line-delay" as string]: `${i * 140}ms`,
              paddingInlineStart: indents?.[i]
                ? `${indents[i] * 0.9}em`
                : undefined,
            }}
          >
            {renderLine(line, italicWord)}
          </span>
        ))}
      </Tag>
    </div>
  );
}

export const KineticHeadline = SerifHeadline;
