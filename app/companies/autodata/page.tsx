import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { companies } from "@/content/site";
import { ChapterRail } from "./ChapterRail";
import "../companies.css";
import "./autodata.css";

/* AutoData model page: the template the other four company pages will follow.
   Bones borrowed from madarplatform.com/en/data-analytics (numbered chapters,
   alternating dark/light slides, keyline media plates, slow rhythm); skin is
   pure WAG tokens (Khand display caps, Suisse body, navy scale, AutoData cyan
   as the signal colour). The hero artwork is the group's own Madar neon
   render, lifted as-is, not recreated. Every product image is a real capture
   from autodatame.com, cleaned and framed. All copy claims trace to
   autodatame.com itself; no other figures are used. */

const company = companies.find((c) => c.slug === "autodata")!;
const next = companies[(companies.findIndex((c) => c.slug === "autodata") + 1) % companies.length];

export const metadata: Metadata = {
  title: company.name,
  description: company.oneLiner,
};

export default function AutoDataPage() {
  return (
    <PageShell hue={company.hue}>
      <div className="co-page ad-page" style={{ "--co": company.hue } as React.CSSProperties}>
        {/* S0 · Hero: the salvaged Madar neon render, full bleed, under our
            navy tint. Kicker over a full-width hairline, then the Khand
            display name, Madar's hero grammar in the WAG voice. */}
        <section className="ad-hero">
          <div className="ad-hero-bg" aria-hidden>
            <Image
              className="hidden md:block"
              src="/images/autodata/madar-neon-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <Image
              className="md:hidden"
              src="/images/autodata/madar-neon-hero-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <div className="ad-hero-tint" />
          </div>

          <div className="ad-hero-content">
            <Link
              href="/companies"
              className="type-kicker link-sweep text-mid hover:text-hi"
            >
              ← All companies
            </Link>

            <div className="ad-hero-foot">
              <p className="co-kicker">Operating company · {company.region}</p>
              <div className="ad-hero-rule" aria-hidden />
              <h1 className="type-display ad-hero-title">AutoData</h1>
              <p className="ad-hero-signal">
                Accurate vehicle data.{" "}
                <span className="co-signal">Trusted</span> for the decisions that
                matter.
              </p>
              <p className="ad-hero-sub">
                AutoData gives insurers, banks and car businesses the valuations,
                inspections and vehicle history they can price, underwrite and
                lend on. Built in the UAE for the region.
              </p>
              <div className="ad-cta-row">
                <Link href="/contact" className="ad-btn ad-btn--solid">
                  Book a demo
                </Link>
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ad-btn ad-btn--ghost"
                >
                  Visit {company.urlLabel} ↗
                </a>
              </div>
            </div>
          </div>

          <div className="ad-scrollcue" aria-hidden>
            <span className="type-kicker">Scroll</span>
            <i />
          </div>
        </section>

        {/* Chapters: three numbered slides, dark / light / dark, with the
            left rail tracking progress. Native scroll, no hijack. */}
        <div id="ad-chapters" className="ad-chapters">
          <ChapterRail />

          {/* 01 · Valuations, dark slide: copy left of a hairline divider,
              real product capture right inside the cyan keyline frame. */}
          <section id="valuations" className="ad-ch ad-ch--dark">
            <div className="ad-ch-inner">
              <div className="ad-ch-copy" data-reveal>
                <p className="ad-ch-num" aria-hidden>01</p>
                <p className="co-kicker">Chapter 01 · Valuations</p>
                <h2 className="type-display ad-ch-title">Valuations</h2>
                <p className="ad-ch-lead">Vehicle appraisals you can settle on.</p>
                <p className="ad-ch-body">
                  The Car Valuation Service gives insurers and dealerships an
                  objective, up-to-date value for any car. Enter the make, model
                  and type, and the system returns an accurate valuation drawn
                  from live market pricing. It reads the vehicle identification
                  number to remove selection errors, and authorised users can
                  pull detailed reports and history to back their decisions.
                </p>
                <ul className="co-chips" aria-label="What it changes">
                  <li>Less insurance fraud</li>
                  <li>More accurate premiums</li>
                  <li>Better trade-in values</li>
                  <li>A faster, cleaner appraisal</li>
                </ul>
              </div>
              <figure className="ad-plate" data-reveal>
                <div className="ad-frame">
                  <div className="ad-browser">
                    <div className="ad-browser-bar" aria-hidden>
                      <i /><i /><i />
                    </div>
                    <Image
                      src="/images/autodata/ui-cvs-appraisals.png"
                      alt="AutoData Car Valuation Service dashboard showing evaluation counts and valuations completed per day"
                      width={1600}
                      height={815}
                    />
                  </div>
                </div>
                <figcaption className="ad-caption">
                  <span aria-hidden />
                  AutoData Car Valuation Service: the appraisals dashboard
                </figcaption>
              </figure>
            </div>
          </section>

          {/* 02 · Inspections, light slide: media left (real tablet capture
              plus the four checklist stages), copy right. The soft light
              streak backdrop is Madar's own light-slide plate, lifted. */}
          <section id="inspections" className="ad-ch ad-ch--light ui-light">
            <div className="ad-ch-bg" aria-hidden>
              <Image
                src="/images/autodata/madar-light-streaks.webp"
                alt=""
                fill
                sizes="100vw"
              />
            </div>
            <div className="ad-ch-inner ad-ch-inner--flip">
              <div className="ad-insp-media" data-reveal>
                <div className="ad-tablet">
                  <Image
                    src="/images/autodata/ui-carantee-inspection.png"
                    alt="AutoData inspection app on a tablet showing the guided checklist with progress per stage"
                    width={625}
                    height={1024}
                  />
                </div>
                <ol className="ad-cards" aria-label="Inspection stages">
                  <li><span>01</span>Bodywork</li>
                  <li><span>02</span>Under bonnet</li>
                  <li><span>03</span>Interior</li>
                  <li><span>04</span>Road test</li>
                </ol>
              </div>
              <div className="ad-ch-copy" data-reveal>
                <p className="ad-ch-num" aria-hidden>02</p>
                <p className="co-kicker">Chapter 02 · Inspections</p>
                <h2 className="type-display ad-ch-title">Inspections</h2>
                <p className="ad-ch-lead">A certified car sells with more trust.</p>
                <p className="ad-ch-body">
                  Carantee is a vehicle inspection and certification app. Book an
                  inspection in the app, and a certified expert examines the car
                  in full. You get back a clear condition report, high-quality
                  photos and an official certification. Sellers stand out and
                  attract more buyers. Buyers know exactly what they are getting
                  before they commit.
                </p>
                <ul className="co-chips" aria-label="Inspection capabilities">
                  <li>App-guided inspections</li>
                  <li>Certified experts</li>
                  <li>Photo evidence</li>
                  <li>Official certification</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 03 · Vehicle history, dark slide. No product capture of the
              history report was recovered at usable quality, so the plate is
              typographic: the record one number unlocks, drawn in hairlines and
              cyan ticks on our tokens. */}
          <section id="vehicle-history" className="ad-ch ad-ch--dark">
            <div className="ad-ch-inner">
              <div className="ad-ch-copy" data-reveal>
                <p className="ad-ch-num" aria-hidden>03</p>
                <p className="co-kicker">Chapter 03 · Vehicle history</p>
                <h2 className="type-display ad-ch-title">Vehicle history</h2>
                <p className="ad-ch-lead">
                  A car&apos;s full history, before money changes hands.
                </p>
                <p className="ad-ch-body">
                  Enter a car&apos;s identification number and get its history
                  back. Accident records, service and maintenance history, and
                  the line of previous owners. Buyers avoid overpaying and dodge
                  hidden problems. Sellers can prove a fair price. The report is
                  drawn from a wide data pool across North America and Europe,
                  and it is written to be read at a glance.
                </p>
                <ul className="co-chips" aria-label="What the report covers">
                  <li>Accident records</li>
                  <li>Service and maintenance history</li>
                  <li>Previous-owner line</li>
                  <li>North America and Europe data</li>
                </ul>
              </div>
              <figure className="ad-plate" data-reveal>
                <div className="ad-frame">
                  <ol className="ad-timeline">
                    <li>
                      <span className="ad-timeline-tick" aria-hidden />
                      <div>
                        <h3>Identity read</h3>
                        <p>The car&apos;s identification number returns its exact make, model and trim.</p>
                      </div>
                    </li>
                    <li>
                      <span className="ad-timeline-tick" aria-hidden />
                      <div>
                        <h3>Accident records</h3>
                        <p>Reported incidents across the car&apos;s life.</p>
                      </div>
                    </li>
                    <li>
                      <span className="ad-timeline-tick" aria-hidden />
                      <div>
                        <h3>Service and maintenance</h3>
                        <p>Service history drawn from the data pool.</p>
                      </div>
                    </li>
                    <li>
                      <span className="ad-timeline-tick" aria-hidden />
                      <div>
                        <h3>Previous owners</h3>
                        <p>The line of people who have held the car.</p>
                      </div>
                    </li>
                    <li>
                      <span className="ad-timeline-tick" aria-hidden />
                      <div>
                        <h3>One clear report</h3>
                        <p>Gathered into a single record, written to be read at a glance.</p>
                      </div>
                    </li>
                  </ol>
                </div>
                <figcaption className="ad-caption">
                  <span aria-hidden />
                  What one identification number unlocks
                </figcaption>
              </figure>
            </div>
          </section>
        </div>

        {/* S4 · Standards band: the existing full-bleed ops treatment, the
            one photographic beat, standing in for Madar's navy wipes. */}
        <section className="co-ops" aria-label="AutoData standards">
          <Image
            className="co-ops-img"
            src="/images/headlight-macro-night.png"
            alt="Close view of a car headlight under cold inspection lighting"
            fill
            sizes="100vw"
          />
          <div aria-hidden className="co-ops-tint" />
          <div className="co-ops-inner">
            <p className="co-kicker">Built to bank standards</p>
            <p className="co-count">
              <span className="co-count-label">
                Valuations, inspections and history reports that banks and
                insurers accept.
              </span>
            </p>
          </div>
        </section>

        {/* Standing: the record behind the data. Real, named awards and the
            public data partnerships; no client names and no round counters,
            both of which stay out until the owner verifies them. */}
        <section className="ad-standing" aria-label="AutoData standing">
          <div className="ad-standing-inner">
            <div className="ad-standing-head" data-reveal>
              <p className="co-kicker">Trusted and recognised</p>
              <h2 className="type-display ad-standing-title">
                The record<br />behind the data
              </h2>
            </div>
            <div className="ad-standing-cols">
              <div data-reveal>
                <p className="ad-standing-label">
                  <span aria-hidden />
                  Awarded
                </p>
                <ul className="ad-award-list">
                  <li>
                    <span className="ad-award-year">2025</span>
                    <p>
                      Best AI-Powered Automotive Valuation Platform, UAE. The
                      Global Economics Awards.
                    </p>
                  </li>
                  <li>
                    <span className="ad-award-year">2025</span>
                    <p>
                      Best Data Intelligence Solution for Automotive Financing,
                      UAE. The Global Economics Awards.
                    </p>
                  </li>
                  <li>
                    <span className="ad-award-year">2024</span>
                    <p>
                      AI-based Estimating Solutions Provider. InsureTek Golden
                      Shield Excellence Awards.
                    </p>
                  </li>
                </ul>
              </div>
              <div data-reveal>
                <p className="ad-standing-label">
                  <span aria-hidden />
                  Recognised
                </p>
                <dl className="ad-standing-facts">
                  <div>
                    <dt>Global data reach through CARFAX</dt>
                    <dd>
                      Since 2024, AutoData draws on data from more than 100,000
                      sources across 22 markets in the United States, Canada and
                      Europe, through its partnership with CARFAX.
                    </dd>
                  </div>
                  <div>
                    <dt>Recognised data partners</dt>
                    <dd>
                      AutoData works alongside globally recognised data providers
                      and compliance partners, including JATO and CARFAX.
                    </dd>
                  </div>
                  <div>
                    <dt>Part of World Automotive Group</dt>
                    <dd>AutoData is the group&apos;s vehicle intelligence arm.</dd>
                  </div>
                  <div>
                    <dt>Published market research</dt>
                    <dd>
                      AutoData publishes its own reports on the UAE and Saudi used
                      car markets.
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        {/* S5 · Closing call to action. Orange stays the action colour. */}
        <section className="relative px-[var(--gutter)] py-24">
          <Scrim />
          <div className="relative max-w-4xl">
            <p data-reveal className="co-kicker">Start here</p>
            <p data-reveal className="ad-close-line">
              Put trusted vehicle data to work.
            </p>
            <p data-reveal className="ad-close-body">
              Tell us the decision you need to get right. We will show you the
              data behind it.
            </p>
            <div data-reveal className="ad-cta-row">
              <Link href="/contact" className="ad-btn ad-btn--solid">
                Book a demo
              </Link>
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ad-btn ad-btn--ghost"
              >
                Visit {company.urlLabel} ↗
              </a>
            </div>
            <p data-reveal className="ad-contact">
              Al Shafar Investment Building, Dubai, United Arab Emirates. +971
              (0)4 323 0583. info@autodata.ae.
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
