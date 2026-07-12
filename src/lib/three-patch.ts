/**
 * Three.js toJSON safety patch.
 *
 * React 19 DevTools inspects component props and calls JSON.stringify on
 * them. When a prop is a Three.js Object3D, JSON.stringify automatically
 * calls its toJSON() method, which recursively serializes the entire
 * scene graph — hitting circular refs (child.metadata → parent → child)
 * and throwing 'Converting circular structure to JSON'.
 *
 * Patching JSON.stringify globally didn't work because React's bundler
 * may cache the original reference before our polyfill loads.
 *
 * This patch takes the opposite approach: it overrides the toJSON methods
 * on Three.js prototypes to return SAFE, minimal descriptors instead of
 * the full recursive serialization. The descriptors are enough for
 * DevTools to display (e.g. "[THREE.Mesh]") without crashing.
 *
 * SSR-safe: the patch is a no-op on the server (window is undefined).
 */

let patched = false;

export function patchThreeToJSON() {
  if (typeof window === "undefined") return; // SSR-safe
  if (patched) return;
  patched = true;

  // Dynamic import would be ideal but we need synchronous patching before
  // any R3F component renders. Since this only runs in the browser, we can
  // safely use the static import.
  const THREE = require("three") as typeof import("three");

  // Override toJSON on all Object3D-derived classes to return a minimal
  // descriptor instead of the full recursive scene graph.
  const safeDescriptor = function (this: any) {
    return {
      __three: true,
      type: this.type || this.constructor.name,
      uuid: this.uuid,
      name: this.name || undefined,
    };
  };

  // Object3D — base class for Mesh, Group, Points, Line, Sprite, etc.
  THREE.Object3D.prototype.toJSON = safeDescriptor as any;

  // Material — has its own toJSON that pulls in textures
  THREE.Material.prototype.toJSON = function (this: any) {
    return {
      __three: true,
      type: this.type || this.constructor.name,
      uuid: this.uuid,
      name: this.name || undefined,
    };
  } as any;

  // Texture — already returns {} but logs a warning; make it silent
  THREE.Texture.prototype.toJSON = function (this: any) {
    return {
      __three: true,
      type: "Texture",
      uuid: this.uuid,
    };
  } as any;

  // BufferGeometry — has vertex data we don't need to serialize
  THREE.BufferGeometry.prototype.toJSON = function (this: any) {
    return {
      __three: true,
      type: "BufferGeometry",
      uuid: this.uuid,
    };
  } as any;

  // Camera
  if (THREE.Camera) {
    THREE.Camera.prototype.toJSON = safeDescriptor as any;
  }

  // Light
  if (THREE.Light) {
    THREE.Light.prototype.toJSON = safeDescriptor as any;
  }

  // WebGLRenderer — not an Object3D but may be passed as a prop
  const RendererProto = THREE.WebGLRenderer.prototype as any;
  if (RendererProto) {
    RendererProto.toJSON = function (this: any) {
      return { __three: true, type: "WebGLRenderer" };
    };
  }
}
