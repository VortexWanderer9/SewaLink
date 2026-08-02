import { categoriesApi, workersApi, type Category as ApiCategory, type WorkerProfile } from './api';
import { categories as mockCategories, workers as mockWorkers, type Category, type Worker, type Worker as DataWorker } from './data';

export function apiCategoryToDataCategory(c: ApiCategory): Category {
  return {
    slug: c.slug,
    name: c.name,
    nameNe: c.nameNe,
    blurb: c.blurb,
    avgPrice: c.avgPrice,
  };
}

export function apiWorkerToDataWorker(w: WorkerProfile): DataWorker {
  const initials = (w.user?.fullName || 'Unknown Worker')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const badgeNames = (w.badges || [])
    .map((b: any) => b?.badge?.name)
    .filter(Boolean) as string[];
  return {
    id: w.userId,
    name: w.user?.fullName || 'Unknown Worker',
    category: w.categorySlug,
    location: w.location,
    yearsExp: w.yearsExperience || 0,
    rating: Number(w.rating) || 0,
    jobsDone: w.totalJobsDone || 0,
    priceFrom: Number(w.priceFrom) || 0,
    verified: w.verificationStatus === 'VERIFIED',
    badges: badgeNames,
    bio: w.bio || 'Professional service provider.',
    responseTime: w.responseTimeMinutes
      ? `Usually responds in ${w.responseTimeMinutes} min`
      : 'Usually responds within 30 min',
    avatarInitials: initials,
    gulfReturnee: !!w.gulfReturnee,
  };
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await categoriesApi.list();
    if (Array.isArray(res) && res.length > 0) {
      return res.map(apiCategoryToDataCategory);
    }
  } catch {
  }
  return mockCategories;
}

export async function getWorkers(params?: {
  category?: string;
  query?: string;
  location?: string;
  minRating?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
  onlineOnly?: boolean;
  sort?: 'rating' | 'price_asc' | 'price_desc' | 'jobs_desc';
  skip?: number;
  take?: number;
}): Promise<Worker[]> {
  try {
    const res = await workersApi.search(params ?? { take: 50 });
    if (res && Array.isArray(res.data) && res.data.length > 0) {
      return res.data.map(apiWorkerToDataWorker);
    }
  } catch {
  }
  let list = mockWorkers;
  if (params?.category && params.category !== 'all') {
    list = list.filter((w) => w.category === params.category);
  }
  if (params?.query) {
    const q = params.query.toLowerCase();
    list = list.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.location.toLowerCase().includes(q) ||
        w.category.includes(q),
    );
  }
  if (params?.minRating) list = list.filter((w) => w.rating >= params.minRating!);
  if (params?.maxPrice) list = list.filter((w) => w.priceFrom <= params.maxPrice!);
  if (params?.verifiedOnly) list = list.filter((w) => w.verified);
  if (params?.sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
  if (params?.sort === 'price_asc') list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
  if (params?.sort === 'price_desc') list = [...list].sort((a, b) => b.priceFrom - a.priceFrom);
  if (params?.sort === 'jobs_desc') list = [...list].sort((a, b) => b.jobsDone - a.jobsDone);
  if (params?.skip) list = list.slice(params.skip);
  if (params?.take) list = list.slice(0, params.take);
  return list;
}

export async function getWorkerById(id: string): Promise<Worker | null> {
  try {
    const res = await workersApi.getById(id);
    if (res && res.userId) {
      return apiWorkerToDataWorker(res as WorkerProfile);
    }
  } catch {
  }
  return mockWorkers.find((w) => w.id === id) || mockWorkers[0] || null;
}

export async function getFeaturedWorkers(limit = 3): Promise<Worker[]> {
  const all = await getWorkers({ sort: 'rating', take: Math.max(limit, 10) });
  return all.slice(0, limit);
}
