"use client";

import { motion, AnimatePresence } from "motion/react";
import { useScrollRaf } from "@/lib/scroll";
import { useState } from "react";

/**
 * BackToTop — floating arrow button that appears after scrolling past 50%.
 * Smooth-scrolls back to the top. Hidden on mobile (the mobile experience
 * already has the navbar logo for this purpose, and a floating button would
 * overlap the bottom-sheet panels).
 */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useScrollRaf((p) => {
    setVisible(p > 0.5);
  });

  const handleClick = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Back to top"
          data-cursor="hover"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="glass pointer-events-auto fixed bottom-8 right-8 z-30 hidden h-12 w-12 items-center justify-center rounded-full border border-cyan/40 text-cyan-bright transition-all hover:border-cyan hover:shadow-[0_0_24px_rgba(76,201,240,0.4)] active:scale-[0.92] lg:flex"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
