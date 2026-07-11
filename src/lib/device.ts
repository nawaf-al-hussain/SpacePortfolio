"use client";

/**
 * Device-tier detection — drives all mobile/low-power quality scaling.
 *
 * Tier meanings:
 *   - "mobile-low":  phone, ≤4 CPU threads, or reduced-motion preferred.
 *                    Aggressive cuts: no post-FX, DPR clamped to 1, particle
 *                    counts halved again, ISS model skipped entirely.
 *   - "mobile":      phone or small viewport. Post-FX on but DPR capped at
 *                    1.25, particle counts reduced, ISS loaded.
 *   - "desktop":     everything else. Full quality.
 *
 * Detection is heuristic (UA + hardwareConcurrency + deviceMemory +
 * viewport + matchMedia). We err on the side of LOWER tier when ambiguous
 * — a false "low" just makes the desktop experience a hair cheaper, while
 * a false "high" makes a phone melt.
 */

export type DeviceTier = "mobile-low" | "mobile" | "desktop";

export interface DeviceProfile {
  tier: DeviceTier;
  isMobile: boolean;
  isTouch: boolean;
  reducedMotion: boolean;
  /** Max DPR the canvas should use on this device. */
  maxDpr: number;
  /** Whether to enable post-processing (bloom/chromatic aberration/vignette). */
  postFx: boolean;
  /** Whether to load the heavy ISS GLB model (4.2 MB). */
  loadIss: boolean;
  /** Particle count multiplier — applied on top of the base reductions. */
  particleScale: number;
  /** Whether smooth scroll (Lenis) should be enabled. */
  smoothScroll: boolean;
}

function detectTier(): DeviceTier {
  if (typeof window === "undefined") return "desktop";

  const ua = navigator.userAgent;
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua);
  const isSmallViewport = Math.min(window.innerWidth, window.innerHeight) < 768;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const cores = navigator.hardwareConcurrency ?? 8;
  // @ts-expect-error — deviceMemory is non-standard but widely supported
  const memory: number | undefined = navigator.deviceMemory;

  // Hard gates: reduced motion or very low-end hardware → lowest tier
  if (reducedMotion) return "mobile-low";
  if (cores <= 4) return "mobile-low";
  if (memory !== undefined && memory <= 4) return "mobile-low";

  // Mobile detection: UA + small viewport + touch
  if (isMobileUA || (isSmallViewport && isTouch)) return "mobile";

  return "desktop";
}

function buildProfile(): DeviceProfile {
  const tier = detectTier();
  const isMobile = tier !== "desktop";
  const isTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  switch (tier) {
    case "mobile-low":
      return {
        tier,
        isMobile: true,
        isTouch,
        reducedMotion,
        maxDpr: 1,
        postFx: false,
        loadIss: false,
        particleScale: 0.4,
        smoothScroll: false, // native momentum scroll is smoother on low-end
      };
    case "mobile":
      return {
        tier,
        isMobile: true,
        isTouch,
        reducedMotion,
        maxDpr: 1.25,
        postFx: true,
        loadIss: true,
        particleScale: 0.6,
        smoothScroll: true,
      };
    case "desktop":
    default:
      return {
        tier,
        isMobile: false,
        isTouch,
        reducedMotion,
        maxDpr: 1.5,
        postFx: true,
        loadIss: true,
        particleScale: 1,
        smoothScroll: true,
      };
  }
}

let cached: DeviceProfile | null = null;

/**
 * Returns the device profile. Memoized after first call — the tier doesn't
 * change during a session (resize doesn't re-trigger; the user would need
 * to reload after rotating a tablet, which is acceptable).
 */
export function getDeviceProfile(): DeviceProfile {
  if (cached) return cached;
  cached = buildProfile();
  return cached;
}

/**
 * SSR-safe hook for React components. Returns a stable profile after mount.
 * Returns a desktop profile during SSR to avoid layout flash.
 */
import { useEffect, useState } from "react";

export function useDeviceProfile(): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>(() => {
    // SSR default — desktop, full quality. Real detection runs on mount.
    if (typeof window === "undefined") {
      return {
        tier: "desktop",
        isMobile: false,
        isTouch: false,
        reducedMotion: false,
        maxDpr: 1.5,
        postFx: true,
        loadIss: true,
        particleScale: 1,
        smoothScroll: true,
      };
    }
    return getDeviceProfile();
  });

  useEffect(() => {
    setProfile(getDeviceProfile());
  }, []);

  return profile;
}
