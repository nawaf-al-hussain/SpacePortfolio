"use client";

/**
 * Next.js App Router error boundary — catches any unhandled error that
 * escapes the component tree (including errors in layout.tsx, hooks that
 * run during render, hydration mismatches, etc.).
 *
 * Without this, an unhandled error shows Vercel's default "This page
 * couldn't load" error page. With this, the user sees a themed fallback
 * with a retry button.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "#02010a" }}
    >
      <div className="max-w-md px-6 text-center">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-cyan/40 bg-cyan/5">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#4cc9f0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <h1
          className="font-display text-2xl font-bold text-white"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Signal Lost
        </h1>
        <p
          className="mt-3 text-sm leading-relaxed text-white/60"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          The 3D engine hit turbulence. Your content is still here — try
          reloading, or scroll to explore the static version.
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-full border border-cyan/60 bg-cyan/10 px-6 py-2.5 font-mono text-xs uppercase tracking-[0.14em] text-cyan-bright transition hover:bg-cyan/20"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          ↻ Retry Launch
        </button>
      </div>
    </div>
  );
}
