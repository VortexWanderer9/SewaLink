import type { Metadata } from "next";
import { workersApi, earningsApi } from "@/lib/api";
import WorkerEarningsClient from "./WorkerEarningsClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Earnings",
  description: "View your earnings and payout history.",
};

async function getWorkerEarnings() {
  try {
    const [earnings, payouts] = await Promise.all([
      workersApi.getMyEarnings(),
      earningsApi.payouts(0, 20),
    ]);
    return { earnings, payouts, error: null };
  } catch (error: any) {
    console.error('Failed to fetch worker earnings:', error);
    return { earnings: null, payouts: [], error: error.message };
  }
}

export default async function WorkerEarningsPage() {
  const data = await getWorkerEarnings();
  return <WorkerEarningsClient initialData={data} />;
}
