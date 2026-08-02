import type { Metadata } from "next";
import { workersApi, bookingsApi } from "@/lib/api";
import WorkerDashboardClient from "./WorkerDashboardClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Worker Dashboard",
  description: "Manage your worker profile, bookings, and earnings.",
};

async function getWorkerDashboardData() {
  try {
    const [profile, bookings, earnings] = await Promise.all([
      workersApi.getMyProfile(),
      bookingsApi.getMy('IN_PROGRESS', 0, 5),
      workersApi.getMyEarnings(),
    ]);
    return { profile, bookings, earnings, error: null };
  } catch (error: any) {
    console.error('Failed to fetch worker dashboard data:', error);
    return { profile: null, bookings: [], earnings: null, error: error.message };
  }
}

export default async function WorkerDashboardPage() {
  const data = await getWorkerDashboardData();
  return <WorkerDashboardClient initialData={data} />;
}
