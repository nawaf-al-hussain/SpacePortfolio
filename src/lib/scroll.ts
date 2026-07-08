"use client";

import Lenis from "lenis";
import { useEffect, useState } from "react";
import {
  impactProgress,
  sectionAnchor,
  sectionAt,
  type SectionId,
} from "./journey";

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
  /**
   * SLOW-MOTION finale playback: eases toward impactProgress(progress) over
   * a few seconds so the detonation unfolds cinematically on its own once
   * you reach the end — not frame-locked to how fast you scroll. Still
   * reverses if you scroll back up. Every finale effect reads THIS.
   */
  impact: 0,
};

/** Easing rate for the slow-mo blast — ~0.7 ⇒ ≈4s to fully play out. */
const IMPACT_LAMBDA = 0.7;
/**
 * Reverse rate: scrolling back UP should REWIND the blast responsively —
 * hugging the scrollbar so the explosion visibly plays backward instead of
 * hanging in the air while it slowly fades. Much faster than the forward
 * slow-mo, so the finale is fully scrubbable on the way out.
 */
const IMPACT_REVERSE_LAMBDA = 9;

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
    // Slow-motion finale: ease the impact value toward the scroll target.
    // Frame-rate-independent (exp form stays stable through long frames).
    // Asymmetric — cinematic slow-mo playing FORWARD into the blast, but a
    // snappy rewind when scrolling back UP so the explosion reverses with
    // the scrollbar instead of lingering.
    const targetImpact = impactProgress(p);
    const lambda =
      targetImpact >= scrollState.impact
        ? IMPACT_LAMBDA
        : IMPACT_REVERSE_LAMBDA;
    scrollState.impact +=
      (targetImpact - scrollState.impact) * (1 - Math.exp(-lambda * dt));
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
