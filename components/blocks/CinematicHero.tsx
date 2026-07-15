"use client";

import { useState } from "react";
import Image from "next/image";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { KineticHeadline } from "@/components/primitives/SerifHeadline";
import { Button } from "@/components/primitives/Button";
import { CompanyChip } from "@/components/blocks/CompanyChip";
import { cn } from "@/lib/cn";
import type { Company } from "@/content/site";

type CinematicHeroProps = {
  microLabel: string;
  headlineLines: readonly string[];
  italicWord?: string;
  sub: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  image: { src: string; alt: string };
  chips: Company[];
};

/**
 * Metalab-organized hero on the Charge night canvas.
 * Composition: paragraph anchored top-end, company rail on the start side,
 * serif statement bottom-start, CTAs bottom-end. The plate is graded far
 * down; ambient nebulas drift above it, and hovering a company chip lifts
 * a cold glow behind the rail — the canvas answers the cursor.
 */
export function CinematicHero({
  microLabel,
  headlineLines,
  italicWord,
  sub,
  ctaPrimary,
  ctaSecondary,
  image,
  chips,
}: CinematicHeroProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="grain relative isolate flex min-h-svh flex-col overflow-hidden">
      {/* canvas: deep-graded plate under ambient nebulas */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-base">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          quality={60}
          sizes="100vw"
          className={cn(
            "hero-drift object-cover transition-opacity duration-[1200ms] ease-[var(--ease-reveal)]",
            active === null ? "opacity-40" : "opacity-25",
          )}
        />
        <div aria-hidden className="absolute inset-0 bg-[image:var(--scrim-hero)]" />
        <div aria-hidden className="absolute inset-0 bg-[image:var(--scrim-foot)]" />
        <div aria-hidden className="nebula-a" />
        <div aria-hidden className="nebula-b" />
        {/* chip-rail response: a cold glow that rises to meet the hovered company */}
        <div
          aria-hidden
          className="absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-reveal)]"
          style={{
            opacity: active === null ? 0 : 1,
            background: `radial-gradient(34rem 22rem at 18% ${
              34 + (active ?? 0) * 13
            }%, var(--accent-glow), transparent 70%)`,
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-svh flex-col px-[var(--gutter)] pb-[clamp(2.5rem,7vh,5rem)] pt-28">
        {/* top row: paragraph anchored to the end column (Metalab position) */}
        <div className="hidden justify-end lg:flex">
          <div className="hero-rise max-w-xs" style={{ ["--rise-delay" as string]: "160ms" }}>
            <p className="text-sm leading-relaxed text-mid">{sub}</p>
          </div>
        </div>

        {/* middle: organized company rail on the start side */}
        <div className="hidden flex-1 items-center lg:flex">
          <nav aria-label="Group companies" className="flex flex-col gap-3">
            {chips.map((company, i) => (
              <div
                key={company.slug}
                className="hero-rise"
                style={{ ["--rise-delay" as string]: `${320 + i * 90}ms` }}
              >
                <CompanyChip
                  company={company}
                  onHover={() => setActive(i)}
                  onLeave={() => setActive(null)}
                />
              </div>
            ))}
          </nav>
        </div>

        {/* bottom: statement bottom-start, actions bottom-end */}
        <div className="mt-auto">
          <div className="hero-rise">
            <MonoLabel tone="hi" className="mb-7 opacity-70">
              {microLabel}
            </MonoLabel>
          </div>

          <KineticHeadline
            as="h1"
            lines={headlineLines}
            italicWord={italicWord}
            indents={[0, 1]}
            className="lg:ps-[6vw]"
          />
          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-4 lg:justify-end"
            style={{ ["--rise-delay" as string]: "240ms" }}
          >
            <Button href={ctaPrimary.href} variant="solid">
              {ctaPrimary.label}
            </Button>
            <Button href={ctaSecondary.href} variant="ghost">
              {ctaSecondary.label}
            </Button>
          </div>

          {/* small screens: paragraph and chips stack under the statement */}
          <div className="hero-rise mt-10 lg:hidden" style={{ ["--rise-delay" as string]: "160ms" }}>
            <p className="type-body text-mid">{sub}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              {chips.map((company) => (
                <CompanyChip key={company.slug} company={company} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
