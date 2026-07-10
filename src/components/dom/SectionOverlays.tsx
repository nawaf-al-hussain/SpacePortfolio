"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ARCHIVE_URL, EXPERIENCE, PROFILE, PROJECTS } from "@/lib/data";
import { useScrollRaf } from "@/lib/scroll";
import { sectionAt, type SectionId } from "@/lib/journey";
import { useUIStore } from "@/lib/store";

/** Mobile breakpoint matchMedia hook — lg breakpoint is 1024px in Tailwind. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

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

const CONTACT_COPY =
  "I'm currently open to new opportunities — full-time, contract, or just a good chat. Whether you have a project idea, a question, or you just want to say hi, my inbox is the best way to reach me.";

/* ------------------------------------------------------------------ */
/* MobileSheet — collapsible bottom-sheet wrapper                      */
/* ------------------------------------------------------------------ */

/**
 * Wraps a panel's content. On mobile: renders a sticky header that's always
 * visible (kicker + title + chevron), and a body that expands/collapses on
 * tap. Collapsed = header only (~64px, scene fully visible). Expanded =
 * up to 80vh with internal scroll.
 *
 * On desktop (lg+): renders children directly, no collapse behavior —
 * the desktop cards are already the right size.
 *
 * Touch behavior: the header is pointer-events-auto (tappable). The body
 * is pointer-events-none when collapsed (touch passes through to scroll)
 * and pointer-events-auto when expanded (internal scroll). This avoids the
 * scroll-trap bug from the previous iteration.
 */
function MobileSheet({
  panelRef,
  hiddenStyle,
  kicker,
  title,
  expanded,
  onToggle,
  children,
  desktopClass,
}: {
  panelRef: React.RefObject<HTMLDivElement | null>;
  hiddenStyle: CSSProperties;
  kicker: string;
  title: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  /** Desktop-only classes applied to the outer panel (lg:). */
  desktopClass: string;
}) {
  const isMobile = useIsMobile();
  // On mobile: show body only when expanded. On desktop: always show.
  // Using conditional rendering (not CSS) so there's zero ambiguity —
  // the body DOM nodes don't exist when collapsed on mobile.
  const showBody = !isMobile || expanded;

  return (
    <div
      ref={panelRef}
      style={{
        ...hiddenStyle,
        background:
          "linear-gradient(150deg, rgba(14,20,42,0.94), rgba(6,8,20,0.94))",
        boxShadow:
          "0 0 40px rgba(5,8,20,0.7), 0 0 24px rgba(76,201,240,0.1), inset 0 1px 0 rgba(255,255,255,0.08)",
        backdropFilter: "blur(18px)",
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(76,201,240,0.35) transparent",
      }}
      className={`hud-corners w-full max-w-[calc(100vw-1.5rem)] rounded-2xl border border-hud/25 p-0 sm:p-0 lg:pointer-events-auto lg:p-8 ${desktopClass}`}
    >
      {/* Mobile: sticky tap-to-expand header. Desktop: hidden (content flows directly). */}
      {isMobile && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="pointer-events-auto flex w-full items-center justify-between gap-3 px-5 py-3.5"
        >
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-hud">
              {kicker}
            </p>
            <div className="mt-0.5 truncate font-display text-[15px] font-bold leading-tight text-star">
              {title}
            </div>
          </div>
          <span
            aria-hidden
            className={`shrink-0 text-cyan transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            {/* Chevron */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>
      )}

      {/* Body: conditional render. Mobile collapsed = no DOM. Desktop = always. */}
      {showBody && (
        <div
          className={
            isMobile
              ? "pointer-events-auto max-h-[72vh] overflow-y-auto p-5 pt-0"
              : ""
          }
        >
          {/* Desktop: render kicker + title inside the body (mobile uses the header). */}
          {!isMobile && (
            <>
              <Kicker>{kicker}</Kicker>
              <h2 className="mt-3 font-display text-[32px] font-bold leading-[1.05] text-star sm:text-[40px]">
                {title}
              </h2>
            </>
          )}
          {/* Mobile: spacer between header and body when expanded */}
          {isMobile && <div className="h-4" />}
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function SectionOverlays() {
  const aboutRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const lastAbout = useRef(-1);
  const lastExperience = useRef(-1);
  const lastSkills = useRef(-1);
  const lastProjects = useRef(-1);
  const lastContact = useRef(-1);

  useScrollRaf((p) => {
    applyPanel(
      aboutRef.current,
      lastAbout,
      envelope(p, 0.205, 0.235, 0.315, 0.34),
      (a) => `translateX(${(-40 * (1 - a)).toFixed(2)}px)`
    );
    applyPanel(
      experienceRef.current,
      lastExperience,
      envelope(p, 0.355, 0.39, 0.475, 0.5),
      (a) => `translateX(${(40 * (1 - a)).toFixed(2)}px)`
    );
    applyPanel(
      skillsRef.current,
      lastSkills,
      envelope(p, 0.51, 0.54, 0.595, 0.62),
      (a) => `translateY(${(-18 * (1 - a)).toFixed(2)}px)`
    );
    applyPanel(
      projectsRef.current,
      lastProjects,
      envelope(p, 0.635, 0.665, 0.775, 0.8),
      (a) => `translateX(${(-28 * (1 - a)).toFixed(2)}px)`
    );
    applyPanel(
      contactRef.current,
      lastContact,
      smoothstep(0.82, 0.875, p),
      (a) => `translateX(${(40 * (1 - a)).toFixed(2)}px)`
    );
  });

  /* ---------------- experience tabs ---------------- */
  const [activeJob, setActiveJob] = useState(0);
  const job = EXPERIENCE[activeJob];

  /* ---------------- mobile sheet expand/collapse state ---------------- */
  // Sheets are COLLAPSED by default — user taps the header to expand.
  // They auto-collapse when scrolling away so they don't linger expanded.
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [expExpanded, setExpExpanded] = useState(false);
  const [contactExpanded, setContactExpanded] = useState(false);
  const lastSection = useRef<SectionId>("hero");

  useScrollRaf((p) => {
    // Auto-collapse on section exit — no auto-expand (user chooses).
    const s = sectionAt(p);
    if (s !== lastSection.current) {
      const prev = lastSection.current;
      lastSection.current = s;
      if (prev === "about") setAboutExpanded(false);
      if (prev === "experience") setExpExpanded(false);
      if (prev === "contact") setContactExpanded(false);
    }
  });

  /* ---------------- projects hover chip ---------------- */
  const hoveredId = useUIStore((s) => s.hoveredProject);
  const hovered = hoveredId
    ? (PROJECTS.find((pr) => pr.id === hoveredId) ?? null)
    : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      {/* ============ 01 // ABOUT ============ */}
      {/* Mobile: collapsible bottom sheet. Desktop: left card. */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3 lg:inset-x-auto lg:inset-y-0 lg:left-0 lg:block lg:px-0 lg:pb-0 lg:flex lg:items-center">
        <MobileSheet
          panelRef={aboutRef}
          hiddenStyle={HIDDEN}
          kicker="01 // About"
          title={<>Full stack, fewer <span className="text-cyan">bottlenecks</span></>}
          expanded={aboutExpanded}
          onToggle={() => setAboutExpanded((v) => !v)}
          desktopClass="lg:max-h-[80vh] lg:w-[470px] lg:max-w-[calc(100vw-4rem)] lg:overflow-visible lg:ml-16"
        >
          <p className="mt-4 text-[14px] leading-relaxed text-white/85 sm:mt-5 sm:text-[15px] lg:mt-5">
            {PROFILE.about.lead}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/75 sm:mt-4 sm:text-sm lg:mt-4">
            {PROFILE.about.p2}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-white/75 sm:mt-4 sm:text-sm lg:mt-4">
            {PROFILE.about.p3}
          </p>
          <div className="hud-line mt-5 sm:mt-6" />
          <ul className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
            {PROFILE.about.credentials.map((cred) => (
              <li
                key={cred}
                className="font-mono text-xs uppercase tracking-wide text-star/85"
              >
                <span className="text-cyan">▹</span> {cred}
              </li>
            ))}
          </ul>
        </MobileSheet>
      </div>

      {/* ============ 02 // EXPERIENCE ============ */}
      {/* Mobile: collapsible bottom sheet. Desktop: right card. */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3 lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:block lg:px-0 lg:pb-0 lg:flex lg:items-center">
        <MobileSheet
          panelRef={experienceRef}
          hiddenStyle={HIDDEN}
          kicker="02 // Where I've been building"
          title={job.title}
          expanded={expExpanded}
          onToggle={() => setExpExpanded((v) => !v)}
          desktopClass="lg:max-h-[80vh] lg:w-[560px] lg:max-w-[calc(100vw-4rem)] lg:overflow-visible lg:mr-24"
        >
          <div className="pointer-events-auto mt-4 flex flex-wrap gap-2 sm:gap-3">
            {EXPERIENCE.map((j, i) => (
              <button
                key={j.company}
                type="button"
                data-cursor="hover"
                onClick={() => setActiveJob(i)}
                className={`rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
                  i === activeJob
                    ? "border-cyan bg-cyan/15 text-cyan-bright shadow-[0_0_14px_rgba(76,201,240,0.25)]"
                    : "border-white/20 text-star/70 hover:border-white/40 hover:text-star"
                }`}
              >
                {j.company.split(" ")[0]}
              </button>
            ))}
          </div>

          <h3 className="mt-5 font-display text-[20px] font-bold leading-snug text-white sm:text-[22px]">
            {job.title} <span className="text-cyan">@ {job.company}</span>
          </h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-hud/90">
            {job.range} · {job.location}
          </p>
          <p className="mt-3 text-[14px] leading-relaxed text-white/85 sm:text-[15px]">
            {job.blurb}
          </p>

          <div className="hud-line mt-4" />

          {/* Inner scroll only on desktop — on mobile the outer panel scrolls */}
          <ul
            key={activeJob}
            onWheel={(e) => e.stopPropagation()}
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(76,201,240,0.35) transparent",
            }}
            className="mt-4 space-y-3 pr-2 lg:max-h-[300px] lg:overflow-y-auto"
          >
            {job.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 text-[13px] leading-relaxed text-white/80 sm:text-sm"
              >
                <span className="mt-0.5 shrink-0 text-cyan">▹</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </MobileSheet>
      </div>

      {/* ============ SKILLS ============ */}
      <div className="absolute inset-x-0 top-28 flex justify-center">
        <div ref={skillsRef} style={HIDDEN} className="px-6 text-center">
          <Kicker>{"// Systems check"}</Kicker>
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
          <Kicker>03 // Some things I&apos;ve built</Kicker>
          <h2
            className="mt-2 font-display text-[34px] font-bold text-star"
            style={{ textShadow: "0 0 28px rgba(124,58,237,0.4)" }}
          >
            Projects in orbit
          </h2>
          <p className="mt-3 animate-blink font-mono text-xs tracking-[0.2em] text-hud">
            ▸ CLICK A CARD TO INSPECT
          </p>
          <a
            href={ARCHIVE_URL}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="pointer-events-auto mt-3 inline-block font-mono text-xs text-star/60 underline-offset-4 transition-colors hover:text-cyan hover:underline"
          >
            Explore the archive ↗
          </a>
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
      {/* Mobile: collapsible bottom sheet. Desktop: right card. */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center px-3 pb-3 lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:block lg:px-0 lg:pb-0 lg:flex lg:items-center">
        <MobileSheet
          panelRef={contactRef}
          hiddenStyle={HIDDEN}
          kicker="04 // What's next"
          title={<>Let's make something <span className="text-cyan">together</span></>}
          expanded={contactExpanded}
          onToggle={() => setContactExpanded((v) => !v)}
          desktopClass="lg:max-h-[80vh] lg:w-[460px] lg:max-w-[calc(100vw-4rem)] lg:overflow-visible lg:mr-24"
        >
          <p className="mt-4 text-[15px] leading-relaxed text-white/80 lg:mt-4">
            {CONTACT_COPY}
          </p>

          {/* No backend, no forms — straight to the inbox */}
          <a
            href={`mailto:${PROFILE.email}`}
            data-cursor="hover"
            className="pointer-events-auto mt-7 block w-full rounded-full bg-gradient-to-r from-cyan to-nebula py-3.5 text-center font-display text-lg font-semibold tracking-wide text-space transition hover:brightness-110 active:scale-[0.98]"
          >
            {PROFILE.email} →
          </a>
          <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
            Opens your mail app — I reply within 24h
          </p>

          <div className="hud-line mt-6" />

          <div className="pointer-events-auto mt-5 flex items-center justify-between">
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
                href={PROFILE.socials.portfolio}
                target="_blank"
                rel="noreferrer"
                aria-label="Portfolio"
                data-cursor="hover"
                className="text-white/50 transition-colors hover:text-cyan"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                aria-label="Email"
                data-cursor="hover"
                className="text-white/50 transition-colors hover:text-cyan"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 6L2 7" />
                </svg>
              </a>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
              GitHub · Portfolio · Email
            </span>
          </div>

          <p className="mt-5 font-mono text-[10px] tracking-[0.14em] text-white/25">
            © 2026 NAWAF AL HUSSAIN — BUILT WITH NEXT.JS + R3F
          </p>
        </MobileSheet>
      </div>
    </div>
  );
}
