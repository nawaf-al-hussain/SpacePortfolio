/**
 * Circular JSON safety polyfill.
 *
 * React 19 (even in production builds) inspects the component tree for
 * DevTools and attempts to JSON.stringify props/state. When R3F components
 * pass Three.js objects as props (via <primitive object={mesh} /> etc.),
 * the serialization hits circular references (Object3D.children[i].parent
 * → Object3D) and throws:
 *
 *   TypeError: Converting circular structure to JSON
 *
 * This crashes the render cycle, which the CanvasErrorBoundary catches,
 * causing the 3D scene to disappear.
 *
 * This module patches JSON.stringify to safely handle circular structures
 * by replacing them with a "[Circular]" placeholder. It's imported once
 * in layout.tsx before any R3F components mount.
 *
 * The original JSON.stringify behavior is preserved for non-circular data.
 */

const originalStringify = JSON.stringify;

function safeStringify(value: unknown, replacer?: any, space?: any): string {
  const seen = new WeakSet();
  const customReplacer = (key: string, val: any) => {
    if (typeof val === "object" && val !== null) {
      if (seen.has(val)) {
        return "[Circular]";
      }
      seen.add(val);
      // Three.js objects — return a minimal descriptor instead of the
      // full object (which would pull in the entire scene graph).
      if (val.isTexture) return "[THREE.Texture]";
      if (val.isMaterial) return "[THREE.Material]";
      if (val.isObject3D) return `[THREE.${val.type}]`;
      if (val.isBufferGeometry) return "[THREE.BufferGeometry]";
      if (val.isCamera) return "[THREE.Camera]";
      if (val.isLight) return "[THREE.Light]";
      if (val.isWebGLRenderer) return "[THREE.WebGLRenderer]";
    }
    // Call the user-provided replacer if any
    if (typeof replacer === "function") return replacer(key, val);
    return val;
  };
  try {
    return originalStringify(value, customReplacer, space);
  } catch {
    return "[Unserializable]";
  }
}

if (typeof window !== "undefined") {
  JSON.stringify = safeStringify as typeof JSON.stringify;
}
