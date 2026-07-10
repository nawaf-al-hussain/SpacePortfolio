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

/* ------------------------------------------------------------------ */
/* SINGLE shared rAF loop                                              */
/* ------------------------------------------------------------------ */
/**
 * Performance: previously the site ran 6+ separate rAF loops (Lenis,
 * useScrollRaf in every DOM overlay, useCurrentSection, CustomCursor, plus
 * the R3F render loop). Each one called requestAnimationFrame independently
 * and read scrollState every frame. This consolidates them into ONE driver
 * loop that:
 *   1. ticks Lenis
 *   2. updates scrollState (progress / velocity / impact)
 *   3. fans out to a Set of subscribers (DOM overlays, cursor, etc.)
 *
 * Subscribers use `subscribeScroll(cb)` and `subscribeSection(cb)`.
 */
type ScrollCb = (progress: number, velocity: number) => void;
type SectionCb = (section: SectionId) => void;

const scrollSubs = new Set<ScrollCb>();
const sectionSubs = new Set<SectionCb>();

let currentSection: SectionId = "hero";

export function subscribeScroll(cb: ScrollCb): () => void {
  scrollSubs.add(cb);
  return () => {
    scrollSubs.delete(cb);
  };
}

export function subscribeSection(cb: SectionCb): () => void {
  sectionSubs.add(cb);
  // Emit current section immediately so new subscribers don't wait a frame.
  cb(currentSection);
  return () => {
    sectionSubs.delete(cb);
  };
}

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
  let paused = false;

  const loop = (time: number) => {
    // Pause work when the tab is hidden — saves CPU/GPU when backgrounded.
    if (paused) {
      raf = requestAnimationFrame(loop);
      lastT = time;
      return;
    }
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
    const targetImpact = impactProgress(p);
    const lambda =
      targetImpact >= scrollState.impact
        ? IMPACT_LAMBDA
        : IMPACT_REVERSE_LAMBDA;
    scrollState.impact +=
      (targetImpact - scrollState.impact) * (1 - Math.exp(-lambda * dt));
    lastP = p;
    lastT = now;

    // Fan out to DOM subscribers (cursor, overlays) — single pass.
    if (scrollSubs.size > 0) {
      for (const cb of scrollSubs) cb(p, scrollState.velocity);
    }

    // Section change detection — only fires on transition.
    const s = sectionAt(p);
    if (s !== currentSection) {
      currentSection = s;
      for (const cb of sectionSubs) cb(s);
    }

    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  // Pause/resume on tab visibility — avoids burning CPU when backgrounded.
  const onVisibility = () => {
    paused = document.hidden;
    if (!paused) {
      // Reset time baseline so dt doesn't spike after a long background gap.
      lastT = performance.now();
      lastP = scrollState.progress;
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    cancelAnimationFrame(raf);
    document.removeEventListener("visibilitychange", onVisibility);
    lenis?.destroy();
    lenis = null;
    scrollSubs.clear();
    sectionSubs.clear();
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
 * Subscribe a callback to scroll progress on the SHARED rAF loop — for DOM
 * elements that animate with scroll without re-rendering (write styles
 * imperatively). Previously each caller spun its own rAF; now they all
 * share the single driver in initSmoothScroll.
 */
export function useScrollRaf(cb: (progress: number, velocity: number) => void) {
  useEffect(() => {
    // Emit once immediately so initial state is correct without waiting a frame.
    cb(scrollState.progress, scrollState.velocity);
    return subscribeScroll(cb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
