import type { Metadata } from "next";
import PlanetCarousel from "@/components/space-tour/PlanetCarousel";
import "@/components/space-tour/planet-carousel.css";

export const metadata: Metadata = {
  title: "Space Tour · Planet Explorer",
  description:
    "An interactive tour of our solar system — Sun, Earth, Mars, Moon, Saturn, and Jupiter. Explore each planet's stats, description, and visuals.",
  openGraph: {
    title: "Space Tour · Planet Explorer",
    description:
      "An interactive tour of our solar system — Sun, Earth, Mars, Moon, Saturn, and Jupiter.",
    type: "website",
  },
};

export default function SpaceTourPage() {
  return <PlanetCarousel />;
}
