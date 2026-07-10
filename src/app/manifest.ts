import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nawaf Al Hussain — Platform Engineer & Cloud Architect",
    short_name: "Nawaf Al Hussain",
    description:
      "Portfolio of Nawaf Al Hussain — a Computer Science & Engineering undergrad at UIU (Dhaka) building end-to-end web, backend, cloud, and AI systems with Java, Spring Boot, Next.js, React, TypeScript, Python, and Docker. Dark Knight of Code.",
    start_url: "/",
    display: "standalone",
    background_color: "#02010a",
    theme_color: "#02010a",
    lang: "en",
    categories: ["portfolio", "technology", "productivity"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
