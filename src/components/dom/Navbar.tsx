"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import type { SectionId } from "@/lib/journey";
import { PROFILE } from "@/lib/data";
import { scrollToSection, useCurrentSection, useScrollRaf } from "@/lib/scroll";

const LINKS: { id: SectionId; num: string; label: string }[] = [
  { id: "about", num: "01", label: "About" },
  { id: "experience", num: "02", label: "Work" },
  { id: "projects", num: "03", label: "Projects" },
  { id: "contact", num: "04", label: "Contact" },
];

export default function Navbar() {
  const barRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scrolledRef = useRef(false);

  // hero/launch/skills aren't nav links — no link is active during those.
  const active: SectionId = useCurrentSection();

  useScrollRaf((p) => {
    const scrolled = p > 0.02;
    if (scrolled === scrolledRef.current) return;
    scrolledRef.current = scrolled;
    const bar = barRef.current;
    const line = lineRef.current;
    if (!bar || !line) return;
    bar.classList.toggle("glass", scrolled);
    line.style.opacity = scrolled ? "1" : "0";
  });

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40"
    >
      <div
        ref={barRef}
        className="relative flex h-20 w-full items-center justify-between px-8 transition-[background,box-shadow] duration-500 lg:px-14"
      >
        {/* Logo */}
        <button
          type="button"
          data-cursor
          onClick={() => scrollToSection("hero")}
          className="pointer-events-auto"
          aria-label="Back to top"
        >
          <span className="font-display text-2xl font-bold leading-none text-star">
            ab<span className="text-cyan">.</span>
          </span>
        </button>

        {/* Center links */}
        <nav className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 lg:flex">
          {LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <button
                key={link.id}
                type="button"
                data-cursor
                onClick={() => scrollToSection(link.id)}
                className={`relative py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                  isActive ? "text-cyan" : "text-star/60 hover:text-star"
                }`}
              >
                <span className="mr-1.5 text-[9px] text-cyan">{link.num}.</span>
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-x-0 -bottom-px h-px bg-cyan shadow-[0_0_10px_rgba(76,201,240,0.9)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Résumé */}
        <a
          href={PROFILE.resume}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor
          className="pointer-events-auto rounded-full border border-cyan/60 px-6 py-2 font-mono text-xs uppercase tracking-hud text-cyan-bright transition-all duration-300 hover:bg-cyan/15 hover:shadow-[0_0_24px_rgba(76,201,240,0.4)]"
        >
          Résumé ↗
        </a>

        {/* Bottom hairline — appears once scrolled */}
        <div
          ref={lineRef}
          className="hud-line absolute inset-x-0 bottom-0 opacity-0 transition-opacity duration-500"
        />
      </div>
    </motion.header>
  );
}
