import type { MetadataRoute } from "next";
import { SITE_URL, PROFILE } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}${PROFILE.resume}`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
