"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { PROFILE } from "@/lib/data";

const LINKS: { label: string; href: string; external: boolean; icon: ReactNode }[] = [
  {
    label: "GitHub",
    href: PROFILE.socials.github,
    external: true,
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: "Portfolio",
    href: PROFILE.socials.portfolio,
    external: true,
    icon: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: `mailto:${PROFILE.email}`,
    external: false,
    icon: (
      <svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </svg>
    ),
  },
];

export default function SocialRail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed bottom-0 left-6 z-30 hidden flex-col items-center gap-5 lg:flex"
    >
      {LINKS.map((link) => (
        <a
          key={link.label}
          href={link.href}
          aria-label={link.label}
          data-cursor
          className="pointer-events-auto text-star/50 transition-all duration-300 hover:-translate-y-0.5 hover:text-cyan"
          {...(link.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {link.icon}
        </a>
      ))}

      {/* rail line down to the screen edge */}
      <span className="h-24 w-px bg-white/25" />
    </motion.div>
  );
}
