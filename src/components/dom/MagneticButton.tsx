"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";
import { TASTE } from "@/lib/taste";

/**
 * MagneticButton — wraps any element and makes it pull slightly toward the
 * cursor on hover. Uses Framer Motion's useMotionValue + useSpring (NOT
 * React useState) per taste-skill rule:
 *
 *   "Magnetic Micro-physics — NEVER use React useState for magnetic hover.
 *    Use EXCLUSIVELY Framer Motion's useMotionValue and useTransform
 *    outside the React render cycle to prevent performance collapse."
 *
 * The magnetic effect is disabled on touch devices (no hover) and when
 * TASTE.magneticButtons is false.
 *
 * Usage:
 *   <MagneticButton strength={0.3}>
 *     <button>Click me</button>
 *   </MagneticButton>
 */
export default function MagneticButton({
  children,
  strength = 0.3,
  className = "",
}: {
  children: ReactNode;
  /** How strongly the element pulls toward the cursor (0 = off, 1 = follows exactly). */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring smoothing for a weighty, premium feel — no linear easing.
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!TASTE.magneticButtons) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (!TASTE.magneticButtons) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: xSpring, y: ySpring }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
