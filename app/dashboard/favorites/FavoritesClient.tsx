"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Star, Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { favoritesApi } from "@/lib/api";

interface FavoritesData {
  favorites: any[];
  error: string | null;
}

export default function FavoritesClient({ initialData }: { initialData: FavoritesData }) {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-900" />
          <p className="mt-2 text-sm text-ink-400">Loading...</p>
        </div>
      </div>
    );
  }

  const handleRemoveFavorite = async (workerProfileId: string) => {
    setLoading(true);
    try {
      await favoritesApi.removeByWorker(workerProfileId);
      const favorites = await favoritesApi.list();
      setData({ favorites, error: null });
    } catch (error: any) {
      console.error('Failed to remove favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">My Favorites</h1>
            <p className="mt-1 text-sm text-ink-400">View your favorite service professionals</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-indigo-900 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        {data.error && (
          <div className="mb-6 rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            Failed to load favorites. Please refresh the page.
          </div>
        )}

        {/* Favorites List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-900" />
          </div>
        ) : data.favorites.length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-ink-900/15 p-12 text-center">
            <Heart size={48} className="mx-auto text-ink-200" />
            <p className="mt-4 text-sm text-ink-400">No favorites yet</p>
            <Link
              href="/browse"
              className="mt-4 inline-block rounded-full bg-indigo-900 px-6 py-2 text-sm font-semibold text-paper-50"
            >
              Browse Professionals
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.favorites.map((favorite: any) => (
              <div key={favorite.id} className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link href={`/worker/${favorite.workerProfile?.userId}`}>
                      <p className="font-semibold text-ink-900 hover:text-indigo-900">
                        {favorite.workerProfile?.user?.fullName || 'Professional'}
                      </p>
                    </Link>
                    <p className="mt-1 text-sm text-ink-400">
                      <MapPin size={14} className="inline mr-1" />
                      {favorite.workerProfile?.location || 'Location not specified'}
                    </p>
                    <div className="mt-2 flex items-center gap-1 text-sm text-ink-400">
                      <Star size={14} className="fill-marigold-500 text-marigold-500" />
                      <span>{favorite.workerProfile?.rating || 0}.0</span>
                      <span>({favorite.workerProfile?.totalReviews || 0} reviews)</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-900 font-semibold">
                      from Rs {favorite.workerProfile?.priceFrom || 0}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFavorite(favorite.workerProfileId)}
                    disabled={loading}
                    className="rounded-full p-2 text-ink-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-40"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <Link
                  href={`/booking/${favorite.workerProfile?.userId}`}
                  className="mt-4 block w-full rounded-full border border-ink-900/12 px-4 py-2 text-center text-sm font-medium text-ink-900 hover:border-indigo-900/40"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
