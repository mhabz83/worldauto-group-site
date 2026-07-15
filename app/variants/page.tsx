import type { Metadata } from "next";
import { CinematicHero } from "@/components/blocks/CinematicHero";
import { HeroMonolith } from "@/components/variants/HeroMonolith";
import { HeroAurora } from "@/components/variants/HeroAurora";
import { HeroLedger } from "@/components/variants/HeroLedger";
import { HeroSignal } from "@/components/variants/HeroSignal";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { companies } from "@/content/site";
import { hero } from "@/content/home";

export const metadata: Metadata = {
  title: "Hero directions",
  robots: { index: false },
};

function VariantLabel({ tag, name, note }: { tag: string; name: string; note: string }) {
  return (
    <div className="flex flex-col justify-between gap-2 border-y border-hairline bg-panel px-[var(--gutter)] py-4 sm:flex-row sm:items-center">
      <MonoLabel tone="hi">
        <span className="text-accent-hover">{tag}</span> · {name}
      </MonoLabel>
      <MonoLabel>{note}</MonoLabel>
    </div>
  );
}

/** Owner picker: four full-screen hero directions, same facts, same tokens. */
export default function Variants() {
  return (
    <main id="main">
      <div className="flex flex-col justify-between gap-2 px-[var(--gutter)] py-6 sm:flex-row sm:items-center">
        <MonoLabel tone="hi">WAG · HERO DIRECTIONS — SCROLL, THEN PICK ONE</MonoLabel>
        <MonoLabel>REPLY V1 / V2 / V3 / V4 / V5</MonoLabel>
      </div>

      <VariantLabel
        tag="V5"
        name="SIGNAL"
        note="ANIMATED WAG MONOGRAM HERO · MAGNETIC BUTTONS · CLEAN MENU"
      />
      <HeroSignal />

      <VariantLabel tag="V1" name="NIGHT PLATE" note="CINEMATIC PHOTOGRAPHY · INTERACTIVE CHIP RAIL" />
      <CinematicHero
        microLabel={hero.microLabel}
        headlineLines={hero.headlineLines}
        italicWord={hero.italicWord}
        sub={hero.sub}
        ctaPrimary={hero.ctaPrimary}
        ctaSecondary={hero.ctaSecondary}
        image={hero.image}
        chips={companies}
      />

      <VariantLabel tag="V2" name="MONOLITH" note="NO IMAGERY · TYPE AS ARCHITECTURE" />
      <HeroMonolith />

      <VariantLabel tag="V3" name="AURORA" note="NO PHOTOGRAPHY · GRADIENT FIELD, METALAB CANVAS" />
      <HeroAurora />

      <VariantLabel tag="V4" name="LEDGER" note="HAIRLINE GRID · ANNUAL-REPORT COVER" />
      <HeroLedger />

      <div className="px-[var(--gutter)] py-10">
        <MonoLabel>
          SAME FACTS, SAME TOKENS, SAME TYPE SYSTEM — ONLY THE CANVAS CHANGES. DIRECTIONS CAN BE
          MIXED (E.G. V3 CANVAS + V4 STAT RAIL).
        </MonoLabel>
      </div>
    </main>
  );
}
