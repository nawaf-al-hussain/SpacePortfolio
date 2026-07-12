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
const IMPACT_REVERSE_LAMBDA = 9;

let lenis: Lenis | null = null;

/* ------------------------------------------------------------------ */
/* SINGLE shared rAF loop                                              */
/* ------------------------------------------------------------------ */
type ScrollCb = (progress: number, velocity: number) => void;
type SectionCb = (section: SectionId) => void;

const scrollSubs = new Set<ScrollCb>();
const sectionSubs = new Set<SectionCb>();

let currentSection: SectionId = "hero";

export function subscribeScroll(cb: ScrollCb): () => void {
  scrollSubs.add(cb);
  return () => { scrollSubs.delete(cb); };
}

export function subscribeSection(cb: SectionCb): () => void {
  sectionSubs.add(cb);
  cb(currentSection);
  return () => { sectionSubs.delete(cb); };
}

/**
 * The shared rAF driver — ALWAYS runs, even when Lenis is disabled
 * (mobile-low devices). Reads window.scrollY, updates scrollState, and
 * fans out to subscribers. This is separate from Lenis so that disabling
 * smooth scroll doesn't also disable scroll state tracking (which would
 * freeze the entire 3D scene).
 *
 * Returns a cleanup function.
 */
let rafId: number | null = null;
let visibilityHandler: (() => void) | null = null;

export function initScrollDriver(): () => void {
  if (rafId !== null) return () => {};

  let lastP = 0;
  let lastT = performance.now();
  let paused = false;

  const loop = (time: number) => {
    if (paused) {
      rafId = requestAnimationFrame(loop);
      lastT = time;
      return;
    }
    // Tick Lenis if it's initialized (desktop + mobile tiers).
    // On mobile-low, Lenis is null and we just read native scroll.
    lenis?.raf(time);

    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, window.scrollY / max));
    const now = performance.now();
    const dt = Math.max(1, now - lastT) / 1000;
    const instV = (p - lastP) / dt;
    scrollState.velocity += (instV - scrollState.velocity) * Math.min(1, dt * 8);
    scrollState.progress = p;
    const targetImpact = impactProgress(p);
    const lambda =
      targetImpact >= scrollState.impact
        ? IMPACT_LAMBDA
        : IMPACT_REVERSE_LAMBDA;
    scrollState.impact +=
      (targetImpact - scrollState.impact) * (1 - Math.exp(-lambda * dt));
    lastP = p;
    lastT = now;

    if (scrollSubs.size > 0) {
      for (const cb of scrollSubs) cb(p, scrollState.velocity);
    }

    const s = sectionAt(p);
    if (s !== currentSection) {
      currentSection = s;
      for (const cb of sectionSubs) cb(s);
    }

    rafId = requestAnimationFrame(loop);
  };
  rafId = requestAnimationFrame(loop);

  visibilityHandler = () => {
    paused = document.hidden;
    if (!paused) {
      lastT = performance.now();
      lastP = scrollState.progress;
    }
  };
  document.addEventListener("visibilitychange", visibilityHandler);

  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
    if (visibilityHandler) {
      document.removeEventListener("visibilitychange", visibilityHandler);
      visibilityHandler = null;
    }
  };
}

/**
 * Initializes Lenis smooth scroll. Call this ONLY on devices that should
 * have smooth scroll (desktop + mobile tiers, NOT mobile-low).
 * The scroll state driver (initScrollDriver) must be called separately
 * and ALWAYS — it works with or without Lenis.
 */
export function initSmoothScroll(): () => void {
  if (lenis) return () => {};

  lenis = new Lenis({
    duration: 1.35,
    smoothWheel: true,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  // NOTE: previously stored lenis on window.__lenis for debugging, but
  // removed to avoid circular structure serialization issues in React 19.

  return () => {
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
    return subscribeSection(setSection);
  }, []);
  return section;
}

/**
 * Subscribe a callback to scroll progress on the SHARED rAF loop.
 */
export function useScrollRaf(cb: (progress: number, velocity: number) => void) {
  useEffect(() => {
    cb(scrollState.progress, scrollState.velocity);
    return subscribeScroll(cb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
