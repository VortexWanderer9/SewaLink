import { categoriesApi, workersApi, type Category as ApiCategory, type WorkerProfile } from './api';

export interface Category {
  slug: string;
  name: string;
  nameNe: string;
  blurb: string;
  avgPrice: string;
}

export interface Worker {
  id: string;
  name: string;
  category: string;
  location: string;
  yearsExp: number;
  rating: number;
  jobsDone: number;
  priceFrom: number;
  verified: boolean;
  badges: string[];
  bio: string;
  responseTime: string;
  avatarInitials: string;
  gulfReturnee?: boolean;
}

export function apiCategoryToCategory(c: ApiCategory): Category {
  return {
    slug: c.slug,
    name: c.name,
    nameNe: c.nameNe,
    blurb: c.blurb,
    avgPrice: c.avgPrice,
  };
}

export function apiWorkerToWorker(w: WorkerProfile): Worker {
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
      return res.map(apiCategoryToCategory);
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
  return [];
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
      return res.data.map(apiWorkerToWorker);
    }
  } catch (error) {
    console.error('Failed to fetch workers:', error);
  }
  return [];
}

export async function getWorkerById(id: string): Promise<Worker | null> {
  try {
    const res = await workersApi.getById(id);
    if (res && res.userId) {
      return apiWorkerToWorker(res as WorkerProfile);
    }
  } catch (error) {
    console.error('Failed to fetch worker:', error);
  }
  return null;
}

export async function getFeaturedWorkers(limit = 3): Promise<Worker[]> {
  try {
    const all = await getWorkers({ sort: 'rating', take: Math.max(limit, 10) });
    return all.slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch featured workers:', error);
    return [];
  }
}

