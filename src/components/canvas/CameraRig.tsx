"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { sampleCamera } from "@/lib/journey";
import { scrollState } from "@/lib/scroll";

/** Preallocated scratch for the impact recoil (zero per-frame allocation). */
const _recoil = new THREE.Vector3();

/**
 * Drives the camera along the journey path from scroll progress,
 * with critically-damped smoothing plus subtle mouse parallax.
 */
export default function CameraRig() {
  const smoothP = useRef(0);
  const pos = useRef(new THREE.Vector3(0, 0.4, 10));
  const tgt = useRef(new THREE.Vector3(0, 0.7, 0));
  const mouse = useRef({ x: 0, y: 0 });
  const shake = useRef(0);
  const size = useThree((s) => s.size);

  useFrame((state, dt) => {
    const cam = state.camera as THREE.PerspectiveCamera;

    // Smooth the raw progress — the camera trails the scrollbar slightly
    smoothP.current = THREE.MathUtils.damp(
      smoothP.current,
      scrollState.progress,
      3.2,
      dt
    );
    const p = smoothP.current;

    const fov = sampleCamera(p, pos.current, tgt.current);

    // Mouse parallax (stronger in the hero, gentler in flight)
    const px = state.pointer.x;
    const py = state.pointer.y;
    mouse.current.x = THREE.MathUtils.damp(mouse.current.x, px, 4, dt);
    mouse.current.y = THREE.MathUtils.damp(mouse.current.y, py, 4, dt);
    const heroness = 1 - THREE.MathUtils.smoothstep(p, 0.05, 0.2);
    const amt = 0.55 * heroness + 0.28;
    pos.current.x += mouse.current.x * amt;
    pos.current.y += mouse.current.y * amt * 0.6;

    // Speed shake while burning hard
    const v = Math.abs(scrollState.velocity);
    shake.current = THREE.MathUtils.damp(shake.current, Math.min(v * 6, 1), 4, dt);
    const t = state.clock.elapsedTime;
    // Impact kick — a violent jolt right as the rocket rams the sun,
    // strongest mid-blast and settling once the fireball dissipates.
    const imp = scrollState.impact;
    const impShake = imp * (1 - imp) * 4;
    const s = shake.current * 0.06 + impShake * 0.11;
    pos.current.x += Math.sin(t * 31.7) * s + Math.sin(t * 84) * impShake * 0.06;
    pos.current.y += Math.cos(t * 27.3) * s + Math.cos(t * 77) * impShake * 0.06;

    cam.position.copy(pos.current);

    // Recoil: the blast shoves the camera back along its view axis — a
    // sharp punch at contact that eases out as the fireball rolls over.
    const recoil = THREE.MathUtils.smoothstep(imp, 0.0, 0.12) * (1 - imp) * 2.6;
    if (recoil > 0.001) {
      _recoil.copy(cam.position).sub(tgt.current).normalize();
      cam.position.addScaledVector(_recoil, recoil);
    }
    cam.lookAt(tgt.current);

    const targetFov = fov + shake.current * 4;
    if (Math.abs(cam.fov - targetFov) > 0.01) {
      cam.fov = THREE.MathUtils.damp(cam.fov, targetFov, 6, dt);
      cam.updateProjectionMatrix();
    }

    // Keep aspect fresh (resize safety)
    const aspect = size.width / size.height;
    if (Math.abs(cam.aspect - aspect) > 0.001) {
      cam.aspect = aspect;
      cam.updateProjectionMatrix();
    }
  });

  return null;
}
