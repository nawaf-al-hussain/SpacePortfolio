"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TOTAL_PAGES } from "@/lib/journey";
import { initSmoothScroll } from "@/lib/scroll";
import { getDeviceProfile } from "@/lib/device";
import Loader from "@/components/dom/Loader";
import Navbar from "@/components/dom/Navbar";
import HeroOverlay from "@/components/dom/HeroOverlay";
import SectionOverlays from "@/components/dom/SectionOverlays";
import ProjectModal from "@/components/dom/ProjectModal";
import HUDRail from "@/components/dom/HUDRail";
import SocialRail from "@/components/dom/SocialRail";
import ImpactFlash from "@/components/dom/ImpactFlash";
import CustomCursor from "@/components/dom/CustomCursor";

const Experience = dynamic(() => import("@/components/canvas/Experience"), {
  ssr: false,
});

export default function Home() {
  const [fontsReady, setFontsReady] = useState(false);
  const [vh, setVh] = useState("100vh");

  useEffect(() => {
    // Device-aware smooth scroll — disabled on mobile-low (native momentum
    // scroll is smoother + cheaper on a 4-core phone than a JS rAF loop).
    const profile = getDeviceProfile();
    const cleanup = profile.smoothScroll
      ? initSmoothScroll()
      : () => {};

    let alive = true;
    document.fonts.ready.then(() => alive && setFontsReady(true));

    // iOS Safari 100vh fix — the address bar grows/shrinks on scroll,
    // making `100vh` jump by ~80px. Use the visualViewport API (or the
    // innerHeight fallback) to compute a stable CSS var `--vh`.
    const setVhVar = () => {
      const h =
        window.visualViewport?.height ??
        window.innerHeight;
      setVh(`${h * 0.01}px`);
    };
    setVhVar();
    window.visualViewport?.addEventListener("resize", setVhVar);
    window.addEventListener("orientationchange", setVhVar);

    return () => {
      alive = false;
      cleanup();
      window.visualViewport?.removeEventListener("resize", setVhVar);
      window.removeEventListener("orientationchange", setVhVar);
    };
  }, []);

  return (
    <main className="relative" style={{ ["--vh" as string]: vh }}>
      {/* Scroll runway — the journey lives in this scroll distance.
          Uses --vh (iOS Safari-safe) instead of raw 100vh. */}
      <div
        style={{
          height: `calc(${TOTAL_PAGES} * var(--vh, 1vh) * 100)`,
        }}
      />

      {/* 3D scene (fixed, behind everything) */}
      {fontsReady && <Experience />}

      {/* DOM overlay */}
      <Navbar />
      <HeroOverlay />
      <SectionOverlays />
      <HUDRail />
      <SocialRail />
      <ProjectModal />
      <ImpactFlash />
      <CustomCursor />
      <Loader />
    </main>
  );
}
