"use client";

import { Component, type ReactNode } from "react";

/**
 * Error boundary for the 3D canvas. If the WebGL scene crashes, we show a
 * static gradient background and RETRY INDEFINITELY with exponential backoff.
 *
 * Previous version gave up after 3 retries — that caused the 3D to
 * permanently disappear when a transient error was caught. Now it never
 * gives up: 1s → 2s → 4s → 8s → 16s (capped), repeating forever.
 * Transient errors (GPU memory hiccups, texture loading timeouts) recover
 * automatically. Permanent errors (no WebGL) are handled by the
 * useWebGLSupport check in page.tsx, which never mounts the canvas at all.
 */
type Props = { children: ReactNode };
type State = { hasError: boolean; retryCount: number; lastError?: string };

const INITIAL_DELAY = 1000;
const MAX_DELAY = 16000;

export default class CanvasErrorBoundary extends Component<Props, State> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      retryCount: 0,
      lastError: error instanceof Error ? error.message : String(error),
    };
  }

  componentDidCatch(error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CanvasErrorBoundary] 3D scene crashed:", msg);
    this.scheduleRetry();
  }

  scheduleRetry() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
    const delay = Math.min(INITIAL_DELAY * 2 ** this.state.retryCount, MAX_DELAY);
    console.log(
      `[CanvasErrorBoundary] Retry ${this.state.retryCount + 1} in ${delay}ms...`
    );
    this.retryTimer = setTimeout(() => {
      this.setState((s) => ({
        hasError: false,
        retryCount: s.retryCount + 1,
      }));
    }, delay);
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
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
          {/* Static starfield via CSS — keeps the dark space aesthetic. */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(1px 1px at 20% 30%, #fff, transparent), radial-gradient(1px 1px at 60% 70%, #fff, transparent), radial-gradient(1px 1px at 80% 20%, #9adcff, transparent), radial-gradient(1px 1px at 40% 80%, #fff, transparent), radial-gradient(2px 2px at 90% 50%, #a78bfa, transparent), radial-gradient(1px 1px at 10% 60%, #fff, transparent), radial-gradient(1px 1px at 70% 40%, #fff, transparent), radial-gradient(1px 1px at 30% 10%, #7df9ff, transparent)",
              backgroundSize: "300px 300px",
              backgroundRepeat: "repeat",
            }}
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
            Reconnecting 3D engine...
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
