"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TOTAL_PAGES } from "@/lib/journey";
import { initSmoothScroll, initScrollDriver } from "@/lib/scroll";
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
    // ALWAYS initialize the scroll state driver — it reads window.scrollY
    // and updates scrollState (which drives the 3D camera + DOM overlays).
    // Without this, the 3D scene would be frozen on mobile-low devices.
    const cleanupDriver = initScrollDriver();

    // Only initialize Lenis smooth scroll on devices that support it well
    // (desktop + mobile tiers). Mobile-low uses native momentum scroll.
    const profile = getDeviceProfile();
    const cleanupLenis = profile.smoothScroll
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
      cleanupDriver();
      cleanupLenis();
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
