"use client";

import { useRef, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PROFILE, PROJECTS } from "@/lib/data";
import { useScrollRaf } from "@/lib/scroll";
import { useUIStore } from "@/lib/store";

/* ------------------------------------------------------------------ */
/* Scroll envelope helpers                                             */
/* ------------------------------------------------------------------ */

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

/** alpha ramps in over [a0,a1] and back out over [b0,b1]. */
function envelope(
  p: number,
  a0: number,
  a1: number,
  b0: number,
  b1: number
): number {
  return smoothstep(a0, a1, p) * (1 - smoothstep(b0, b1, p));
}

function applyPanel(
  el: HTMLDivElement | null,
  last: { current: number },
  alpha: number,
  transform: (a: number) => string
) {
  if (!el) return;
  if (Math.abs(alpha - last.current) < 0.0008) return;
  last.current = alpha;
  el.style.opacity = alpha.toFixed(4);
  el.style.transform = transform(alpha);
  el.style.visibility = alpha < 0.02 ? "hidden" : "visible";
}

const HIDDEN: CSSProperties = {
  opacity: 0,
  visibility: "hidden",
  willChange: "opacity, transform",
};

/* ------------------------------------------------------------------ */
/* Small shared bits                                                   */
/* ------------------------------------------------------------------ */

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs tracking-hud text-hud uppercase">
      {children}
    </p>
  );
}

const inputClass =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-star placeholder:text-white/25 outline-none transition-[border-color,box-shadow] duration-200 focus:border-cyan focus:shadow-[0_0_16px_rgba(76,201,240,0.25)]";

const labelClass =
  "mb-1.5 block font-mono text-[10px] uppercase tracking-[0.22em] text-white/50";

/* ------------------------------------------------------------------ */

export default function SectionOverlays() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const lastAbout = useRef(-1);
  const lastSkills = useRef(-1);
  const lastProjects = useRef(-1);
  const lastContact = useRef(-1);

  useScrollRaf((p) => {
    applyPanel(
      aboutRef.current,
      lastAbout,
      envelope(p, 0.235, 0.265, 0.365, 0.4),
      (a) => `translateX(${(-40 * (1 - a)).toFixed(2)}px)`
    );
    applyPanel(
      skillsRef.current,
      lastSkills,
      envelope(p, 0.41, 0.44, 0.53, 0.56),
      (a) => `translateY(${(-18 * (1 - a)).toFixed(2)}px)`
    );
    applyPanel(
      projectsRef.current,
      lastProjects,
      envelope(p, 0.575, 0.61, 0.75, 0.78),
      (a) => `translateX(${(-28 * (1 - a)).toFixed(2)}px)`
    );
    applyPanel(
      contactRef.current,
      lastContact,
      smoothstep(0.8, 0.855, p),
      (a) => `translateX(${(40 * (1 - a)).toFixed(2)}px)`
    );
  });

  /* ---------------- projects hover chip ---------------- */
  const hoveredId = useUIStore((s) => s.hoveredProject);
  const hovered = hoveredId
    ? (PROJECTS.find((pr) => pr.id === hoveredId) ?? null)
    : null;

  /* ---------------- contact form ---------------- */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Mission inquiry from ${name || "a visitor"}`
    );
    const body = encodeURIComponent(
      `${message}\n\n— ${name}${email ? ` (${email})` : ""}`
    );
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* ============ 01 // ABOUT ============ */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <div
          ref={aboutRef}
          style={HIDDEN}
          className="glass hud-corners ml-8 w-[440px] max-w-[calc(100vw-4rem)] rounded-2xl p-8 lg:ml-16"
        >
          <Kicker>01 // About me</Kicker>
          <h2 className="mt-3 font-display text-[40px] font-bold leading-[1.05] text-star">
            Mission <span className="text-cyan">commander</span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/70">
            {PROFILE.bio}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/50">
            {PROFILE.bio2}
          </p>
          <div className="hud-line mt-6" />
          <div className="mt-5 grid grid-cols-3 divide-x divide-white/10">
            {PROFILE.stats.map((stat, i) => (
              <div key={stat.label} className={i === 0 ? "pr-4" : "px-4"}>
                <div className="font-display text-3xl font-bold text-cyan">
                  {stat.value}
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ 02 // SKILLS ============ */}
      <div className="absolute inset-x-0 top-28 flex justify-center">
        <div ref={skillsRef} style={HIDDEN} className="px-6 text-center">
          <Kicker>02 // Systems check</Kicker>
          <h2
            className="mt-2 font-display text-[28px] font-bold text-star"
            style={{
              textShadow:
                "0 0 24px rgba(76,201,240,0.45), 0 0 64px rgba(124,58,237,0.35)",
            }}
          >
            Skill modules online
          </h2>
          <p className="mt-2 font-mono text-xs tracking-[0.3em] text-white/40">
            FLY THROUGH THE CALIBRATION CORRIDOR
          </p>
        </div>
      </div>

      {/* ============ 03 // PROJECTS ============ */}
      <div className="absolute left-8 top-28 lg:left-16">
        <div ref={projectsRef} style={HIDDEN}>
          <Kicker>03 // Selected missions</Kicker>
          <h2
            className="mt-2 font-display text-[34px] font-bold text-star"
            style={{ textShadow: "0 0 28px rgba(124,58,237,0.4)" }}
          >
            Projects in orbit
          </h2>
          <p className="mt-3 animate-blink font-mono text-xs tracking-[0.2em] text-hud">
            ▸ CLICK A CARD TO INSPECT
          </p>
        </div>
      </div>

      {/* target-locked hint chip */}
      <div className="absolute bottom-8 right-8">
        <AnimatePresence mode="wait">
          {hovered && (
            <motion.div
              key={hovered.id}
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="glass flex items-center gap-2.5 rounded-full px-4 py-2"
            >
              <span className="block h-1.5 w-1.5 rotate-45 animate-blink bg-cyan shadow-[0_0_8px_rgba(76,201,240,0.9)]" />
              <span className="font-mono text-[10px] tracking-[0.22em] text-hud">
                TARGET LOCKED // {hovered.title.toUpperCase()}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ============ 04 // CONTACT ============ */}
      <div className="absolute inset-y-0 right-0 flex items-center">
        <div
          ref={contactRef}
          style={HIDDEN}
          className="glass hud-corners pointer-events-auto mr-8 w-[460px] max-w-[calc(100vw-4rem)] rounded-2xl p-8 lg:mr-24"
        >
          <Kicker>04 // Transmission</Kicker>
          <h2 className="mt-2 font-display text-[38px] font-bold leading-[1.05] text-star">
            Start a <span className="text-cyan">mission</span>
          </h2>
          <p className="mt-3 text-sm text-white/60">
            Have an ambitious idea? Open a channel — I&apos;m listening.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="tx-name" className={labelClass}>
                  Callsign / Name
                </label>
                <input
                  id="tx-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className={inputClass}
                  data-cursor="hover"
                />
              </div>
              <div>
                <label htmlFor="tx-email" className={labelClass}>
                  Return signal / Email
                </label>
                <input
                  id="tx-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@galaxy.dev"
                  className={inputClass}
                  data-cursor="hover"
                />
              </div>
            </div>
            <div>
              <label htmlFor="tx-message" className={labelClass}>
                Message payload
              </label>
              <textarea
                id="tx-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about the mission…"
                className={`${inputClass} resize-none`}
                data-cursor="hover"
              />
            </div>

            {sent ? (
              <p className="py-2 font-mono text-xs tracking-[0.14em] text-cyan">
                {"// SIGNAL SENT — I'll respond within 24h"}
              </p>
            ) : (
              <button
                type="submit"
                data-cursor="hover"
                className="w-full rounded-full bg-gradient-to-r from-cyan to-nebula py-3 font-display font-semibold tracking-wide text-space transition hover:brightness-110 active:scale-[0.98]"
              >
                TRANSMIT MESSAGE ▸
              </button>
            )}
          </form>

          <div className="hud-line mt-6" />

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a
                href={PROFILE.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                data-cursor="hover"
                className="text-white/50 transition-colors hover:text-cyan"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.66.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
              <a
                href={PROFILE.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                data-cursor="hover"
                className="text-white/50 transition-colors hover:text-cyan"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
                </svg>
              </a>
              <a
                href={PROFILE.socials.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                data-cursor="hover"
                className="text-white/50 transition-colors hover:text-cyan"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
                </svg>
              </a>
            </div>
            <a
              href={`mailto:${PROFILE.email}`}
              data-cursor="hover"
              className="font-mono text-[11px] text-white/50 transition-colors hover:text-cyan"
            >
              {PROFILE.email}
            </a>
          </div>

          <p className="mt-5 font-mono text-[10px] tracking-[0.14em] text-white/25">
            © 2026 ABHISHEK BADAR — BUILT WITH NEXT.JS + R3F
          </p>
        </div>
      </div>
    </div>
  );
}
