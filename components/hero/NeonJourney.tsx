"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

gsap.registerPlugin(ScrollTrigger);

/* Faithful rebuild of the Madar Platform WebGL hero, from the full recovery in
   /tmp/wag-build/madar-webgl-recovery (NOTES.md is the spec).
   - World scaled 1/7.7; fog #000835 (.02 → .15) IS the vanishing point.
   - VEHICLE (WAG differentiation): Madar's truck is replaced by an SUV —
     suv.glb rendered as a solid-black silhouette plus a neon wireframe built
     at runtime from THREE.EdgesGeometry FEATURE edges only (crease angle
     threshold — never the full triangulation), chained into polylines and
     grown into the same glowing tubes/shader the truck line-art used.
     The old truck's line-art in scene-16.obj (every "TRUCK_*" object) is
     skipped; roads/crossroads/graphics/HUD lines all stay.
   - Camera: fov 35, near .001, far .15, driven along two CatmullRomCurve3
     (recovered resolved points) by the WHOLE page scroll (0→1), SmoothDamped.
   - UnrealBloom 0.5/0/0 + the recovered gradient post pass.
   - Reflective floor approximated with three's Reflector (drei's
     MeshReflectorMaterial isn't in this stack). */

/* ------------------------------- constants ------------------------------- */

const WORLD_SCALE = 1 / 7.7;

const COLORS = {
  background: 0x000835, // clear + fog + scene background
  lineBlue: 0x1367fe,
  lineOrange: 0xff4200,
  lineWhite: 0xffffff,
  vehicle: 0x000000,
};

const FOG = { near: 0.02, far: 0.15 };

const CAMERA = {
  fovDesktop: 35,
  fovMd: 50, // <= 1024px
  fovSm: 65, // <= 640px
  near: 0.001,
  far: 0.15,
  smoothTime: 0.2, // SmoothDamp on scroll progress (Madar value)
  introMs: 0, // locked opening pose; scroll is the only camera driver
  // recovered preloader sweep start pose ("Z" array, pose 0)
  introFrom: {
    position: new THREE.Vector3(-0.04072, 0.00461, 0.73854),
    target: new THREE.Vector3(-0.0858, -0.01579, 0.6965),
  },
  // push the scene right so the left third stays clear for the headline
  viewShiftX: 0.13, // fraction of viewport width
};

const BLOOM = { strength: 0.28, radius: 0, threshold: 0.12 };

const RENDER = {
  maxWidth: 3840,
  maxHeight: 2160,
  maxPixelRatio: 2,
  msaaSamples: 4,
  exposure: 0.7,
};

// Tube sizing (desktop values from the recovered bundle)
const TUBES = {
  roadRadius: 585e-7,
  thinRadius: 3e-5,
  detailRadius: 3e-5,
  radialSegments: 8,
  roadSegments: 500,
  roadSegmentsShort: 200, // curves shorter than 0.1 world units
  roadDarken: -10, // stable core stays above bloom threshold along the full trail
  // Non-road (truck wireframe / detail) lines only: emissive boost so they
  // read as bright as Madar's under the page's legibility scrim (which
  // multiplies the canvas down ~0.8). Per-channel: c' = k * c^gamma.
  // - blue: gamma 2 keeps it SATURATED blue (a flat multiply overshoots the
  //   green channel under ACES and reads teal; ref bright blue is 19/83/224)
  // - orange: flat multiply so the core warms toward Madar's yellow-white
  // - white: flat multiply, just hotter
  // Road trails stay untouched (they'd blow out under bloom).
  detailBoostBlue: { gamma: 2, k: 2.8 },
  detailBoostOrange: { gamma: 1, k: 1.6 },
  detailBoostWhite: { gamma: 1, k: 2 },
};

// SUV replaces Madar's truck. The licensed source is normalized offline by
// scripts/export_suv_web.py: front facing +Z, nose-to-tail length 1.0, tyres
// on y=0, centred in x/z. Body, wheels and brakes remain separate so the
// silhouette and circular wheel geometry survive every camera position.
const SUV = {
  position: new THREE.Vector3(-0.138, 0, 0.632),
  rotationY: 1.62, // nose to screen-right; opening camera looks along -z, so
  // side-on = heading ~+x (π/2), plus a hair so a hint of the front shows
  length: 0.033,
  edgeThresholdDeg: 36,
  minChainLength: 0.035,
};
const SUV_FIT = {
  desktopWidthNdc: 0.68, // 34% of viewport width
  desktopHeightNdc: 0.66,
  mobileWidthNdc: 1.34, // 67% of viewport width
  mobileHeightNdc: 0.72,
  desktopCenterX: 0.42, // centre-right, with the left third protected
  mobileCenterX: 0,
  centerY: 0.1,
  mobileBreakpoint: 900,
  safety: 0.94,
} as const;
const LINES_OFFSET = new THREE.Vector3(0, 0, 0.5);

const FLOOR = {
  size: 1.5,
  y: -0.0005,
  textureSize: 1024, // 2048 in Madar; 1024 + blur = softer AND cheaper
  // Reflector overlay tint: 0x7f7f7f = neutral mirror; darker = dimmer
  // reflection (approximates mirror .96 + mixStrength 1.75 + roughness)
  tint: 0x555562,
  clipBias: 0.00003,
  // Soft-reflection stack (stands in for drei MeshReflectorMaterial's
  // mirror .96 / mixStrength 1.75 / mixBlur 3.2 / roughness 2):
  blurTexels: 2.0, // gaussian tap spacing in RT texels, per pass
  blurPasses: 2, // H+V iterations on the reflection render target
  roughnessMap: "/webgl-lines/textures/unnamed.avif", // recovered Madar map
  normalMap: "/webgl-lines/textures/def-normal.avif", // recovered Madar map
  mapRepeat: 4, // both maps repeat(4,4) in Madar
  roughnessInfluence: 0.45, // rough patches dim the mirror toward the fog
  distortion: 0.008, // normal-map wobble on the projective uv
  fadeStart: 0.02, // camera-distance reflection fade (world units,
  fadeEnd: 0.11, //   tracks fog .02 → .15 so far reflections dissolve)
};

const JOURNEY_POSES = [
  { raw: 0, scene: 0, accent: 0x1367fe },
  { raw: 0.1, scene: 0.06, accent: 0x1367fe },
  { raw: 0.2, scene: 0.14, accent: 0x1367fe },
  { raw: 0.3, scene: 0.23, accent: 0x42d7ff },
  { raw: 0.4, scene: 0.33, accent: 0xff4200 },
  { raw: 0.5, scene: 0.43, accent: 0x8a6cff },
  { raw: 0.6, scene: 0.54, accent: 0x34e39b },
  { raw: 0.7, scene: 0.65, accent: 0x1367fe },
  { raw: 0.8, scene: 0.77, accent: 0xff4200 },
  { raw: 0.9, scene: 0.89, accent: 0x42d7ff },
  { raw: 1, scene: 1, accent: 0x1367fe },
] as const;
const JOURNEY_ACCENT_COLORS = JOURNEY_POSES.map((pose) => new THREE.Color(pose.accent));
const JOURNEY_HOLD = 0.026;

// The five company cards are real arrival points in the same continuous
// world. Each destination is intentionally sparse: one architectural idea and
// one road transformation, rather than five miniature literal dioramas.
const DESTINATION_SPECS = [
  { id: "fasttrack", raw: 0.2, scene: 0.14, accent: 0x1367fe, side: -1 },
  { id: "autodata", raw: 0.3, scene: 0.23, accent: 0x42d7ff, side: 1 },
  { id: "axxion", raw: 0.4, scene: 0.33, accent: 0xff4200, side: -1 },
  { id: "pag-direct", raw: 0.5, scene: 0.43, accent: 0x8a6cff, side: 1 },
  { id: "vicimus", raw: 0.6, scene: 0.54, accent: 0x34e39b, side: -1 },
] as const;

const DESTINATIONS = {
  sideOffset: 0.014,
  structureRadius: 0.000052,
  roadRadius: 0.000062,
  enter: 0.068,
  settle: 0.026,
  leave: 0.072,
  mobileScale: 1.16,
} as const;

const FAKE_FLOOR = {
  size: 0.1,
  position: new THREE.Vector3(-0.135, 0, 0.64),
  rotationX: Math.PI / 2,
  rotationZ: 2.36,
};

// Resolved camera path (already scaled 1/7.7, z+0.5, reversed) — recovery JSON
const CAM_POINTS: [number, number, number][] = [
  [-0.13377, 0.00909, 0.70779], [-0.03896, 0.01558, 0.56494], [0.06483, 0.0033, 0.49386],
  [0.08961, 0.00239, 0.47403], [0.02365, 0.00173, 0.44796], [0.07908, 0.01659, 0.39514],
  [0.1618, 0.02468, 0.42483], [0.20836, 0.02208, 0.42727], [0.24857, 0.01353, 0.42015],
  [0.24476, 0.02906, 0.43835], [0.3004, 0.00519, 0.39702], [0.34369, 0.00178, 0.36433],
  [0.34421, 0.00085, 0.34421],
];
const LOOK_POINTS: [number, number, number][] = [
  [-0.13738, 0.00547, 0.6561], [0.0025, 0.0039, 0.5359], [0.08314, 0.00612, 0.44533],
  [0.0806, 0.00511, 0.42294], [0.07359, 0.00671, 0.43458], [0.12898, 0.00314, 0.40038],
  [0.18478, -0.00937, 0.39303], [0.18452, -0.00779, 0.39208], [0.27941, -0.00875, 0.38477],
  [0.27381, 0.00168, 0.40511], [0.3458, -0.01342, 0.37995], [0.39214, 0.00485, 0.3828],
  [0.39482, 0.00085, 0.35591],
];

const ASSETS = {
  suv: "/webgl-lines/suv-licensed.glb",
  lines: "/webgl-lines/scene-16.obj",
};

const REDUCED_MOTION_PROGRESS = 0; // static representative frame

/* -------------------------------- shaders -------------------------------- */
/* Verbatim recovered GLSL (shaders/ in the recovery folder). */

const LINE_VERT = /* glsl */ `
varying vec2 vUv;

#include <fog_pars_vertex>

void main() {
    vUv = uv;

    vec4 pos = modelViewMatrix * vec4(position, 1.0);

    gl_Position = projectionMatrix * pos;

    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>
}
`;

const LINE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
uniform float uSize;
uniform float uSpeed;
uniform float uAlpha;
uniform bool uHideCorners;
varying vec2 vUv;

#include <fog_pars_fragment>

void main() {

    // Fade only at genuine authored endpoints. The previous 10% fade made
    // long roads visibly lose energy before reaching the screen edge.
    // Fixed UV feather keeps this shader portable across WebGL drivers; using
    // fwidth here requires derivative extensions and can prevent compilation.
    float endpointAA = 0.002;
    float endpointWidth = 0.018;
    float hideCorners = uHideCorners
      ? smoothstep(0.0, endpointWidth + endpointAA, vUv.x)
        * (1.0 - smoothstep(1.0 - endpointWidth - endpointAA, 1.0, vUv.x))
      : 1.0;

    // A constant 1x core keeps every trail crisp and equally illuminated.
    // Motion is a narrow, continuous Gaussian packet with modest energy;
    // unlike the old 1x→3x sine, it never flashes the whole line through the
    // bloom threshold or produces hard temporal bands.
    float repeatCount = max(1.0, uSize * 0.18);
    float phase = fract(vUv.x * repeatCount - uTime * 0.09 * uSpeed);
    float distanceToPacket = min(phase, 1.0 - phase);
    float packet = exp(-distanceToPacket * distanceToPacket / 0.0072) * uSpeed;
    vec3 finalcolor = uColor * (1.0 + packet * 0.58);

    gl_FragColor.rgba = vec4(finalcolor, uAlpha * hideCorners);

    #include <fog_fragment>
}
`;

const BASIC_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Reflector override: three's stock mirror shader + Madar's recovered floor
// maps. Roughness dims the mirror in patches, the normal map wobbles the
// projective uv, and a camera-distance fade dissolves far reflections into
// the fog so nothing reads razor-sharp at the horizon.
const REFLECTOR_VERT = /* glsl */ `
uniform mat4 textureMatrix;
uniform float uMapRepeat;
varying vec4 vUvP;
varying vec2 vPlaneUv;
varying vec3 vWorldPos;
void main() {
    vUvP = textureMatrix * vec4(position, 1.0);
    vPlaneUv = uv * uMapRepeat;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const REFLECTOR_FRAG = /* glsl */ `
uniform vec3 color;
uniform sampler2D tDiffuse;
uniform sampler2D tRough;
uniform sampler2D tNormal;
uniform vec3 uBgColor;
uniform float uRoughInfluence;
uniform float uDistortion;
uniform float uFadeStart;
uniform float uFadeEnd;
varying vec4 vUvP;
varying vec2 vPlaneUv;
varying vec3 vWorldPos;

float blendOverlay(float base, float blend) {
    return (base < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));
}
vec3 blendOverlay(vec3 base, vec3 blend) {
    return vec3(blendOverlay(base.r, blend.r), blendOverlay(base.g, blend.g), blendOverlay(base.b, blend.b));
}

void main() {
    float rough = texture2D(tRough, vPlaneUv).g;
    vec3 nrm = texture2D(tNormal, vPlaneUv).rgb * 2.0 - 1.0;
    vec2 uv = vUvP.xy / vUvP.w + nrm.xy * uDistortion;
    vec4 base = texture2D(tDiffuse, uv);
    vec3 refl = blendOverlay(base.rgb, color);
    // what the floor shows where the mirror gives out: the fogged void
    vec3 farCol = blendOverlay(uBgColor, color);
    refl = mix(refl, farCol, rough * uRoughInfluence);
    float fade = smoothstep(uFadeStart, uFadeEnd, distance(vWorldPos, cameraPosition));
    gl_FragColor = vec4(mix(refl, farCol, fade), 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
`;

// 9-tap separable gaussian, run H then V over the reflection render target
// (the "mixBlur" stand-in — softens the mirror image itself).
const BLUR_FRAG = /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uDelta;
varying vec2 vUv;
void main() {
    vec4 sum = vec4(0.0);
    sum += texture2D(tDiffuse, vUv - 4.0 * uDelta) * 0.051;
    sum += texture2D(tDiffuse, vUv - 3.0 * uDelta) * 0.0918;
    sum += texture2D(tDiffuse, vUv - 2.0 * uDelta) * 0.12245;
    sum += texture2D(tDiffuse, vUv - 1.0 * uDelta) * 0.1531;
    sum += texture2D(tDiffuse, vUv) * 0.1633;
    sum += texture2D(tDiffuse, vUv + 1.0 * uDelta) * 0.1531;
    sum += texture2D(tDiffuse, vUv + 2.0 * uDelta) * 0.12245;
    sum += texture2D(tDiffuse, vUv + 3.0 * uDelta) * 0.0918;
    sum += texture2D(tDiffuse, vUv + 4.0 * uDelta) * 0.051;
    gl_FragColor = sum;
}
`;

const FAKE_FLOOR_FRAG = /* glsl */ `
uniform float uTime;
varying vec2 vUv;

#define MOD3 vec3(.1031,.11369,.13787)

#define COLOR_1 vec3(0.18, 0.27, 0.53)
#define COLOR_2 vec3(0.7294, 0.5725, 0.0)

vec3 hash33(vec3 p3)
{
	p3 = fract(p3 * MOD3);
    p3 += dot(p3, p3.yxz+19.19);
    return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
}

float simplex_noise(vec3 p)
{
    const float K1 = 0.333333333;
    const float K2 = 0.166666667;

    vec3 i = floor(p + (p.x + p.y + p.z) * K1);
    vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);

    vec3 e = step(vec3(0.0), d0 - d0.yzx);
	vec3 i1 = e * (1.0 - e.zxy);
	vec3 i2 = 1.0 - e.zxy * (1.0 - e);

    vec3 d1 = d0 - (i1 - 1.0 * K2);
    vec3 d2 = d0 - (i2 - 2.0 * K2);
    vec3 d3 = d0 - (1.0 - 3.0 * K2);

    vec4 h = max(0.6 - vec4(dot(d0, d0), dot(d1, d1), dot(d2, d2), dot(d3, d3)), 0.0);
    vec4 n = h * h * h * h * vec4(dot(d0, hash33(i)), dot(d1, hash33(i + i1)), dot(d2, hash33(i + i2)), dot(d3, hash33(i + 1.0)));

    return dot(vec4(31.316), n);
}

void main() {
    vec2 uv = vUv;
    float alpha = 1.0 - distance(uv, vec2(0.5, 0.5)) * 2.0;

    float speed = 0.1;
    float time = uTime * speed;
    uv.x += time * -0.3;

    vec2 noiseScaleBlue = vec2(2.0, 4.0);
    vec2 noiseScaleOrange = vec2(2.0, 8.0);

    float cBlue1 = simplex_noise(vec3(uv * noiseScaleBlue, time * 0.5)) * 0.5 + 0.5;
    float cBlue2 = simplex_noise(vec3(uv * noiseScaleBlue * -2.0, time * 0.5)) * 0.5 + 0.5;

    float cOrange1 = simplex_noise(vec3(uv * noiseScaleOrange * 1.0, time * 0.5)) * 0.5 + 0.5;
    float cOrange2 = simplex_noise(vec3(uv * noiseScaleOrange * 3.0 * -2.0, time * 0.5)) * 0.5 + 0.5;
    float cOrange3 = simplex_noise(vec3(uv * noiseScaleOrange * 2.0 * 1.5, time * 0.5)) * 0.5 + 0.5;

    float cMix1 = simplex_noise(vec3(uv * noiseScaleOrange * 2.5, time * 1.25)) * 0.5 + 0.5;
    float cMix2 = simplex_noise(vec3(uv * noiseScaleBlue * 0.5, time * 1.25)) * 0.5 + 0.5;

    float alphaBlue = alpha * cBlue1 * cBlue2;
    float alphaOrange = alpha * cOrange1 * cOrange2 * cOrange3;

    gl_FragColor = mix(vec4(COLOR_1, alphaBlue), vec4(COLOR_2, alphaOrange), cMix1 * cMix1 * cMix2 * cMix2);
    gl_FragColor.a *= 0.75;
}
`;

// Post pass: chromatic aberration + radial gradients + vignette + noise.
// Uniform defaults below reproduce the live site (CA/noise/vignette off,
// the two deep-blue radial gradients on).
const POST_FRAG = /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec2 uResolution;
uniform float uNoiseStrength;
uniform float uCAMaxDistortion;
uniform float uCAScale;
uniform float uCASize;
uniform float uVignetteOffset;
uniform float uVignetteDarkness;
uniform float uGradientsAlpha;
uniform vec2 uGradient1Position;
uniform vec3 uGradient1Color;
uniform float uGradient1Strength;
uniform float uGradient1Scale;
uniform vec2 uGradient2Position;
uniform vec3 uGradient2Color;
uniform float uGradient2Strength;
uniform float uGradient2Scale;
uniform float uBottomGradientScale;
uniform float uBottomGradientStrength;
uniform vec3 uBottomGradientColor;
varying vec2 vUv;
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
#define PI 3.141592653589793
vec2 barrelDistortion(vec2 coord, float amt) {
    vec2 cc = coord - 0.5;
    float dist = dot(cc, cc);
    return coord + cc * dist * amt;
}
float sat(float t) {
    return clamp( t, 0.0, 1.0 );
}
float linterp(float t) {
    return sat(1.0 - abs(2.0 * t - 1.0));
}
float remap(float t, float a, float b) {
    return sat((t - a) / (b - a));
}
vec4 spectrumOffset( float t ) {
    vec4 ret;
    float lo = step(t, 0.5);
    float hi = 1.0 - lo;
    float w = linterp(remap(t, 1.0 / 6.0, 5.0 / 6.0));
    ret = vec4(lo, 1.0, hi, 1.) * vec4(1.0 - w, w, 1.0 - w, 1.);
    return pow(ret, vec4(1.0 / 2.2));
}
float sineInOut(float t) {
    return -0.5 * (cos(PI * t) - 1.0);
}
const int CAIterations = 9;
const float CAReciIterations = 1.0 / float(CAIterations);
void main() {
    vec2 uv = vUv;

    vec2 caUv = (gl_FragCoord.xy / uResolution.xy * uCAScale) + (1.0 - uCAScale) * 0.5;
    vec4 sumCol = vec4(0.0);
    vec4 sumW = vec4(0.0);
    for (int i = 0; i < CAIterations; ++i) {
        float t = float(i) * CAReciIterations;
        vec4 w = spectrumOffset(t);
        sumW += w;
        sumCol += w * texture2D(tDiffuse, barrelDistortion(caUv, uCASize * uCAMaxDistortion * t));
    }
    vec4 color = sumCol / sumW;

    float gradient1Alpha = 1.0 - distance(uGradient1Position, uv) * uGradient1Scale;
    gradient1Alpha = clamp(gradient1Alpha, 0.0, 1.0);
    gradient1Alpha = sineInOut(gradient1Alpha);
    color.rgb += uGradient1Color * gradient1Alpha * uGradient1Strength * uGradientsAlpha;
    float gradient2Alpha = 1.0 - distance(uGradient2Position, uv) * uGradient2Scale;
    gradient2Alpha = clamp(gradient2Alpha, 0.0, 1.0);
    gradient2Alpha = sineInOut(gradient2Alpha);
    color.rgb += uGradient2Color * gradient2Alpha * uGradient2Strength * uGradientsAlpha;

    float bottomGradientAlpha = distance(uv.y, 1.0) * uBottomGradientScale;
    bottomGradientAlpha = clamp(bottomGradientAlpha, 0.0, 1.0);
    color.rgb = mix(color.rgb, uBottomGradientColor, bottomGradientAlpha * uBottomGradientStrength);

    const vec2 center = vec2(0.5);
    float d = distance(vUv, center);
    color *= smoothstep(0.8, uVignetteOffset * 0.799, d * (uVignetteDarkness + uVignetteOffset));

    color.rgb += (random(vUv) - 0.5) * uNoiseStrength;

    gl_FragColor = color;
}
`;

/* -------------------------------- helpers -------------------------------- */

/** Madar's own curve: straight linear segments between recovered points. */
class PolylineCurve extends THREE.Curve<THREE.Vector3> {
  private cumulative: number[];
  private totalLength: number;

  constructor(private pts: THREE.Vector3[]) {
    super();
    this.cumulative = [0];
    for (let index = 1; index < pts.length; index++) {
      this.cumulative.push(this.cumulative[index - 1] + pts[index].distanceTo(pts[index - 1]));
    }
    this.totalLength = this.cumulative[this.cumulative.length - 1] || 1;
  }

  getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const distance = THREE.MathUtils.clamp(t, 0, 1) * this.totalLength;
    let index = 0;
    while (index < this.cumulative.length - 2 && this.cumulative[index + 1] < distance) index++;
    const start = this.cumulative[index];
    const segmentLength = Math.max(this.cumulative[index + 1] - start, Number.EPSILON);
    return target.lerpVectors(this.pts[index], this.pts[index + 1], (distance - start) / segmentLength);
  }

  getPointAt(u: number, target = new THREE.Vector3()): THREE.Vector3 {
    return this.getPoint(u, target);
  }
}

/** Chain EdgesGeometry's unordered segment soup into ordered polylines so
 *  feature edges can grow into the same tubes the truck's line-art used.
 *  Vertices are matched by quantized position (1e-4 on a car of length 1). */
function chainEdgeSegments(edges: THREE.BufferGeometry): THREE.Vector3[][] {
  const attr = edges.attributes.position;
  if (!attr) return [];
  const pos = attr.array as Float32Array;
  const nSeg = Math.floor(pos.length / 6);
  const keyAt = (i: number) =>
    `${Math.round(pos[i * 3] * 1e4)},${Math.round(pos[i * 3 + 1] * 1e4)},${Math.round(pos[i * 3 + 2] * 1e4)}`;
  const keyOf = (v: THREE.Vector3) =>
    `${Math.round(v.x * 1e4)},${Math.round(v.y * 1e4)},${Math.round(v.z * 1e4)}`;
  const adj = new Map<string, { seg: number; end: 0 | 1 }[]>();
  for (let s = 0; s < nSeg; s++) {
    for (const end of [0, 1] as const) {
      const k = keyAt(s * 2 + end);
      let list = adj.get(k);
      if (!list) adj.set(k, (list = []));
      list.push({ seg: s, end });
    }
  }
  const vecAt = (i: number) => new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
  const used = new Uint8Array(nSeg);
  const chains: THREE.Vector3[][] = [];
  for (let s = 0; s < nSeg; s++) {
    if (used[s]) continue;
    used[s] = 1;
    const chain = [vecAt(s * 2), vecAt(s * 2 + 1)];
    for (const forward of [true, false]) {
      for (;;) {
        const tip = forward ? chain[chain.length - 1] : chain[0];
        const cand = (adj.get(keyOf(tip)) ?? []).find((c) => !used[c.seg]);
        if (!cand) break;
        used[cand.seg] = 1;
        const p = vecAt(cand.seg * 2 + (1 - cand.end));
        if (forward) chain.push(p);
        else chain.unshift(p);
      }
    }
    chains.push(chain);
  }
  return chains;
}

/** Per-channel 0-255 darken, exactly like the recovered bundle. */
function darkenHex(hex: number, amt: number): number {
  const clamp8 = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp8((hex >> 16) + amt);
  const g = clamp8(((hex >> 8) & 255) + amt);
  const b = clamp8((hex & 255) + amt);
  return (r << 16) | (g << 8) | b;
}

/** Unity SmoothDamp (the algorithm Madar smooths scroll progress with). */
function smoothDamp(
  current: number,
  target: number,
  vel: { v: number },
  smoothTime: number,
  dt: number,
): number {
  const omega = 2 / Math.max(smoothTime, 1e-4);
  const x = omega * dt;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (vel.v + omega * change) * dt;
  vel.v = (vel.v - omega * temp) * exp;
  return target + (change + temp) * exp;
}

/** Holds the camera at each content stop, then eases through the road segment. */
function journeyProgress(raw: number): number {
  const p = THREE.MathUtils.clamp(raw, 0, 1);
  for (let index = 0; index < JOURNEY_POSES.length - 1; index++) {
    const current = JOURNEY_POSES[index];
    const next = JOURNEY_POSES[index + 1];
    const leave = index === 0 ? current.raw : current.raw + JOURNEY_HOLD;
    const arrive = index === JOURNEY_POSES.length - 2 ? next.raw : next.raw - JOURNEY_HOLD;
    if (p <= leave) return current.scene;
    if (p < arrive) {
      const local = THREE.MathUtils.clamp((p - leave) / (arrive - leave), 0, 1);
      const eased = 1 - Math.pow(1 - local, 4);
      return THREE.MathUtils.lerp(current.scene, next.scene, eased);
    }
    if (p <= next.raw + JOURNEY_HOLD) return next.scene;
  }
  return 1;
}

function journeyAccent(raw: number, target: THREE.Color): THREE.Color {
  const p = THREE.MathUtils.clamp(raw, 0, 1);
  const scaled = p * (JOURNEY_POSES.length - 1);
  const index = Math.min(JOURNEY_POSES.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const transition = THREE.MathUtils.smoothstep(local, 0.32, 0.68);
  return target.copy(JOURNEY_ACCENT_COLORS[index]).lerp(JOURNEY_ACCENT_COLORS[index + 1], transition);
}

function destinationVisibility(raw: number, center: number): number {
  const enter = THREE.MathUtils.smoothstep(
    raw,
    center - DESTINATIONS.enter,
    center - DESTINATIONS.settle,
  );
  const leave = 1 - THREE.MathUtils.smoothstep(
    raw,
    center + DESTINATIONS.settle,
    center + DESTINATIONS.leave,
  );
  return enter * leave;
}

function fovForWidth(w: number): number {
  if (w <= 640) return CAMERA.fovSm;
  if (w <= 1024) return CAMERA.fovMd;
  return CAMERA.fovDesktop;
}

const sineInOut = (t: number) => -0.5 * (Math.cos(Math.PI * t) - 1);

/* ------------------------------- component ------------------------------- */

export function NeonJourney() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    document.documentElement.classList.remove("webgl-unavailable");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = window.innerWidth;
    let H = window.innerHeight;
    let disposed = false;
    const targetPixelRatio = () => Math.max(0.75, Math.min(
      window.devicePixelRatio,
      RENDER.maxPixelRatio,
      RENDER.maxWidth / W,
      RENDER.maxHeight / H,
    ));
    let renderPixelRatio = targetPixelRatio();

    /* ------------------------------ renderer ------------------------------ */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      document.documentElement.classList.add("webgl-unavailable");
      return;
    }
    renderer.setPixelRatio(renderPixelRatio);
    renderer.setSize(W, H);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = RENDER.exposure;
    // Madar renders linear out of the composer (no final sRGB encode);
    // colors below are authored as sRGB hex and converted by three.
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    mount.appendChild(renderer.domElement);

    /* -------------------------------- scene ------------------------------- */
    const scene = new THREE.Scene();
    // Color model (verified against the recovery screenshots pixel-by-pixel):
    // fog/background #000835 uses three's standard sRGB→linear decode, while
    // LINE colors are stored raw (their bundle's setHex used LinearSRGB — the
    // runtime dump reads #1367fe back as #4daaff, i.e. raw bytes re-encoded).
    const bgColor = new THREE.Color(COLORS.background);
    scene.background = bgColor;
    scene.fog = new THREE.Fog(bgColor.clone(), FOG.near, FOG.far);
    renderer.setClearColor(bgColor, 1);
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    const camera = new THREE.PerspectiveCamera(fovForWidth(W), W / H, CAMERA.near, CAMERA.far);
    const applyViewShift = () => {
      camera.setViewOffset(W, H, -CAMERA.viewShiftX * W, 0, W, H);
    };
    applyViewShift();

    /* ------------------------------ composer ------------------------------ */
    const composer = new EffectComposer(renderer);
    composer.setPixelRatio(renderPixelRatio);
    composer.renderTarget1.samples = RENDER.msaaSamples;
    composer.renderTarget2.samples = RENDER.msaaSamples;
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), BLOOM.strength, BLOOM.radius, BLOOM.threshold);
    composer.addPass(bloom);

    // Recovered "dotEffect" pass with the live uniform values.
    const postPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        uResolution: { value: new THREE.Vector2(W * renderPixelRatio, H * renderPixelRatio) },
        uNoiseStrength: { value: 0 },
        uCAMaxDistortion: { value: 0 },
        uCAScale: { value: 1 },
        uCASize: { value: 0 },
        uVignetteOffset: { value: 0 },
        uVignetteDarkness: { value: 0 },
        uGradientsAlpha: { value: 1 },
        uGradient1Position: { value: new THREE.Vector2(0.5, 1) },
        uGradient1Color: { value: new THREE.Vector3(0.0431, 0.0706, 0.3922) },
        uGradient1Strength: { value: 0.77 },
        uGradient1Scale: { value: 1.28 },
        uGradient2Position: { value: new THREE.Vector2(0, 0.66) },
        uGradient2Color: { value: new THREE.Vector3(0.0431, 0.0706, 0.3922) },
        uGradient2Strength: { value: 0.48 },
        uGradient2Scale: { value: 0.17 },
        uBottomGradientScale: { value: 0.88 },
        uBottomGradientStrength: { value: 0 },
        uBottomGradientColor: { value: new THREE.Vector3(0, 0, 0) },
      },
      vertexShader: BASIC_VERT,
      fragmentShader: POST_FRAG,
    });
    composer.addPass(postPass);
    const accentColor = new THREE.Color(JOURNEY_POSES[0].accent);

    /* ------------------------------- camera path -------------------------- */
    const toVec = (p: [number, number, number]) => new THREE.Vector3(p[0], p[1], p[2]);
    const camCurve = new THREE.CatmullRomCurve3(CAM_POINTS.map(toVec));
    const lookCurve = new THREE.CatmullRomCurve3(LOOK_POINTS.map(toVec));

    /* -------------------------------- floor ------------------------------- */
    const floorGeo = new THREE.PlaneGeometry(FLOOR.size, FLOOR.size);
    const texLoader = new THREE.TextureLoader();
    const loadFloorMap = (url: string) => {
      // Seed a valid neutral pixel so the first render never samples an
      // image-less texture while the AVIF is still decoding.
      const seed = document.createElement("canvas");
      seed.width = seed.height = 1;
      const seedContext = seed.getContext("2d");
      if (seedContext) {
        seedContext.fillStyle = "#8080ff";
        seedContext.fillRect(0, 0, 1, 1);
      }
      const t = new THREE.Texture<TexImageSource>(seed);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.needsUpdate = true;
      texLoader.load(url, (loaded) => {
        if (disposed) {
          loaded.dispose();
          return;
        }
        t.image = loaded.image;
        t.needsUpdate = true;
        loaded.dispose();
      });
      return t;
    };
    const roughTex = loadFloorMap(FLOOR.roughnessMap);
    const normalTex = loadFloorMap(FLOOR.normalMap);
    const reflector = new Reflector(floorGeo, {
      clipBias: FLOOR.clipBias,
      textureWidth: FLOOR.textureSize,
      textureHeight: FLOOR.textureSize,
      color: new THREE.Color(FLOOR.tint),
      shader: {
        name: "SoftReflector",
        uniforms: {
          color: { value: null },
          tDiffuse: { value: null },
          textureMatrix: { value: null },
          tRough: { value: roughTex },
          tNormal: { value: normalTex },
          uMapRepeat: { value: FLOOR.mapRepeat },
          uBgColor: { value: bgColor.clone() },
          uRoughInfluence: { value: FLOOR.roughnessInfluence },
          uDistortion: { value: FLOOR.distortion },
          uFadeStart: { value: FLOOR.fadeStart },
          uFadeEnd: { value: FLOOR.fadeEnd },
        },
        vertexShader: REFLECTOR_VERT,
        fragmentShader: REFLECTOR_FRAG,
      },
    });
    reflector.position.y = FLOOR.y;
    reflector.rotation.x = -Math.PI / 2;
    scene.add(reflector);

    // Soften the mirror: after the Reflector renders its target each frame,
    // run a small separable gaussian over it (the drei mixBlur stand-in).
    const reflRT = reflector.getRenderTarget();
    const blurRT = reflRT.clone();
    const blurMat = new THREE.ShaderMaterial({
      vertexShader: BASIC_VERT,
      fragmentShader: BLUR_FRAG,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        tDiffuse: { value: null },
        uDelta: { value: new THREE.Vector2() },
      },
    });
    const blurQuad = new FullScreenQuad(blurMat);
    const texel = FLOOR.blurTexels / FLOOR.textureSize;
    const reflectorRender = reflector.onBeforeRender;
    reflector.onBeforeRender = (rnd, scn, cam, geo, mat, grp) => {
      reflectorRender.call(reflector, rnd, scn, cam, geo, mat, grp);
      const r = rnd as THREE.WebGLRenderer;
      const prevRT = r.getRenderTarget();
      for (let i = 0; i < FLOOR.blurPasses; i++) {
        blurMat.uniforms.tDiffuse.value = reflRT.texture;
        (blurMat.uniforms.uDelta.value as THREE.Vector2).set(texel, 0);
        r.setRenderTarget(blurRT);
        blurQuad.render(r);
        blurMat.uniforms.tDiffuse.value = blurRT.texture;
        (blurMat.uniforms.uDelta.value as THREE.Vector2).set(0, texel);
        r.setRenderTarget(reflRT);
        blurQuad.render(r);
      }
      r.setRenderTarget(prevRT);
    };

    // "Fake floor": the animated blue/gold glow pool under the truck.
    const fakeFloorMat = new THREE.ShaderMaterial({
      vertexShader: BASIC_VERT,
      fragmentShader: FAKE_FLOOR_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      uniforms: { uTime: { value: 0 } },
    });
    const fakeFloor = new THREE.Mesh(new THREE.PlaneGeometry(FAKE_FLOOR.size, FAKE_FLOOR.size), fakeFloorMat);
    fakeFloor.position.copy(FAKE_FLOOR.position);
    fakeFloor.rotation.x = FAKE_FLOOR.rotationX;
    fakeFloor.rotation.z = FAKE_FLOOR.rotationZ;
    scene.add(fakeFloor);

    /* ------------------------------- loaders ------------------------------ */
    const disposables: { dispose(): void }[] = [
      floorGeo, fakeFloorMat, fakeFloor.geometry,
      roughTex, normalTex, blurRT, blurMat, blurQuad,
    ];
    const lineMaterials: THREE.ShaderMaterial[] = [];
    const circleLines: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>[] = [];
    let renderStatic = () => {}; // re-render hook for reduced motion
    let fittedVehicle: THREE.Group | null = null;

    /* ----------------------- company destinations ----------------------- */
    const point = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
    const framePath = (width: number, height: number, z: number, base = 0) => [
      point(-width / 2, base, z),
      point(-width / 2, base + height, z),
      point(width / 2, base + height, z),
      point(width / 2, base, z),
    ];
    const groundCircle = (cx: number, cz: number, radius: number, segments = 28) =>
      Array.from({ length: segments + 1 }, (_, index) => {
        const angle = (index / segments) * Math.PI * 2;
        return point(cx + Math.cos(angle) * radius, 0.00012, cz + Math.sin(angle) * radius);
      });
    const verticalCircle = (cx: number, cy: number, cz: number, radius: number, segments = 24) =>
      Array.from({ length: segments + 1 }, (_, index) => {
        const angle = (index / segments) * Math.PI * 2;
        return point(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius, cz);
      });

    const createDestinationMesh = (
      paths: THREE.Vector3[][],
      hex: number,
      radius: number,
      pulse: boolean,
    ) => {
      const tubeGeometries = paths
        .filter((path) => path.length > 1)
        .map((path) => new THREE.TubeGeometry(
          new PolylineCurve(path),
          Math.max(12, (path.length - 1) * 6),
          radius,
          6,
          false,
        ));
      const geometry = mergeGeometries(tubeGeometries, false);
      tubeGeometries.forEach((item) => item.dispose());
      if (!geometry) return null;

      const color = new THREE.Color().setHex(hex, THREE.LinearSRGBColorSpace).multiplyScalar(1.35);
      const material = new THREE.ShaderMaterial({
        vertexShader: LINE_VERT,
        fragmentShader: LINE_FRAG,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        fog: true,
        lights: false,
        uniforms: THREE.UniformsUtils.merge([
          THREE.UniformsLib.fog,
          {
            uColor: { value: color },
            uTime: { value: 0 },
            uSize: { value: pulse ? 5 : 1 },
            uSpeed: { value: pulse ? 0.82 : 0.16 },
            uHideCorners: { value: false },
            uAlpha: { value: 0 },
          },
        ]),
      });
      const mesh = new THREE.Mesh(geometry, material);
      lineMaterials.push(material);
      disposables.push(geometry, material);
      return { mesh, material };
    };

    type DestinationRuntime = {
      id: (typeof DESTINATION_SPECS)[number]["id"];
      raw: number;
      group: THREE.Group;
      baseY: number;
      materials: THREE.ShaderMaterial[];
      roadMaterials: THREE.ShaderMaterial[];
      scanBeam?: THREE.Mesh;
    };
    const destinationRuntimes: DestinationRuntime[] = [];

    DESTINATION_SPECS.forEach((spec) => {
      const group = new THREE.Group();
      group.name = `destination_${spec.id}`;

      const cameraPoint = camCurve.getPoint(spec.scene);
      const focusPoint = lookCurve.getPoint(spec.scene);
      const forward = focusPoint.clone().sub(cameraPoint).setY(0).normalize();
      const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
      const center = focusPoint.clone().addScaledVector(right, DESTINATIONS.sideOffset * spec.side);
      center.y = 0.00015;
      group.position.copy(center);
      group.rotation.y = Math.atan2(cameraPoint.x - center.x, cameraPoint.z - center.z);
      group.visible = false;

      const structurePaths: THREE.Vector3[][] = [];
      const roadPaths: THREE.Vector3[][] = [];
      let scanBeamPath: THREE.Vector3[][] | null = null;

      if (spec.id === "fasttrack") {
        // Forecourt canopy + four repeatable service bays. The highway fans
        // into parallel operating lanes as the camera arrives.
        structurePaths.push(framePath(0.044, 0.015, -0.006));
        structurePaths.push([
          point(-0.022, 0.015, -0.006), point(-0.018, 0.018, 0.004),
          point(0.018, 0.018, 0.004), point(0.022, 0.015, -0.006),
        ]);
        [-0.0165, -0.0055, 0.0055, 0.0165].forEach((x) => {
          structurePaths.push([point(x, 0, -0.006), point(x, 0.012, -0.006)]);
          roadPaths.push([point(x * 0.35, 0.0001, 0.044), point(x, 0.0001, 0.01), point(x, 0.0001, -0.026)]);
        });
      } else if (spec.id === "autodata") {
        // Three scanner gates turn the road into a measured data grid.
        [-0.011, 0, 0.011].forEach((z, index) => {
          structurePaths.push(framePath(0.032 - index * 0.002, 0.017, z));
        });
        [-0.012, -0.004, 0.004, 0.012].forEach((x) => {
          roadPaths.push([point(x, 0.0001, 0.038), point(x, 0.0001, -0.03)]);
        });
        [-0.024, -0.012, 0, 0.012, 0.024].forEach((z) => {
          roadPaths.push([point(-0.018, 0.0001, z), point(0.018, 0.0001, z)]);
        });
        scanBeamPath = [[point(-0.017, 0.009, 0), point(0.017, 0.009, 0)]];
      } else if (spec.id === "axxion") {
        // A single claim enters, branches through routing logic, then resolves
        // into three approved endpoints.
        roadPaths.push([point(0, 0.0001, 0.042), point(0, 0.0001, 0.004)]);
        [-0.018, 0, 0.018].forEach((x) => {
          roadPaths.push([point(0, 0.0001, 0.004), point(x, 0.0001, -0.022)]);
          structurePaths.push(verticalCircle(x, 0.007, -0.022, 0.0042));
          structurePaths.push([point(x, 0.0001, -0.022), point(x, 0.003, -0.022)]);
        });
        structurePaths.push(verticalCircle(0, 0.009, 0.004, 0.005));
      } else if (spec.id === "pag-direct") {
        // A dealership facade frames three calm display loops: arrival turns
        // into presentation rather than another branching network.
        structurePaths.push(framePath(0.048, 0.016, -0.009));
        [-0.012, 0, 0.012].forEach((x) => {
          structurePaths.push([point(x, 0, -0.009), point(x, 0.016, -0.009)]);
          roadPaths.push(groundCircle(x, 0.008, 0.0065));
        });
        structurePaths.push([
          point(-0.024, 0.016, -0.009), point(-0.018, 0.019, 0.003),
          point(0.018, 0.019, 0.003), point(0.024, 0.016, -0.009),
        ]);
        roadPaths.push([point(0, 0.0001, 0.042), point(0, 0.0001, 0.016)]);
      } else {
        // Vicimus resolves the road into a connected lifecycle graph. Nodes
        // are deliberately few and legible instead of a generic particle fog.
        const nodes = [
          [-0.019, 0.007, 0.008], [-0.008, 0.015, -0.004], [0.006, 0.009, 0.006],
          [0.019, 0.017, -0.006], [-0.014, 0.022, -0.018], [0.012, 0.025, -0.02],
        ] as const;
        const links = [[0, 1], [0, 2], [1, 2], [1, 4], [2, 3], [2, 5], [3, 5]] as const;
        nodes.forEach(([x, y, z]) => structurePaths.push(verticalCircle(x, y, z, 0.0027)));
        links.forEach(([a, b]) => {
          const start = nodes[a];
          const end = nodes[b];
          structurePaths.push([
            point(start[0], start[1], start[2]),
            point(end[0], end[1], end[2]),
          ]);
        });
        roadPaths.push([point(0, 0.0001, 0.044), point(-0.008, 0.0001, 0.014), point(0.006, 0.0001, 0.006)]);
        nodes.slice(0, 4).forEach(([x, , z]) => {
          roadPaths.push([point(0.006, 0.0001, 0.006), point(x, 0.0001, z)]);
        });
      }

      const structure = createDestinationMesh(
        structurePaths,
        spec.accent,
        DESTINATIONS.structureRadius,
        false,
      );
      const road = createDestinationMesh(
        roadPaths,
        spec.accent,
        DESTINATIONS.roadRadius,
        true,
      );
      const materials: THREE.ShaderMaterial[] = [];
      const roadMaterials: THREE.ShaderMaterial[] = [];
      if (structure) {
        structure.mesh.name = `${spec.id}_architecture`;
        group.add(structure.mesh);
        materials.push(structure.material);
      }
      if (road) {
        road.mesh.name = `${spec.id}_road_transform`;
        group.add(road.mesh);
        materials.push(road.material);
        roadMaterials.push(road.material);
      }

      let scanBeam: THREE.Mesh | undefined;
      if (scanBeamPath) {
        const scan = createDestinationMesh(
          scanBeamPath,
          COLORS.lineWhite,
          DESTINATIONS.structureRadius * 1.15,
          false,
        );
        if (scan) {
          scanBeam = scan.mesh;
          scanBeam.name = "autodata_scan_beam";
          group.add(scanBeam);
          materials.push(scan.material);
        }
      }

      scene.add(group);
      destinationRuntimes.push({
        id: spec.id,
        raw: spec.raw,
        group,
        baseY: group.position.y,
        materials,
        roadMaterials,
        scanBeam,
      });
    });

    const projectedBounds = (object: THREE.Object3D, fitCamera: THREE.Camera) => {
      const box = new THREE.Box3().setFromObject(object);
      const low = box.min;
      const high = box.max;
      const corners = [
        new THREE.Vector3(low.x, low.y, low.z), new THREE.Vector3(low.x, low.y, high.z),
        new THREE.Vector3(low.x, high.y, low.z), new THREE.Vector3(low.x, high.y, high.z),
        new THREE.Vector3(high.x, low.y, low.z), new THREE.Vector3(high.x, low.y, high.z),
        new THREE.Vector3(high.x, high.y, low.z), new THREE.Vector3(high.x, high.y, high.z),
      ].map((point) => point.project(fitCamera));
      return {
        width: Math.max(...corners.map((point) => point.x)) - Math.min(...corners.map((point) => point.x)),
        height: Math.max(...corners.map((point) => point.y)) - Math.min(...corners.map((point) => point.y)),
        center: box.getCenter(new THREE.Vector3()).project(fitCamera),
        worldCenter: box.getCenter(new THREE.Vector3()),
      };
    };

    const fitVehicleToOpeningFrame = () => {
      if (!fittedVehicle) return;

      // Always derive from the authored pose so repeated resizes cannot
      // accumulate scale or position errors.
      fittedVehicle.position.copy(SUV.position);
      fittedVehicle.scale.setScalar(SUV.length);
      fittedVehicle.updateMatrixWorld(true);

      const fitCamera = new THREE.PerspectiveCamera(fovForWidth(W), W / H, CAMERA.near, CAMERA.far);
      fitCamera.position.copy(toVec(CAM_POINTS[0]));
      fitCamera.setViewOffset(W, H, -CAMERA.viewShiftX * W, 0, W, H);
      fitCamera.lookAt(toVec(LOOK_POINTS[0]));
      fitCamera.updateProjectionMatrix();
      fitCamera.updateMatrixWorld(true);

      const mobile = W <= SUV_FIT.mobileBreakpoint;
      const targetWidth = mobile ? SUV_FIT.mobileWidthNdc : SUV_FIT.desktopWidthNdc;
      const targetHeight = mobile ? SUV_FIT.mobileHeightNdc : SUV_FIT.desktopHeightNdc;
      const initial = projectedBounds(fittedVehicle, fitCamera);
      const scaleFactor = Math.min(targetWidth / initial.width, targetHeight / initial.height) * SUV_FIT.safety;
      fittedVehicle.scale.multiplyScalar(THREE.MathUtils.clamp(scaleFactor, 0.2, 2.5));
      fittedVehicle.updateMatrixWorld(true);

      const fitted = projectedBounds(fittedVehicle, fitCamera);
      const desiredX = mobile ? SUV_FIT.mobileCenterX : SUV_FIT.desktopCenterX;
      const forward = new THREE.Vector3();
      fitCamera.getWorldDirection(forward);
      const depth = Math.max(
        CAMERA.near * 2,
        fitted.worldCenter.clone().sub(fitCamera.position).dot(forward),
      );
      const halfHeight = Math.tan(THREE.MathUtils.degToRad(fitCamera.fov * 0.5)) * depth;
      const halfWidth = halfHeight * fitCamera.aspect;
      const right = new THREE.Vector3().setFromMatrixColumn(fitCamera.matrixWorld, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(fitCamera.matrixWorld, 1);
      fittedVehicle.position.addScaledVector(right, (desiredX - fitted.center.x) * halfWidth);
      fittedVehicle.position.addScaledVector(up, (SUV_FIT.centerY - fitted.center.y) * halfHeight);
      fittedVehicle.updateMatrixWorld(true);
    };

    new GLTFLoader().load(
      ASSETS.suv,
      (gltf) => {
        if (disposed) return;
        // normalized GLB (car length 1, front +Z, on y=0) → world placement
        const vehicle = new THREE.Group();
        fittedVehicle = vehicle;
        vehicle.position.copy(SUV.position);
        vehicle.rotation.y = SUV.rotationY;
        vehicle.scale.setScalar(SUV.length);

        // solid-black silhouette, exactly like the truck body
        const bodyMat = new THREE.MeshBasicMaterial({ color: COLORS.vehicle });
        disposables.push(bodyMat);

        // neon color: same boosted-blue path as the truck's blue line-art
        const uCol = new THREE.Color().setHex(COLORS.lineBlue, THREE.LinearSRGBColorSpace);
        const boost = TUBES.detailBoostBlue;
        uCol.setRGB(
          boost.k * uCol.r ** boost.gamma,
          boost.k * uCol.g ** boost.gamma,
          boost.k * uCol.b ** boost.gamma,
        );

        // tube radius is authored in world units; the group scales GLB units
        const tubeRadius = TUBES.detailRadius / SUV.length;
        const tubeGeos: THREE.BufferGeometry[] = [];
        gltf.scene.updateMatrixWorld(true);
        gltf.scene.traverse((o) => {
          if (!(o as THREE.Mesh).isMesh) return;
          const m = o as THREE.Mesh;
          m.material = bodyMat;
          disposables.push(m.geometry);
          // FEATURE edges only (creases sharper than the threshold) — never
          // the full triangulation. This is what keeps it sparse and clean.
          const edges = new THREE.EdgesGeometry(m.geometry, SUV.edgeThresholdDeg);
          for (const pts of chainEdgeSegments(edges)) {
            let len = 0;
            for (let i = 1; i < pts.length; i++) len += pts[i].distanceTo(pts[i - 1]);
            if (len < SUV.minChainLength) continue; // drop specks, stay sparse
            for (const p of pts) p.applyMatrix4(m.matrixWorld);
            tubeGeos.push(
              new THREE.TubeGeometry(
                new PolylineCurve(pts),
                Math.max(pts.length - 1, 1),
                tubeRadius,
                TUBES.radialSegments,
                false,
              ),
            );
          }
          edges.dispose();
        });

        if (tubeGeos.length) {
          const merged = mergeGeometries(tubeGeos, false);
          tubeGeos.forEach((g) => g.dispose());
          if (merged) {
            // same shader/uniform shape as the truck's non-road detail lines
            const mat = new THREE.ShaderMaterial({
              vertexShader: LINE_VERT,
              fragmentShader: LINE_FRAG,
              transparent: true,
              depthTest: true,
              depthWrite: true,
              fog: true,
              lights: false,
              uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib.fog,
                {
                  uColor: { value: uCol },
                  uTime: { value: 0 },
                  uSize: { value: 1 },
                  uSpeed: { value: 0 },
                  uHideCorners: { value: false },
                  uAlpha: { value: 1 },
                },
              ]),
            });
            const wire = new THREE.Mesh(merged, mat);
            wire.name = "suv_feature_edges";
            vehicle.add(wire);
            lineMaterials.push(mat);
            disposables.push(merged, mat);
          }
        }

        vehicle.add(gltf.scene);
        scene.add(vehicle);
        fitVehicleToOpeningFrame();
        renderStatic();
      },
      undefined,
      (e) => {
        document.documentElement.classList.add("webgl-unavailable");
        console.error("[NeonJourney] vehicle asset failed", e);
      },
    );

    new OBJLoader().load(
      ASSETS.lines,
      (obj) => {
        if (disposed) return;
        const container = new THREE.Group();
        container.position.copy(LINES_OFFSET);

        obj.children.forEach((child) => {
          const line = child as THREE.LineSegments;
          const attr = line.geometry?.attributes?.position;
          if (!attr) return;
          const name = child.name.toLowerCase();
          // old Madar truck line-art — replaced by the SUV's feature edges
          if (name.startsWith("truck_")) return;
          const roadish =
            name.includes("road") || name.includes("graphic") || name.includes("integration") || name.includes("payments");
          const baseHex = name.includes("white")
            ? COLORS.lineWhite
            : name.includes("blue")
              ? COLORS.lineBlue
              : COLORS.lineOrange;

          // OBJ polylines arrive as LineSegments pairs — rebuild the ordered
          // point list (drop consecutive duplicates), scaled 1/7.7.
          const raw = attr.array as Float32Array;
          const pts: THREE.Vector3[] = [];
          for (let i = 0; i < raw.length; i += 3) {
            const v = new THREE.Vector3(raw[i], raw[i + 1], raw[i + 2]).multiplyScalar(WORLD_SCALE);
            const prev = pts[pts.length - 1];
            if (!prev || !prev.equals(v)) pts.push(v);
          }
          if (pts.length < 2) return;

          const curve = new PolylineCurve(pts);
          const len = curve.getLength();
          const sizeUnits = Math.round(100 * len); // uSize = this / 2

          let colorHex = baseHex;
          let radius: number;
          let tubularSegments: number;
          let pulse = false;
          let hideCorners = false;
          let boosted = false;
          if (roadish) {
            colorHex = darkenHex(baseHex, TUBES.roadDarken);
            radius = name.includes("thin") ? TUBES.thinRadius : TUBES.roadRadius;
            tubularSegments = sizeUnits < 10 ? TUBES.roadSegmentsShort : TUBES.roadSegments;
            pulse = true;
            hideCorners = true;
          } else {
            radius = TUBES.detailRadius;
            tubularSegments = pts.length - 1;
            boosted = true;
          }

          const uCol = new THREE.Color().setHex(colorHex, THREE.LinearSRGBColorSpace);
          if (boosted) {
            const spec =
              baseHex === COLORS.lineWhite
                ? TUBES.detailBoostWhite
                : baseHex === COLORS.lineBlue
                  ? TUBES.detailBoostBlue
                  : TUBES.detailBoostOrange;
            uCol.setRGB(
              spec.k * uCol.r ** spec.gamma,
              spec.k * uCol.g ** spec.gamma,
              spec.k * uCol.b ** spec.gamma,
            );
          }

          const geo = new THREE.TubeGeometry(curve, tubularSegments, radius, TUBES.radialSegments, false);
          const mat = new THREE.ShaderMaterial({
            vertexShader: LINE_VERT,
            fragmentShader: LINE_FRAG,
            transparent: true,
            depthTest: true,
            depthWrite: true,
            fog: true,
            lights: false,
            uniforms: THREE.UniformsUtils.merge([
              THREE.UniformsLib.fog,
              {
                uColor: { value: uCol },
                uTime: { value: 0 },
                uSize: { value: sizeUnits / 2 },
                uSpeed: { value: pulse ? 1 : 0 },
                uHideCorners: { value: hideCorners },
                uAlpha: { value: 1 },
              },
            ]),
          });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.name = name;
          container.add(mesh);
          lineMaterials.push(mat);
          disposables.push(geo, mat);
          if (name.includes("crossroad_orange_circle_")) {
            mat.uniforms.uAlpha.value = 0; // fades in on scroll
            circleLines.push(mesh as THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial>);
          }
        });

        scene.add(container);
        renderStatic();
      },
      undefined,
      (e) => {
        document.documentElement.classList.add("webgl-unavailable");
        console.error("[NeonJourney] road asset failed", e);
      },
    );

    /* ------------------------------- scroll ------------------------------- */
    let timelineProgress = 0;
    let rawProgress = 0;
    const journeyTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        timelineProgress = self.progress;
        rawProgress = journeyProgress(timelineProgress);
      },
    });
    timelineProgress = journeyTrigger.progress;
    rawProgress = journeyProgress(timelineProgress);

    let smoothed = reduce ? REDUCED_MOTION_PROGRESS : rawProgress;
    const progressVel = { v: 0 };

    /* ---------------------------- camera update --------------------------- */
    const startTime = performance.now();
    const posV = new THREE.Vector3();
    const tgtV = new THREE.Vector3();
    const updateCamera = (progress: number, now: number) => {
      camCurve.getPoint(progress, posV);
      lookCurve.getPoint(progress, tgtV);
      if (!reduce && CAMERA.introMs > 0) {
        // intro sweep from the recovered preloader pose into the path
        const introT = THREE.MathUtils.clamp((now - startTime) / CAMERA.introMs, 0, 1);
        if (introT < 1) {
          const k = sineInOut(introT);
          posV.lerpVectors(CAMERA.introFrom.position, posV, k);
          tgtV.lerpVectors(CAMERA.introFrom.target, tgtV, k);
        }
      }
      camera.position.copy(posV);
      camera.lookAt(tgtV);
    };

    const updateUniforms = (elapsedMs: number, progress: number) => {
      const t = elapsedMs / 500;
      for (const m of lineMaterials) m.uniforms.uTime.value = t;
      fakeFloorMat.uniforms.uTime.value = t;

      destinationRuntimes.forEach((destination) => {
        const visibility = destinationVisibility(timelineProgress, destination.raw);
        destination.group.visible = visibility > 0.002;
        const responsiveScale = W <= SUV_FIT.mobileBreakpoint ? DESTINATIONS.mobileScale : 1;
        const arrivalScale = THREE.MathUtils.lerp(0.94, 1, visibility);
        destination.group.scale.setScalar(responsiveScale * arrivalScale);
        destination.group.position.y = destination.baseY - (1 - visibility) * 0.0025;
        destination.materials.forEach((material) => {
          material.uniforms.uAlpha.value = visibility;
        });
        destination.roadMaterials.forEach((material) => {
          material.uniforms.uSpeed.value = 0.48 + visibility * 0.72;
        });
        if (destination.scanBeam) {
          destination.scanBeam.position.z = Math.sin(t * 0.38) * 0.0105;
        }
      });

      circleLines.forEach((mesh, i) => {
        const s = 0.01 * Math.floor(i / 4);
        mesh.material.uniforms.uAlpha.value = THREE.MathUtils.clamp(
          (progress - (0.72 + s)) / 0.04,
          0,
          1,
        );
      });
      const accent = journeyAccent(timelineProgress, accentColor);
      const gradient = postPass.uniforms.uGradient1Color.value as THREE.Vector3;
      gradient.set(accent.r * 0.34, accent.g * 0.34, accent.b * 0.42);
    };

    /* ------------------------------- resize ------------------------------- */
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.fov = fovForWidth(W);
      applyViewShift();
      camera.updateProjectionMatrix();
      renderPixelRatio = targetPixelRatio();
      renderer.setPixelRatio(renderPixelRatio);
      composer.setPixelRatio(renderPixelRatio);
      renderer.setSize(W, H);
      composer.setSize(W, H);
      fitVehicleToOpeningFrame();
      const pr = renderer.getPixelRatio();
      (postPass.uniforms.uResolution.value as THREE.Vector2).set(W * pr, H * pr);
      ScrollTrigger.refresh();
      if (reduce) renderStatic();
    };

    /* -------------------------------- loop -------------------------------- */
    let raf = 0;
    let running = false;
    let last = performance.now();
    const frame = () => {
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      smoothed = smoothDamp(smoothed, rawProgress, progressVel, CAMERA.smoothTime, dt);
      updateCamera(smoothed, now);
      updateUniforms(now - startTime, smoothed);
      composer.render();
      raf = requestAnimationFrame(frame);
    };

    const startLoop = () => {
      if (running || reduce || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };
    const onVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    renderStatic = () => {
      if (!reduce || disposed) return;
      updateCamera(REDUCED_MOTION_PROGRESS, startTime + CAMERA.introMs);
      updateUniforms(1200, REDUCED_MOTION_PROGRESS);
      composer.render();
    };

    if (reduce) {
      renderStatic();
    } else {
      startLoop();
    }
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibilityChange);

    /* ------------------------------- cleanup ------------------------------ */
    return () => {
      disposed = true;
      stopLoop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      journeyTrigger.kill();
      reflector.dispose();
      disposables.forEach((d) => d.dispose());
      composer.dispose();
      renderer.forceContextLoss();
      renderer.dispose();
      document.documentElement.classList.remove("webgl-unavailable");
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="journey-webgl fixed inset-0 z-0" aria-hidden />;
}
