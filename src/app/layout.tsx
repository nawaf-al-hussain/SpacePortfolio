import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
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

const DESCRIPTION =
  "Software Development Engineer at Xeo Information Systems. Building scalable web applications with React, TypeScript, Laravel, and Flutter. IIT Ropar AI Minor graduate.";

export const metadata: Metadata = {
  title:
    "Abhishek Badar - Software Development Engineer | React, TypeScript & AI",
  description: DESCRIPTION,
  keywords: [
    "Abhishek Badar",
    "Software Developer",
    "SDE",
    "React Developer",
    "TypeScript",
    "JavaScript",
    "Flutter",
    "Laravel",
    "AI Developer",
    "Web Developer",
    "RCOEM",
    "IIT Ropar",
    "Xeo Information Systems",
  ],
  metadataBase: new URL("https://abhishekbadar.dev"),
  openGraph: {
    title: "Abhishek Badar - Software Development Engineer",
    description:
      "Software Development Engineer at Xeo Information Systems. Building scalable web applications with React, TypeScript, Laravel, and Flutter.",
    url: "https://abhishekbadar.dev/",
    siteName: "Abhishek Badar Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abhishek Badar - Software Development Engineer",
    description:
      "Software Development Engineer at Xeo Information Systems. Building scalable web applications with React, TypeScript, Laravel, and Flutter.",
    creator: "@abhishekbadar",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Abhishek Badar",
  jobTitle: "Software Development Engineer",
  description:
    "Software Development Engineer specializing in React, TypeScript, Laravel, and Flutter",
  url: "https://abhishekbadar.dev/",
  email: "mailto:ab15.badar@gmail.com",
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "RCOEM College" },
    { "@type": "CollegeOrUniversity", name: "IIT Ropar" },
  ],
  knowsAbout: [
    "React",
    "TypeScript",
    "JavaScript",
    "Laravel",
    "PHP",
    "Flutter",
    "Dart",
    "Artificial Intelligence",
  ],
  worksFor: { "@type": "Organization", name: "Xeo Information Systems" },
  sameAs: [
    "https://github.com/AbhishekBadar",
    "https://www.linkedin.com/in/abhishekbadar",
    "https://medium.com/@abhishekbadar",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
