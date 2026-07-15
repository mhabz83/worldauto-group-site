import type { Metadata } from "next";
import { NavBar } from "@/components/blocks/NavBar";
import { Footer } from "@/components/blocks/Footer";
import { Section } from "@/components/blocks/Section";
import { CompanyChip } from "@/components/blocks/CompanyChip";
import { CompanyCard } from "@/components/blocks/CompanyCard";
import { StatGrid } from "@/components/blocks/StatGrid";
import { PillarGrid } from "@/components/blocks/PillarGrid";
import { EditorialStatement } from "@/components/blocks/EditorialStatement";
import { TimelineRow } from "@/components/blocks/TimelineRow";
import { QuoteBand } from "@/components/blocks/QuoteBand";
import { LogoRow } from "@/components/blocks/LogoRow";
import { CTABand } from "@/components/blocks/CTABand";
import { ContactBlock } from "@/components/blocks/ContactBlock";
import { MediaPlate } from "@/components/blocks/MediaPlate";
import { Button } from "@/components/primitives/Button";
import { ULink } from "@/components/primitives/ULink";
import { Kicker } from "@/components/primitives/Kicker";
import { MonoLabel } from "@/components/primitives/MonoLabel";
import { AccentRule } from "@/components/primitives/AccentRule";
import { SerifHeadline } from "@/components/primitives/SerifHeadline";
import { companies } from "@/content/site";
import { model, heritage, proofBand } from "@/content/home";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false },
};

const swatches = [
  { name: "--bg-base", value: "#02040a" },
  { name: "--bg-panel", value: "#020711" },
  { name: "--bg-raised", value: "#04101f" },
  { name: "--accent", value: "#0b6fd8" },
  { name: "--accent-hover", value: "#2e8fef" },
];

function Spec({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline py-14">
      <MonoLabel className="mb-10 text-accent-hover">{title}</MonoLabel>
      {children}
    </section>
  );
}

export default function Styleguide() {
  return (
    <>
      <NavBar />
      <main id="main" className="flex-1 pt-32">
        <Section tight>
          <Kicker>Styleguide</Kicker>
          <h1 className="type-heading mt-6">Every component, every state</h1>
          <p className="type-body mt-6 text-low">
            The complete WAG design system on the night canvas. Tokens first;
            no magic values downstream.
          </p>
        </Section>

        <Section tight className="pt-0">
          <Spec title="COLOR TOKENS">
            <div className="flex flex-wrap gap-6">
              {swatches.map((s) => (
                <div key={s.name}>
                  <div
                    className="h-20 w-36 rounded-[var(--radius-card)] border border-hairline"
                    style={{ background: s.value }}
                  />
                  <MonoLabel className="mt-3">{s.name}</MonoLabel>
                  <MonoLabel tone="faint">{s.value}</MonoLabel>
                </div>
              ))}
            </div>
          </Spec>

          <Spec title="TYPE VOICES">
            <div className="flex flex-col gap-12">
              <SerifHeadline
                lines={["editorial serif,", "with one italic word."]}
                italicWord="italic"
                indents={[0, 1]}
              />
              <p className="type-editorial-sub">secondary serif statement</p>
              <p className="type-heading">Grotesk section heading</p>
              <Kicker>Accent kicker voice</Kicker>
              <Kicker tone="dim">Dim kicker voice</Kicker>
              <MonoLabel>01 / OPERATIONS · EST. 1994 · ABU DHABI</MonoLabel>
              <p className="type-body">
                Body voice. Plain, confident, operator-first. Short declarative
                sentences, sixteen to eighteen pixels, line height 1.7, never
                wider than 68 characters. No buzzwords survive review.
              </p>
            </div>
          </Spec>

          <Spec title="BUTTONS — SOLID / GHOST / TEXT">
            <div className="flex flex-wrap items-center gap-6">
              <Button href="#" variant="solid">
                Partner With Us
              </Button>
              <Button href="#" variant="ghost">
                The Companies
              </Button>
              <Button href="#" variant="text">
                Read the story
              </Button>
            </div>
          </Spec>

          <Spec title="LINKS, RULES, LABELS">
            <div className="flex flex-col items-start gap-8">
              <p className="type-body">
                Inline links carry an <ULink href="#">underline sweep</ULink> on
                hover, including <ULink href="https://skelmore.com" external>outbound ones</ULink>.
              </p>
              <div className="flex items-stretch gap-4">
                <AccentRule />
                <p className="type-body">Accent left rule beside content.</p>
              </div>
              <AccentRule orientation="horizontal" />
            </div>
          </Spec>

          <Spec title="COMPANY CHIP — IDLE FLOAT + HOVER HINT">
            <div className="flex flex-wrap gap-4">
              {companies.map((c, i) => (
                <CompanyChip key={c.slug} company={c} index={i} />
              ))}
            </div>
          </Spec>

          <Spec title="COMPANY CARD">
            <div className="grid gap-4 md:grid-cols-2">
              {companies.slice(0, 2).map((c, i) => (
                <CompanyCard key={c.slug} company={c} index={i} />
              ))}
            </div>
          </Spec>

          <Spec title="STAT GRID — COUNT-UP ON VIEW">
            <StatGrid stats={proofBand.stats} />
          </Spec>

          <Spec title="PILLAR GRID — 01 CARRIES FLAGSHIP WEIGHT">
            <PillarGrid pillars={model.pillars} />
          </Spec>

          <Spec title="EDITORIAL STATEMENT">
            <EditorialStatement
              lines={["one oversized serif", "moment per page."]}
              italicWord="one"
              indents={[0, 1]}
            />
          </Spec>

          <Spec title="TIMELINE ROW">
            <TimelineRow rows={heritage.rows.slice(0, 2)} />
          </Spec>

          <Spec title="LOGO ROW — GREYSCALE, BRIGHTNESS ON HOVER">
            <LogoRow
              label="THE OPERATING COMPANIES"
              names={companies.map((c) => c.name)}
            />
          </Spec>

          <Spec title="CONTACT BLOCK">
            <div className="max-w-md">
              <ContactBlock />
            </div>
          </Spec>
        </Section>

        <QuoteBand
          lines={["quote band, for words", "worth setting in serif."]}
          italicWord="serif."
          attribution="COMPONENT · QUOTEBAND"
        />

        <Section variant="bleed">
          <MediaPlate
            src={proofBand.image.src}
            alt={proofBand.image.alt}
            caption="COMPONENT · MEDIAPLATE"
            className="min-h-[50vh]"
          />
        </Section>

        <Section variant="bleed">
          <CTABand
            monoLabel="COMPONENT · CTABAND"
            lines={["the closing ask."]}
            body="Full-bleed plate, serif line, one primary action."
            cta={{ label: "Partner With Us", href: "#" }}
          />
        </Section>
      </main>
      <Footer />
    </>
  );
}
