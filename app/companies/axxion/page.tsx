import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { companies } from "@/content/site";
import { ChapterRail } from "./ChapterRail";
import { Reveals } from "./Reveals";
import "../companies.css";
import "./axxion.css";

/* Axxion model page: the AutoData template's structure grammar (numbered
   chapters, a left progress rail, alternating dark/light slides, framed real
   screenshots, a photographic ops beat, a standing section, a pilot close)
   carrying Axxion's own story in its own compositions, so it reads as its own
   page and not a recolour. Skin is pure WAG tokens; the hero artwork is the
   group's own Madar neon render, lifted and graded warm toward Axxion's ember
   hue. The two product plates are real captures from axxion.co, tightly
   cropped and framed on an ember keyline. Every claim traces to axxion.co;
   the site's own cost-outcome figures are held back pending owner sign-off. */

const company = companies.find((c) => c.slug === "axxion")!;
const next = companies[(companies.findIndex((c) => c.slug === "axxion") + 1) % companies.length];

export const metadata: Metadata = {
  title: company.name,
  description: company.oneLiner,
};

export default function AxxionPage() {
  return (
    <PageShell hue={company.hue}>
      <div className="co-page ax-page" style={{ "--co": company.hue } as React.CSSProperties}>
        <Reveals />

        {/* S0 · Hero: the lifted Madar neon render, graded ember under our navy.
            The lockup drops low-left; the fold carries one action beside one
            real proof line. */}
        <section className="ax-hero">
          <div className="ax-hero-bg" aria-hidden>
            <Image
              className="hidden md:block"
              src="/images/axxion/madar-neon-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <Image
              className="md:hidden"
              src="/images/axxion/madar-neon-hero-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <div className="ax-hero-tint" />
          </div>

          <div className="ax-hero-content">
            <Link href="/companies" className="type-kicker link-sweep text-mid hover:text-hi">
              ← All companies
            </Link>

            <div className="ax-hero-foot">
              <p className="co-kicker">Operating company · {company.region}</p>
              <div className="ax-hero-rule" aria-hidden />
              <h1 className="type-display ax-hero-title">Axxion</h1>
              <p className="ax-hero-signal">
                Motor claims, run as one{" "}
                <span className="co-signal">governed</span> operation.
              </p>
              <p className="ax-hero-sub">
                Axxion is the UAE&apos;s first dedicated motor claims third-party
                administrator. It runs the claim from first notice to settlement,
                and routes every repair to an approved workshop.
              </p>
              <div className="ax-hero-action">
                <Link href="/contact" className="ax-btn ax-btn--solid">
                  Request a pilot
                </Link>
                <p className="ax-hero-proof">
                  The UAE&apos;s first dedicated motor claims TPA. More than 75
                  workshops in a governed repair network, with 40 years of GCC
                  motor experience behind the team.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters: three numbered slides, each with its own composition. */}
        <div id="ax-chapters" className="ax-chapters">
          <ChapterRail />

          {/* 01 · The operation, dark: an intro over a full-width horizontal
              pipeline, first notice to settlement, drawn on our tokens. */}
          <section id="operation" className="ax-ch ax-ch--dark">
            <div className="ax-op-inner">
              <div className="ax-op-head" data-axr>
                <h2 className="type-display ax-ch-title">The operation</h2>
                <p className="ax-ch-lead">One governed operation, first notice to settlement.</p>
                <p className="ax-ch-body">
                  Axxion runs the full motor claims lifecycle for its insurer
                  partners. It sits between the insurer and the repair network,
                  running the operation that connects them. Each side gets its own
                  experience on the same infrastructure, and every step is
                  timestamped as the claim moves through a gate at each stage.
                </p>
              </div>

              <div className="ax-pipe" data-axr>
                <ol className="ax-pipe-list">
                  <li>
                    <span className="ax-pipe-node" aria-hidden />
                    <h3 className="ax-pipe-stage">FNOL</h3>
                    <p className="ax-pipe-desc">
                      Digital intake captures structured data from the first
                      notification of loss.
                    </p>
                  </li>
                  <li>
                    <span className="ax-pipe-node" aria-hidden />
                    <h3 className="ax-pipe-stage">Triage</h3>
                    <p className="ax-pipe-desc">
                      Routing matches the claim&apos;s complexity to the right
                      pathway.
                    </p>
                  </li>
                  <li>
                    <span className="ax-pipe-node" aria-hidden />
                    <h3 className="ax-pipe-stage">Assessment</h3>
                    <p className="ax-pipe-desc">
                      A standardised damage evaluation, with photographic evidence.
                    </p>
                  </li>
                  <li>
                    <span className="ax-pipe-node" aria-hidden />
                    <h3 className="ax-pipe-stage">Repair</h3>
                    <p className="ax-pipe-desc">
                      Workshop allocation against cost benchmarks and quality gates.
                    </p>
                  </li>
                  <li>
                    <span className="ax-pipe-node" aria-hidden />
                    <h3 className="ax-pipe-stage">Settlement</h3>
                    <p className="ax-pipe-desc">
                      Documented approvals with a full audit trail.
                    </p>
                  </li>
                </ol>
              </div>

              <p className="ax-op-route" data-axr>
                <strong>Repairs go to a governed network, not an open panel.</strong>{" "}
                More than 75 workshops, allocated on capability and performance,
                not geography or relationships. Every member holds to transparent
                pricing, quality standards with post-repair inspection, and
                cycle-time commitments.
              </p>
            </div>
          </section>

          {/* 02 · Governance, light, media-led: the real compliance-gate UI
              framed on the left, copy on the right. */}
          <section id="governance" className="ax-ch ax-ch--light ui-light">
            <div className="ax-ch-bg" aria-hidden>
              <Image src="/images/axxion/madar-light-streaks.webp" alt="" fill sizes="100vw" />
            </div>
            <div className="ax-split ax-split--media-left">
              <figure className="ax-plate" data-axr>
                <div className="ax-frame">
                  <div className="ax-shot ax-shot--ui">
                    <div className="ax-shot-label" aria-hidden>
                      Governance · Compliance gates
                    </div>
                    <Image
                      src="/images/axxion/ui-governance-gates.png"
                      alt="Axxion compliance-gate interface: the seven gates from registration to settlement, with the registration gate's checklist open"
                      width={1218}
                      height={452}
                    />
                  </div>
                </div>
                <figcaption className="ax-caption">
                  <span aria-hidden />
                  The compliance gates, registration to settlement
                </figcaption>
              </figure>

              <div className="ax-ch-copy" data-axr>
                <h2 className="type-display ax-ch-title">Governance</h2>
                <p className="ax-ch-lead">
                  Compliance is enforced by the system, not written in a policy.
                </p>
                <p className="ax-ch-body">
                  Every claim passes through gates. Seven compliance gates govern
                  the claim from registration to settlement; four cost gates govern
                  the repair. Behind them sits a security layer for access, data
                  residency and audit logging.
                </p>
                <p className="ax-ch-body">
                  The cost gates catch the money early: is the claim payable, is the
                  car going to the right workshop, is the estimate fair, are the
                  parts priced straight. No claim advances without passing the gate
                  in front of it, and every gate is built to a standard the Central
                  Bank of the UAE can audit.
                </p>
              </div>
            </div>
          </section>

          {/* 03 · The intelligence, dark, media-right: the real parts-cost model,
              a navy plate seated straight onto the page. */}
          <section id="intelligence" className="ax-ch ax-ch--dark">
            <div className="ax-split ax-split--media-right">
              <div className="ax-ch-copy" data-axr>
                <h2 className="type-display ax-ch-title">The intelligence</h2>
                <p className="ax-ch-lead">
                  Every cost checked against the market before it is paid.
                </p>
                <p className="ax-ch-body">
                  Behind the operation runs an intelligence layer. Before a repair
                  is authorised, its cost is checked against an independent market
                  benchmark, so the price is the market&apos;s and not the
                  workshop&apos;s.
                </p>
                <p className="ax-ch-body">
                  Parts are the sharpest variable. Their cost swings by where they
                  are made, and Axxion models that swing by origin region so a
                  claim&apos;s real exposure is understood before the bill lands.
                </p>
              </div>

              <figure className="ax-plate" data-axr>
                <div className="ax-frame">
                  <div className="ax-shot ax-shot--navy">
                    <div className="ax-shot-label" aria-hidden>
                      Analytics · Parts-cost model
                    </div>
                    <Image
                      src="/images/axxion/ui-parts-model.png"
                      alt="Axxion parts-cost model: a world map showing modelled collision-parts inflation by origin region, with the highest bands on China and India"
                      width={602}
                      height={384}
                    />
                  </div>
                </div>
                <figcaption className="ax-caption">
                  <span aria-hidden />
                  Modelled parts inflation by origin region
                </figcaption>
              </figure>
            </div>
          </section>
        </div>

        {/* S4 · Ops beat: the one photographic frame, folding in the operating
            principle behind the whole system. */}
        <section className="co-ops" aria-label="How Axxion works">
          <Image
            className="co-ops-img"
            src="/images/macro-brake-disc-night.png"
            alt="Close view of a vehicle brake disc under cold studio light"
            fill
            sizes="100vw"
          />
          <div aria-hidden className="co-ops-tint" />
          <div className="co-ops-inner">
            <div>
              <p className="co-kicker">People first, technology second</p>
              <p className="ax-ops-line">AI assists. Humans decide.</p>
              <p className="ax-ops-sub">
                The system runs every stage. A person makes the binding call and
                signs off the result.
              </p>
            </div>
          </div>
        </section>

        {/* Standing: the team who run it and the group behind it. */}
        <section className="ax-standing" aria-label="Axxion team and backing">
          <div className="ax-standing-inner">
            <div data-axr>
              <p className="co-kicker">The team and the backing</p>
              <h2 className="type-display ax-standing-title">
                Built by operators,<br />not by a start-up
              </h2>
            </div>
            <div className="ax-standing-cols">
              <div data-axr>
                <h3 className="ax-standing-h">The people who run it</h3>
                <ul className="ax-people">
                  <li>
                    <p className="ax-people-name">Frederik Bisbjerg</p>
                    <p className="ax-people-role">Managing Director and Co-Founder</p>
                    <p className="ax-people-note">
                      An international insurance and transformation executive, with
                      leadership roles across the Gulf insurance market.
                    </p>
                  </li>
                  <li>
                    <p className="ax-people-name">James Mathew</p>
                    <p className="ax-people-role">Head of Claims</p>
                    <p className="ax-people-note">
                      More than 40 years in motor insurance, most of it leading motor
                      claims survey work.
                    </p>
                  </li>
                  <li>
                    <p className="ax-people-name">Stijn Venrooij</p>
                    <p className="ax-people-role">Executive Director, Operations and AI</p>
                    <p className="ax-people-note">
                      Leads the operating model that keeps the work consistent
                      across every partner.
                    </p>
                  </li>
                </ul>
              </div>
              <div data-axr>
                <h3 className="ax-standing-h">The group behind it</h3>
                <p className="ax-standing-lead">
                  Axxion is part of World Automotive Group, a diversified automotive
                  group that has operated across the Middle East for more than four
                  decades.
                </p>
                <ul className="ax-standing-list">
                  <li>
                    <strong>The group&apos;s reach.</strong> Decades of vehicle
                    data, repair-cost intelligence and supplier relationships feed
                    straight into the claims operation.
                  </li>
                  <li>
                    <strong>Axxion&apos;s part.</strong> Axxion provides the claims
                    operation, the governance framework and the insurer
                    relationship on top of that foundation.
                  </li>
                  <li>
                    <strong>Built for the regulation.</strong> The governance is
                    built for the UAE&apos;s new motor claims law, not retrofitted
                    to it after the fact.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* S5 · Closing call to action. Orange stays the one action colour. */}
        <section className="relative px-[var(--gutter)] py-24">
          <Scrim />
          <div className="relative max-w-4xl">
            <p data-axr className="co-kicker">Start here</p>
            <p data-axr className="ax-close-line">Run a pilot before you commit.</p>
            <p data-axr className="ax-close-body">
              Put Axxion on a live slice of your motor book for twelve weeks,
              alongside your current claims operation. We manage the repairs,
              benchmark every cost against your existing portfolio, and report the
              difference each week.
            </p>
            <div data-axr className="ax-cta-row">
              <Link href="/contact" className="ax-btn ax-btn--solid">
                Request a pilot
              </Link>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ax-btn ax-btn--ghost"
              >
                Visit axxion.co ↗
              </a>
            </div>
            <p data-axr className="ax-contact">
              Al Shafar Investment Building, Al Quoz, Dubai, United Arab Emirates.
              hi@axxion.co.
            </p>
          </div>
        </section>

        {/* Next company: previews the next hue before you get there. */}
        <section className="relative px-[var(--gutter)] pb-16">
          <Scrim />
          <div className="relative max-w-4xl">
            <Link
              href={`/companies/${next.slug}`}
              className="co-next"
              style={{ "--co-next": next.hue } as React.CSSProperties}
            >
              <span>
                <span className="co-next-kicker type-kicker block">Next company</span>
                <span className="co-next-name mt-2 block">{next.name}</span>
              </span>
              <span aria-hidden className="co-next-arrow">→</span>
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
