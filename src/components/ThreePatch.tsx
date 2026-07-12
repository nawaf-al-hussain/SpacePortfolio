"use client";

/**
 * Three.js toJSON safety patch — CLIENT COMPONENT.
 *
 * MUST run at module load time (not in useEffect) so the prototypes are
 * patched BEFORE React renders any R3F component. useEffect runs after
 * the first render — too late, React's DevTools serialization already
 * crashed on the first frame.
 *
 * The patch is applied synchronously when this module is imported.
 * Import this module at the TOP of page.tsx, before the Experience
 * dynamic import.
 */

import * as THREE from "three";

let patched = false;

export function applyThreePatch() {
  if (patched) return;
  patched = true;

  const safeDescriptor = function (this: any) {
    return {
      __three: true,
      type: this.type || this.constructor?.name || "Unknown",
      uuid: this.uuid,
      name: this.name || undefined,
    };
  };

  // Override toJSON on all key prototypes to return safe descriptors.
  // This is the nuclear option — we don't try to call the original toJSON
  // and catch errors. We just replace it entirely. This is more reliable
  // than wrapping because there's no chance the original runs and throws
  // before we catch it.
  const override = (proto: any) => {
    if (!proto) return;
    proto.toJSON = safeDescriptor;
  };

  override(THREE.Object3D.prototype);
  override(THREE.Scene.prototype);
  override(THREE.Material.prototype);
  override(THREE.Texture.prototype);
  override(THREE.BufferGeometry.prototype);
  override(THREE.Camera.prototype);
  override(THREE.Light.prototype);

  if (THREE.InstancedMesh) {
    override(THREE.InstancedMesh.prototype);
  }
  if (THREE.Fog) override(THREE.Fog.prototype);
  if (THREE.FogExp2) override(THREE.FogExp2.prototype);
  if (THREE.Euler) override(THREE.Euler.prototype);

  // WebGLRenderer — not an Object3D
  const RendererProto = THREE.WebGLRenderer.prototype as any;
  if (RendererProto) {
    RendererProto.toJSON = function (this: any) {
      return { __three: true, type: "WebGLRenderer" };
    };
  }
}

// APPLY IMMEDIATELY at module load — not in useEffect.
// This runs before any component renders.
applyThreePatch();

/** Component: renders nothing. Importing this module applies the patch. */
export default function ThreePatch() {
  return null;
}
