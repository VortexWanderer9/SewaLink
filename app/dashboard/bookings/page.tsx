import type { Metadata } from "next";
import { bookingsApi } from "@/lib/api";
import BookingsClient from "./BookingsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your service bookings.",
};

async function getBookings(status?: string, skip = 0, take = 20) {
  try {
    const bookings = await bookingsApi.getMy(status, skip, take);
    return { bookings, error: null };
  } catch (error: any) {
    console.error('Failed to fetch bookings:', error);
    return { bookings: [], error: error.message };
  }
}

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const data = await getBookings(searchParams.status);
  return <BookingsClient initialData={data} />;
}
