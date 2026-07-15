"use client";

import { type ReactNode, useEffect, useRef } from "react";
import * as THREE from "three";

/* --------------------------------------------------------------------------
 * Public art-direction controls. Keep these in one place for fast tuning.
 * ------------------------------------------------------------------------ */
export const HERO_IMAGE = "/hero/suv-neon.jpg";
export const COLORS = {
  void: "#000835",
  blue: "#1367FE",
  orange: "#FF4200",
  cyan: "#42D7FF",
} as const;

export const LOOK = {
  exposure: 1.08,
  bloom: 1.55,
  fog: 0.14,
  // Kept at zero: any UV warping deforms the lower wheel geometry.
  reflectionShimmer: 0,
  vignette: 0.58,
} as const;

export const CAMERA = {
  startZoom: 1.0,
  endZoom: 1.235,
  travelX: 0.105,
  travelY: 0.032,
  pointerParallaxX: 0.009,
  pointerParallaxY: 0.006,
} as const;

export const MOTION = {
  scrollDamping: 7.5,
  pointerDamping: 5.5,
  trailSpeed: 0.42,
  energySpeed: 0.55,
  journeyVh: 380,
} as const;

type Props = {
  children?: ReactNode;
  className?: string;
  imageSrc?: string;
  /** Accessible description for the static fallback image. */
  alt?: string;
};

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const easeOutQuart = (n: number) => 1 - Math.pow(1 - clamp01(n), 4);

/** Critically damped scalar motion: stable across variable frame rates. */
function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/**
 * Three intentional “holds” in the journey. The curve remains monotonic, but
 * its slope falls near each pose before accelerating smoothly into the next.
 */
function cinematicProgress(raw: number) {
  const stops = [0, 0.18, 0.31, 0.48, 0.62, 0.79, 1];
  const poses = [0, 0.2, 0.27, 0.53, 0.59, 0.84, 1];
  const p = clamp01(raw);
  let i = 0;
  while (i < stops.length - 2 && p > stops[i + 1]) i++;
  const local = (p - stops[i]) / (stops[i + 1] - stops[i]);
  const eased = easeOutQuart(local);
  return THREE.MathUtils.lerp(poses[i], poses[i + 1], eased);
}

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uImage;
  uniform vec2 uResolution;
  uniform vec2 uImageResolution;
  uniform vec2 uOffset;
  uniform float uZoom;
  uniform float uTime;
  uniform float uProgress;
  uniform float uBloom;
  uniform float uFog;
  uniform float uShimmer;
  uniform float uVignette;
  uniform float uExposure;

  float pulse(float x, float center, float width) {
    float d = abs(fract(x - center + .5) - .5);
    return exp(-d * d / width);
  }

  void main() {
    vec2 uv = vUv;

    // Aspect-cover, matching CSS object-fit: cover without stretching the SUV.
    float screenAspect = uResolution.x / uResolution.y;
    float imageAspect = uImageResolution.x / uImageResolution.y;
    vec2 cover = screenAspect > imageAspect
      ? vec2(1.0, imageAspect / screenAspect)
      : vec2(screenAspect / imageAspect, 1.0);
    uv = (uv - .5) * cover / uZoom + .5 + uOffset;

    // Never warp source UVs. Uniform scale + translation preserves the exact
    // silhouette and keeps both wheels perfectly circular throughout travel.
    float floorMask = smoothstep(.46, .08, uv.y);

    vec3 color = texture2D(uImage, uv).rgb;
    float blueSignal = max(color.b - max(color.r, color.g) * .42, 0.0);
    float orangeSignal = max(color.r - color.b * .8, 0.0);
    float neon = smoothstep(.12, .88, max(blueSignal, orangeSignal));

    // Traveling energy follows existing bright pixels, so it never invents mesh.
    // Two clearly readable energy packets: one races along the body, one along
    // the road/reflection. Both only amplify pixels already present in the art.
    float bodyTravel = pulse(uv.x * 1.28 + uv.y * .18, uTime * .38 + uProgress * 1.75, .012);
    float roadTravel = pulse(uv.x * 1.52 + uv.y * .52, -uTime * .55 + uProgress * 2.35, .009);
    float travel = max(bodyTravel, roadTravel * (0.4 + floorMask));
    float wireEnergy = .76 + .24 * sin(uTime * 4.2 + uv.x * 10.0 + uProgress * 12.566);
    color *= mix(1.0, wireEnergy, neon * .66);
    color += color * neon * travel * uBloom * 3.2;
    color += vec3(.075, .34, 1.0) * blueSignal * bodyTravel * uBloom * 1.8;
    color += vec3(1.0, .12, 0.0) * orangeSignal * roadTravel * uBloom * 1.25;

    // Soft low-cost bloom sampled only around emissive source pixels.
    vec2 px = 1.0 / uResolution;
    vec3 halo = vec3(0.0);
    halo += texture2D(uImage, uv + vec2(px.x * 4.0, 0.0)).rgb;
    halo += texture2D(uImage, uv - vec2(px.x * 4.0, 0.0)).rgb;
    halo += texture2D(uImage, uv + vec2(0.0, px.y * 4.0)).rgb;
    halo += texture2D(uImage, uv - vec2(0.0, px.y * 4.0)).rgb;
    color += halo * neon * uBloom * .055;

    float breath = .5 + .5 * sin(uTime * .34 + uProgress * 3.1415);
    vec3 fogColor = vec3(.015, .12, .42);
    float fogShape = smoothstep(.92, .18, distance(vUv, vec2(.68, .53)));
    color = mix(color, color + fogColor * uFog * breath, fogShape * .5);

    float vignette = smoothstep(.78, .18, distance(vUv, vec2(.56, .51)));
    color *= mix(1.0 - uVignette, 1.0, vignette);
    color *= uExposure;
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Fixed, scroll-driven luxury hero. Supply headline/UI as `children`; it is
 * placed in the protected left third and never enters the WebGL render loop.
 */
export default function SuvNeonScrollHero({
  children,
  className = "",
  imageSrc = HERO_IMAGE,
  alt = "Electric-blue digital-twin SUV on a neon road",
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fallbackRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const fallback = fallbackRef.current;
    if (!root || !canvas || !fallback) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch {
      return; // Crisp image fallback remains visible if WebGL is unavailable.
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(COLORS.void);
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const texture = new THREE.Texture();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const uniforms = {
      uImage: { value: texture },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uImageResolution: { value: new THREE.Vector2(16, 9) },
      uOffset: { value: new THREE.Vector2() },
      uZoom: { value: CAMERA.startZoom as number },
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uBloom: { value: LOOK.bloom },
      uFog: { value: LOOK.fog },
      uShimmer: { value: LOOK.reflectionShimmer },
      uVignette: { value: LOOK.vignette },
      uExposure: { value: LOOK.exposure },
    };
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, depthTest: false, depthWrite: false });
    scene.add(new THREE.Mesh(geometry, material));

    let image: HTMLImageElement | null = new Image();
    image.decoding = "async";
    image.src = imageSrc;
    image.onload = () => {
      if (!image) return;
      texture.image = image;
      texture.needsUpdate = true;
      uniforms.uImageResolution.value.set(image.naturalWidth, image.naturalHeight);
      fallback.style.opacity = "0";
      canvas.style.opacity = "1";
    };

    const pointerTarget = new THREE.Vector2();
    const pointer = new THREE.Vector2();
    const onPointer = (event: PointerEvent) => {
      pointerTarget.set(event.clientX / innerWidth * 2 - 1, event.clientY / innerHeight * 2 - 1);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const resize = () => {
      const width = root.clientWidth;
      const height = root.clientHeight;
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    let smooth = 0;
    const render = () => {
      const dt = Math.min(clock.getDelta(), 1 / 20);
      const elapsed = clock.elapsedTime;
      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, root.offsetHeight - innerHeight);
      const raw = clamp01(-rect.top / travel);
      smooth = damp(smooth, cinematicProgress(raw), MOTION.scrollDamping, dt);
      pointer.x = damp(pointer.x, pointerTarget.x, MOTION.pointerDamping, dt);
      pointer.y = damp(pointer.y, pointerTarget.y, MOTION.pointerDamping, dt);

      const push = easeOutQuart(smooth);
      uniforms.uTime.value = elapsed * MOTION.energySpeed;
      uniforms.uProgress.value = smooth;
      uniforms.uZoom.value = THREE.MathUtils.lerp(CAMERA.startZoom, CAMERA.endZoom, push);
      // A shallow S-curve feels like traveling the road rather than simply
      // enlarging a photograph. Scale remains uniform, so geometry is locked.
      const roadArc = Math.sin(smooth * Math.PI * 2) * 0.014;
      uniforms.uOffset.value.set(
        CAMERA.travelX * (smooth - .5) + roadArc + pointer.x * CAMERA.pointerParallaxX,
        (Math.sin(smooth * Math.PI) - smooth * .35) * CAMERA.travelY - pointer.y * CAMERA.pointerParallaxY,
      );
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointer);
      resizeObserver.disconnect();
      image = null;
      texture.dispose();
      material.dispose();
      geometry.dispose();
      renderer.dispose();
      // Release the WebGL context so a re-mount (React StrictMode in dev, Fast
      // Refresh, or an imageSrc change) can acquire a fresh one on the same
      // canvas instead of failing with "existing context of a different type".
      renderer.forceContextLoss();
    };
  }, [imageSrc]);

  return (
    <section
      ref={rootRef}
      className={`suvHero ${className}`}
      style={{ height: `${MOTION.journeyVh}dvh` }}
      aria-label="Automotive digital-twin experience"
    >
      <div className="suvHero__stage">
        {/* The image is both the no-JS/reduced-motion frame and WebGL fallback. */}
        <img ref={fallbackRef} className="suvHero__fallback" src={imageSrc} alt={alt} fetchPriority="high" />
        <canvas ref={canvasRef} className="suvHero__canvas" aria-hidden="true" />
        <div className="suvHero__copy">{children}</div>
        <div className="suvHero__grain" aria-hidden="true" />
      </div>

      <style jsx>{`
        .suvHero { position: relative; width: 100%; background: ${COLORS.void}; }
        .suvHero__stage { position: sticky; top: 0; width: 100%; height: 100dvh; min-height: 520px; overflow: hidden; background: ${COLORS.void}; isolation: isolate; }
        .suvHero__fallback, .suvHero__canvas { position: absolute; inset: 0; width: 100%; height: 100%; }
        .suvHero__fallback { z-index: 0; object-fit: cover; transition: opacity .35s ease-out; }
        .suvHero__canvas { z-index: 1; opacity: 0; transition: opacity .35s ease-out; }
        .suvHero__copy { position: absolute; z-index: 2; inset: 0 auto 0 0; display: flex; width: min(34vw, 34rem); align-items: center; padding: clamp(1.25rem, 4.5vw, 5rem); pointer-events: none; color: #eef5ff; }
        .suvHero__copy :global(a), .suvHero__copy :global(button) { pointer-events: auto; }
        .suvHero__grain { position: absolute; z-index: 3; inset: 0; pointer-events: none; opacity: .035; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.7'/%3E%3C/svg%3E"); mix-blend-mode: soft-light; }
        @media (max-width: 760px) {
          .suvHero__fallback { object-position: 62% center; }
          .suvHero__copy { inset: auto 0 0; width: auto; min-height: 42%; align-items: flex-end; padding: 1.25rem; background: linear-gradient(0deg, rgba(0,8,53,.96), rgba(0,8,53,.62) 55%, transparent); }
        }
        @media (prefers-reduced-motion: reduce) {
          .suvHero { height: 100dvh !important; }
          .suvHero__canvas { display: none; }
          .suvHero__fallback { opacity: 1 !important; transition: none; }
          .suvHero__grain { display: none; }
        }
      `}</style>
    </section>
  );
}
