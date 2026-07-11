"use client";

import { Component, type ReactNode } from "react";

/**
 * Error boundary for the 3D canvas. If the WebGL scene crashes (context
 * loss, shader compile error, OOM, driver reset), we show a static gradient
 * background instead of letting the error propagate and white-screen the
 * whole page.
 *
 * AUTO-RETRY: On mobile, WebGL context loss is often temporary (GPU memory
 * pressure recovers). Instead of permanently showing the fallback, this
 * boundary auto-retries mounting the canvas up to MAX_RETRIES times, with
 * RETRY_DELAY ms between attempts. If all retries fail, it stays on the
 * static fallback — the DOM overlays still work.
 */
type Props = { children: ReactNode };
type State = { hasError: boolean; retryCount: number };

const MAX_RETRIES = 3;
const RETRY_DELAY = 2500; // ms

export default class CanvasErrorBoundary extends Component<Props, State> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true, retryCount: 0 };
  }

  componentDidCatch(error: unknown) {
    console.error("[CanvasErrorBoundary] 3D scene crashed:", error);
    this.scheduleRetry();
  }

  scheduleRetry() {
    if (this.state.retryCount >= MAX_RETRIES) return;
    if (this.retryTimer) clearTimeout(this.retryTimer);
    this.retryTimer = setTimeout(() => {
      console.log(
        `[CanvasErrorBoundary] Retry ${this.state.retryCount + 1}/${MAX_RETRIES}...`
      );
      this.setState((s) => ({
        hasError: false,
        retryCount: s.retryCount + 1,
      }));
    }, RETRY_DELAY);
  }

  componentWillUnmount() {
    if (this.retryTimer) clearTimeout(this.retryTimer);
  }

  render() {
    if (this.state.hasError) {
      const exhausted = this.state.retryCount >= MAX_RETRIES;
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
          {!exhausted && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
              Reconnecting 3D engine...
            </div>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}
