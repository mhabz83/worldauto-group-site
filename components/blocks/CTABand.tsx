import Image from "next/image";
import { SerifHeadline } from "@/components/primitives/SerifHeadline";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { Button } from "@/components/primitives/Button";
import { Reveal } from "@/components/primitives/Reveal";

type CTABandProps = {
  monoLabel: string;
  lines: readonly string[];
  italicWord?: string;
  body: string;
  cta: { label: string; href: string };
  image?: { src: string; alt: string };
};

/** Closing full-bleed band: night plate, serif ask, single CTA. */
export function CTABand({ monoLabel, lines, italicWord, body, cta, image }: CTABandProps) {
  return (
    <div className="relative isolate overflow-hidden py-[var(--space-section)]">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" className="object-cover" />
          <div aria-hidden className="absolute inset-0 bg-[image:var(--scrim-plate)]" />
        </div>
      )}
      <div className="px-[var(--gutter)]">
        <Reveal>
          <MonoLabel tone="hi" className="mb-8 opacity-70">
            {monoLabel}
          </MonoLabel>
        </Reveal>
        <SerifHeadline lines={lines} italicWord={italicWord} as="p" />
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Reveal index={1}>
            <p className="type-body max-w-md text-mid">{body}</p>
          </Reveal>
          <Reveal index={2}>
            <Button href={cta.href} variant="solid">
              {cta.label}
            </Button>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
