import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageShell, Scrim } from "@/components/site/PageShell";
import { companies } from "@/content/site";
import { ChapterRail } from "./ChapterRail";
import { Reveals } from "./Reveals";
import "../companies.css";
import "./fasttrack.css";

/* FastTrack model page, built to the AutoData standard: numbered chapters, a
   left progress rail, alternating dark/light beats and framed real product
   captures. The skin is pure WAG tokens with FastTrack blue (#1367FE) as the
   signal colour; orange stays the action colour. The hero artwork is the
   group's own Madar neon render, lifted and graded toward FastTrack blue, not
   recreated. Every product image is a real capture from fasttrackemarat.com,
   cleaned and framed. Its own story (quick service on the forecourt) gives each
   chapter its own composition, so the page reads as FastTrack, not a recolour
   of AutoData. All copy traces to fasttrackemarat.com or approved group copy. */

const company = companies.find((c) => c.slug === "fasttrack")!;
const next = companies[(companies.findIndex((c) => c.slug === "fasttrack") + 1) % companies.length];

export const metadata: Metadata = {
  title: company.name,
  description: company.oneLiner,
};

export default function FastTrackPage() {
  return (
    <PageShell hue={company.hue}>
      <div className="co-page ft-page" style={{ "--co": company.hue } as React.CSSProperties}>
        <Reveals />

        {/* S0 · Hero: the group's Madar neon render, graded to FastTrack blue,
            full bleed under a navy tint. Title lockup sits low-left; the fold
            carries one action and one real proof line. */}
        <section className="ft-hero">
          <div className="ft-hero-bg" aria-hidden>
            <Image
              className="hidden md:block"
              src="/images/fasttrack/madar-neon-hero.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <Image
              className="md:hidden"
              src="/images/fasttrack/madar-neon-hero-mobile.webp"
              alt=""
              fill
              priority
              sizes="100vw"
            />
            <div className="ft-hero-tint" />
          </div>

          <div className="ft-hero-content">
            <Link href="/companies" className="type-kicker link-sweep text-mid hover:text-hi">
              ← All companies
            </Link>

            <div className="ft-hero-foot">
              <p className="co-kicker">Operating company · {company.region}</p>
              <div className="ft-hero-rule" aria-hidden />
              <h1 className="type-display ft-hero-title">FastTrack</h1>
              <p className="ft-hero-signal">
                Quick car service, right on the <span className="co-signal">forecourt</span>.
              </p>
              <p className="ft-hero-sub">
                FastTrack keeps cars moving with walk-in service at fuel
                forecourts across the UAE. Built by Emarat in 2004.
              </p>
              <div className="ft-hero-action">
                <a
                  href={company.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ft-btn ft-btn--solid"
                >
                  Find a centre ↗
                </a>
                <p className="ft-hero-proof">
                  On the forecourt since 2004. More than twenty years of
                  hands-on service, at 32 points across the UAE.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Chapters: three numbered slides, each with its own composition and
            entrance. Native scroll, no hijack. */}
        <div id="ft-chapters" className="ft-chapters">
          <ChapterRail />

          {/* 01 · On the forecourt — dark, image on the LEFT (flipped from the
              other model page), a narrow copy column at the right. */}
          <section id="forecourt" className="ft-ch ft-ch--dark ft-ch--01">
            <div className="ft-ch-inner ft-ch-inner--imgleft">
              <figure className="ft-plate ft-plate--photo" data-ftr>
                <div className="ft-frame">
                  <Image
                    src="/images/fasttrack/forecourt-emarat-sign.webp"
                    alt="A FastTrack service point on an Emarat fuel forecourt, with the FastTrack sign under the Emarat pylon"
                    width={1132}
                    height={702}
                  />
                </div>
                <figcaption className="ft-caption">
                  <span aria-hidden />A FastTrack centre on an Emarat forecourt
                </figcaption>
              </figure>
              <div className="ft-ch-copy" data-ftr>
                <h2 className="type-display ft-ch-title">On the forecourt</h2>
                <p className="ft-ch-lead">Service where you already stop for fuel.</p>
                <p className="ft-ch-body">
                  Every FastTrack centre sits on or beside a fuel forecourt, so a
                  service fits into a stop you were already making. Drive in
                  without an appointment, hand over the keys and a technician gets
                  to work. Every visit includes a full vehicle health check, and
                  FastTrack fits genuine parts only.
                </p>
              </div>
            </div>
          </section>

          {/* 02 · Quick service — light, media-led: the real booking tool runs
              large on the right and overlaps the copy, with the service types
              named once in a caption strip rather than a chip row. */}
          <section id="service" className="ft-ch ft-ch--light ui-light ft-ch--02">
            <div className="ft-ch-bg" aria-hidden>
              <Image src="/images/autodata/madar-light-streaks.webp" alt="" fill sizes="100vw" />
            </div>
            <div className="ft-ch-inner ft-ch-inner--overlap">
              <div className="ft-ch-copy" data-ftr>
                <h2 className="type-display ft-ch-title">Quick service</h2>
                <p className="ft-ch-lead">Tyres, oil, batteries, brakes and full servicing.</p>
                <p className="ft-ch-body">
                  Search by tyre size or by car model and FastTrack handles the
                  rest. Every make and model is welcome, including electric cars,
                  and you can walk in without an appointment or have the car picked
                  up and dropped back to you.
                </p>
              </div>
              <figure className="ft-service-media" data-ftr>
                <div className="ft-frame ft-frame--tool">
                  <div className="ft-tool-label" aria-hidden>Book a service online</div>
                  <Image
                    src="/images/fasttrack/ui-service-search.png"
                    alt="FastTrack booking tool: search for a service by tyre size or by car model, across tyres, oil, batteries and brakes"
                    width={800}
                    height={539}
                  />
                </div>
                <figcaption className="ft-stage-strip">
                  Tyres · Oil and filters · Batteries · Brakes · Air-conditioning ·
                  Minor and major servicing
                </figcaption>
              </figure>
            </div>
          </section>

          {/* 03 · Before you buy — dark, centred stack: a short intro over one
              wide, light inset panel carrying FastTrack's own inspection tool.
              Its own composition (light media inside a dark slide). */}
          <section id="inspection" className="ft-ch ft-ch--dark ft-ch--03">
            <div className="ft-ch-inner ft-ch-inner--stack">
              <div className="ft-ch-copy ft-ch-copy--center" data-ftr>
                <h2 className="type-display ft-ch-title">Before you buy</h2>
                <p className="ft-ch-lead">A 125-point check before you buy a used car.</p>
                <p className="ft-ch-body ft-ch-body--wide">
                  FastTrack&apos;s pre-purchase inspection runs 125 checks across the
                  engine, gearbox, brakes, suspension, electrics and body, then
                  returns a same-day digital report with photos and a valuation. A
                  technician can come to the car wherever it is, and FastTrack
                  works for the buyer, not the seller.
                </p>
                <p className="ft-spec-line" data-ftr>
                  <span>125 checks</span>
                  <span>Same-day digital report</span>
                  <span>From AED 199</span>
                  <span>At the car or at a centre</span>
                </p>
              </div>
              <figure className="ft-insp-plate" data-ftr>
                <div className="ft-insp-inset">
                  <Image
                    src="/images/fasttrack/ui-inspection-car.png"
                    alt="FastTrack pre-purchase inspection tool showing inspection points marked across a car, with an engine performance detail"
                    width={972}
                    height={338}
                  />
                </div>
                <figcaption className="ft-caption ft-caption--center">
                  <span aria-hidden />The inspection points, from FastTrack&apos;s own tool
                </figcaption>
              </figure>
            </div>
          </section>
        </div>

        {/* S4 · At work: the one photographic beat. The technician sits at the
            left; a navy wash on the right carries the statement. */}
        <section className="ft-work" aria-label="FastTrack technicians">
          <div className="ft-work-media" aria-hidden>
            <Image
              className="ft-work-img"
              src="/images/fasttrack/technician-bonnet.webp"
              alt=""
              fill
              sizes="(max-width: 899px) 100vw, 55vw"
            />
          </div>
          <div className="ft-work-tint" aria-hidden />
          <div className="ft-work-inner">
            <p className="co-kicker" data-ftr>Trained technicians</p>
            <p className="ft-work-line" data-ftr>The same trained team, at every centre.</p>
            <p className="ft-work-body" data-ftr>
              Genuine parts, a full vehicle health check with every service, and a
              comfortable waiting room while the work is done.
            </p>
          </div>
        </section>

        {/* Standing: the network Emarat built, and the concrete proof from
            FastTrack's own service pages. Two columns of different weight so it
            reads as an editorial standing beat, not a card grid. */}
        <section className="ft-standing" aria-label="FastTrack standing">
          <div className="ft-standing-inner">
            <div className="ft-standing-head" data-ftr>
              <p className="co-kicker">The network and the record</p>
              <h2 className="type-display ft-standing-title">
                Built by Emarat,<br />run across the UAE
              </h2>
            </div>
            <div className="ft-standing-cols">
              <div data-ftr>
                <h3 className="ft-standing-h">The network</h3>
                <p className="ft-standing-figure">
                  <span className="ft-standing-num">32</span>
                  <span>service points across the UAE, on or beside fuel forecourts.</span>
                </p>
                <ul className="ft-standing-list">
                  <li>
                    <strong>Built by Emarat.</strong> Emarat introduced FastTrack
                    in 2004 and has grown it ever since.
                  </li>
                  <li>
                    <strong>Part of World Automotive Group.</strong> FastTrack is
                    the group&apos;s quick-service arm in the UAE.
                  </li>
                  <li>
                    <strong>Open when you need it.</strong> Select centres run 24
                    hours, with plans to grow across the GCC.
                  </li>
                </ul>
              </div>
              <div className="ft-standing-proof" data-ftr>
                <h3 className="ft-standing-h">The record</h3>
                <p className="ft-standing-lead">
                  In 2025, FastTrack replaced batteries for more than 15,000
                  customers, fitted at a centre or wherever the car is.
                </p>
                <ul className="ft-standing-list">
                  <li>
                    <strong>Rated 5 stars.</strong> From more than 400 customer
                    reviews.
                  </li>
                  <li>
                    <strong>Up to 18 months warranty</strong> on batteries, with a
                    genuine-parts-only policy across every service.
                  </li>
                  <li>
                    <strong>Fleet accounts for business.</strong> Monthly billing,
                    a full service history and priority servicing for company
                    vehicles.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* S5 · Closing call to action. Orange stays the action colour; the
            group ask (fleet) routes to contact. */}
        <section className="relative px-[var(--gutter)] py-24">
          <Scrim />
          <div className="relative max-w-4xl">
            <p data-ftr className="co-kicker">Two ways in</p>
            <p data-ftr className="ft-close-line">Drive in, or run your fleet with FastTrack.</p>
            <p data-ftr className="ft-close-body">
              Take any car to the nearest centre with no appointment, or talk to
              the group about servicing a business fleet.
            </p>
            <div data-ftr className="ft-cta-row">
              <a
                href={company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ft-btn ft-btn--solid"
              >
                Find a centre ↗
              </a>
              <Link href="/contact" className="ft-btn ft-btn--ghost">
                Fleet enquiries
              </Link>
            </div>
            <p data-ftr className="ft-contact">
              Emarat Atrium Building, Sheikh Zayed Road, Dubai, United Arab
              Emirates. 800 FASTTRACK (800 3278). service@fasttrackemarat.com.
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
