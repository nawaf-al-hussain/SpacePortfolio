"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useUIStore } from "@/lib/store";

const RING_SIZE = 34;
const DOT_SIZE = 6;
const INTERACTIVE = "a[href], button, [data-cursor]";

/** SSR-safe "(pointer: fine)" media query subscription. */
function useFinePointer(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(pointer: fine)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(pointer: fine)").matches,
    () => false
  );
}

export default function CustomCursor() {
  const fine = useFinePointer();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine) return;

    const html = document.documentElement;
    html.classList.add("custom-cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;

    // Mutable tracking state — no React updates in the hot path.
    const mouse = { x: -200, y: -200 };
    const ringPos = { x: -200, y: -200 };
    let hoverAmt = 0;
    let domHover = false;
    let storeHover = useUIStore.getState().hoveredProject !== null;
    let visible = false;
    let raf = 0;
    let last = performance.now();

    const setVisible = (v: boolean) => {
      if (v === visible) return;
      visible = v;
      const o = v ? "1" : "0";
      if (dot) dot.style.opacity = o;
      if (ring) ring.style.opacity = o;
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // Dot tracks exactly — write immediately for zero perceptible lag.
      if (dot) {
        dot.style.transform = `translate3d(${mouse.x - DOT_SIZE / 2}px, ${
          mouse.y - DOT_SIZE / 2
        }px, 0)`;
      }
      setVisible(true);
    };

    const onOver = (e: PointerEvent) => {
      const t = e.target;
      domHover =
        t instanceof Element ? t.closest(INTERACTIVE) !== null : false;
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const unsub = useUIStore.subscribe((state) => {
      storeHover = state.hoveredProject !== null;
    });

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // Ring trails the mouse with a critically-damped-feeling lerp.
      const kPos = 1 - Math.exp(-14 * dt);
      ringPos.x += (mouse.x - ringPos.x) * kPos;
      ringPos.y += (mouse.y - ringPos.y) * kPos;

      const target = domHover || storeHover ? 1 : 0;
      hoverAmt += (target - hoverAmt) * (1 - Math.exp(-18 * dt));

      if (ring) {
        const s = 1 + 0.6 * hoverAmt;
        ring.style.transform = `translate3d(${ringPos.x - RING_SIZE / 2}px, ${
          ringPos.y - RING_SIZE / 2
        }px, 0) scale(${s})`;
        ring.style.backgroundColor = `rgba(76, 201, 240, ${(
          0.12 * hoverAmt
        ).toFixed(3)})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("blur", onLeave);
      html.classList.remove("custom-cursor-active");
    };
  }, [fine]);

  if (!fine) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] rounded-full border border-cyan/70 opacity-0 transition-opacity duration-200"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          transform: "translate3d(-200px, -200px, 0)",
          boxShadow: "0 0 12px rgba(76,201,240,0.25)",
        }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] rounded-full opacity-0 transition-opacity duration-200"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          background: "#7df9ff",
          transform: "translate3d(-200px, -200px, 0)",
          boxShadow: "0 0 8px rgba(125,249,255,0.9)",
        }}
      />
    </>
  );
}
