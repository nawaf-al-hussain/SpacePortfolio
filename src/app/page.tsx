"use client";

// ThreePatch MUST be imported before Experience — it patches Three.js
// prototype.toJSON methods synchronously at module load time. If Experience
// loads first, React's DevTools serialization crashes on circular Object3D
// refs before the patch runs.
import "@/components/ThreePatch";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TOTAL_PAGES } from "@/lib/journey";
import { initSmoothScroll, initScrollDriver } from "@/lib/scroll";
import { getDeviceProfile } from "@/lib/device";
import { useWebGLSupport } from "@/lib/webgl";
import Loader from "@/components/dom/Loader";
import Navbar from "@/components/dom/Navbar";
import HeroOverlay from "@/components/dom/HeroOverlay";
import SectionOverlays from "@/components/dom/SectionOverlays";
import ProjectModal from "@/components/dom/ProjectModal";
import HUDRail from "@/components/dom/HUDRail";
import SocialRail from "@/components/dom/SocialRail";
import ImpactFlash from "@/components/dom/ImpactFlash";
import CustomCursor from "@/components/dom/CustomCursor";
import CanvasErrorBoundary from "@/components/canvas/CanvasErrorBoundary";

const Experience = dynamic(() => import("@/components/canvas/Experience"), {
  ssr: false,
});

/** Static fallback background when WebGL is unavailable or the canvas crashed. */
function StaticBackground() {
  return (
    <div
      className="fixed inset-0 z-0"
      aria-hidden
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #0a0820 0%, #050310 50%, #02010a 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 60% 70%, #fff, transparent), radial-gradient(1px 1px at 80% 20%, #9adcff, transparent), radial-gradient(1px 1px at 40% 80%, #fff, transparent), radial-gradient(2px 2px at 90% 50%, #a78bfa, transparent), radial-gradient(1px 1px at 10% 60%, #fff, transparent), radial-gradient(1px 1px at 70% 40%, #fff, transparent), radial-gradient(1px 1px at 30% 10%, #7df9ff, transparent)",
          backgroundSize: "300px 300px",
          backgroundRepeat: "repeat",
        }}
      />
    </div>
  );
}

export default function Home() {
  const [fontsReady, setFontsReady] = useState(false);
  const [vh, setVh] = useState("100vh");
  const webglSupported = useWebGLSupport();

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
      const h = window.visualViewport?.height ?? window.innerHeight;
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
      {/* Scroll runway — the journey lives in this scroll distance. */}
      <div
        style={{
          height: `calc(${TOTAL_PAGES} * var(--vh, 1vh) * 100)`,
        }}
      />

      {/* 3D scene (fixed, behind everything).
          ThreePatch is imported at the top of this file (before Experience)
          so it runs synchronously at module load — patches Three.js
          prototype.toJSON before any R3F component renders.
          Wrapped in an error boundary so a WebGL crash doesn't take down
          the whole page — the DOM overlays still work on a static bg.
          Also gated on WebGL support — old/broken GPUs skip the canvas. */}
      {fontsReady && webglSupported ? (
        <CanvasErrorBoundary>
          <Experience />
        </CanvasErrorBoundary>
      ) : (
        <StaticBackground />
      )}

      {/* DOM overlay — always rendered, works with or without 3D. */}
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
