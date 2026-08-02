import type { Metadata } from "next";
import { favoritesApi } from "@/lib/api";
import FavoritesClient from "./FavoritesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Favorites",
  description: "View your favorite service professionals.",
};

async function getFavorites() {
  try {
    const favorites = await favoritesApi.list();
    return { favorites, error: null };
  } catch (error: any) {
    console.error('Failed to fetch favorites:', error);
    return { favorites: [], error: error.message };
  }
}

export default async function FavoritesPage() {
  const data = await getFavorites();
  return <FavoritesClient initialData={data} />;
}
