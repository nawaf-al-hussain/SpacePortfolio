"use client";

import { Component, type ReactNode } from "react";

/**
 * Error boundary for the 3D canvas. If the WebGL scene crashes (context
 * loss, shader compile error, OOM, driver reset), we show a static gradient
 * background instead of letting the error propagate and white-screen the
 * whole page. The DOM overlays (about, experience, projects, contact) still
 * work — only the 3D layer is replaced.
 *
 * This is the difference between "This page couldn't load" (Vercel error
 * page) and "the 3D scene didn't load, but here's the content."
 */
type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class CanvasErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Log to console for debugging — Vercel's runtime logs will pick this up.
    console.error("[CanvasErrorBoundary] 3D scene crashed:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="fixed inset-0 z-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, #0a0820 0%, #050310 50%, #02010a 100%)",
          }}
        >
          {/* Static starfield via CSS — keeps the dark space aesthetic
              even when WebGL is unavailable. */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 60% 70%, #fff, transparent), radial-gradient(1px 1px at 80% 20%, #9adcff, transparent), radial-gradient(1px 1px at 40% 80%, #fff, transparent), radial-gradient(2px 2px at 90% 50%, #a78bfa, transparent), radial-gradient(1px 1px at 10% 60%, #fff, transparent), radial-gradient(1px 1px at 70% 40%, #fff, transparent), radial-gradient(1px 1px at 30% 10%, #7df9ff, transparent)",
              backgroundSize: "300px 300px",
              backgroundRepeat: "repeat",
            }}
          />
        </div>
      );
    }
    return this.props.children;
  }
}
