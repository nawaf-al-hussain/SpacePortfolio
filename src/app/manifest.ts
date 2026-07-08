import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Abhishek Badar — Software Development Engineer",
    short_name: "Abhishek Badar",
    description:
      "Portfolio of Abhishek Badar, a Software Development Engineer building end-to-end web, mobile, backend, and AI systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#02010a",
    theme_color: "#02010a",
    lang: "en",
    categories: ["portfolio", "technology", "productivity"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
