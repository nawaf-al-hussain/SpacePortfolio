"use client";

import { useRef } from "react";
import { SECTIONS, sectionAt, type SectionId } from "@/lib/journey";
import { scrollToSection, useCurrentSection, useScrollRaf } from "@/lib/scroll";

const LABELS = Object.fromEntries(
  SECTIONS.map((s) => [s.id, s.label])
) as Record<SectionId, string>;

export default function HUDRail() {
  const current = useCurrentSection();

  const fillRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLSpanElement>(null);
  const velRef = useRef<HTMLSpanElement>(null);
  const secRef = useRef<HTMLSpanElement>(null);
  const cache = useRef({ fill: "", alt: "", vel: "", sec: "", lastText: 0 });

  useScrollRaf((p, v) => {
    const c = cache.current;

    // Fill via transform — composited, never triggers layout
    const fill = p.toFixed(4);
    if (fill !== c.fill && fillRef.current) {
      c.fill = fill;
      fillRef.current.style.transform = `scaleY(${fill})`;
    }

    // Text readouts tick at ~8Hz like real telemetry — text mutations
    // invalidate layout, so keep them off the per-frame path
    const now = performance.now();
    if (now - c.lastText < 120) return;
    c.lastText = now;

    const alt = `ALT +${(p * 420).toFixed(1)} KM`;
    if (alt !== c.alt && altRef.current) {
      c.alt = alt;
      altRef.current.textContent = alt;
    }

    const vel = `VEL ${(Math.abs(v) * 2400).toFixed(0)} M/S`;
    if (vel !== c.vel && velRef.current) {
      c.vel = vel;
      velRef.current.textContent = vel;
    }

    const sec = `SEC // ${LABELS[sectionAt(p)].toUpperCase()}`;
    if (sec !== c.sec && secRef.current) {
      c.sec = sec;
      secRef.current.textContent = sec;
    }
  });

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-0 lg:flex">
      {/* flight-progress rail */}
      <div className="relative h-[240px] w-px bg-white/15">
        {/* progress fill */}
        <div
          ref={fillRef}
          className="absolute left-0 top-0 h-full w-full origin-top bg-gradient-to-b from-cyan-bright via-cyan to-nebula shadow-[0_0_8px_rgba(76,201,240,0.7)]"
          style={{ transform: "scaleY(0)" }}
        />

        {/* section ticks */}
        {SECTIONS.map((s) => {
          const active = current === s.id;
          return (
            <button
              key={s.id}
              type="button"
              data-cursor="hover"
              aria-label={`Go to ${s.label}`}
              onClick={() => scrollToSection(s.id)}
              className="group pointer-events-auto absolute left-1/2 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              style={{ top: `${s.range[0] * 100}%` }}
            >
              <span
                className={`block h-2 w-2 rotate-45 border transition-all duration-300 ${
                  active
                    ? "border-cyan bg-cyan shadow-[0_0_10px_rgba(76,201,240,0.9)]"
                    : "border-white/40 bg-space/70 group-hover:border-cyan-bright group-hover:shadow-[0_0_8px_rgba(125,249,255,0.5)]"
                }`}
              />
              <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-hud opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* live telemetry */}
      <div className="mt-6 text-right font-mono text-[9px] leading-relaxed text-hud/70">
        <span ref={altRef} className="block" />
        <span ref={velRef} className="block" />
        <span ref={secRef} className="block" />
      </div>
    </div>
  );
}
