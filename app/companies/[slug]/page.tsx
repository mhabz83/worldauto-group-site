import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { companies } from "@/content/site";

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
    <PageShell>
      <section className="relative px-[var(--gutter)] pb-24 pt-40">
        <Scrim />
        <div className="relative max-w-4xl">
          <Link
            href="/companies"
            className="type-kicker link-sweep text-mid hover:text-hi"
          >
            ← All companies
          </Link>

          <p data-reveal className="mt-10 type-kicker text-accent">
            Operating company · {company.region}
          </p>
          <h1
            data-reveal
            className="mt-6 font-light leading-[0.95] text-hi"
            style={{ fontSize: "var(--fs-display)" }}
          >
            {company.name}
          </h1>
          <p data-reveal className="mt-8 max-w-2xl text-xl leading-relaxed text-mid">
            {company.oneLiner}
          </p>

          <div className="mt-14 grid gap-x-10 gap-y-12 border-t border-hairline pt-12 sm:grid-cols-[1fr_1fr]">
            <div data-reveal>
              <p className="type-kicker text-highlight">What they do</p>
              <ul className="mt-5 space-y-3">
                {company.capabilities.map((cap) => (
                  <li key={cap} className="flex gap-3 text-mid">
                    <span aria-hidden className="text-highlight">
                      —
                    </span>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal>
              <p className="type-kicker text-highlight">In the group</p>
              <p
                className="mt-5 font-light leading-[1.1] text-hi"
                style={{ fontSize: "var(--fs-h2)" }}
              >
                {company.proof}
              </p>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-[4px] bg-highlight px-6 py-3 type-kicker text-white transition-colors duration-[var(--dur-fast)] hover:bg-[var(--highlight-hover)]"
              >
                Visit {company.urlLabel} ↗
              </a>
            </div>
          </div>

          <div className="mt-24 flex items-center justify-between border-t border-hairline pt-8">
            <span className="type-kicker text-faint">Next company</span>
            <Link
              href={`/companies/${next.slug}`}
              className="type-kicker link-sweep text-mid hover:text-hi"
            >
              {next.name} →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
