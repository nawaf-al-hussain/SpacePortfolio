"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

/**
 * PlanetCarousel — ported from divyashrma18/space (Vite + React + Framer Motion).
 * 6-planet explorer with crossfading backgrounds, rotating planet images,
 * and stats panels. Rebranded with a back-to-portfolio link instead of the
 * original "Space Tour" navbar.
 */

type Planet = {
  name: string;
  desc: string;
  img: string;
  bg: string;
  stats: { label: string; value: string }[];
  style: { width: string; top?: string; left?: string; marginLeft?: string; marginTop?: string };
};

const planets: Planet[] = [
  {
    name: "Sun",
    desc:
      "The blazing star at the center of our solar system — source of all light and energy. " +
      "A colossal nuclear furnace where hydrogen fuses into helium, powering life across the cosmos. " +
      "Its magnetic storms ripple through space, shaping planets, orbits, and even our technology.",
    img: "/images/space-tour/one.png",
    bg: "/images/space-tour/bg1.png",
    stats: [
      { label: "Radius", value: "696,340 km" },
      { label: "Distance from Earth", value: "149.6 million km" },
      { label: "Temperature", value: "5,500°C" },
      { label: "Type", value: "G-Type Main-Sequence Star" },
    ],
    style: { width: "660px", top: "30px", left: "-150px" },
  },
  {
    name: "Earth",
    desc:
      "Our home planet, rich with life, water, and endless beauty. " +
      "A perfect balance of oceans, atmosphere, and sunlight that sustains millions of species. " +
      "From forests to deserts, it remains the only known world to cradle life as we know it.",
    img: "/images/space-tour/two.png",
    bg: "/images/space-tour/bg2.png",
    stats: [
      { label: "Radius", value: "6,371 km" },
      { label: "Distance from Sun", value: "149.6 million km" },
      { label: "Orbital Period", value: "365 days" },
      { label: "Surface Gravity", value: "9.8 m/s²" },
    ],
    style: { width: "660px", marginLeft: "30px", left: "-150px" },
  },
  {
    name: "Mars",
    desc:
      "The red planet — a dusty, cold world with a thin atmosphere and giant volcanoes. " +
      "Home to ancient riverbeds and frozen water, it whispers secrets of a wetter past. " +
      "A future destination for human exploration and perhaps, one day, colonization.",
    img: "/images/space-tour/three.png",
    bg: "/images/space-tour/bg3.png",
    stats: [
      { label: "Radius", value: "3,389 km" },
      { label: "Distance from Sun", value: "227.9 million km" },
      { label: "Orbital Period", value: "687 days" },
      { label: "Surface Gravity", value: "3.7 m/s²" },
    ],
    style: { width: "640px", top: "30px", marginLeft: "50px" },
  },
  {
    name: "Moon",
    desc:
      "Earth's only natural satellite — calm, cratered, and a mirror of sunlight. " +
      "Its gravitational pull choreographs our tides and stabilizes Earth's tilt. " +
      "A silent witness to 4.5 billion years of cosmic history and humanity's first steps beyond Earth.",
    img: "/images/space-tour/four.png",
    bg: "/images/space-tour/bg4.png",
    stats: [
      { label: "Radius", value: "1,737 km" },
      { label: "Distance from Earth", value: "384,400 km" },
      { label: "Orbital Period", value: "27.3 days" },
      { label: "Surface Gravity", value: "1.62 m/s²" },
    ],
    style: { width: "640px", top: "30px", marginTop: "50px" },
  },
  {
    name: "Saturn",
    desc:
      "The ringed giant — majestic with icy rings and swirling storms. " +
      "Its atmosphere glows in pale gold hues, sculpted by powerful winds and magnetic fields. " +
      "The rings, billions of icy fragments, create one of the most mesmerizing sights in space.",
    img: "/images/space-tour/five.png",
    bg: "/images/space-tour/bg5.png",
    stats: [
      { label: "Radius", value: "58,232 km" },
      { label: "Distance from Sun", value: "1.4 billion km" },
      { label: "Orbital Period", value: "29 years" },
      { label: "Surface Gravity", value: "10.4 m/s²" },
    ],
    style: { width: "600px", top: "30px", left: "-150px" },
  },
  {
    name: "Jupiter",
    desc:
      "The gas giant — massive, stormy, and home to the Great Red Spot. " +
      "Its immense gravity protects inner planets by capturing rogue asteroids and comets. " +
      "Beneath its clouds may lie a metallic ocean of hydrogen, conducting electricity like a star.",
    img: "/images/space-tour/six.png",
    bg: "/images/space-tour/bg6.png",
    stats: [
      { label: "Radius", value: "69,911 km" },
      { label: "Distance from Sun", value: "778 million km" },
      { label: "Orbital Period", value: "12 years" },
      { label: "Surface Gravity", value: "24.8 m/s²" },
    ],
    style: { width: "600px", top: "30px", left: "-150px" },
  },
];

export default function PlanetCarousel() {
  const [index, setIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const current = planets[index];
  const bgBackRef = useRef<HTMLDivElement>(null);
  const bgFrontRef = useRef<HTMLDivElement>(null);

  // Crossfade background on planet change
  useEffect(() => {
    const front = bgFrontRef.current;
    const back = bgBackRef.current;
    if (!front || !back) return;

    front.style.backgroundImage = `url(${current.bg})`;
    front.classList.remove("fade-in");
    void front.offsetWidth; // force reflow
    front.classList.add("fade-in");

    const timeout = setTimeout(() => {
      back.style.backgroundImage = front.style.backgroundImage;
      front.classList.remove("fade-in");
    }, 900);

    return () => clearTimeout(timeout);
  }, [index, current.bg]);

  // Preload all background images
  useEffect(() => {
    planets.forEach((p) => {
      const img = new Image();
      img.src = p.bg;
    });
  }, []);

  const nextPlanet = () => {
    setRotation((r) => r + 90);
    setIndex((i) => (i + 1) % planets.length);
  };

  const prevPlanet = () => {
    setRotation((r) => r - 90);
    setIndex((i) => (i - 1 + planets.length) % planets.length);
  };

  return (
    <div className="planet-hero-container">
      {/* Background crossfade layers */}
      <div className="planet-hero-bg-wrapper">
        <div ref={bgBackRef} className="planet-hero-bg planet-bg-back" />
        <div ref={bgFrontRef} className="planet-hero-bg planet-bg-front" />
      </div>

      {/* Rebranded navbar — links back to portfolio */}
      <nav className="planet-navbar">
        <Link href="/" className="planet-brand" aria-label="Back to portfolio">
          <span className="planet-brand-mark">nah</span>
          <span className="planet-brand-dot">.</span>
        </Link>
        <Link href="/" className="planet-back-link">
          ← Back to Portfolio
        </Link>
      </nav>

      <div className="planet-hero-content">
        {/* Left: planet name + description */}
        <div className="planet-hero-left">
          <AnimatePresence mode="wait">
            <motion.h1
              key={current.name}
              className="planet-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {current.name}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={current.desc}
              className="planet-desc"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {current.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Center: rotating planet image */}
        <div className="planet-hero-center">
          <AnimatePresence mode="wait">
            <motion.div
              className="planet-rotate-wrapper"
              animate={{ rotate: rotation }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <motion.img
                key={current.name}
                src={current.img}
                alt={current.name}
                style={current.style}
                className="planet-img"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.99 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation chevrons */}
        <div className="planet-hero-nav">
          <button onClick={prevPlanet} className="planet-nav-btn" aria-label="Previous planet">
            <ChevronLeft size={30} />
          </button>
          <button onClick={nextPlanet} className="planet-nav-btn" aria-label="Next planet">
            <ChevronRight size={30} />
          </button>
        </div>

        {/* Right: stats panel */}
        <div className="planet-hero-right">
          {current.stats.map((s, i) => (
            <div className="planet-stat" key={i}>
              <span className="planet-stat-label">{s.label}</span>
              <span className="planet-stat-value">{s.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
