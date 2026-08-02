import type { Metadata } from "next";
import LoginView from "@/components/auth/LoginView";

export const metadata: Metadata = {
  title: "Log in to your account",
  description:
    "Sign in to SewaLink Nepal with phone OTP, email, or Google. Track bookings, message pros, or manage your worker earnings dashboard.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginView />;
}
