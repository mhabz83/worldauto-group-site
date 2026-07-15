import { MonoLabel } from "@/components/primitives/MonoLabel";
import { KineticHeadline } from "@/components/primitives/SerifHeadline";
import { Button } from "@/components/primitives/Button";
import { CompanyChip } from "@/components/blocks/CompanyChip";
import { companies } from "@/content/site";
import { hero } from "@/content/home";

/**
 * V3 · AURORA — the Metalab canvas taken literally: no photography, only a
 * deep-blue gradient field drifting on black. Same organized grid as the
 * night-plate hero: paragraph top-end, chip rail start-side, statement low.
 */
export function HeroAurora() {
  return (
    <section className="grain relative isolate flex min-h-svh flex-col overflow-hidden bg-base px-[var(--gutter)] pb-[clamp(2.5rem,7vh,5rem)] pt-28">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          aria-hidden
          className="nebula-a"
          style={{
            background:
              "radial-gradient(42% 48% at 26% 34%, rgba(11,111,216,0.26), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="nebula-b"
          style={{
            background:
              "radial-gradient(50% 44% at 78% 74%, rgba(46,143,239,0.13), transparent 70%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(90% 70% at 50% 115%, rgba(2,4,10,0.9), transparent 60%)",
          }}
        />
      </div>

      <div className="hidden justify-end lg:flex">
        <p className="max-w-xs text-sm leading-relaxed text-mid">{hero.sub}</p>
      </div>

      <div className="hidden flex-1 items-center lg:flex">
        <nav aria-label="Group companies" className="flex flex-col gap-3">
          {companies.map((company) => (
            <CompanyChip key={company.slug} company={company} />
          ))}
        </nav>
      </div>

      <div className="mt-auto">
        <MonoLabel tone="hi" className="mb-7 opacity-70">
          {hero.microLabel}
        </MonoLabel>
        <KineticHeadline
          lines={hero.headlineLines}
          italicWord={hero.italicWord}
          indents={[0, 1]}
          className="lg:ps-[6vw]"
        />
        <div className="mt-9 flex flex-wrap items-center gap-4 lg:justify-end">
          <Button href={hero.ctaPrimary.href} variant="solid">
            {hero.ctaPrimary.label}
          </Button>
          <Button href={hero.ctaSecondary.href} variant="ghost">
            {hero.ctaSecondary.label}
          </Button>
        </div>
        <div className="mt-10 flex flex-wrap gap-3 lg:hidden">
          {companies.map((company) => (
            <CompanyChip key={company.slug} company={company} />
          ))}
        </div>
      </div>
    </section>
  );
}
