import * as THREE from "three";

/**
 * The journey map — single source of truth for the scroll-driven flight.
 *
 * World layout: the voyage travels along -Z. Scroll progress p ∈ [0,1]
 * drives the camera and rocket along keyframed paths through the scene.
 */

export const TOTAL_PAGES = 9; // page height = TOTAL_PAGES * 100vh

export const SECTIONS = [
  { id: "hero", label: "Home", range: [0.0, 0.12] },
  { id: "launch", label: "Launch", range: [0.12, 0.22] },
  { id: "about", label: "About", range: [0.22, 0.4] },
  { id: "skills", label: "Skills", range: [0.4, 0.56] },
  { id: "projects", label: "Projects", range: [0.56, 0.78] },
  { id: "contact", label: "Contact", range: [0.78, 1.0] },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Landmark positions — everything in the scene anchors to these. */
export const ABOUT_PLANET = {
  position: new THREE.Vector3(-24, 5, -70),
  radius: 11,
};

export const SKILLS_CENTER = new THREE.Vector3(9, -2, -120);

export const PROJECTS_PLANET = {
  position: new THREE.Vector3(-4, -3, -186),
  radius: 13,
  ringInner: 16,
  ringOuter: 30,
};

export const CONTACT_SUN = {
  position: new THREE.Vector3(28, 9, -262),
  radius: 7,
};

/** Shared tilt for the projects ring plane + orbiting cards. */
export const PROJECTS_RING_TILT = new THREE.Euler(0.45, 0, 0.08);

/* ------------------------------------------------------------------ */
/* Keyframed paths                                                     */
/* ------------------------------------------------------------------ */

type CamKey = {
  p: number;
  pos: [number, number, number];
  tgt: [number, number, number];
  fov: number;
};

const CAMERA_KEYS: CamKey[] = [
  { p: 0.0, pos: [0, 0.4, 10], tgt: [0, 0.7, 0], fov: 45 },
  { p: 0.08, pos: [0, 0.7, 9.2], tgt: [0, 0.7, 0], fov: 46 },
  { p: 0.14, pos: [0, 2.4, 7.8], tgt: [0, 0.6, -5], fov: 50 },
  { p: 0.22, pos: [0, 1.6, 1.5], tgt: [0, 0.2, -16], fov: 55 },
  { p: 0.3, pos: [-5, 2.5, -36], tgt: [-17, 4, -62], fov: 55 },
  { p: 0.38, pos: [-3, 2.5, -64], tgt: [-22, 5, -82], fov: 52 },
  { p: 0.46, pos: [3, -1, -96], tgt: [11, -2, -121], fov: 52 },
  { p: 0.54, pos: [8.5, -2, -127], tgt: [7, -1.5, -148], fov: 52 },
  { p: 0.62, pos: [16, 9, -138], tgt: [-4, -3, -186], fov: 50 },
  { p: 0.71, pos: [32, 8, -157], tgt: [-4, -2, -186], fov: 48 },
  { p: 0.78, pos: [16, 3, -197], tgt: [14, 5, -231], fov: 50 },
  { p: 0.9, pos: [10, 3.5, -215], tgt: [36, 10, -262], fov: 46 },
  { p: 1.0, pos: [13, 4.5, -226], tgt: [36, 10, -262], fov: 44 },
];

type RocketKey = { p: number; pos: [number, number, number] };

/** Rocket path — stays ahead of the camera, threads past the landmarks. */
const ROCKET_KEYS: RocketKey[] = [
  { p: 0.0, pos: [0, 0, 0] },
  { p: 0.12, pos: [0, 0.3, -0.5] },
  { p: 0.22, pos: [0, -0.3, -11] },
  { p: 0.3, pos: [-10, 2.5, -52] },
  { p: 0.38, pos: [-9, 3, -74] },
  { p: 0.46, pos: [6, -2.8, -107] },
  { p: 0.54, pos: [7.5, -2, -138] },
  { p: 0.62, pos: [6, 2, -156] },
  { p: 0.71, pos: [14, 4, -172] },
  { p: 0.78, pos: [15, 4, -213] },
  { p: 0.9, pos: [16, 6, -240] },
  { p: 1.0, pos: [19, 7, -248] },
];

/* ------------------------------------------------------------------ */
/* Sampling helpers                                                    */
/* ------------------------------------------------------------------ */

function buildCurve(keys: { p: number; pos: [number, number, number] }[]) {
  const pts = keys.map((k) => new THREE.Vector3(...k.pos));
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal", 0.5);
  const stops = keys.map((k) => k.p);
  return { curve, stops };
}

const camPosCurve = buildCurve(CAMERA_KEYS);
const camTgtCurve = buildCurve(
  CAMERA_KEYS.map((k) => ({ p: k.p, pos: k.tgt }))
);
const rocketCurve = buildCurve(ROCKET_KEYS);

/** Map progress -> curve parameter u, honouring non-uniform key spacing. */
function progressToU(p: number, stops: number[]): number {
  const n = stops.length;
  const clamped = THREE.MathUtils.clamp(p, 0, 1);
  for (let i = 0; i < n - 1; i++) {
    if (clamped <= stops[i + 1]) {
      const t = (clamped - stops[i]) / (stops[i + 1] - stops[i]);
      return (i + t) / (n - 1);
    }
  }
  return 1;
}

/** Sample the camera path. Writes into outPos/outTgt, returns fov. */
export function sampleCamera(
  p: number,
  outPos: THREE.Vector3,
  outTgt: THREE.Vector3
): number {
  camPosCurve.curve.getPoint(progressToU(p, camPosCurve.stops), outPos);
  camTgtCurve.curve.getPoint(progressToU(p, camTgtCurve.stops), outTgt);

  // fov: linear between keys
  const keys = CAMERA_KEYS;
  let fov = keys[keys.length - 1].fov;
  for (let i = 0; i < keys.length - 1; i++) {
    if (p <= keys[i + 1].p) {
      const t = THREE.MathUtils.clamp(
        (p - keys[i].p) / (keys[i + 1].p - keys[i].p),
        0,
        1
      );
      fov = THREE.MathUtils.lerp(keys[i].fov, keys[i + 1].fov, t);
      break;
    }
  }
  return fov;
}

const UP = new THREE.Vector3(0, 1, 0);
const _ahead = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _qPitch = new THREE.Quaternion();
const _qFace = new THREE.Quaternion();

/**
 * Sample the rocket. Writes position + orientation, returns thrust ∈ [0,1].
 * Orientation convention: the rocket model's nose points along +Y in local
 * space; this quaternion rotates local +Y onto the direction of travel.
 * During the hero the rocket stands vertical (identity-ish, gentle idle
 * motion should be layered on top by the component).
 */
export function sampleRocket(
  p: number,
  outPos: THREE.Vector3,
  outQuat: THREE.Quaternion
): number {
  const u = progressToU(p, rocketCurve.stops);
  rocketCurve.curve.getPoint(u, outPos);

  // Direction of travel from the curve tangent
  rocketCurve.curve.getTangent(Math.min(u, 0.9999), _dir);
  if (_dir.lengthSq() < 1e-6) _dir.set(0, 0, -1);
  _dir.normalize();

  // Blend from "standing vertical" (+Y) to "facing travel direction"
  // across the launch window.
  const pitchT = THREE.MathUtils.smoothstep(p, 0.1, 0.2);
  _qFace.setFromUnitVectors(UP, _dir);
  _qPitch.identity();
  outQuat.copy(_qPitch).slerp(_qFace, pitchT);

  // Bank into turns: roll around the travel axis by lateral curvature
  const uAhead = Math.min(u + 0.012, 1);
  rocketCurve.curve.getTangent(uAhead, _ahead);
  const lateral = _ahead.clone().sub(_dir).dot(new THREE.Vector3(1, 0, 0));
  const bank = THREE.MathUtils.clamp(-lateral * 18, -0.7, 0.7) * pitchT;
  const qBank = new THREE.Quaternion().setFromAxisAngle(UP, bank);
  outQuat.multiply(qBank);

  // Thrust profile: cold on the pad, ignition through launch, cruise,
  // then ease off on final approach.
  const ignition = THREE.MathUtils.smoothstep(p, 0.1, 0.22);
  const arrival = 1 - THREE.MathUtils.smoothstep(p, 0.93, 1.0) * 0.75;
  return ignition * arrival;
}

/* ------------------------------------------------------------------ */
/* Section helpers                                                     */
/* ------------------------------------------------------------------ */

export function sectionAt(p: number): SectionId {
  for (const s of SECTIONS) {
    if (p <= s.range[1]) return s.id;
  }
  return "contact";
}

/** 0..1 progress within a section, clamped. */
export function sectionProgress(p: number, id: SectionId): number {
  const s = SECTIONS.find((x) => x.id === id)!;
  return THREE.MathUtils.clamp(
    (p - s.range[0]) / (s.range[1] - s.range[0]),
    0,
    1
  );
}

/** Progress value the nav should scroll to for a section (mid-ish entry). */
export function sectionAnchor(id: SectionId): number {
  const s = SECTIONS.find((x) => x.id === id)!;
  if (id === "hero") return 0;
  if (id === "contact") return 1;
  return s.range[0] + (s.range[1] - s.range[0]) * 0.45;
}
