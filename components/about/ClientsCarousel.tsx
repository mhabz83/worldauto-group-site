/* AutoData clients & partners — a self-scrolling logo marquee shown inside the
   AutoData stop of the homepage journey. Real logos in full colour on uniform
   white chips (colours untouched). Styling lives in LandingJourney's styled-jsx
   (journey-clients-*). Pure-CSS seamless loop; collapses under reduced motion. */

export const autodataClients = [
  { name: "AXA", logo: "/clients/axa.png" },
  { name: "RSA", logo: "/clients/rsa.png" },
  { name: "Qatar Insurance Group", logo: "/clients/qic.png" },
  { name: "Emirates Insurance", logo: "/clients/emirates-insurance.png" },
  { name: "Dubai Islamic Bank", logo: "/clients/dubai-islamic-bank.png" },
  { name: "Oman Insurance Company", logo: "/clients/oman-insurance.png" },
  { name: "ADNIC", logo: "/clients/adnic.png" },
  { name: "Watania", logo: "/clients/watania.png" },
  { name: "AFNIC", logo: "/clients/afnic.png" },
  { name: "Royal Oman Police", logo: "/clients/oman-emblem.png" },
  { name: "Precision Tune Auto Care", logo: "/clients/precision-tune.png" },
  { name: "Emirates NBD", logo: "/clients/emirates-nbd.png" },
  { name: "Tasjeel", logo: "/clients/tasjeel.png" },
  { name: "FastTrack", logo: "/clients/fasttrack.png" },
  { name: "Emarat Insurance", logo: "/clients/tree-emblem.png" },
];

export function ClientsCarousel() {
  return (
    <div className="journey-clients" aria-label="AutoData clients and partners">
      <div className="journey-clients-marquee">
        <div className="journey-clients-track">
          {autodataClients.map((c) => (
            <span className="journey-clients-chip" key={c.name}>
              <img src={c.logo} alt={c.name} loading="lazy" draggable={false} />
            </span>
          ))}
          {autodataClients.map((c) => (
            <span className="journey-clients-chip journey-clients-dup" key={`dup-${c.name}`} aria-hidden="true">
              <img src={c.logo} alt="" loading="lazy" draggable={false} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
