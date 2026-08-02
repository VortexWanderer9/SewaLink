import type { Metadata } from "next";
import { customersApi } from "@/lib/api";
import HistoryClient from "./HistoryClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Booking History",
  description: "View your completed service bookings.",
};

async function getHistory(skip = 0, take = 20) {
  try {
    const history = await customersApi.history(skip, take);
    return { history, error: null };
  } catch (error: any) {
    console.error('Failed to fetch history:', error);
    return { history: [], error: error.message };
  }
}

export default async function HistoryPage() {
  const data = await getHistory();
  return <HistoryClient initialData={data} />;
}
