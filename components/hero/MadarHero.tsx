"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

/* WAG hero = the ORIGINAL Madar scene (scene-16.obj road + light-trails) and
   ORIGINAL camera fly-through (camera-4.glb) — reused verbatim from the salvage.
   The only swap is the truck → our simplified car, seated on the same road where
   the truck stood (wheels dropped to the truck's ground line). */

const BG = 0x000835;
const COL_BLUE = new THREE.Color("#2e8fef");
const COL_CYAN = new THREE.Color("#28c6ff");
const COL_ORANGE = new THREE.Color("#ff6340");
const COL_GOLD = new THREE.Color("#ffcf47");
const COL_WHITE = new THREE.Color("#cfe0ff");

const CAR_ROT_Y = 0; // fine-tune the car's heading on the road

// simplified glowing-line silhouettes of UAE landmarks (normalised: x centred, y 0→1)
const BURJ_KHALIFA: [number, number][] = [
  [-0.16, 0], [-0.16, 0.24], [-0.115, 0.24], [-0.115, 0.44], [-0.08, 0.44], [-0.08, 0.62],
  [-0.05, 0.62], [-0.05, 0.78], [-0.028, 0.78], [-0.014, 0.9], [0, 1.0],
  [0.014, 0.9], [0.028, 0.78], [0.05, 0.78], [0.05, 0.62], [0.08, 0.62], [0.08, 0.44],
  [0.115, 0.44], [0.115, 0.24], [0.16, 0.24], [0.16, 0],
];
const BURJ_AL_ARAB: [number, number][] = [
  [-0.03, 0], [-0.03, 1.0], [0.02, 0.96], [0.12, 0.78], [0.2, 0.52], [0.22, 0.28],
  [0.16, 0.1], [0.04, 0.01], [-0.03, 0],
];
// Aldar HQ = a disc on two legs (Abu Dhabi); disc points generated at build time
const ALDAR_DISC: [number, number][] = Array.from({ length: 41 }, (_, i) => {
  const a = (i / 40) * Math.PI * 2;
  return [Math.cos(a) * 0.34, 0.5 + Math.sin(a) * 0.34];
});
const ALDAR_LEGS: [number, number][] = [
  [-0.16, 0], [-0.09, 0.28], [0.09, 0.28], [0.16, 0], [-0.16, 0],
];

// each road trail gets a two-colour gradient that flows along its length (Madar look)
function gradientFor(name: string): [THREE.Color, THREE.Color] {
  const n = name.toLowerCase();
  if (n.includes("orange")) return [COL_ORANGE, COL_GOLD];
  if (n.includes("white")) return [COL_CYAN, COL_WHITE];
  return [COL_BLUE, COL_CYAN];
}

export function MadarHero({ children }: { children?: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const track = trackRef.current;
    if (!mount || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = mount.clientWidth || window.innerWidth;
    let H = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(BG);
    scene.fog = new THREE.Fog(BG, 3, 45);

    const camera = new THREE.PerspectiveCamera(42, W / H, 0.01, 100);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    mount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(W, H), 0.5, 0.45, 0.0));

    const group = new THREE.Group();
    scene.add(group);

    let showcaseCenter: THREE.Vector3 | null = null;
    let showcaseRadius = 1;
    let carReadyAt = 0; // timestamp for the intro reveal
    const lineMats: LineMaterial[] = []; // car's fat-line materials (need resolution)
    const roadMats: LineMaterial[] = []; // road's thick gradient-line materials

    // convert a thin obj polyline into a THICK glowing line with a colour
    // gradient baked along its length, and an animated flow offset (Madar road)
    const toFatLine = (line: THREE.Line, a: THREE.Color, b: THREE.Color) => {
      const src = line.geometry.attributes.position as THREE.BufferAttribute;
      const n = src.count;
      const m = line.matrixWorld;
      const pos: number[] = [];
      const col: number[] = [];
      const v = new THREE.Vector3();
      const c = new THREE.Color();
      for (let i = 0; i < n; i++) {
        v.fromBufferAttribute(src, i).applyMatrix4(m);
        pos.push(v.x, v.y, v.z);
        c.copy(a).lerp(b, n > 1 ? i / (n - 1) : 0);
        col.push(c.r, c.g, c.b);
      }
      const geo = new LineGeometry();
      geo.setPositions(pos);
      geo.setColors(col);
      const thin = line.name.toLowerCase().includes("thin");
      const mat = new LineMaterial({
        linewidth: thin ? 1.6 : 2.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      mat.resolution.set(W, H);
      roadMats.push(mat);
      return new Line2(geo, mat);
    };

    // hotspot labels pinned to the car — WAG's group standard: service · data · retail
    const hotspots = [
      { off: new THREE.Vector3(-0.26, 0.12, 0.05), label: "Service" },
      { off: new THREE.Vector3(0.0, 0.21, 0.0), label: "Data" },
      { off: new THREE.Vector3(0.28, 0.0, -0.05), label: "Retail" },
    ].map((h) => {
      const el = document.createElement("div");
      el.style.cssText =
        "position:absolute;left:0;top:0;pointer-events:none;white-space:nowrap;opacity:0;" +
        "display:flex;align-items:center;gap:8px;z-index:5;" +
        "font:600 10px/1.4 var(--font-mono,ui-monospace,monospace);letter-spacing:0.18em;" +
        "text-transform:uppercase;color:rgba(255,255,255,0.82);";
      el.innerHTML =
        '<span style="width:6px;height:6px;border-radius:50%;background:#2e8fef;' +
        'box-shadow:0 0 9px #2e8fef;flex:none"></span>' +
        h.label;
      mount.appendChild(el);
      return { off: h.off, el, world: new THREE.Vector3() };
    });

    // UAE skyline backdrop: glowing line silhouettes in the road's palette, colour-shifting
    const buildingMats: THREE.LineBasicMaterial[] = [];
    const buildBackdrop = (groundY: number, unit: number, anchor: THREE.Vector3) => {
      const backdrop = new THREE.Group();
      const glow = (pts: [number, number][], base: THREE.Color, phase: number) => {
        const m = new THREE.LineBasicMaterial({
          color: base.clone(),
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        m.userData = { a: base.clone(), b: COL_ORANGE.clone(), phase };
        buildingMats.push(m);
        const g = new THREE.BufferGeometry().setFromPoints(
          pts.map(([x, y]) => new THREE.Vector3(x, y, 0)),
        );
        return new THREE.Line(g, m);
      };
      const put = (line: THREE.Line, x: number, z: number, w: number, h: number) => {
        line.position.set(anchor.x + x, groundY - unit * 0.25, anchor.z + z);
        line.scale.set(w, h, 1);
        backdrop.add(line);
      };
      // one clean horizon line: three landmarks, evenly spread, same depth
      const Z = -unit * 12;
      put(glow(BURJ_KHALIFA, COL_CYAN, 0), -unit * 3.2, Z, unit * 2.6, unit * 5.2);
      put(glow(ALDAR_DISC, COL_BLUE, 4.0), unit * 0.0, Z, unit * 2.6, unit * 2.6);
      put(glow(ALDAR_LEGS, COL_BLUE, 4.0), unit * 0.0, Z, unit * 2.6, unit * 2.6);
      put(glow(BURJ_AL_ARAB, COL_GOLD, 2.1), unit * 1.9, Z, unit * 2.4, unit * 3.4);
      group.add(backdrop);
    };

    // --- the ORIGINAL Madar scene: road + light-trails, truck hidden ---
    new OBJLoader().load("/webgl-lines/scene-16.obj", (obj) => {
      obj.updateMatrixWorld(true);
      const truckLines: THREE.Object3D[] = [];
      const roadFat = new THREE.Group();
      obj.traverse((ch) => {
        const line = ch as THREE.Line;
        if (!line.isLine) return;
        if (/^TRUCK_/i.test(ch.name)) {
          truckLines.push(ch);
          line.visible = false;
          return;
        }
        const [a, b] = gradientFor(ch.name);
        roadFat.add(toFatLine(line, a, b));
        line.visible = false; // hide the thin original; the fat version replaces it
      });
      group.add(obj);
      group.add(roadFat);
      if (truckLines.length === 0) return;

      // where the truck stood — reuse it to seat the car on the same road
      const truckBox = new THREE.Box3();
      truckLines.forEach((l) => truckBox.union(new THREE.Box3().setFromObject(l)));
      truckLines.forEach((l) => (l.visible = false));
      const tSize = truckBox.getSize(new THREE.Vector3());
      const tCtr = truckBox.getCenter(new THREE.Vector3());

      const wire = new THREE.Group();
      const addPart = (m: THREE.Object3D) => {
        const mesh = m as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;
        const nm = (mesh.name || "").toLowerCase();
        if (/interior|seat|emblem|plate/.test(nm)) return; // drop clutter, keep steering
        const isWheel = nm.includes("wheel") && !nm.includes("steering");
        const isLight = nm.includes("light");
        const geo = mesh.geometry.clone();
        geo.applyMatrix4(mesh.matrixWorld);
        wire.add(
          new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({
              color: BG,
              polygonOffset: true,
              polygonOffsetFactor: 1.5,
              polygonOffsetUnits: 1.5,
            }),
          ),
        );
        // higher threshold = fewer internal lines → calmer, less crowded car
        const edges = new THREE.EdgesGeometry(geo, isLight ? 24 : 38);
        const lsg = new LineSegmentsGeometry().fromEdgesGeometry(edges);
        // dimmer lines so the vibrant road leads, not the car
        const op = isWheel ? 0.22 : isLight ? 0.34 : 0.3;
        const mat = new LineMaterial({
          color: isWheel || isLight ? COL_ORANGE : COL_BLUE,
          linewidth: isWheel ? 0.9 : 1.1, // screen pixels
          transparent: true,
          opacity: op,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        mat.userData.baseOpacity = op;
        mat.resolution.set(W, H);
        lineMats.push(mat);
        wire.add(new LineSegments2(lsg, mat));
      };

      new GLTFLoader().load("/webgl-lines/car-simplified.glb", (g) => {
        g.scene.updateMatrixWorld(true);
        g.scene.traverse(addPart);

        // centre the car at its own origin
        const wb = new THREE.Box3().setFromObject(wire);
        const wSize = wb.getSize(new THREE.Vector3());
        const wCtr = wb.getCenter(new THREE.Vector3());
        wire.position.sub(wCtr);

        const scale = Math.max(tSize.x, tSize.z) / Math.max(wSize.x, wSize.z || 1) || 1;
        const holder = new THREE.Group();
        holder.add(wire);
        holder.scale.setScalar(scale);
        // seat on the road: X/Z at the truck's spot, wheels dropped to the truck's ground line
        holder.position.set(tCtr.x, truckBox.min.y + (wSize.y * scale) / 2, tCtr.z);
        holder.rotation.y = CAR_ROT_Y;
        group.add(holder);

        const fb = new THREE.Box3().setFromObject(holder);
        showcaseCenter = fb.getCenter(new THREE.Vector3());
        showcaseRadius = fb.getSize(new THREE.Vector3()).length();
        carReadyAt = performance.now();
        buildBackdrop(truckBox.min.y, showcaseRadius, tCtr);
      });
    });

    // --- the ORIGINAL camera fly-through (10 position + 10 look-at waypoints) ---
    let posCurve: THREE.CatmullRomCurve3 | null = null;
    let tgtCurve: THREE.CatmullRomCurve3 | null = null;
    new GLTFLoader().load("/webgl-lines/camera-4.glb", (gltf) => {
      gltf.scene.updateMatrixWorld(true);
      const posNodes: THREE.Object3D[] = [];
      const tgtNodes: THREE.Object3D[] = [];
      gltf.scene.traverse((n) => {
        if (/camera_position_\d+/i.test(n.name)) posNodes.push(n);
        else if (/camera_target_\d+/i.test(n.name)) tgtNodes.push(n);
      });
      const idx = (s: string) => parseInt(s.match(/_(\d+)$/)?.[1] ?? "0", 10);
      posNodes.sort((a, b) => idx(a.name) - idx(b.name));
      tgtNodes.sort((a, b) => idx(a.name) - idx(b.name));
      const pos = posNodes.map((n) => n.getWorldPosition(new THREE.Vector3()));
      const tgt = tgtNodes.map((n) => n.getWorldPosition(new THREE.Vector3()));
      if (pos.length > 1 && tgt.length > 1) {
        posCurve = new THREE.CatmullRomCurve3(pos);
        tgtCurve = new THREE.CatmullRomCurve3(tgt);
      }
    });

    // --- scroll → progress ---
    let progress = reduce ? 0.35 : 0;
    const computeProgress = () => {
      const rect = track.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    };

    let raf = 0;
    const tmpT = new THREE.Vector3();
    const heroPos = new THREE.Vector3();
    const heroTgt = new THREE.Vector3();
    const curveP = new THREE.Vector3();
    const curveT = new THREE.Vector3();
    const clamp = THREE.MathUtils.clamp;
    const smooth = THREE.MathUtils.smoothstep;
    const frame = () => {
      const p = reduce ? 0 : progress;
      // intro reveal: the car's lines fade up as it materialises on the road
      let introT = 0;
      if (carReadyAt) {
        const t = reduce ? 1 : clamp((performance.now() - carReadyAt) / 1400, 0, 1);
        introT = 1 - Math.pow(1 - t, 3);
        for (const m of lineMats) m.opacity = (m.userData.baseOpacity as number) * introT;
      }
      // colour-shifting skyline, echoing the road's blue↔orange flow
      if (buildingMats.length) {
        const now = performance.now() * 0.0005;
        for (const m of buildingMats) {
          const k = 0.5 + 0.5 * Math.sin(now + (m.userData.phase as number));
          m.color.copy(m.userData.a as THREE.Color).lerp(m.userData.b as THREE.Color, k * 0.5);
          m.opacity = 0.5 * introT;
        }
      }
      if (showcaseCenter) {
        // hero framing at rest, easing into the original camera path as you scroll
        const ang = 0.62 + Math.sin(performance.now() * 0.00016) * 0.1;
        const r = showcaseRadius * 1.95; // further back → smaller, calmer car
        heroPos.set(
          showcaseCenter.x + Math.sin(ang) * r,
          showcaseCenter.y + showcaseRadius * 0.14,
          showcaseCenter.z + Math.cos(ang) * r,
        );
        // aim above-and-right of the car so it sits lower-left, clear of the headline
        heroTgt.set(
          showcaseCenter.x + showcaseRadius * 0.34,
          showcaseCenter.y + showcaseRadius * 0.18,
          showcaseCenter.z,
        );
        const blend = posCurve ? smooth(p, 0.03, 0.32) : 0;
        if (posCurve && tgtCurve && blend > 0) {
          posCurve.getPointAt(clamp(p, 0, 1), curveP);
          tgtCurve.getPointAt(clamp(p, 0, 1), curveT);
          camera.position.lerpVectors(heroPos, curveP, blend);
          tmpT.copy(heroTgt).lerp(curveT, blend);
          camera.lookAt(tmpT);
        } else {
          camera.position.copy(heroPos);
          camera.lookAt(heroTgt);
        }
      } else if (posCurve && tgtCurve) {
        posCurve.getPointAt(clamp(p, 0, 1), camera.position);
        tgtCurve.getPointAt(clamp(p, 0, 1), tmpT);
        camera.lookAt(tmpT);
      }

      // pin hotspot labels to the car; fade in with the reveal, out as we drive off
      if (showcaseCenter) {
        const labelVis = introT * (1 - smooth(p, 0.0, 0.18));
        for (const hs of hotspots) {
          hs.world.copy(hs.off).multiplyScalar(showcaseRadius).add(showcaseCenter).project(camera);
          if (hs.world.z < 1 && labelVis > 0.01) {
            hs.el.style.transform = `translate(${(hs.world.x * 0.5 + 0.5) * W}px, ${(-hs.world.y * 0.5 + 0.5) * H}px)`;
            hs.el.style.opacity = String(labelVis);
          } else {
            hs.el.style.opacity = "0";
          }
        }
      }

      composer.render();
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      W = mount.clientWidth;
      H = mount.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
      composer.setSize(W, H);
      lineMats.forEach((m) => m.resolution.set(W, H));
      roadMats.forEach((m) => m.resolution.set(W, H));
    };

    computeProgress();
    frame();
    window.addEventListener("scroll", computeProgress, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", computeProgress);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      composer.dispose();
      hotspots.forEach((h) => h.el.remove());
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section ref={trackRef} className="relative" style={{ height: "400vh" }}>
      <div className="sticky top-0 h-svh w-full overflow-hidden bg-[#000835]">
        <div ref={mountRef} className="absolute inset-0" aria-hidden />
        <div className="relative z-10 flex h-full flex-col">{children}</div>
      </div>
    </section>
  );
}
