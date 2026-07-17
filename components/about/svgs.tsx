/**
 * Inline SVGs rebuilt from the recovered /about DOM, recolored to the WAG
 * accent system:
 *   blues  #1BA5FF/#1164FF/#59E2FF/#54A2FF → #42D7FF/#1367FE/#42D7FF/#89AEFF
 *   warms  #FF3946/#FF4C2A/#FCF238        → #FB441A/#FF6340/#FF9E7A (orange family)
 *   braid blues #256CCC/#75C5FF/#A1FFFF   → #1367FE/#42D7FF/#B3F0FF
 *   glow  #0B1264 (shared navy aura)      → kept, it is our navy family
 * Geometry is verbatim from the recovery archive.
 */

import { Ref } from "react";

/* radial glow — 2012px circle, #0B1264 → transparent */
export function GlowSvg({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="2012"
      height="2012"
      viewBox="0 0 2012 2012"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="1006" cy="1006" r="1006" fill="url(#ax-glow)" />
      <defs>
        <radialGradient
          id="ax-glow"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(1006 1006) rotate(90) scale(1006)"
        >
          <stop offset="0.00961538" stopColor="#0B1264" />
          <stop offset="0.384615" stopColor="#0B1264" stopOpacity="0.456311" />
          <stop offset="1" stopColor="#0B1264" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* S2 orbital — 1420x940, 3 circles + orbit paths + 12 dots + propeller */
export function OrbitalSvg({
  className,
  svgRef,
}: {
  className?: string;
  svgRef?: Ref<SVGSVGElement>;
}) {
  const blue = (
    <>
      <stop stopColor="#42D7FF" stopOpacity="0" />
      <stop offset="0.0867578" stopColor="#42D7FF" />
      <stop offset="0.668106" stopColor="#1367FE" />
      <stop offset="0.81291" stopColor="#42D7FF" />
      <stop offset="1" stopColor="#89AEFF" />
    </>
  );
  const warmFade = (
    <>
      <stop stopColor="#FF6340" />
      <stop offset="1" stopColor="#FB441A" stopOpacity="0" />
    </>
  );
  const orangeIn = (
    <>
      <stop stopColor="#FF6340" stopOpacity="0" />
      <stop offset="1" stopColor="#FF6340" />
    </>
  );
  return (
    <svg
      ref={svgRef}
      className={className}
      width="1420"
      height="940"
      viewBox="0 0 1420 940"
      fill="none"
      aria-hidden="true"
    >
      <circle className="ax-orb-ring" opacity="0.4" cx="710" cy="470" r="229" stroke="url(#ax-o0)" strokeWidth="2" />
      <circle className="ax-orb-ring" opacity="0.3" cx="710" cy="470" r="349" stroke="url(#ax-o1)" strokeWidth="2" />
      <circle className="ax-orb-ring" opacity="0.2" cx="710" cy="470" r="469" stroke="url(#ax-o2)" strokeWidth="2" />
      <path className="ax-orb-arc" d="M597.5 103C597.5 103 657 376.5 718.5 376.5C780 376.5 836.5 107 836.5 107" stroke="url(#ax-o3)" strokeWidth="2" />
      <path className="ax-orb-arc" d="M936.845 160C894.941 239.884 809.865 377 719.588 377C626.417 377 536.016 230.951 494.178 152.5" stroke="url(#ax-o4)" strokeWidth="2" />
      <path className="ax-orb-arc" d="M598 837C598 837 657 564.5 718.5 564.5C775.591 564.5 828.374 799.333 835.648 833" stroke="url(#ax-o5)" strokeWidth="2" />
      <path className="ax-orb-arc" d="M494.713 787.5C536.783 708.815 626.813 564 719.59 564C809.491 564 894.234 699.978 936.321 780" stroke="url(#ax-o6)" strokeWidth="2" />
      <path className="ax-orb-arc" d="M1075.5 586.857C1027.35 575.745 812.5 523.108 812.5 468.5C812.5 413.892 1027.35 363.226 1075.5 352.556" stroke="url(#ax-o7)" strokeWidth="2" />
      <circle className="ax-orb-dot" cx="1072" cy="353" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="1076" cy="587" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="1025" cy="687" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="936" cy="779" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="835" cy="832" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="598" cy="836" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="495" cy="787" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="1024" cy="253" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="936" cy="161" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="836" cy="109" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="598" cy="106" r="4" fill="#FF6340" />
      <circle className="ax-orb-dot" cx="496" cy="154" r="4" fill="#FF6340" />
      <path className="ax-orb-arc" d="M1026.5 687.42C946.291 643.548 812 556.753 812 467.411C812 378.254 945.734 294.171 1026 251.734" stroke="url(#ax-o8)" strokeWidth="2" />
      <path className="ax-orb-flow" d="M225 450H646.81C658.884 450 670.463 445.204 679 436.667V436.667C687.537 428.13 699.253 423.333 711.327 423.333V423.333C737.1 423.333 758.333 444.227 758.333 470V470C758.333 495.773 737.1 516.667 711.327 516.667V516.667C699.253 516.667 687.537 511.871 679 503.333V503.333C670.463 494.796 658.884 490 646.81 490H431.667" stroke="url(#ax-o9)" strokeWidth="2" />
      <path className="ax-orb-flow" d="M225 443.333H644.144C656.217 443.333 667.796 438.537 676.333 430V430C684.87 421.463 696.449 416.667 708.523 416.667H711.731C741.151 416.667 765 440.581 765 470V470C765 499.42 741.151 523.333 711.731 523.333H708.523C696.449 523.333 684.87 518.537 676.333 510V510C667.796 501.463 656.217 496.667 644.144 496.667H445" stroke="url(#ax-o10)" strokeWidth="2" />
      <path className="ax-orb-flow" d="M225 436.667H641.477C653.551 436.667 665.129 431.871 673.667 423.333V423.333C682.204 414.796 693.783 410 705.856 410H711.798C744.863 410 771.667 436.936 771.667 470V470C771.667 503.064 744.863 530 711.798 530H705.856C693.783 530 682.204 525.204 673.667 516.667V516.667C665.129 508.129 653.551 503.333 641.477 503.333H458.333" stroke="url(#ax-o11)" strokeWidth="2" />
      <path className="ax-orb-flow" d="M711.669 470H318.336M698.336 476.667H318.336M685.003 463.333H318.336" stroke="url(#ax-o12)" strokeWidth="2" />
      <defs>
        <linearGradient id="ax-o0" x1="563.07" y1="319.471" x2="946.414" y2="417.36" gradientUnits="userSpaceOnUse">{blue}</linearGradient>
        <linearGradient id="ax-o1" x1="486.411" y1="240.935" x2="1069.76" y2="389.895" gradientUnits="userSpaceOnUse">{blue}</linearGradient>
        <linearGradient id="ax-o2" x1="409.752" y1="162.398" x2="1193.11" y2="362.431" gradientUnits="userSpaceOnUse">{blue}</linearGradient>
        <linearGradient id="ax-o3" x1="717" y1="254" x2="717" y2="376.5" gradientUnits="userSpaceOnUse">{warmFade}</linearGradient>
        <linearGradient id="ax-o4" x1="715.511" y1="265" x2="715.511" y2="377" gradientUnits="userSpaceOnUse">{warmFade}</linearGradient>
        <linearGradient id="ax-o5" x1="716.824" y1="691" x2="716.824" y2="564.5" gradientUnits="userSpaceOnUse">{warmFade}</linearGradient>
        <linearGradient id="ax-o6" x1="715.517" y1="670.5" x2="715.517" y2="564" gradientUnits="userSpaceOnUse">{warmFade}</linearGradient>
        <linearGradient id="ax-o7" x1="933.5" y1="469.706" x2="812.5" y2="469.706" gradientUnits="userSpaceOnUse">{warmFade}</linearGradient>
        <linearGradient id="ax-o8" x1="866" y1="454.5" x2="812" y2="469.577" gradientUnits="userSpaceOnUse">{warmFade}</linearGradient>
        <linearGradient id="ax-o9" x1="225" y1="470" x2="758.333" y2="470" gradientUnits="userSpaceOnUse">{orangeIn}</linearGradient>
        <linearGradient id="ax-o10" x1="225" y1="470" x2="765" y2="470" gradientUnits="userSpaceOnUse">{orangeIn}</linearGradient>
        <linearGradient id="ax-o11" x1="225" y1="470" x2="771.667" y2="470" gradientUnits="userSpaceOnUse">{orangeIn}</linearGradient>
        <linearGradient id="ax-o12" x1="318.336" y1="470" x2="711.669" y2="470" gradientUnits="userSpaceOnUse">{orangeIn}</linearGradient>
      </defs>
    </svg>
  );
}

/* The Model streamlines — 1420x940 wind-tunnel flow over an implied body.
   4 blue lines above, 3 orange below in a tight band that pinches over the
   body. Paths are stroke-drawn on scroll; a current rides each on assembly.
   Geometry generated once (deterministic) so SSR and client match. */
export function StreamlinesSvg({
  className,
  svgRef,
}: {
  className?: string;
  svgRef?: Ref<SVGSVGElement>;
}) {
  const W = 1420;
  const CX = 710;
  const centerY = 470;
  const sig = 265;
  const lift = (x: number, amp: number) => {
    const u = (x - CX) / sig;
    const bump = Math.exp(-u * u);
    const tail = 0.16 * Math.exp(-Math.pow((x - CX - 300) / (sig * 2.1), 2));
    return amp * (bump + tail);
  };
  const band = [
    { y: centerY - 132, amp: 44, warm: false },
    { y: centerY - 88, amp: 62, warm: false },
    { y: centerY - 44, amp: 82, warm: false },
    { y: centerY, amp: 104, warm: false },
    { y: centerY + 46, amp: 128, warm: true },
    { y: centerY + 96, amp: 150, warm: true },
    { y: centerY + 150, amp: 172, warm: true },
  ];
  const paths = band.map((b) => {
    let d = "";
    for (let x = 40; x <= 1380; x += 12) {
      const px = x;
      const py = Math.round((b.y - lift(x, b.amp)) * 100) / 100;
      d += (x === 40 ? "M" : "L") + px + " " + py + " ";
    }
    return { d: d.trim(), warm: b.warm };
  });
  return (
    <svg
      ref={svgRef}
      className={className}
      width={W}
      height="940"
      viewBox={`0 0 ${W} 940`}
      fill="none"
      aria-hidden="true"
    >
      {paths.map((p, i) => (
        <path
          key={i}
          className={p.warm ? "ax-stream-warm" : "ax-stream-cool"}
          d={p.d}
          stroke={p.warm ? "url(#ax-stream-w)" : "url(#ax-stream-b)"}
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity={p.warm ? 0.7 : 0.45 + i * 0.04}
        />
      ))}
      <defs>
        <linearGradient id="ax-stream-b" x1="40" y1="0" x2="1380" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#42D7FF" stopOpacity="0" />
          <stop offset="0.0867578" stopColor="#42D7FF" />
          <stop offset="0.668106" stopColor="#1367FE" />
          <stop offset="0.81291" stopColor="#42D7FF" />
          <stop offset="1" stopColor="#89AEFF" />
        </linearGradient>
        <linearGradient id="ax-stream-w" x1="40" y1="0" x2="1380" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6340" />
          <stop offset="0.6" stopColor="#FB441A" />
          <stop offset="1" stopColor="#FF9E7A" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* S6 values rings — 1080x1080, two scroll-rotated dashed-arc groups */
export function RingsSvg({
  className,
  g1Ref,
  g2Ref,
}: {
  className?: string;
  g1Ref?: Ref<SVGGElement>;
  g2Ref?: Ref<SVGGElement>;
}) {
  return (
    <svg
      width="1080"
      height="1080"
      viewBox="0 0 1080 1080"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle vectorEffect="non-scaling-stroke" opacity="0.2" cx="540" cy="540" r="539" stroke="url(#ax-r0)" strokeWidth="2" />
      <circle vectorEffect="non-scaling-stroke" opacity="0.5" cx="540" cy="540" r="329" stroke="url(#ax-r1)" strokeWidth="2" />
      <g ref={g1Ref} transform="rotate(0 540 540)">
        <path vectorEffect="non-scaling-stroke" d="M799.996 539.999C799.996 594.905 782.614 648.402 750.341 692.822C718.068 737.242 672.561 770.305 620.342 787.272L619.538 784.799C671.235 768.002 716.287 735.27 748.237 691.294C780.188 647.318 797.396 594.356 797.396 539.999H799.996Z" fill="url(#ax-r2)" />
        <path vectorEffect="non-scaling-stroke" d="M295.68 451.074C276.901 502.669 274.938 558.885 290.072 611.664C305.206 664.443 336.661 711.077 379.927 744.88L381.528 742.831C338.694 709.366 307.554 663.199 292.571 610.948C277.588 558.696 279.532 503.043 298.123 451.964L295.68 451.074Z" fill="url(#ax-r3)" />
        <path vectorEffect="non-scaling-stroke" d="M799.996 539.999C799.996 485.093 782.614 431.596 750.341 387.176C718.068 342.756 672.561 309.693 620.342 292.726L619.538 295.199C671.235 311.996 716.287 344.728 748.237 388.704C780.188 432.68 797.396 485.642 797.396 539.999H799.996Z" fill="url(#ax-r4)" />
        <path vectorEffect="non-scaling-stroke" d="M314.833 410C342.286 362.45 384.088 324.811 434.247 302.479C484.407 280.147 540.348 274.267 594.055 285.683L593.514 288.226C540.345 276.924 484.963 282.745 435.305 304.854C385.647 326.963 344.263 364.225 317.085 411.3L314.833 410Z" fill="url(#ax-r5)" />
      </g>
      <g ref={g2Ref} transform="rotate(0 540 540)">
        <path vectorEffect="non-scaling-stroke" d="M753.689 453.641C771.926 498.77 775.408 548.513 763.636 595.742C751.864 642.971 725.443 685.261 688.159 716.551L686.677 714.785C723.588 683.808 749.746 641.941 761.4 595.184C773.054 548.428 769.607 499.182 751.552 454.505L753.689 453.641Z" fill="url(#ax-r6)" />
        <path vectorEffect="non-scaling-stroke" d="M377.021 702.978C411.439 737.395 455.869 760.034 503.944 767.648C552.019 775.262 601.27 767.462 644.639 745.364L643.592 743.31C600.657 765.187 551.898 772.91 504.305 765.371C456.711 757.833 412.725 735.421 378.651 701.348L377.021 702.978Z" fill="url(#ax-r7)" />
        <path vectorEffect="non-scaling-stroke" d="M759.198 468.756C744.153 422.466 714.84 382.126 675.46 353.519C636.08 324.912 588.654 309.507 539.98 309.51L539.98 311.815C588.168 311.811 635.119 327.063 674.105 355.384C713.092 383.705 742.112 423.641 757.006 469.469L759.198 468.756Z" fill="url(#ax-r8)" />
        <path vectorEffect="non-scaling-stroke" d="M309.514 540.014C309.511 491.34 324.916 443.915 353.523 404.534C382.13 365.154 422.47 335.841 468.76 320.797L469.473 322.989C423.645 337.883 383.709 366.903 355.388 405.889C327.067 444.875 311.816 491.827 311.819 540.014L309.514 540.014Z" fill="url(#ax-r9)" />
      </g>
      <defs>
        <linearGradient id="ax-r0" x1="195.034" y1="186.585" x2="1095.06" y2="416.41" gradientUnits="userSpaceOnUse">
          <stop stopColor="#42D7FF" stopOpacity="0" />
          <stop offset="0.0867578" stopColor="#42D7FF" />
          <stop offset="0.668106" stopColor="#1367FE" />
          <stop offset="0.81291" stopColor="#42D7FF" />
          <stop offset="1" stopColor="#89AEFF" />
        </linearGradient>
        <linearGradient id="ax-r1" x1="329.187" y1="324.024" x2="879.203" y2="464.473" gradientUnits="userSpaceOnUse">
          <stop stopColor="#42D7FF" stopOpacity="0" />
          <stop offset="0.0867578" stopColor="#42D7FF" />
          <stop offset="0.668106" stopColor="#1367FE" />
          <stop offset="0.81291" stopColor="#42D7FF" />
          <stop offset="1" stopColor="#89AEFF" />
        </linearGradient>
        <linearGradient id="ax-r2" x1="624" y1="789" x2="624.477" y2="544.85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#42D7FF" stopOpacity="0" />
          <stop offset="0.227104" stopColor="#42D7FF" />
          <stop offset="0.668106" stopColor="#1367FE" />
          <stop offset="0.81291" stopColor="#42D7FF" />
          <stop offset="1" stopColor="#89AEFF" />
        </linearGradient>
        <linearGradient id="ax-r3" x1="269" y1="427" x2="133.403" y2="568.554" gradientUnits="userSpaceOnUse">
          <stop stopColor="#060A3D" stopOpacity="0" />
          <stop offset="0.0843636" stopColor="#FB441A" />
          <stop offset="0.551965" stopColor="#FF6340" />
          <stop offset="0.827696" stopColor="#FF9E7A" />
          <stop offset="1" stopColor="#FF6340" />
        </linearGradient>
        <linearGradient id="ax-r4" x1="789.598" y1="464.081" x2="769.154" y2="269.993" gradientUnits="userSpaceOnUse">
          <stop stopColor="#060A3D" stopOpacity="0" />
          <stop offset="0.343843" stopColor="#FB441A" />
          <stop offset="0.551965" stopColor="#FF6340" />
          <stop offset="0.827696" stopColor="#FF9E7A" />
          <stop offset="1" stopColor="#FF6340" />
        </linearGradient>
        <linearGradient id="ax-r5" x1="530.64" y1="280.002" x2="463.772" y2="510.698" gradientUnits="userSpaceOnUse">
          <stop stopColor="#42D7FF" stopOpacity="0" />
          <stop offset="0.0867578" stopColor="#42D7FF" />
          <stop offset="0.668106" stopColor="#1367FE" />
          <stop offset="0.81291" stopColor="#42D7FF" />
          <stop offset="1" stopColor="#89AEFF" />
        </linearGradient>
        <linearGradient id="ax-r6" x1="696.978" y1="709.702" x2="616.236" y2="515.956" gradientUnits="userSpaceOnUse">
          <stop stopColor="#42D7FF" stopOpacity="0" />
          <stop offset="0.245511" stopColor="#42D7FF" />
          <stop offset="0.668106" stopColor="#1367FE" />
          <stop offset="0.81291" stopColor="#42D7FF" />
          <stop offset="1" stopColor="#89AEFF" />
        </linearGradient>
        <linearGradient id="ax-r7" x1="375.502" y1="730" x2="454.961" y2="862.908" gradientUnits="userSpaceOnUse">
          <stop stopColor="#060A3D" stopOpacity="0" />
          <stop offset="0.195511" stopColor="#FB441A" />
          <stop offset="0.551965" stopColor="#FF6340" />
          <stop offset="0.827696" stopColor="#FF9E7A" />
          <stop offset="0.933324" stopColor="#FF9E7A" />
        </linearGradient>
        <linearGradient id="ax-r8" x1="729.629" y1="407.6" x2="659.212" y2="249.569" gradientUnits="userSpaceOnUse">
          <stop stopColor="#060A3D" stopOpacity="0" />
          <stop offset="0.343843" stopColor="#FB441A" />
          <stop offset="0.551965" stopColor="#FF6340" />
          <stop offset="0.827696" stopColor="#FF9E7A" />
          <stop offset="1" stopColor="#FF6340" />
        </linearGradient>
        <linearGradient id="ax-r9" x1="417.559" y1="344.548" x2="468.494" y2="551.294" gradientUnits="userSpaceOnUse">
          <stop stopColor="#42D7FF" stopOpacity="0" />
          <stop offset="0.0867578" stopColor="#42D7FF" />
          <stop offset="0.201656" stopColor="#1367FE" />
          <stop offset="0.749807" stopColor="white" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* S6 timeline braid — 1460x2175, warm braid left / blue braid right + spine */
export function BraidSvg({
  className,
  svgRef,
}: {
  className?: string;
  svgRef?: Ref<SVGSVGElement>;
}) {
  return (
    <svg
      ref={svgRef}
      width="1460"
      height="2175"
      viewBox="0 0 1460 2175"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path vectorEffect="non-scaling-stroke" opacity="0.6" d="M724 2096L705.935 534.647C703.888 357.71 615.922 200.42 449.164 141.238C241.944 67.6957 -8.90036 -1.48339 -12 -2" stroke="url(#ax-t0)" strokeWidth="2" />
      <path vectorEffect="non-scaling-stroke" opacity="0.6" d="M721 2096L701.252 544.222C699.003 367.53 611.084 210.497 444.561 151.378C237.264 77.7839 -13.8984 8.51694 -17 8" stroke="url(#ax-t1)" />
      <path vectorEffect="non-scaling-stroke" opacity="0.6" d="M736 2096L754.416 534.565C756.502 357.675 844.411 200.381 1010.98 140.817C1218.46 66.6272 1469.9 -3.48303 1473 -4" stroke="url(#ax-t2)" strokeWidth="2" />
      <path vectorEffect="non-scaling-stroke" opacity="0.3" d="M739 2096L759.097 545.136C761.386 368.494 849.249 211.459 1015.58 151.96C1223.14 77.7171 1474.9 7.5173 1478 7" stroke="url(#ax-t3)" />
      <path vectorEffect="non-scaling-stroke" opacity="0.6" d="M725 75L727 2175" stroke="url(#ax-t4)" />
      <path vectorEffect="non-scaling-stroke" opacity="0.6" d="M730 75L730 2175" stroke="url(#ax-t5)" />
      <path vectorEffect="non-scaling-stroke" opacity="0.6" d="M735 75L733 2175" stroke="url(#ax-t6)" />
      <path vectorEffect="non-scaling-stroke" d="M729.999 75L729.999 2107.5" stroke="url(#ax-t7)" strokeWidth="2" />
      <defs>
        <linearGradient id="ax-t0" x1="721" y1="2096" x2="1282.82" y2="386.026" gradientUnits="userSpaceOnUse">
          <stop stopColor="#060A3D" stopOpacity="0" />
          <stop offset="0.0530558" stopColor="#FB441A" />
          <stop offset="0.50029" stopColor="#FF6340" />
          <stop offset="0.662398" stopColor="#FF9E7A" />
          <stop offset="0.807107" stopColor="#FF6340" />
          <stop offset="0.995794" stopColor="#FF6340" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ax-t1" x1="707" y1="2101" x2="1258.46" y2="368.638" gradientUnits="userSpaceOnUse">
          <stop stopColor="#060A3D" stopOpacity="0" />
          <stop offset="0.114894" stopColor="#FB441A" />
          <stop offset="0.50029" stopColor="#FF6340" />
          <stop offset="0.662398" stopColor="#FF9E7A" />
          <stop offset="0.826276" stopColor="#FF6340" />
          <stop offset="0.996792" stopColor="#FF6340" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ax-t2" x1="981.5" y1="131.5" x2="1317.07" y2="1990.71" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1367FE" stopOpacity="0" />
          <stop offset="0.231728" stopColor="#1367FE" />
          <stop offset="0.668106" stopColor="#42D7FF" />
          <stop offset="0.81291" stopColor="#B3F0FF" />
          <stop offset="0.859655" stopColor="#42D7FF" />
          <stop offset="0.997532" stopColor="#42D7FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ax-t3" x1="986.5" y1="142.5" x2="1321.78" y2="1992.8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1367FE" stopOpacity="0" />
          <stop offset="0.194236" stopColor="#1367FE" />
          <stop offset="0.668106" stopColor="#42D7FF" />
          <stop offset="0.81291" stopColor="#B3F0FF" />
          <stop offset="0.940534" stopColor="#42D7FF" />
          <stop offset="0.99927" stopColor="#42D7FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ax-t4" x1="726.706" y1="75" x2="726.706" y2="2175" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6340" stopOpacity="0.1" />
          <stop offset="0.154494" stopColor="#FF6340" stopOpacity="0.6" />
          <stop offset="0.9" stopColor="#FF6340" />
          <stop offset="1" stopColor="#FF6340" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ax-t5" x1="729.853" y1="75" x2="729.854" y2="2175" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6340" stopOpacity="0.1" />
          <stop offset="0.154494" stopColor="#FF6340" stopOpacity="0.6" />
          <stop offset="0.9" stopColor="#FF6340" />
          <stop offset="1" stopColor="#FF6340" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ax-t6" x1="734.706" y1="75" x2="734.706" y2="2175" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6340" stopOpacity="0.1" />
          <stop offset="0.154494" stopColor="#FF6340" stopOpacity="0.6" />
          <stop offset="0.9" stopColor="#FF6340" />
          <stop offset="1" stopColor="#FF6340" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ax-t7" x1="729.706" y1="297.889" x2="729.706" y2="2108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6340" stopOpacity="0.1" />
          <stop offset="0.15" stopColor="#FF6340" />
          <stop offset="1" stopColor="#FF9E7A" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* pin border — the two quarter-arc strokes shared by every pin */
export function PinBorder() {
  return (
    <svg
      className="ax-pin-border"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path vectorEffect="non-scaling-stroke" d="M25.0467 38.8356C28.3531 37.9497 31.3679 36.2091 33.7883 33.7887C36.2087 31.3683 37.9494 28.3534 38.8353 25.0471" stroke="white" />
      <path vectorEffect="non-scaling-stroke" d="M14.9528 1.16454C11.6465 2.05047 8.63157 3.79111 6.21117 6.21151C3.79077 8.63191 2.05013 11.6468 1.1642 14.9531" stroke="white" />
    </svg>
  );
}

export function ArrowDown() {
  return (
    <svg width="14" height="7" viewBox="0 0 14 7" fill="none" aria-hidden="true">
      <path d="M1 1L7 6L13 1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg width="7" height="14" viewBox="0 0 7 14" fill="none" aria-hidden="true">
      <path d="M6 1L1 7L6 13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg width="7" height="14" viewBox="0 0 7 14" fill="none" aria-hidden="true">
      <path d="M1 1L6 7L1 13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function Chevron() {
  return (
    <svg width="9" height="8" viewBox="0 0 9 8" fill="none" aria-hidden="true">
      <path d="M2 7L7 1" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
