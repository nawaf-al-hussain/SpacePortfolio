"use client";

/**
 * Three.js toJSON safety patch — CLIENT COMPONENT.
 *
 * React 19 DevTools calls JSON.stringify on component props. When a prop
 * is a Three.js object, JSON.stringify auto-calls its toJSON() method.
 * Three.js toJSON methods recursively serialize the scene graph → circular
 * refs → 'Converting circular structure to JSON' crash.
 *
 * Additionally, some classes (Scene, InstancedMesh, etc.) have their own
 * toJSON that accesses properties like data.object.backgroundRotation,
 * which fails if the parent toJSON was overridden.
 *
 * FIX: wrap every toJSON method in a try/catch. If it throws, fall back
 * to a safe minimal descriptor. This handles ALL Three.js classes without
 * having to enumerate them individually.
 */

import * as THREE from "three";
import { useEffect } from "react";

let patched = false;

function applyPatch() {
  if (patched) return;
  patched = true;

  // Safe fallback descriptor — what toJSON returns if the original throws.
  const safeDescriptor = function (this: any) {
    return {
      __three: true,
      type: this.type || this.constructor?.name || "Unknown",
      uuid: this.uuid,
      name: this.name || undefined,
    };
  };

  // Helper: wrap a toJSON method in try/catch.
  const wrapToJSON = (proto: any) => {
    if (!proto || typeof proto.toJSON !== "function") return;
    const original = proto.toJSON;
    // Don't double-wrap.
    if (original.__wrapped) return;
    const wrapped = function (this: any, ...args: any[]) {
      try {
        const result = original.apply(this, args);
        // Verify the result is serializable (no circular refs).
        JSON.stringify(result);
        return result;
      } catch {
        return safeDescriptor.call(this);
      }
    };
    wrapped.__wrapped = true;
    proto.toJSON = wrapped;
  };

  // Wrap toJSON on all key Three.js prototypes. This covers all subclasses
  // that inherit from these (Mesh, Group, Points, Line, Sprite, etc.).
  wrapToJSON(THREE.Object3D.prototype);
  wrapToJSON(THREE.Scene.prototype); // Scene has its OWN toJSON
  wrapToJSON(THREE.Material.prototype);
  wrapToJSON(THREE.Texture.prototype);
  wrapToJSON(THREE.BufferGeometry.prototype);
  wrapToJSON(THREE.Camera.prototype);
  wrapToJSON(THREE.Light.prototype);

  // InstancedMesh has its own toJSON (serializes instanceMatrix, etc.)
  if (THREE.InstancedMesh) {
    wrapToJSON(THREE.InstancedMesh.prototype);
  }

  // WebGLRenderer — not an Object3D but may be passed as a prop
  const RendererProto = THREE.WebGLRenderer.prototype as any;
  if (RendererProto && typeof RendererProto.toJSON !== "function") {
    RendererProto.toJSON = function (this: any) {
      return { __three: true, type: "WebGLRenderer" };
    };
  } else {
    wrapToJSON(RendererProto);
  }

  // Fog — Scene.toJSON references this.fog.toJSON()
  if (THREE.Fog) wrapToJSON(THREE.Fog.prototype);
  if (THREE.FogExp2) wrapToJSON(THREE.FogExp2.prototype);

  // Euler — Scene.toJSON calls this.backgroundRotation.toArray()
  // (toArray is safe, but just in case)
  if (THREE.Euler) wrapToJSON(THREE.Euler.prototype);
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
