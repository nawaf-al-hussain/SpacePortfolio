"use client";

/**
 * Three.js toJSON safety patch — CLIENT COMPONENT.
 *
 * Must be a client component so Next.js includes it in the client bundle.
 * Imported from page.tsx (which is already "use client") to ensure it
 * runs before any R3F component mounts.
 *
 * React 19 DevTools calls JSON.stringify on component props. When a prop
 * is a Three.js Object3D, JSON.stringify auto-calls its toJSON() method,
 * which recursively serializes the scene graph → circular refs → crash.
 *
 * This patch overrides toJSON on Three.js prototypes to return safe
 * minimal descriptors.
 */

import * as THREE from "three";
import { useEffect } from "react";

let patched = false;

function applyPatch() {
  if (patched) return;
  patched = true;

  const safeDescriptor = function (this: any) {
    return {
      __three: true,
      type: this.type || this.constructor.name,
      uuid: this.uuid,
      name: this.name || undefined,
    };
  };

  THREE.Object3D.prototype.toJSON = safeDescriptor as any;

  THREE.Material.prototype.toJSON = function (this: any) {
    return {
      __three: true,
      type: this.type || this.constructor.name,
      uuid: this.uuid,
      name: this.name || undefined,
    };
  } as any;

  THREE.Texture.prototype.toJSON = function (this: any) {
    return {
      __three: true,
      type: "Texture",
      uuid: this.uuid,
    };
  } as any;

  THREE.BufferGeometry.prototype.toJSON = function (this: any) {
    return {
      __three: true,
      type: "BufferGeometry",
      uuid: this.uuid,
    };
  } as any;

  if (THREE.Camera) {
    THREE.Camera.prototype.toJSON = safeDescriptor as any;
  }
  if (THREE.Light) {
    THREE.Light.prototype.toJSON = safeDescriptor as any;
  }

  const RendererProto = THREE.WebGLRenderer.prototype as any;
  if (RendererProto) {
    RendererProto.toJSON = function (this: any) {
      return { __three: true, type: "WebGLRenderer" };
    };
  }
}

/** Hook: call once in the root client component to apply the patch. */
export function useThreePatch() {
  useEffect(() => {
    applyPatch();
  }, []);
}

/** Component: renders nothing, just applies the patch on mount. */
export default function ThreePatch() {
  useThreePatch();
  return null;
}
