/* AutoData clients & partners — a self-scrolling logo marquee shown inside the
   AutoData stop of the homepage journey. Two treatments keep every mark sharp
   and legible on the dark navy world: simple wordmarks are knocked out to a
   quiet white and float directly on the world; marks that rely on colour, a
   plate, or fine emblem detail sit on a subtle dark glass chip in their own
   (lightly desaturated) colours so they stay recognisable. "sq" marks a
   square/emblem lockup that needs a little more height to match the optical
   weight of the wordmarks. Styling lives in LandingJourney's styled-jsx
   (journey-clients-*). Pure-CSS seamless loop; collapses under reduced motion.

   Logo files upgraded 2026-07-21 to crisp vector (SVG) or high-res transparent
   PNG. Three marks are still the older low-res PNGs pending owner-verified art
   (see the flagged notes below): Oman Insurance, Royal Oman Police, Emarat
   Insurance. */

type Treatment = "mono" | "chip";

export const autodataClients: {
  name: string;
  logo: string;
  treatment: Treatment;
  sq?: boolean;
}[] = [
  { name: "AXA", logo: "/clients/axa.svg", treatment: "chip", sq: true },
  { name: "RSA", logo: "/clients/rsa.svg", treatment: "mono" },
  { name: "Qatar Insurance Group", logo: "/clients/qic.png", treatment: "mono" },
  { name: "Emirates Insurance", logo: "/clients/emirates-insurance.png", treatment: "mono" },
  { name: "Dubai Islamic Bank", logo: "/clients/dubai-islamic-bank.png", treatment: "chip", sq: true },
  // flagged: still the older low-res mark, pending owner-verified vector
  { name: "Oman Insurance Company", logo: "/clients/oman-insurance.png", treatment: "chip", sq: true },
  { name: "ADNIC", logo: "/clients/adnic.png", treatment: "mono" },
  { name: "Watania", logo: "/clients/watania.svg", treatment: "mono" },
  { name: "AFNIC", logo: "/clients/afnic.svg", treatment: "mono" },
  // flagged: government emblem, still the older mark pending an authoritative vector
  { name: "Royal Oman Police", logo: "/clients/oman-emblem.png", treatment: "chip", sq: true },
  { name: "Precision Tune Auto Care", logo: "/clients/precision-tune.svg", treatment: "chip" },
  { name: "Emirates NBD", logo: "/clients/emirates-nbd.png", treatment: "chip" },
  { name: "Tasjeel", logo: "/clients/tasjeel.png", treatment: "mono" },
  { name: "FastTrack", logo: "/clients/fasttrack.png", treatment: "chip" },
  // flagged: mark identity to be confirmed by the owner
  { name: "Emarat Insurance", logo: "/clients/tree-emblem.png", treatment: "chip", sq: true },
];

function chipClass(c: { treatment: Treatment; sq?: boolean }) {
  return [
    "journey-clients-chip",
    c.treatment === "chip" ? "is-chip" : "is-mono",
    c.sq ? "is-sq" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function ClientsCarousel() {
  return (
    <div className="journey-clients" aria-label="AutoData clients and partners">
      <p className="journey-clients-label">Trusted by</p>
      <div className="journey-clients-marquee">
        <div className="journey-clients-track">
          {autodataClients.map((c) => (
            <span className={chipClass(c)} key={c.name}>
              <img src={c.logo} alt={c.name} loading="lazy" draggable={false} />
            </span>
          ))}
          {autodataClients.map((c) => (
            <span className={chipClass(c) + " journey-clients-dup"} key={`dup-${c.name}`} aria-hidden="true">
              <img src={c.logo} alt="" loading="lazy" draggable={false} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
