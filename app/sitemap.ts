import type { MetadataRoute } from "next";
import { categories, workers } from "@/lib/data";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://sewalinknepal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/browse`, priority: 0.9 },
    { url: `${BASE}/#worker`, priority: 0.6 },
    { url: `${BASE}/#business`, priority: 0.5 },
  ];

  const categoryRoutes = categories.map((c) => ({
    url: `${BASE}/browse?category=${c.slug}`,
    priority: 0.7,
  }));

  const workerRoutes = workers.map((w) => ({
    url: `${BASE}/worker/${w.id}`,
    priority: 0.8,
  }));

  const now = new Date();
  return [...staticRoutes, ...categoryRoutes, ...workerRoutes].map((r) => ({
    ...r,
    lastModified: now,
    changeFrequency: "weekly" as const,
  }));
}
