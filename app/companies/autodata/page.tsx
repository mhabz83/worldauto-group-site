import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { companies } from "@/content/site";
import { ChapterRail } from "./ChapterRail";
import { Reveals } from "./Reveals";
import "../companies.css";
import "./autodata.css";

/* AutoData model page: the template the other four company pages will follow.
   Bones borrowed from madarplatform.com/en/data-analytics (numbered chapters,
   alternating dark/light slides, keyline media plates, slow rhythm); skin is
   pure WAG tokens (Khand display caps, Suisse body, navy scale, AutoData cyan
   as the signal colour). The hero artwork is the group's own Madar neon
   render, lifted as-is, not recreated. Every product image is a real capture
   from autodata.me, cleaned and framed. All copy claims trace to autodata.me
   itself; no other figures are used. Each chapter carries its own composition
   so the page does not read as one repeated template. */

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
        <Reveals />
        {/* S0 · Hero: the salvaged Madar neon render, full bleed, under our
            navy tint. The title lockup sits low-left so the render breathes on
            the right; the fold carries one action and one real proof line. */}
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
                Valuations <span className="co-signal">insurers and banks</span>{" "}
                price on.
              </p>
              <p className="ad-hero-sub">
                AutoData tells insurers and banks what a car is worth and what it
                has been through. Built in the UAE.
              </p>
              <div className="ad-hero-action">
                <Link href="/contact" className="ad-btn ad-btn--solid">
                  Book a demo
                </Link>
                <p className="ad-hero-proof">
                  Since 2024, data from more than 100,000 sources across 22
                  markets, through CARFAX.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters: three numbered slides, dark / light / dark, with the
            left rail as the single progress index. Each chapter has its own
            composition. Native scroll, no hijack. */}
        <div id="ad-chapters" className="ad-chapters">
          <ChapterRail />

          {/* 01 · Valuations, dark, image-forward: a narrow copy column at the
              left, the real dashboard capture running large to the right edge. */}
          <section id="valuations" className="ad-ch ad-ch--dark ad-ch--01">
            <div className="ad-ch-inner ad-ch-inner--bleed">
              <div className="ad-ch-copy" data-adr>
                <h2 className="type-display ad-ch-title">Valuations</h2>
                <p className="ad-ch-lead">Vehicle appraisals you can settle on.</p>
                <p className="ad-ch-body">
                  The Car Valuation Service returns an objective, up-to-date value
                  for any car. Enter the make, model and type and it prices the car
                  from live market data. It reads the vehicle identification number
                  so the wrong car is never valued, and authorised users pull the
                  full report and history behind every figure. Insurers set
                  premiums on it; dealers set trade-in values on it.
                </p>
              </div>
              <figure className="ad-plate ad-plate--bleed" data-adr>
                <div className="ad-frame">
                  <div className="ad-browser">
                    <div className="ad-browser-label" aria-hidden>
                      Car Valuation Service
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

          {/* 02 · Inspections, light, media-led: the tablet capture runs large
              and overlaps the copy column; the stages are one thin caption
              strip under it, not a card grid, since the tablet already shows
              the live checklist. The light streak backdrop is Madar's own. */}
          <section id="inspections" className="ad-ch ad-ch--light ui-light ad-ch--02">
            <div className="ad-ch-bg" aria-hidden>
              <Image
                src="/images/autodata/madar-light-streaks.webp"
                alt=""
                fill
                sizes="100vw"
              />
            </div>
            <div className="ad-ch-inner ad-ch-inner--overlap">
              <figure className="ad-insp-media" data-adr>
                <div className="ad-tablet">
                  <Image
                    src="/images/autodata/ui-carantee-inspection.png"
                    alt="AutoData inspection app on a tablet showing the guided checklist with progress per stage"
                    width={625}
                    height={1024}
                  />
                </div>
                <figcaption className="ad-stage-strip">
                  Bodywork · Under bonnet · Interior · Under chassis · Wheels and
                  tyres · Road test
                </figcaption>
              </figure>
              <div className="ad-ch-copy" data-adr>
                <h2 className="type-display ad-ch-title">Inspections</h2>
                <p className="ad-ch-lead">Every car checked by a certified expert.</p>
                <p className="ad-ch-body">
                  Carantee is a vehicle inspection and certification app. Book an
                  inspection and a certified expert works through the whole car,
                  then issues a condition report, high-quality photos and an
                  official certificate. A seller can prove the car&apos;s condition;
                  a buyer knows exactly what they are getting before they commit.
                </p>
              </div>
            </div>
          </section>

          {/* 03 · Vehicle history, dark, text-forward: a short intro centred
              above one wide typographic timeline. No product capture of the
              history report was recovered at usable quality, so the record one
              number returns is drawn in hairlines and cyan ticks on our tokens. */}
          <section id="vehicle-history" className="ad-ch ad-ch--dark ad-ch--03">
            <div className="ad-ch-inner ad-ch-inner--stack">
              <div className="ad-ch-copy ad-ch-copy--center" data-adr>
                <h2 className="type-display ad-ch-title">Vehicle history</h2>
                <p className="ad-ch-lead">A car&apos;s full history from one number.</p>
                <p className="ad-ch-body ad-ch-body--wide">
                  Enter a car&apos;s identification number and its record comes
                  back: accident history, service and maintenance, and the line of
                  previous owners. The data is pooled from across North America and
                  Europe, and it is written to be read at a glance. A buyer avoids
                  overpaying and hidden faults; a seller can prove a fair price.
                </p>
              </div>
              <figure className="ad-plate ad-plate--wide" data-adr>
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
                  What one identification number returns
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
                Reports banks and insurers accept.
              </span>
            </p>
          </div>
        </section>

        {/* Standing: the record behind the data. Real, named awards and the
            public data partnerships, led by the CARFAX reach; no client names
            and no round counters, both of which stay out until the owner
            verifies them. */}
        <section className="ad-standing" aria-label="AutoData standing">
          <div className="ad-standing-inner">
            <div className="ad-standing-head" data-adr>
              <p className="co-kicker">Awards and data partners</p>
              <h2 className="type-display ad-standing-title">
                The record<br />behind the data
              </h2>
            </div>
            <div className="ad-standing-cols">
              <div data-adr>
                <h3 className="ad-standing-h">Awards</h3>
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
              <div className="ad-standing-recognised" data-adr>
                <h3 className="ad-standing-h">Data and partners</h3>
                <p className="ad-standing-lead">
                  Since 2024, AutoData draws on more than 100,000 sources across 22
                  markets in the United States, Canada and Europe, through its
                  partnership with CARFAX.
                </p>
                <ul className="ad-standing-list">
                  <li>
                    <strong>Recognised partners.</strong> AutoData works with
                    globally recognised data and compliance partners, including
                    JATO and CARFAX.
                  </li>
                  <li>
                    <strong>Part of World Automotive Group.</strong>{" "}
                    AutoData is the group&apos;s vehicle intelligence arm.
                  </li>
                  <li>
                    <strong>Published research.</strong> AutoData publishes its own
                    reports on the UAE and Saudi used-car markets.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* S5 · Closing call to action. Orange stays the action colour. */}
        <section className="relative px-[var(--gutter)] py-24">
          <Scrim />
          <div className="relative max-w-4xl">
            <p data-adr className="co-kicker">Start here</p>
            <p data-adr className="ad-close-line">
              Put AutoData to work.
            </p>
            <p data-adr className="ad-close-body">
              Tell us the decision you need to get right. We will show you the
              data behind it.
            </p>
            <div data-adr className="ad-cta-row">
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
            <p data-adr className="ad-contact">
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
