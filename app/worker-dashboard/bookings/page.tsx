import type { Metadata } from "next";
import { workersApi } from "@/lib/api";
import WorkerBookingsClient from "./WorkerBookingsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Bookings",
  description: "View and manage your service bookings.",
};

async function getWorkerBookings(status?: string, skip = 0, take = 20) {
  try {
    const bookings = await workersApi.getMyBookings(status, skip, take);
    return { bookings, error: null };
  } catch (error: any) {
    console.error('Failed to fetch worker bookings:', error);
    return { bookings: [], error: error.message };
  }
}

export default async function WorkerBookingsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const data = await getWorkerBookings(searchParams.status);
  return <WorkerBookingsClient initialData={data} />;
}
