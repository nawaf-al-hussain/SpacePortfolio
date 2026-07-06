"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  PROJECTS_PLANET,
  PROJECTS_RING_TILT,
  sectionAt,
  sectionProgress,
} from "@/lib/journey";
import { scrollState } from "@/lib/scroll";
import { PROJECTS, type Project } from "@/lib/data";
import { useUIStore } from "@/lib/store";
import {
  makeGlowTexture,
  makeProjectCardTexture,
  makeTextTexture,
} from "@/lib/textures";

/**
 * The interactive centerpiece: the 5 projects orbiting inside the projects
 * planet's ring like satellites — fake website screenshots that billboard
 * to the camera, glow on hover, and open the detail modal on click.
 */

/* ------------------------------------------------------------------ */
/* Constants + module-level scratch (zero per-frame allocations)       */
/* ------------------------------------------------------------------ */

const CARD_W = 4.8;
const CARD_H = 3.0;
const GLOW_W = 5.0;
const GLOW_H = 3.2;
const CHIP_W = 3.0;

const CAROUSEL_SPEED = 0.018; // rad/s
const HOVER_SCALE = 1.14;
const GLOW_BASE = 0.3;
const GLOW_HOVER = 0.6;

const LANE_RADIUS: [number, number] = [20, 24.5];
const LANE_Y: [number, number] = [0.8, -0.8];
const STEP = (Math.PI * 2) / PROJECTS.length;

const _parentQ = new THREE.Quaternion();

/** Shared reveal envelope for the whole orbit group. */
function revealAlpha(): number {
  const sp = sectionProgress(scrollState.progress, "projects");
  return (
    THREE.MathUtils.smoothstep(sp, 0.04, 0.22) *
    (1 - THREE.MathUtils.smoothstep(sp, 0.9, 1))
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

/* ------------------------------------------------------------------ */
/* Single orbiting card                                                */
/* ------------------------------------------------------------------ */

type CardProps = {
  project: Project;
  index: number;
  cardGeo: THREE.PlaneGeometry;
  glowGeo: THREE.PlaneGeometry;
  chipGeo: THREE.PlaneGeometry;
};

function ProjectCard({ project, index, cardGeo, glowGeo, chipGeo }: CardProps) {
  const billboardRef = useRef<THREE.Group>(null);
  const alphaRef = useRef(0);
  const targets = useRef({ scale: 1, glow: GLOW_BASE });
  const glowCurrent = useRef(GLOW_BASE);

  const lane = index % 2;
  const angle = index * STEP;
  const radius = LANE_RADIUS[lane];
  const yOff = LANE_Y[lane];

  const { cardMat, glowMat, chipMat, chipAspect } = useMemo(() => {
    const cardTex = makeProjectCardTexture(project);
    const glowTex = makeGlowTexture(hexToRgba(project.colorA, 0.5));
    const chip = makeTextTexture(project.title, { size: 90 });

    const cardMat = new THREE.MeshBasicMaterial({
      map: cardTex,
      transparent: true,
      toneMapped: false,
      depthWrite: false,
      opacity: 0,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      toneMapped: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    const chipMat = new THREE.MeshBasicMaterial({
      map: chip.texture,
      transparent: true,
      toneMapped: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    return { cardMat, glowMat, chipMat, chipAspect: chip.aspect };
  }, [project]);

  useEffect(() => {
    return () => {
      cardMat.map?.dispose();
      glowMat.map?.dispose();
      chipMat.map?.dispose();
      cardMat.dispose();
      glowMat.dispose();
      chipMat.dispose();
    };
  }, [cardMat, glowMat, chipMat]);

  useFrame((state, delta) => {
    const bb = billboardRef.current;
    if (!bb || !bb.parent) return;

    // Billboard in world space: quaternion = parentWorldQuat^-1 * cameraQuat
    bb.parent.getWorldQuaternion(_parentQ);
    _parentQ.invert();
    bb.quaternion.copy(_parentQ).multiply(state.camera.quaternion);

    // Reveal envelope
    const alpha = revealAlpha();
    alphaRef.current = alpha;

    // Hover animation (damped toward targets)
    const s = THREE.MathUtils.damp(bb.scale.x, targets.current.scale, 6, delta);
    bb.scale.setScalar(s);
    glowCurrent.current = THREE.MathUtils.damp(
      glowCurrent.current,
      targets.current.glow,
      6,
      delta
    );

    cardMat.opacity = alpha;
    glowMat.opacity = glowCurrent.current * alpha;
    chipMat.opacity = alpha * 0.85;
  });

  const onPointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (alphaRef.current < 0.5) return;
    useUIStore.getState().setHoveredProject(project.id);
    targets.current.scale = HOVER_SCALE;
    targets.current.glow = GLOW_HOVER;
  };

  const onPointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const store = useUIStore.getState();
    if (store.hoveredProject === project.id) store.setHoveredProject(null);
    targets.current.scale = 1;
    targets.current.glow = GLOW_BASE;
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (alphaRef.current < 0.5) return;
    if (sectionAt(scrollState.progress) !== "projects") return;
    useUIStore.getState().setSelectedProject(project.id);
  };

  return (
    <group rotation={[0, angle, 0]}>
      <group ref={billboardRef} position={[radius, yOff, 0]}>
        <mesh
          geometry={glowGeo}
          material={glowMat}
          position={[0, 0, -0.05]}
          renderOrder={17}
        />
        <mesh
          geometry={cardGeo}
          material={cardMat}
          renderOrder={18}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onClick={onClick}
        />
        <mesh
          geometry={chipGeo}
          material={chipMat}
          position={[0, -1.95, 0.02]}
          scale={[CHIP_W, CHIP_W / chipAspect, 1]}
          renderOrder={19}
        />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Ambient mini-satellites                                             */
/* ------------------------------------------------------------------ */

const SATS = [
  { radius: 18.2, speed: 0.35, phase: 1.7, y: 1.5 },
  { radius: 27.2, speed: -0.22, phase: 4.4, y: -1.2 },
] as const;

/* ------------------------------------------------------------------ */
/* Root                                                                */
/* ------------------------------------------------------------------ */

export default function ProjectOrbit() {
  const rootRef = useRef<THREE.Group>(null);
  const carouselRef = useRef<THREE.Group>(null);
  const satRefs = useRef<(THREE.Mesh | null)[]>([null, null]);

  const { cardGeo, glowGeo, chipGeo, satGeo, satMat } = useMemo(() => {
    return {
      cardGeo: new THREE.PlaneGeometry(CARD_W, CARD_H),
      glowGeo: new THREE.PlaneGeometry(GLOW_W, GLOW_H),
      chipGeo: new THREE.PlaneGeometry(1, 1),
      satGeo: new THREE.BoxGeometry(0.3, 0.3, 0.3),
      satMat: new THREE.MeshStandardMaterial({
        color: "#0a1220",
        emissive: "#4cc9f0",
        emissiveIntensity: 1.6,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        roughness: 0.4,
        metalness: 0.6,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      cardGeo.dispose();
      glowGeo.dispose();
      chipGeo.dispose();
      satGeo.dispose();
      satMat.dispose();
    };
  }, [cardGeo, glowGeo, chipGeo, satGeo, satMat]);

  useFrame((state, delta) => {
    const root = rootRef.current;
    const carousel = carouselRef.current;
    if (!root || !carousel) return;

    // Slow orbital revolution around the ring's local Y
    carousel.rotation.y += CAROUSEL_SPEED * delta;

    const alpha = revealAlpha();
    // Invisible meshes don't raycast — gates hover/click for free
    root.visible = alpha > 0.012;

    // Drop any stale hover once the orbit fades (e.g. user scrolled away
    // without moving the mouse) so the HUD chip doesn't stick around.
    if (alpha < 0.5) {
      const store = useUIStore.getState();
      if (store.hoveredProject) store.setHoveredProject(null);
    }

    // Mini-satellites drifting on their own lanes
    const t = state.clock.elapsedTime;
    satMat.opacity = alpha * 0.85;
    for (let i = 0; i < SATS.length; i++) {
      const sat = satRefs.current[i];
      if (!sat) continue;
      const cfg = SATS[i];
      const a = t * cfg.speed + cfg.phase;
      sat.position.set(
        Math.cos(a) * cfg.radius,
        cfg.y + Math.sin(t * 0.8 + cfg.phase) * 0.4,
        Math.sin(a) * cfg.radius
      );
      sat.rotation.x = t * 0.6 + cfg.phase;
      sat.rotation.y = t * 0.45;
    }
  });

  return (
    <group
      ref={rootRef}
      position={PROJECTS_PLANET.position}
      rotation={PROJECTS_RING_TILT}
      visible={false}
    >
      <group ref={carouselRef}>
        {PROJECTS.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            cardGeo={cardGeo}
            glowGeo={glowGeo}
            chipGeo={chipGeo}
          />
        ))}
      </group>
      {SATS.map((_, i) => (
        <mesh
          key={i}
          ref={(m) => {
            satRefs.current[i] = m;
          }}
          geometry={satGeo}
          material={satMat}
          renderOrder={16}
        />
      ))}
    </group>
  );
}
