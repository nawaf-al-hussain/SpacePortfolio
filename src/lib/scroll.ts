"use client";

import Lenis from "lenis";
import { useEffect, useState } from "react";
import { sectionAnchor, sectionAt, type SectionId } from "./journey";

/**
 * Shared, mutable scroll state. Canvas components read this inside
 * useFrame (no React re-renders). DOM components that need reactivity
 * use the hooks below or motion's useScroll.
 */
export const scrollState = {
  /** Raw scroll progress 0..1 across the whole page. */
  progress: 0,
  /** Progress units per second, signed. Feeds the warp/thrust effects. */
  velocity: 0,
};

let lenis: Lenis | null = null;

export function initSmoothScroll(): () => void {
  if (lenis) return () => {};

  lenis = new Lenis({
    duration: 1.35,
    smoothWheel: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  // Handle for programmatic scroll (nav, tests, console debugging)
  (window as unknown as { __lenis: Lenis }).__lenis = lenis;

  let lastP = 0;
  let lastT = performance.now();
  let raf = 0;

  const loop = (time: number) => {
    lenis?.raf(time);
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    const now = performance.now();
    const dt = Math.max(1, now - lastT) / 1000;
    // Low-pass the velocity so single wheel ticks don't spike the warp
    const instV = (p - lastP) / dt;
    scrollState.velocity += (instV - scrollState.velocity) * Math.min(1, dt * 8);
    scrollState.progress = p;
    lastP = p;
    lastT = now;
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToSection(id: SectionId) {
  const doc = document.documentElement;
  const max = Math.max(1, doc.scrollHeight - window.innerHeight);
  const y = sectionAnchor(id) * max;
  if (lenis) {
    lenis.scrollTo(y, { duration: 2.2 });
  } else {
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

/** Reactive current-section id (updates only on section change). */
export function useCurrentSection(): SectionId {
  const [section, setSection] = useState<SectionId>("hero");
  useEffect(() => {
    let raf = 0;
    let last: SectionId = "hero";
    const tick = () => {
      const s = sectionAt(scrollState.progress);
      if (s !== last) {
        last = s;
        setSection(s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return section;
}

/**
 * Subscribe a callback to scroll progress on rAF — for DOM elements that
 * animate with scroll without re-rendering (write styles imperatively).
 */
export function useScrollRaf(cb: (progress: number, velocity: number) => void) {
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      cb(scrollState.progress, scrollState.velocity);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
