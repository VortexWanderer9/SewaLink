import type { MetadataRoute } from "next";
import { getCategories, getWorkers } from "@/lib/server-data";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://sewalinknepal.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { url: BASE, priority: 1.0 },
    { url: `${BASE}/browse`, priority: 0.9 },
    { url: `${BASE}/#worker`, priority: 0.6 },
    { url: `${BASE}/#business`, priority: 0.5 },
  ];

  try {
    const [categories, workers] = await Promise.all([getCategories(), getWorkers({ take: 100 })]);

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
  } catch {
    // Fallback to static routes only if API fails
    const now = new Date();
    return staticRoutes.map((r) => ({
      ...r,
      lastModified: now,
      changeFrequency: "weekly" as const,
    }));
  }
}
