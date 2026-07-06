"use client";

import { motion, type Variants } from "motion/react";
import { useRef } from "react";
import { useScrollRaf } from "@/lib/scroll";

function smoothstep(p: number, a: number, b: number): number {
  const t = Math.min(1, Math.max(0, (p - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

const container: Variants = {
  hidden: {},
  show: {
    transition: { delayChildren: 1.2, staggerChildren: 0.14 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Thin vertical telemetry tick line. */
function VLine({ h = 56 }: { h?: number }) {
  return (
    <span
      aria-hidden
      className="block w-px"
      style={{
        height: h,
        background:
          "linear-gradient(180deg, transparent, rgba(154,220,255,0.6) 20%, rgba(154,220,255,0.6) 80%, transparent)",
      }}
    />
  );
}

function TelemetrySquare() {
  return (
    <span aria-hidden className="block h-1.5 w-1.5 border border-hud/70" />
  );
}

export default function HeroOverlay() {
  const rootRef = useRef<HTMLDivElement>(null);

  useScrollRaf((p) => {
    const el = rootRef.current;
    if (!el) return;
    const t = smoothstep(p, 0.02, 0.1);
    el.style.opacity = String(1 - t);
    el.style.transform = `translateY(${-40 * t}px)`;
    el.style.visibility = t >= 0.999 ? "hidden" : "visible";
  });

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 z-10 will-change-transform">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative h-full w-full"
      >
        {/* Identity tag — upper-left of the (3D) title */}
        <motion.div
          variants={item}
          className="absolute left-1/2 top-[26%] -translate-x-1/2 md:left-[50%] md:-translate-x-[72%]"
        >
          <div className="hud-corners px-5 py-2">
            <p className="whitespace-nowrap font-mono text-xs uppercase tracking-hud text-hud">
              ABHISHEK BADAR {"//"} CREATIVE DEVELOPER
            </p>
          </div>
        </motion.div>

        {/* Left telemetry column */}
        <motion.div
          variants={item}
          className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 opacity-40 lg:flex lg:left-10"
        >
          <TelemetrySquare />
          <VLine h={64} />
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-hud [writing-mode:vertical-rl]">
            SYS.OK
          </p>
          <VLine h={40} />
          <TelemetrySquare />
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-hud [writing-mode:vertical-rl]">
            NAV {"//"} AUTO
          </p>
          <VLine h={64} />
          <TelemetrySquare />
        </motion.div>

        {/* Right telemetry column */}
        <motion.div
          variants={item}
          className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-4 opacity-40 lg:flex lg:right-10"
        >
          <TelemetrySquare />
          <VLine h={40} />
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-hud [writing-mode:vertical-rl]">
            ALT +000.4
          </p>
          <VLine h={64} />
          <TelemetrySquare />
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-hud [writing-mode:vertical-rl]">
            THR 000%
          </p>
          <VLine h={40} />
          <TelemetrySquare />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={item}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-6"
        >
          <span className="hud-line hidden w-40 sm:block" />
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-hud text-hud/80">
            Scroll To
          </span>
          <span className="flex h-11 w-7 items-start justify-center rounded-full border border-hud/50 pt-2 shadow-[0_0_16px_rgba(76,201,240,0.15)]">
            <span className="h-2 w-1 animate-scroll-dot rounded-full bg-cyan-bright shadow-[0_0_8px_rgba(125,249,255,0.9)]" />
          </span>
          <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-hud text-hud/80">
            Explore
          </span>
          <span className="hud-line hidden w-40 sm:block" />
        </motion.div>
      </motion.div>
    </div>
  );
}
