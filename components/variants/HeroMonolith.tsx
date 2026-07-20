import { MonoLabel } from "@/components/primitives/MonoLabel";
import { CompanyChip } from "@/components/blocks/CompanyChip";
import { companies } from "@/content/site";
import { hero } from "@/content/home";

/**
 * V2 · MONOLITH — no imagery at all. Type as architecture on the flat night
 * canvas: three stacked megawords, the middle one hollow, mono ledger
 * details in the corners, companies in a strip along the base.
 */
export function HeroMonolith() {
  return (
    <section className="relative flex min-h-svh flex-col justify-between bg-base px-[var(--gutter)] py-24">
      <div className="flex items-baseline justify-between pt-4">
        <MonoLabel tone="hi">WORLD AUTOMOTIVE GROUP</MonoLabel>
        <MonoLabel>EST. 1994 · ABU DHABI</MonoLabel>
        <MonoLabel className="hidden md:block">MENA · NORTH AMERICA</MonoLabel>
      </div>

      <h1
        className="font-grotesk font-medium uppercase text-hi"
        style={{
          fontSize: "clamp(3.25rem, 12.5vw, 11.5rem)",
          lineHeight: 0.94,
          letterSpacing: "-0.015em",
        }}
      >
        <span className="block">World</span>
        <span
          aria-hidden="false"
          className="block text-transparent"
          style={{ WebkitTextStroke: "1px rgba(255,255,255,0.55)" }}
        >
          Automotive
        </span>
        <span className="block">
          Group<span className="text-accent-hover">.</span>
        </span>
      </h1>

      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <p className="max-w-sm text-sm leading-relaxed text-mid">{hero.sub}</p>
        <div className="flex flex-wrap gap-3">
          {companies.map((company) => (
            <CompanyChip key={company.slug} company={company} />
          ))}
        </div>
      </div>
    </section>
  );
}
