"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  ABOUT_PLANET,
  CONTACT_SUN,
  PROJECTS_PLANET,
  PROJECTS_RING_TILT,
  sectionProgress,
} from "@/lib/journey";
import { scrollState } from "@/lib/scroll";
import { makeGlowTexture, makeTextTexture } from "@/lib/textures";

/* ------------------------------------------------------------------ */
/* Shared GLSL                                                         */
/* ------------------------------------------------------------------ */

const NOISE_GLSL = /* glsl */ `
  float hash3(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }
  float vnoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash3(i + vec3(0.0, 0.0, 0.0)), hash3(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash3(i + vec3(0.0, 1.0, 0.0)), hash3(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash3(i + vec3(0.0, 0.0, 1.0)), hash3(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash3(i + vec3(0.0, 1.0, 1.0)), hash3(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z);
  }
  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * vnoise(p);
      p = p * 2.02 + vec3(13.7, 7.3, 3.1);
      a *= 0.5;
    }
    return v;
  }
`;

/** Object-space position + world-space normal/pos for stable noise + fixed sun. */
const PLANET_VERT = /* glsl */ `
  varying vec3 vPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vPos = position;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const ATMO_VERT = PLANET_VERT;

/** BackSide halo: brightest at the planet limb, fading outward. */
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  void main() {
    vec3 v = normalize(cameraPosition - vWorldPos);
    float d = dot(normalize(vWorldNormal), v);
    float glow = pow(clamp(-d * 3.2, 0.0, 1.0), 1.6);
    gl_FragColor = vec4(uColor * uIntensity, glow);
  }
`;

const ABOUT_FRAG = /* glsl */ `
  uniform vec3 uLightDir;
  uniform vec3 uColOrange;
  uniform vec3 uColAmber;
  uniform vec3 uColMaroon;
  uniform vec3 uCityColor;
  varying vec3 vPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  ${NOISE_GLSL}
  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 sp = vPos * 0.32;
    float continents = fbm(sp);
    float detail = fbm(sp * 3.1 + vec3(7.0));
    vec3 albedo = mix(uColMaroon, uColOrange, smoothstep(0.32, 0.52, continents));
    albedo = mix(albedo, uColAmber, smoothstep(0.52, 0.72, continents + detail * 0.18));
    albedo *= 0.82 + detail * 0.36;

    float lambert = dot(n, uLightDir);
    float diff = max(lambert, 0.0);
    vec3 col = albedo * (0.035 + diff * 1.25);

    // Night-side city lights: high-frequency speckles gated by cluster noise
    float night = 1.0 - smoothstep(-0.18, 0.05, lambert);
    float speck = vnoise(vPos * 8.0);
    float clusters = smoothstep(0.5, 0.75, fbm(sp * 2.2 + vec3(3.0)));
    float lights = smoothstep(0.8, 0.94, speck) * clusters;
    col += uCityColor * lights * night * 2.4;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const GAS_FRAG = /* glsl */ `
  uniform vec3 uLightDir;
  uniform float uTime;
  uniform vec3 uColDeep;
  uniform vec3 uColMid;
  uniform vec3 uColHigh;
  varying vec3 vPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  ${NOISE_GLSL}
  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 p = vPos * 0.16;
    float warp = fbm(p * 1.8 + vec3(0.0, uTime * 0.01, 0.0));
    float warp2 = fbm(p * 3.2 + vec3(11.0) + vec3(warp));
    // Horizontal banding: compress along y so stripes run around the equator
    vec3 bp = vec3(p.x, p.y * 4.0, p.z) + vec3(warp * 0.9, warp2 * 0.35, 0.0);
    float bands = fbm(bp + vec3(0.0, uTime * 0.008, 0.0));

    vec3 col = mix(uColDeep, uColMid, smoothstep(0.3, 0.55, bands));
    col = mix(col, uColHigh, smoothstep(0.55, 0.78, bands));

    // Pale storm swirls via domain warp
    float storm = fbm(p * 4.5 + vec3(warp2 * 1.8) + vec3(5.0, 0.0, uTime * 0.015));
    col = mix(col, vec3(0.88, 0.97, 1.0), smoothstep(0.68, 0.92, storm) * 0.45);

    float lambert = dot(n, uLightDir);
    col *= 0.05 + max(lambert, 0.0) * 1.25;

    // Cyan fresnel rim
    vec3 v = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    col += uColHigh * fres * 0.9;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const RING_VERT = /* glsl */ `
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const RING_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  uniform float uReveal;
  uniform vec3 uColor;
  varying vec3 vLocal;
  ${NOISE_GLSL}
  void main() {
    float r = length(vLocal.xy);
    float t = clamp((r - uInner) / (uOuter - uInner), 0.0, 1.0);
    float a = atan(vLocal.y, vLocal.x) - uTime * 0.02;

    // Concentric streaks (radius-driven) + seamless angular variation
    float fine = vnoise(vec3(r * 3.4, 17.0, 0.0));
    float fine2 = vnoise(vec3(r * 9.0, 4.2, 0.0));
    float az = vnoise(vec3(cos(a) * 2.4 + 4.0, sin(a) * 2.4, r * 0.5));
    float streak = fine * 0.65 + fine2 * 0.55;
    streak *= 0.7 + az * 0.55;

    // Density falloff toward inner/outer edges + a Cassini-style gap
    float edge = smoothstep(0.0, 0.14, t) * (1.0 - smoothstep(0.78, 1.0, t));
    float gap = 1.0 - 0.8 * (1.0 - smoothstep(0.0, 0.05, abs(t - 0.38)));
    float density = streak * edge * gap * uReveal;

    vec3 col = mix(uColor, vec3(1.0), vnoise(vec3(r * 5.5, 9.3, 0.0)) * 0.35) * 1.15;
    gl_FragColor = vec4(col, density);
  }
`;

const SUN_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform vec3 uColCore;
  uniform vec3 uColMid;
  uniform vec3 uColDeep;
  varying vec3 vPos;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPos;
  ${NOISE_GLSL}
  void main() {
    vec3 p = vPos * 0.45;
    vec3 q = vec3(
      fbm(p + vec3(0.0, 0.0, uTime * 0.05)),
      fbm(p + vec3(5.2, 1.3, -uTime * 0.04)),
      fbm(p + vec3(2.8, 8.1, uTime * 0.03))
    );
    float f = fbm(p * 2.0 + q * 1.7 + vec3(uTime * 0.02));
    vec3 col = mix(uColDeep, uColMid, smoothstep(0.2, 0.5, f));
    col = mix(col, uColCore, smoothstep(0.5, 0.78, f));
    col *= (1.25 + f * 1.05) * (0.45 + 0.55 * uReveal); // >1 -> bloom, swells on approach
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ------------------------------------------------------------------ */
/* Shared constants / helpers                                          */
/* ------------------------------------------------------------------ */

const LIGHT_DIR = new THREE.Vector3(1, 0.4, 0.6).normalize();

const smoothstep = THREE.MathUtils.smoothstep;

const fadeEnvelope = (sp: number) =>
  smoothstep(sp, 0.05, 0.25) * (1 - smoothstep(sp, 0.8, 1));
const fadeAbout = (p: number) => fadeEnvelope(sectionProgress(p, "about"));
const fadeProjects = (p: number) => fadeEnvelope(sectionProgress(p, "projects"));
const fadeContact = (p: number) =>
  smoothstep(sectionProgress(p, "contact"), 0.05, 0.3);

const ABOUT_LABEL_POS: [number, number, number] = [
  ABOUT_PLANET.position.x + ABOUT_PLANET.radius * 0.15,
  ABOUT_PLANET.position.y + ABOUT_PLANET.radius * 0.9,
  ABOUT_PLANET.position.z + ABOUT_PLANET.radius * 0.55,
];

// Floats just off the planet's face, like the reference video
const PROJECTS_LABEL_POS: [number, number, number] = [
  PROJECTS_PLANET.position.x,
  PROJECTS_PLANET.position.y + PROJECTS_PLANET.radius * 0.15,
  PROJECTS_PLANET.position.z + PROJECTS_PLANET.radius * 1.05,
];

const CONTACT_LABEL_POS: [number, number, number] = [
  CONTACT_SUN.position.x - CONTACT_SUN.radius * 0.6,
  CONTACT_SUN.position.y + CONTACT_SUN.radius * 1.45,
  CONTACT_SUN.position.z + CONTACT_SUN.radius * 0.4,
];

const ASTEROID_TILT = new THREE.Euler(1.15, 0, 0.2);

function createAtmosphereMaterial(color: string, intensity: number) {
  return new THREE.ShaderMaterial({
    vertexShader: ATMO_VERT,
    fragmentShader: ATMO_FRAG,
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uIntensity: { value: intensity },
    },
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/** Deterministic LCG so the asteroid belt is identical every mount. */
function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/* ------------------------------------------------------------------ */
/* BillboardLabel                                                      */
/* ------------------------------------------------------------------ */

type BillboardLabelProps = {
  text: string;
  fontSize: number;
  width: number;
  position: [number, number, number];
  fade: (progress: number) => number;
  renderOrder?: number;
};

function BillboardLabel({
  text,
  fontSize,
  width,
  position,
  fade,
  renderOrder = 20,
}: BillboardLabelProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { material, aspect } = useMemo(() => {
    const { texture, aspect } = makeTextTexture(text, { size: fontSize });
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
      opacity: 0,
      fog: false,
    });
    return { material, aspect };
  }, [text, fontSize]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.quaternion.copy(state.camera.quaternion);
    const alpha = fade(scrollState.progress);
    material.opacity = alpha;
    mesh.visible = alpha > 0.003;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      material={material}
      renderOrder={renderOrder}
      visible={false}
    >
      <planeGeometry args={[width, width / aspect]} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* About planet — rocky, city lights on the night side                 */
/* ------------------------------------------------------------------ */

function AboutPlanet() {
  const planetRef = useRef<THREE.Mesh>(null);
  const beltRef = useRef<THREE.Points>(null);

  const surfaceMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: PLANET_VERT,
        fragmentShader: ABOUT_FRAG,
        uniforms: {
          uLightDir: { value: LIGHT_DIR },
          uColOrange: { value: new THREE.Color("#c2571b") },
          uColAmber: { value: new THREE.Color("#e8944a") },
          uColMaroon: { value: new THREE.Color("#4a1d0d") },
          uCityColor: { value: new THREE.Color("#ffb347") },
        },
      }),
    []
  );

  const atmoMat = useMemo(() => createAtmosphereMaterial("#ff7b33", 1.35), []);

  const belt = useMemo(() => {
    const count = 600;
    const arr = new Float32Array(count * 3);
    const inner = ABOUT_PLANET.radius * 1.35;
    const outer = ABOUT_PLANET.radius * 1.9;
    const rand = makeRand(48271);
    for (let i = 0; i < count; i++) {
      const ang = rand() * Math.PI * 2;
      const rad = inner + rand() * (outer - inner);
      arr[i * 3] = Math.cos(ang) * rad;
      arr[i * 3 + 1] = (rand() - 0.5) * 0.7;
      arr[i * 3 + 2] = Math.sin(ang) * rad;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    const material = new THREE.PointsMaterial({
      color: "#9c8b7a",
      size: 0.12,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    return { geometry, material };
  }, []);

  useFrame((_, dt) => {
    if (planetRef.current) planetRef.current.rotation.y += dt * 0.02;
    if (beltRef.current) beltRef.current.rotation.y += dt * 0.012;
  });

  return (
    <>
      <group position={ABOUT_PLANET.position}>
        <mesh ref={planetRef} material={surfaceMat}>
          <sphereGeometry args={[ABOUT_PLANET.radius, 64, 64]} />
        </mesh>
        <mesh material={atmoMat} renderOrder={3}>
          <sphereGeometry args={[ABOUT_PLANET.radius * 1.06, 48, 48]} />
        </mesh>
        <group rotation={ASTEROID_TILT}>
          <points
            ref={beltRef}
            geometry={belt.geometry}
            material={belt.material}
            renderOrder={4}
          />
        </group>
      </group>
      <BillboardLabel
        text="ABOUT ME"
        fontSize={200}
        width={11}
        position={ABOUT_LABEL_POS}
        fade={fadeAbout}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Projects planet — gas giant with the signature ring                 */
/* ------------------------------------------------------------------ */

function ProjectsPlanet() {
  const planetRef = useRef<THREE.Mesh>(null);

  const surfaceMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: PLANET_VERT,
        fragmentShader: GAS_FRAG,
        uniforms: {
          uLightDir: { value: LIGHT_DIR },
          uTime: { value: 0 },
          uColDeep: { value: new THREE.Color("#123a8f") },
          uColMid: { value: new THREE.Color("#2d7dd2") },
          uColHigh: { value: new THREE.Color("#4cc9f0") },
        },
      }),
    []
  );

  const atmoMat = useMemo(() => createAtmosphereMaterial("#4cc9f0", 1.2), []);

  const ringMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: RING_VERT,
        fragmentShader: RING_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uInner: { value: PROJECTS_PLANET.ringInner },
          uOuter: { value: PROJECTS_PLANET.ringOuter },
          uReveal: { value: 0 },
          uColor: { value: new THREE.Color("#4cc9f0") },
        },
        side: THREE.DoubleSide,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  useFrame((state, dt) => {
    if (planetRef.current) planetRef.current.rotation.y += dt * 0.02;
    const t = state.clock.elapsedTime;
    surfaceMat.uniforms.uTime.value = t;
    ringMat.uniforms.uTime.value = t;
    // The ring stays hidden until the voyage nears the projects reveal
    ringMat.uniforms.uReveal.value = smoothstep(
      scrollState.progress,
      0.44,
      0.58
    );
  });

  return (
    <>
      <group position={PROJECTS_PLANET.position}>
        <mesh ref={planetRef} material={surfaceMat}>
          <sphereGeometry args={[PROJECTS_PLANET.radius, 64, 64]} />
        </mesh>
        <mesh material={atmoMat} renderOrder={3}>
          <sphereGeometry args={[PROJECTS_PLANET.radius * 1.06, 48, 48]} />
        </mesh>
        {/* Ring plane: XZ annulus rotated by the shared PROJECTS_RING_TILT —
            project cards orbit in this exact plane. */}
        <group rotation={PROJECTS_RING_TILT}>
          <mesh rotation-x={-Math.PI / 2} material={ringMat} renderOrder={6}>
            <ringGeometry
              args={[PROJECTS_PLANET.ringInner, PROJECTS_PLANET.ringOuter, 180, 8]}
            />
          </mesh>
        </group>
      </group>
      <BillboardLabel
        text="PROJECTS"
        fontSize={200}
        width={9}
        position={PROJECTS_LABEL_POS}
        fade={fadeProjects}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Contact sun                                                         */
/* ------------------------------------------------------------------ */

function ContactSun() {
  const sunMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: PLANET_VERT,
        fragmentShader: SUN_FRAG,
        uniforms: {
          uTime: { value: 0 },
          uReveal: { value: 0 },
          uColCore: { value: new THREE.Color("#ffe9a8") },
          uColMid: { value: new THREE.Color("#ff9d2e") },
          uColDeep: { value: new THREE.Color("#c23e02") },
        },
      }),
    []
  );

  const glowMats = useMemo(() => {
    const specs: Array<[string, number]> = [
      ["rgba(255,246,213,0.9)", 0.5],
      ["rgba(255,157,46,0.85)", 0.3],
      ["rgba(255,179,71,0.8)", 0.18],
    ];
    return specs.map(([color, opacity]) => {
      const m = new THREE.SpriteMaterial({
        map: makeGlowTexture(color),
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      });
      m.toneMapped = false;
      return m;
    });
  }, []);

  const connector = useMemo(() => {
    const start = new THREE.Vector3(...CONTACT_LABEL_POS);
    const dir = start.clone().sub(CONTACT_SUN.position).normalize();
    const a = start.clone().addScaledVector(dir, -1.8);
    const b = CONTACT_SUN.position
      .clone()
      .addScaledVector(dir, CONTACT_SUN.radius * 1.15);
    const geometry = new THREE.BufferGeometry().setFromPoints([a, b]);
    const material = new THREE.LineBasicMaterial({
      color: "#ffd9a0",
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      fog: false,
    });
    const line = new THREE.Line(geometry, material);
    line.renderOrder = 19;
    line.frustumCulled = false;
    return { line, material };
  }, []);

  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    sunMat.uniforms.uTime.value = state.clock.elapsedTime;
    connector.material.opacity = fadeContact(scrollState.progress) * 0.7;
    // Halo + light swell only as the voyage approaches the finale
    const rv = 0.12 + 0.88 * smoothstep(scrollState.progress, 0.55, 0.74);
    sunMat.uniforms.uReveal.value = rv;
    glowMats[0].opacity = 0.5 * rv;
    glowMats[1].opacity = 0.3 * rv;
    glowMats[2].opacity = 0.18 * rv;
    if (lightRef.current) lightRef.current.intensity = 900 * rv;
  });

  const r = CONTACT_SUN.radius;

  return (
    <>
      <group position={CONTACT_SUN.position}>
        <mesh material={sunMat}>
          <sphereGeometry args={[r, 48, 48]} />
        </mesh>
        <sprite material={glowMats[0]} scale={[r * 5, r * 5, 1]} renderOrder={8} />
        <sprite material={glowMats[1]} scale={[r * 8, r * 8, 1]} renderOrder={9} />
        <sprite material={glowMats[2]} scale={[r * 13, r * 13, 1]} renderOrder={10} />
        <pointLight
          ref={lightRef}
          color="#ffb347"
          intensity={900}
          distance={260}
          decay={1.6}
        />
      </group>
      <primitive object={connector.line} />
      <BillboardLabel
        text="CONTACT"
        fontSize={140}
        width={7}
        position={CONTACT_LABEL_POS}
        fade={fadeContact}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Background dressing — distant inert planets for parallax depth      */
/* ------------------------------------------------------------------ */

function BackgroundPlanets() {
  const sphereGeom = useMemo(() => new THREE.SphereGeometry(1, 32, 32), []);

  const mats = useMemo(() => {
    const std = (color: string) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.92,
        metalness: 0.05,
      });
    const ring = new THREE.MeshBasicMaterial({
      color: "#5a4634",
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    return {
      navy: std("#0d1220"),
      brown: std("#6b4a35"),
      slate: std("#24304d"),
      gray: std("#3a3f4d"),
      moon: std("#262b3a"),
      ring,
    };
  }, []);

  return (
    <group>
      <mesh
        geometry={sphereGeom}
        material={mats.navy}
        position={[60, 25, -120]}
        scale={10}
      />
      {/* Saturn-ish brown planet with a simple ring */}
      <group position={[-70, -15, -160]} rotation={[1.05, 0.2, 0.35]}>
        <mesh geometry={sphereGeom} material={mats.brown} scale={9} />
        <mesh material={mats.ring} rotation-x={-Math.PI / 2} renderOrder={2}>
          <ringGeometry args={[12.5, 19, 64]} />
        </mesh>
      </group>
      <mesh
        geometry={sphereGeom}
        material={mats.slate}
        position={[45, -20, -230]}
        scale={8}
      />
      <mesh
        geometry={sphereGeom}
        material={mats.gray}
        position={[-55, 30, -260]}
        scale={14}
      />
      {/* Foreground dark moon in the hero corridor */}
      <mesh
        geometry={sphereGeom}
        material={mats.moon}
        position={[14, -6, -18]}
        scale={1.6}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ */

export default function Planets() {
  return (
    <group>
      <AboutPlanet />
      <ProjectsPlanet />
      <ContactSun />
      <BackgroundPlanets />
    </group>
  );
}
