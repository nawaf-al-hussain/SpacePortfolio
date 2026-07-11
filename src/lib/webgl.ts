"use client";

import { useEffect, useState } from "react";

/**
 * Detects whether the browser supports WebGL. Used to decide whether to
 * mount the 3D canvas at all — if WebGL is unavailable (old mobile browser,
 * disabled in settings, no GPU driver), we skip the canvas entirely and
 * the page shows just the DOM overlays on a static starfield background.
 *
 * This prevents the cryptic "This page couldn't load" error that happens
 * when Three.js tries to create a WebGL context and fails.
 */
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
