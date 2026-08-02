"use client";

import Link from "next/link";
import { useState } from "react";
import { LogIn, Phone, Mail, ShieldCheck, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth-context";

type Mode = "phone" | "email" | "google";

export default function LoginView() {
  const { login } = useAuth();
  const [mode, setMode] = useState<Mode>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Get redirect parameter from URL
  const [redirectPath] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('redirect') || undefined;
    }
    return undefined;
  });

  const canSubmit = mode === "phone" ? phone.trim().length >= 7 && password.length >= 6 : email.trim().length > 3 && password.length >= 6;

  return (
    <div>
      <Header />
      <section className="container-page flex flex-col items-center py-16 sm:py-24">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900 font-display text-xl font-bold text-paper-50"
              aria-hidden="true"
            >
              स
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-ink-900">Welcome back</h1>
            <p className="mt-1 text-sm text-ink-700">
              Log in to track bookings, message pros, or view your worker earnings.
            </p>
          </div>

          <div
            className="mt-8 grid grid-cols-3 gap-2 rounded-xl bg-paper-100 p-1"
            role="tablist"
            aria-label="Login method"
          >
            {(["phone", "email", "google"] as Mode[]).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={mode === m}
                onClick={() => {
                  setMode(m);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition ${
                  mode === m ? "bg-white text-ink-900 shadow-sm" : "text-ink-400 hover:text-ink-700"
                }`}
              >
                {m === "phone" ? (
                  <>
                    <Phone size={13} aria-hidden="true" /> Phone
                  </>
                ) : null}
                {m === "email" ? (
                  <>
                    <Mail size={13} aria-hidden="true" /> Email
                  </>
                ) : null}
                {m === "google" ? (
                  <>
                    <ShieldCheck size={13} aria-hidden="true" /> Google
                  </>
                ) : null}
              </button>
            ))}
          </div>

          <div className="mt-6 rounded-xl2 border border-ink-900/8 bg-white p-6">
            {mode !== "google" ? (
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  setError("");
                  try {
                    const loginInput = mode === "phone" ? phone : email;
                    await login(loginInput, password, redirectPath);
                  } catch (err: any) {
                    setError(err.message || "Login failed. Please check your credentials.");
                  } finally {
                    setIsLoading(false);
                  }
                }}
              >
                {mode === "phone" ? (
                  <div className="space-y-4">
                    <label className="block text-xs font-medium text-ink-700">
                      Nepali phone number
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s-]/g, ""))}
                        placeholder="98XXXXXXXX"
                        className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                        autoComplete="tel"
                      />
                    </label>
                    <label className="block text-xs font-medium text-ink-700">
                      Password
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                        autoComplete="current-password"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="block text-xs font-medium text-ink-700">
                      Email address
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                        autoComplete="email"
                      />
                    </label>
                    <label className="block text-xs font-medium text-ink-700">
                      Password
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-sm outline-none focus:border-indigo-900"
                        autoComplete="current-password"
                      />
                    </label>
                    <div className="flex items-center justify-between text-xs">
                      <Link href="/" className="font-medium text-indigo-900 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <LogIn size={15} aria-hidden="true" />
                  {isLoading ? "Logging in..." : "Log in"}
                </button>
                {error && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
                    <AlertCircle size={16} aria-hidden="true" />
                    {error}
                  </div>
                )}
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-sm text-ink-700">
                  Sign in with Google — available for existing SewaLink accounts that have previously verified with email.
                </p>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-ink-900/15 bg-white px-6 py-3 text-sm font-semibold text-ink-900 transition hover:border-indigo-900/40"
                >
                  <ShieldCheck size={15} aria-hidden="true" /> Continue with Google
                </button>
              </div>
            )}

            <div className="mt-6 border-t border-ink-900/8 pt-5 text-center text-xs text-ink-400">
              Don&apos;t have an account?{" "}
              <Link href="/pro/apply" className="font-semibold text-indigo-900 hover:underline">
                Join as a pro
              </Link>{" "}
              or{" "}
              <Link href="/browse" className="font-semibold text-indigo-900 hover:underline">
                browse as a guest
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
