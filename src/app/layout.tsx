import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import {
  PROFILE,
  SKILLS,
  PROJECTS,
  SITE_URL,
} from "@/lib/data";
import SeoContent from "@/components/dom/SeoContent";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const TITLE =
  "Abhishek Badar — Software Development Engineer | React, TypeScript, Flutter & AI";
const DESCRIPTION =
  "Abhishek Badar is a Software Development Engineer at Xeo Information Systems (Pune, India) building end-to-end web, mobile, and backend systems with React, Next.js, TypeScript, Laravel, and Flutter — plus AI in production (RAG, Pinecone, OCR). IIT Ropar AI Minor graduate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · Abhishek Badar",
  },
  description: DESCRIPTION,
  applicationName: "Abhishek Badar Portfolio",
  authors: [{ name: PROFILE.name, url: SITE_URL }],
  creator: PROFILE.name,
  publisher: PROFILE.name,
  category: "technology",
  keywords: [
    "Abhishek Badar",
    "Abhishek Badar portfolio",
    "Software Development Engineer",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Laravel Developer",
    "Flutter Developer",
    "AI Engineer",
    "RAG",
    "Pinecone",
    "Xeo Information Systems",
    "IIT Ropar",
    "RCOEM",
    "Pune developer",
    "software engineer India",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "profile",
    firstName: PROFILE.firstName,
    lastName: "Badar",
    username: "abhishekbadar",
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Abhishek Badar Portfolio",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    creator: "@abhishekbadar",
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
    icon: "/favicon.ico",
    apple: "/favicon.ico",
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
  themeColor: "#02010a",
  colorScheme: "dark",
};

/**
 * Rich, linked structured data (schema.org @graph). Answer engines and AI
 * crawlers use this to understand who Abhishek is, what he does, and what
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
      familyName: "Badar",
      jobTitle: PROFILE.role,
      description: PROFILE.bio,
      url: `${SITE_URL}/`,
      email: `mailto:${PROFILE.email}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        addressCountry: "IN",
      },
      worksFor: {
        "@type": "Organization",
        name: "Xeo Information Systems",
      },
      alumniOf: [
        {
          "@type": "CollegeOrUniversity",
          name: "Ramdeobaba College of Engineering and Management (RCOEM)",
        },
        {
          "@type": "CollegeOrUniversity",
          name: "Indian Institute of Technology Ropar (IIT Ropar)",
        },
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: PROFILE.role,
        occupationLocation: {
          "@type": "City",
          name: "Pune, India",
        },
        skills: SKILLS.map((s) => s.items).join(" · "),
      },
      knowsAbout: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript",
        "Laravel",
        "PHP",
        "Flutter",
        "Dart",
        "Python",
        "REST APIs",
        "MySQL",
        "Firebase",
        "Retrieval-Augmented Generation (RAG)",
        "Pinecone vector database",
        "OCR",
        "Workflow automation",
        "Artificial Intelligence",
      ],
      sameAs: [
        PROFILE.socials.github,
        PROFILE.socials.linkedin,
        PROFILE.socials.medium,
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Abhishek Badar Portfolio",
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
      name: "Projects by Abhishek Badar",
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
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <body>
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
