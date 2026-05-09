import { getAllDocs } from "@/lib/journal/documents";
import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://dziedzorm.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs();
  const posts = docs.map((doc) => ({
    url: `${BASE}/journal/${doc.slug}`,
    lastModified: new Date(doc.metadata.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    ...posts,
  ];
}
