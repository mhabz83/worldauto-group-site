"use client";

import { cn } from "@/lib/cn";
import type { Company } from "@/content/site";

type CompanyChipProps = {
  company: Company;
  /** Slot used only when float is on, so chips don't bob in sync. */
  index?: number;
  /** Idle 4-6px drift; off by default — the hero rail stays organized. */
  float?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  className?: string;
};

/**
 * Rounded company pill (Metalab client-chip register): name + arrow,
 * hover reveals the one-liner hint and notifies the parent so the
 * canvas can respond.
 */
export function CompanyChip({
  company,
  index = 0,
  float = false,
  onHover,
  onLeave,
  className,
}: CompanyChipProps) {
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(float && "chip-drift", "group/chip block w-fit", className)}
      style={float ? { animationDelay: `${index * 0.9}s` } : undefined}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onHover}
      onBlur={onLeave}
    >
      <span
        className={cn(
          "flex items-center gap-3 rounded-full border border-hairline-strong",
          "bg-[rgba(4,16,31,0.55)] px-5 py-3 backdrop-blur-md",
          "transition-all duration-[var(--dur-med)] ease-[var(--ease-reveal)]",
          "group-hover/chip:border-accent-hover group-hover/chip:bg-[rgba(4,16,31,0.8)]",
          "group-focus-visible/chip:border-accent-hover",
        )}
      >
        <span className="type-kicker text-hi">{company.name}</span>
        <span
          aria-hidden
          className="text-low transition-transform duration-[var(--dur-med)] ease-[var(--ease-reveal)] group-hover/chip:translate-x-1 group-hover/chip:text-accent-hover"
        >
          ↗
        </span>
        <span
          className={cn(
            "type-mono hidden overflow-hidden whitespace-nowrap text-low sm:block",
            "max-w-0 opacity-0 transition-all duration-[var(--dur-med)] ease-[var(--ease-reveal)]",
            "group-hover/chip:max-w-56 group-hover/chip:opacity-100 group-focus-visible/chip:max-w-56 group-focus-visible/chip:opacity-100",
          )}
        >
          {company.chipHint}
        </span>
      </span>
    </a>
  );
}
