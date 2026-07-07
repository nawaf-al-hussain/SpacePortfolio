"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TOTAL_PAGES } from "@/lib/journey";
import { initSmoothScroll } from "@/lib/scroll";
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

  useEffect(() => {
    const cleanup = initSmoothScroll();
    let alive = true;
    document.fonts.ready.then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
      cleanup();
    };
  }, []);

  return (
    <main className="relative">
      {/* Scroll runway — the journey lives in this scroll distance */}
      <div style={{ height: `${TOTAL_PAGES * 100}vh` }} />

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
