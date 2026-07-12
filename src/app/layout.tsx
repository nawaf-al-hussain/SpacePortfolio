import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Geist, JetBrains_Mono } from "next/font/google";
import {
  PROFILE,
  SKILLS,
  PROJECTS,
  SITE_URL,
} from "@/lib/data";
import { TASTE } from "@/lib/taste";
import SeoContent from "@/components/dom/SeoContent";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Taste-skill Fix 1: Geist replaces Inter (Inter is banned by the taste-skill
// as an overused AI default). Geist has a similar neutral geometry but a
// more distinct character. Toggle off via TASTE.useGeistFont to revert.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Kept for fallback when TASTE.useGeistFont is false.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// Apply only the active body font's variable to <html>. The CSS @theme
// uses a fallback chain: var(--font-geist, var(--font-inter)) — so when
// Geist's variable isn't set (toggle off), it falls back to Inter.
const bodyFont = TASTE.useGeistFont ? geist : inter;

const TITLE =
  "Nawaf Al Hussain — Platform Engineer & Cloud Architect | Java, TypeScript, Next.js & AI";
const DESCRIPTION =
  "Nawaf Al Hussain is a Computer Science & Engineering undergrad at United International University (Dhaka, Bangladesh) building end-to-end web, backend, cloud, and AI systems with Java, Spring Boot, Next.js, React, TypeScript, Python, and Docker — from AI-powered recruitment platforms to real-time multiplayer game engines and reverse-engineered Batman game rebuilds. Dark Knight of Code.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Nawaf Al Hussain",
  },
  description: DESCRIPTION,
  applicationName: "Nawaf Al Hussain Portfolio",
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  category: "technology",
  keywords: [
    "Nawaf Al Hussain",
    "Nawaf Al Hussain portfolio",
    "Platform Engineer",
    "Cloud Architect",
    "Dark Knight of Code",
    "The Dark Dev",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Java Developer",
    "Spring Boot Developer",
    "AI Engineer",
    "United International University",
    "UIU Dhaka",
    "Dhaka developer",
    "Bangladesh software engineer",
    "NexHire",
    "TDKR",
    "Game of Life 2",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: PROFILE.firstName,
    lastName: "Al Hussain",
    username: "nawaf-al-hussain",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Nawaf Al Hussain Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: { url: "/favicon.svg", type: "image/svg+xml" },
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // viewport-fit=cover — lets the page extend into the notch/safe areas
  // on iPhone X+ so the 3D scene fills the screen edge-to-edge.
  viewportFit: "cover",
  // maximumScale + user-scalable=no prevents the accidental double-tap
  // zoom that would break the scroll-driven 3D experience. Accessibility
  // note: this is a deliberate trade-off for a 3D portfolio — users who
  // need zoom can use browser-level zoom (Ctrl/Cmd + +).
  maximumScale: 1,
  userScalable: false,
  themeColor: "#02010a",
  colorScheme: "dark",
};

/**
 * Rich, linked structured data (schema.org @graph). Answer engines and AI
 * crawlers use this to understand who Nawaf is, what he does, and what
 * he has built — the backbone of AEO / AI-SEO. Built from the same content
 * data that drives the site so it never drifts out of sync.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: PROFILE.name,
      givenName: PROFILE.firstName,
      familyName: "Al Hussain",
      jobTitle: PROFILE.role,
      description: PROFILE.bio,
      url: `${SITE_URL}/`,
      email: `mailto:${PROFILE.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dhaka",
        addressCountry: "BD",
      },
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "United International University (UIU), Dhaka",
        },
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: PROFILE.role,
        occupationLocation: {
          "@type": "City",
          name: "Dhaka, Bangladesh",
        },
        skills: SKILLS.map((s) => s.items).join(" · "),
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Java",
        "Spring Boot",
        "Python",
        "C#",
        "REST APIs",
        "SQL",
        "Docker",
        "Redis",
        "Linux",
        "Reverse Engineering",
        "Retrieval-Augmented Generation (RAG)",
        "Vector databases",
        "Workflow automation",
        "Artificial Intelligence",
        "Cloud architecture",
      ],
      sameAs: [PROFILE.socials.github, PROFILE.socials.portfolio],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Nawaf Al Hussain Portfolio",
      description: DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: `${SITE_URL}/`,
      name: TITLE,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      mainEntity: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#projects`,
      name: "Projects by Nawaf Al Hussain",
      numberOfItems: PROJECTS.length,
      itemListElement: PROJECTS.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: p.title,
          headline: p.tagline,
          description: p.description,
          keywords: p.tags.join(", "),
          creator: { "@id": `${SITE_URL}/#person` },
          ...(p.link ? { url: p.link } : {}),
        },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${bodyFont.variable} ${jetbrains.variable} antialiased`}
    >
      <body className={`${TASTE.glassRefraction ? "taste-glass" : ""} ${TASTE.tactileFeedback ? "taste-tactile" : ""}`.trim() || undefined}>
        {children}
        {/* Text alternative to the WebGL experience — full, semantic content
            for screen readers and for AI/search crawlers that don't run JS. */}
        <SeoContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
