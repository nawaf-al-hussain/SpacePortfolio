"use client";

/**
 * Three.js toJSON safety patch — CLIENT COMPONENT.
 *
 * Nuclear option: walk EVERY export in the THREE module and replace
 * toJSON on every prototype that has one. This catches all subclasses
 * (PerspectiveCamera, OrthographicCamera, Scene, InstancedMesh, all
 * Material subclasses, all Light subclasses, etc.) without enumeration.
 *
 * The safe toJSON returns { object: { type, uuid, name } } — the shape
 * that subclasses expect (they do data.object.xxx = ... after calling
 * super.toJSON()). No children array = no circular refs.
 */

import * as THREE from "three";

let patched = false;

export function applyThreePatch() {
  if (patched) return;
  patched = true;

  // Safe toJSON shape — returns { object: {...} } so subclasses that do
  // `data.object.xxx = ...` after calling super.toJSON() don't crash on
  // undefined. No children array = no circular refs.
  const safeToJSON = function (this: any) {
    return {
      object: {
        type: this.type || this.constructor?.name || "Unknown",
        uuid: this.uuid || "",
        name: this.name || "",
      },
    };
  };

  // Walk ALL Three.js exports. For each class (function with a prototype),
  // replace toJSON if the prototype has one. This catches every subclass
  // without having to enumerate them individually.
  for (const key of Object.keys(THREE)) {
    const Exported = (THREE as any)[key];
    if (typeof Exported === "function" && Exported.prototype) {
      const proto = Exported.prototype;
      if (typeof proto.toJSON === "function") {
        proto.toJSON = safeToJSON;
      }
    }
  }

  // Also patch WebGLRenderer (not an Object3D, may be passed as a prop)
  const RendererProto = THREE.WebGLRenderer.prototype as any;
  if (RendererProto) {
    RendererProto.toJSON = function (this: any) {
      return { object: { type: "WebGLRenderer" } };
    };
  }
}

// APPLY IMMEDIATELY at module load — not in useEffect.
applyThreePatch();

export default function ThreePatch() {
  return null;
}
