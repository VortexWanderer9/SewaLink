import type { Metadata } from "next";
import { addressesApi } from "@/lib/api";
import AddressesClient from "./AddressesClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Addresses",
  description: "Manage your saved addresses for bookings.",
};

async function getAddresses() {
  try {
    const addresses = await addressesApi.list();
    return { addresses, error: null };
  } catch (error: any) {
    console.error('Failed to fetch addresses:', error);
    return { addresses: [], error: error.message };
  }
}

export default async function AddressesPage() {
  const data = await getAddresses();
  return <AddressesClient initialData={data} />;
}
