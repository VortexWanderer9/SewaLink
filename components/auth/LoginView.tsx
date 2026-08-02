"use client";

import Link from "next/link";
import { useState } from "react";
import { LogIn, Phone, Mail, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Mode = "phone" | "email" | "google";

export default function LoginView() {
  const [mode, setMode] = useState<Mode>("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const canSubmit = mode === "phone" ? phone.trim().length >= 7 : email.trim().length > 3 && password.length >= 6;
  const canVerifyOtp = otp.length >= 6;

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
                  setOtpSent(false);
                }}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-semibold transition ${
                  mode === m ? "bg-white text-ink-900 shadow-sm" : "text-ink-400 hover:text-ink-700"
                }`}
              >
                {m === "phone" ? (
                  <>
                    <Phone size={13} aria-hidden="true" /> Phone OTP
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
              <>
                {!otpSent ? (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setOtpSent(true);
                    }}
                  >
                    {mode === "phone" ? (
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
                        <p className="mt-1 text-[11px] text-ink-400">
                          We&apos;ll send a 6-digit OTP via SMS. Standard SMS rates.
                        </p>
                      </label>
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
                      disabled={!canSubmit}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-900 px-6 py-3 text-sm font-semibold text-paper-50 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <LogIn size={15} aria-hidden="true" />
                      {mode === "phone" ? "Send OTP" : "Log in"}
                    </button>
                  </form>
                ) : (
                  <form
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <label className="block text-xs font-medium text-ink-700">
                      Enter the 6-digit code we just sent
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="000000"
                        className="mt-1.5 w-full rounded-xl border border-ink-900/12 bg-paper-50 px-4 py-3 text-center text-2xl font-mono tracking-widest outline-none focus:border-indigo-900"
                        autoComplete="one-time-code"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={!canVerifyOtp}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-marigold-500 px-6 py-3 text-sm font-semibold text-indigo-950 transition hover:bg-marigold-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Verify &amp; log in
                    </button>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="w-full text-center text-xs font-medium text-ink-400 hover:text-indigo-900"
                    >
                      ← Use a different number
                    </button>
                  </form>
                )}
              </>
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
