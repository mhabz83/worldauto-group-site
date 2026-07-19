/* AutoData clients & partners — a self-scrolling logo marquee. Real logos in
   full colour on uniform white chips (colours untouched), on the brand navy.
   Pure-CSS seamless loop (track duplicated), pauses on hover, and collapses to
   a static centred grid under reduced motion. No heading by request. */

const clients = [
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
    <section
      id="clients"
      data-ax-theme="dark"
      data-nav-section="group"
      className="ax-section ax-clients"
      aria-label="Clients and partners"
    >
      <div className="ax-clients-marquee">
        <div className="ax-clients-track">
          {clients.map((c) => (
            <div className="ax-clients-chip" key={c.name}>
              <img src={c.logo} alt={c.name} loading="lazy" draggable={false} />
            </div>
          ))}
          {/* duplicate set for the seamless loop; hidden under reduced motion */}
          {clients.map((c) => (
            <div className="ax-clients-chip ax-clients-dup" key={`dup-${c.name}`} aria-hidden="true">
              <img src={c.logo} alt="" loading="lazy" draggable={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
