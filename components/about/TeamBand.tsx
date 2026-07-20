"use client";

/**
 * TeamBand — the team chapter on panel navy.
 *
 * Replaces the recovered keen-slider lineup (white stage, frosted card,
 * chevron arrows) with an editorial band: a full-bleed row of uniform 3:4
 * duotone portraits (CSS: grayscale + navy multiply + orange highlight
 * screen), each carried by a navy nameplate with an orange rule, light-weight
 * name and small-caps role on a shared baseline grid. The row scrolls
 * horizontally; no JS engine needed.
 */

import { team } from "@/content/site";
import { FlickerTitle } from "./reveal";

export function TeamBand() {
  return (
    <section
      id="team"
      data-ax-theme="dark"
      data-nav-section="team"
      className="ax-section ax-teamband"
    >
      <div className="ax-container">
        <FlickerTitle
          as="h2"
          className="ax-h1 ax-team-title"
          reveal="title"
          segments={[{ text: "The Team", className: "ax-accent-b" }]}
        />
      </div>
      <ul className="ax-portrow" aria-label="Group leadership">
        {team.map((member) => (
          <li key={member.name} className="ax-port" data-about-reveal="fade-in">
            <figure className="ax-port-fig">
              <div className="ax-port-img">
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed-crop duotone frame */}
                <img
                  src={member.image}
                  alt={`${member.name}, ${member.role}`}
                  loading="lazy"
                  draggable={false}
                />
              </div>
              <figcaption className="ax-port-plate">
                <span className="ax-port-rule" aria-hidden="true" />
                <h3 className="ax-port-name">{member.name}</h3>
                <p className="ax-port-role">{member.role}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
