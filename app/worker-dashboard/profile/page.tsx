import type { Metadata } from "next";
import { workersApi } from "@/lib/api";
import WorkerProfileClient from "./WorkerProfileClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your worker profile and availability.",
};

async function getWorkerProfile() {
  try {
    const profile = await workersApi.getMyProfile();
    return { profile, error: null };
  } catch (error: any) {
    console.error('Failed to fetch worker profile:', error);
    return { profile: null, error: error.message };
  }
}

export default async function WorkerProfilePage() {
  const data = await getWorkerProfile();
  return <WorkerProfileClient initialData={data} />;
}
