import { MonoLabel } from "@/components/primitives/MonoLabel";
import { SerifHeadline } from "@/components/primitives/SerifHeadline";
import { Button } from "@/components/primitives/Button";
import { ULink } from "@/components/primitives/ULink";
import { companies } from "@/content/site";
import { hero, numbers } from "@/content/home";

const ledgerStats = [
  { value: "1994", label: "FOUNDED, ABU DHABI" },
  { value: "~USD 650M", label: "ANNUAL GROUP REVENUE" },
  { value: "~4,000", label: "PEOPLE ACROSS THE GROUP" },
  { value: "UAE · NA", label: "TWO OPERATING REGIONS" },
];

/**
 * V4 · LEDGER — the annual-report cover. A visible hairline grid holds
 * everything: mono header row, serif statement beside a stacked stat rail,
 * one company per cell along the base. Built for the corp-dev reader.
 */
export function HeroLedger() {
  return (
    <section className="flex min-h-svh flex-col bg-base px-[var(--gutter)] pb-12 pt-24">
      <div className="flex min-h-full flex-1 flex-col border border-hairline">
        {/* header row */}
        <div className="grid gap-px border-b border-hairline bg-transparent sm:grid-cols-3">
          <div className="px-6 py-4">
            <MonoLabel tone="hi">WORLD AUTOMOTIVE GROUP</MonoLabel>
          </div>
          <div className="border-t border-hairline px-6 py-4 sm:border-s sm:border-t-0">
            <MonoLabel>{numbers.monoLabel}</MonoLabel>
          </div>
          <div className="border-t border-hairline px-6 py-4 sm:border-s sm:border-t-0">
            <MonoLabel>EST. 1994 · ABU DHABI</MonoLabel>
          </div>
        </div>

        {/* body: statement + stat rail */}
        <div className="grid flex-1 lg:grid-cols-[1.8fr_1fr]">
          <div className="flex flex-col justify-between gap-12 p-6 md:p-10">
            <SerifHeadline
              as="h1"
              size="sub"
              lines={hero.headlineLines}
              italicWord={hero.italicWord}
              indents={[0, 1]}
            />
            <div>
              <p className="type-body max-w-md text-mid">{hero.sub}</p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href={hero.ctaPrimary.href} variant="solid">
                  {hero.ctaPrimary.label}
                </Button>
                <Button href={hero.ctaSecondary.href} variant="ghost">
                  {hero.ctaSecondary.label}
                </Button>
              </div>
            </div>
          </div>
          <div className="grid grid-rows-4 border-t border-hairline lg:border-s lg:border-t-0">
            {ledgerStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col justify-center border-b border-hairline px-6 py-5 last:border-b-0"
              >
                <p className="font-grotesk text-2xl font-medium tracking-tight text-hi md:text-3xl">
                  {stat.value}
                </p>
                <MonoLabel className="mt-2">{stat.label}</MonoLabel>
              </div>
            ))}
          </div>
        </div>

        {/* company row */}
        <div className="grid border-t border-hairline sm:grid-cols-2 lg:grid-cols-4">
          {companies.map((company, i) => (
            <div
              key={company.slug}
              className="flex items-center justify-between gap-3 border-b border-hairline px-6 py-5 last:border-b-0 sm:border-b-0 sm:border-s sm:first:border-s-0"
            >
              <div>
                <MonoLabel tone="faint">{String(i + 1).padStart(2, "0")}</MonoLabel>
                <ULink href={company.url} external className="type-kicker mt-1 block">
                  {company.name}
                </ULink>
              </div>
              <span aria-hidden className="text-faint">
                ↗
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
