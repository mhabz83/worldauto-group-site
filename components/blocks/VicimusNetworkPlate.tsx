/* Vicimus operations-band plate — a group-level "network of dealerships"
   data-flow wireframe in the Vicimus green, echoing the homepage Vicimus
   pulse-grid intersection. Pure line art on the existing perspective grid:
   dealership storefront glyphs feed animated signal packets into one
   group-level hub. No product UI, no client marks, no figures, no claims.
   Server-rendered SVG; all motion is CSS (disabled under reduced motion). */

type Node = { x: number; y: number; s: number; d: number };

/* Storefront glyphs sit in the band's upper two thirds so the kicker line
   along the bottom edge keeps clear air. `s` scales the glyph, `d` staggers
   its pulse + packet delay. */
const nodes: Node[] = [
  { x: 150, y: 250, s: 0.85, d: 0.0 },
  { x: 335, y: 135, s: 0.75, d: 0.9 },
  { x: 500, y: 320, s: 0.95, d: 1.8 },
  { x: 940, y: 130, s: 0.8, d: 0.5 },
  { x: 1130, y: 305, s: 1.0, d: 2.3 },
  { x: 1305, y: 165, s: 0.85, d: 1.3 },
  { x: 430, y: 490, s: 0.8, d: 2.8 },
  { x: 1020, y: 500, s: 0.9, d: 3.4 },
];

const HUB = { x: 720, y: 318 };

/* One arched data-flow curve per dealership into the hub. */
function flowPath(n: Node): string {
  const mx = (n.x + HUB.x) / 2;
  const my = Math.min(n.y, HUB.y) - 85;
  return `M${n.x} ${n.y - 22 * n.s} Q${mx} ${my} ${HUB.x} ${HUB.y}`;
}

function Storefront({ n }: { n: Node }) {
  return (
    <g className="co-net-cell" style={{ animationDelay: `${n.d}s` }}>
      {/* ground ring */}
      <ellipse cx={n.x} cy={n.y + 16 * n.s} rx={46 * n.s} ry={9 * n.s} className="co-net-faint" />
      {/* facade: canopy roofline + walls + door */}
      <g transform={`translate(${n.x} ${n.y}) scale(${n.s})`}>
        <path d="M-30 14 L-30 -6 L0 -18 L30 -6 L30 14" className="co-net-node" />
        <path d="M-38 14 L38 14" className="co-net-node" />
        <path d="M-8 14 L-8 -1 L8 -1 L8 14" className="co-net-faint" />
        <path d="M-30 -6 L30 -6" className="co-net-faint" />
      </g>
      {/* uplink dot */}
      <circle cx={n.x} cy={n.y - 22 * n.s} r={3} className="co-net-dot" />
    </g>
  );
}

export function VicimusNetworkPlate() {
  return (
    <div className="co-net" aria-hidden="true">
      <svg viewBox="0 0 1440 620" fill="none" preserveAspectRatio="xMidYMid slice">
        {/* data-flow lines: a faint constant thread + one bright packet
            travelling it on a staggered loop */}
        {nodes.map((n) => (
          <path key={`l-${n.x}-${n.y}`} d={flowPath(n)} className="co-net-line" />
        ))}
        {nodes.map((n) => (
          <path
            key={`f-${n.x}-${n.y}`}
            d={flowPath(n)}
            className="co-net-flow"
            style={{ animationDelay: `${n.d * 0.85}s` }}
          />
        ))}

        {/* the group-level hub: pulse arcs from the homepage Vicimus motif */}
        <g className="co-net-hub">
          <circle cx={HUB.x} cy={HUB.y} r={4.5} className="co-net-dot" />
          <circle cx={HUB.x} cy={HUB.y} r={16} className="co-net-node" />
          <path
            d={`M${HUB.x - 46} ${HUB.y} A46 46 0 0 1 ${HUB.x + 46} ${HUB.y}`}
            className="co-net-arc"
          />
          <path
            d={`M${HUB.x - 80} ${HUB.y} A80 80 0 0 1 ${HUB.x + 80} ${HUB.y}`}
            className="co-net-arc co-net-arc--outer"
          />
        </g>

        {/* dealership storefronts */}
        {nodes.map((n) => (
          <Storefront key={`n-${n.x}-${n.y}`} n={n} />
        ))}
      </svg>
    </div>
  );
}
