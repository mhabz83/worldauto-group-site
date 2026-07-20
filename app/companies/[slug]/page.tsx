import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { VicimusNetworkPlate } from "@/components/blocks/VicimusNetworkPlate";
import { companies } from "@/content/site";
import "../companies.css";

export function generateStaticParams() {
  return companies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = companies.find((c) => c.slug === slug);
  if (!company) return { title: "Company not found" };
  return {
    title: company.name,
    description: company.oneLiner,
  };
}

/* The big proof line with the company's signal word in its hue —
   the same treatment the homepage journey panel uses. */
function ProofLine({ text, highlight }: { text: string; highlight: string }) {
  const start = text.indexOf(highlight);
  if (start < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, start)}
      <span className="co-signal">{highlight}</span>
      {text.slice(start + highlight.length)}
    </>
  );
}

export default async function CompanyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = companies.find((c) => c.slug === slug);
  if (!company) notFound();

  const index = companies.findIndex((c) => c.slug === slug);
  const next = companies[(index + 1) % companies.length];

  return (
    <PageShell hue={company.hue}>
      <div
        className="co-page"
        style={{ "--co": company.hue } as React.CSSProperties}
      >
        {/* Hero — the company hue owns the kicker, proof stat and chips. */}
        <section className="relative px-[var(--gutter)] pb-20 pt-40">
          <Scrim />
          <div className="relative max-w-4xl">
            <Link
              href="/companies"
              className="type-kicker link-sweep text-mid hover:text-hi"
            >
              ← All companies
            </Link>

            <p data-reveal className="co-kicker mt-10">
              Operating company · {company.region}
            </p>
            <h1
              data-reveal
              className="type-display mt-6"
              style={{ fontSize: "var(--fs-display)" }}
            >
              {company.name}
            </h1>
            <p data-reveal className="mt-8 max-w-2xl text-xl leading-relaxed text-mid">
              {company.oneLiner}
            </p>

            <p data-reveal className="co-proof mt-12 max-w-2xl">
              <ProofLine text={company.proof} highlight={company.proofHighlight} />
            </p>

            <ul
              data-reveal
              className="co-chips"
              aria-label={`${company.name} capabilities`}
            >
              {company.capabilities.map((cap) => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>

            <div data-reveal className="mt-10">
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[4px] bg-highlight px-6 py-3 type-kicker text-white transition-colors duration-[var(--dur-fast)] hover:bg-[var(--highlight-hover)]"
              >
                Visit {company.urlLabel} ↗
              </a>
            </div>
          </div>
        </section>

        {/* Operations band — the company at work, washed in its hue.
            FastTrack and PAG Direct carry their centre count large. */}
        <section
          className={`co-ops${company.ops.image ? "" : " co-ops--motif"}`}
          aria-label={`${company.name} operations`}
        >
          {company.ops.image ? (
            <>
              <Image
                className="co-ops-img"
                src={company.ops.image}
                alt={company.ops.alt ?? ""}
                fill
                sizes="100vw"
              />
              <div aria-hidden className="co-ops-tint" />
            </>
          ) : (
            /* No photography at group level: the network-of-dealerships
               data-flow plate carries the band instead (Vicimus). */
            <VicimusNetworkPlate />
          )}
          <div className="co-ops-inner">
            <p className="co-kicker">{company.ops.label}</p>
            {company.ops.stat && (
              <p className="co-count">
                <span className="co-count-value">{company.ops.stat.value}</span>
                <span className="co-count-label">{company.ops.stat.label}</span>
              </p>
            )}
          </div>
        </section>

        {/* Next company — previews the next hue before you get there. */}
        <section className="relative px-[var(--gutter)] py-16">
          <Scrim />
          <div className="relative max-w-4xl">
            <Link
              href={`/companies/${next.slug}`}
              className="co-next"
              style={{ "--co-next": next.hue } as React.CSSProperties}
            >
              <span>
                <span className="co-next-kicker type-kicker block">
                  Next company
                </span>
                <span className="co-next-name mt-2 block">{next.name}</span>
              </span>
              <span aria-hidden className="co-next-arrow">
                →
              </span>
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
