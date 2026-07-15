"use client";

import Link from "next/link";

/**
 * Themed 404 page — "Signal Lost in Space".
 * Matches the portfolio's dark space aesthetic instead of Next.js's
 * default error page.
 */
export default function NotFound() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{ background: "#02010a" }}
    >
      {/* Static starfield background */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 60% 70%, #fff, transparent), radial-gradient(1px 1px at 80% 20%, #9adcff, transparent), radial-gradient(1px 1px at 40% 80%, #fff, transparent), radial-gradient(2px 2px at 90% 50%, #a78bfa, transparent), radial-gradient(1px 1px at 10% 60%, #fff, transparent), radial-gradient(1px 1px at 70% 40%, #fff, transparent), radial-gradient(1px 1px at 30% 10%, #7df9ff, transparent)",
          backgroundSize: "300px 300px",
          backgroundRepeat: "repeat",
        }}
      />

      {/* Floating astronaut-ish glow */}
      <div
        className="absolute h-64 w-64 rounded-full opacity-20 blur-3xl"
        style={{
          background: "radial-gradient(circle, #4cc9f0 0%, transparent 70%)",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      <div className="relative z-10 px-6 text-center">
        {/* 404 in big display font */}
        <h1
          className="font-display text-[120px] font-bold leading-none text-star sm:text-[180px]"
          style={{
            background: "linear-gradient(180deg, #ffffff 0%, #4cc9f0 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textShadow: "0 0 80px rgba(76,201,240,0.3)",
          }}
        >
          404
        </h1>

        <p
          className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-hud"
        >
          Signal Lost in Space
        </p>

        <p
          className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/60"
          style={{ fontFamily: "var(--font-body, 'Geist', sans-serif)" }}
        >
          The trajectory you're following leads nowhere. The coordinates
          don't exist in this sector. Let's get you back to known space.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full border border-cyan/60 bg-cyan/10 px-8 py-3 font-mono text-xs uppercase tracking-[0.14em] text-cyan-bright transition-all hover:bg-cyan/20 hover:shadow-[0_0_24px_rgba(76,201,240,0.4)] active:scale-[0.96]"
        >
          ↩ Return to Launch
        </Link>
      </div>
    </div>
  );
}
