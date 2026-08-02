import type { Metadata } from "next";
import { customersApi, bookingsApi, favoritesApi, addressesApi } from "@/lib/api";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Manage your bookings, favorites, and account settings.",
};

async function getDashboardData() {
  try {
    const [dashboard, bookings, favorites, addresses] = await Promise.all([
      customersApi.dashboard(),
      bookingsApi.getMy('PENDING', 0, 5),
      favoritesApi.list(),
      addressesApi.list(),
    ]);
    return { dashboard, bookings, favorites, addresses, error: null };
  } catch (error: any) {
    console.error('Failed to fetch dashboard data:', error);
    return { dashboard: null, bookings: [], favorites: [], addresses: [], error: error.message };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  return <DashboardClient initialData={data} />;
}
