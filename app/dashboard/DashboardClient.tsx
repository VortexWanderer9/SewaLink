"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Heart, Home, History, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface DashboardData {
  dashboard: any;
  bookings: any[];
  favorites: any[];
  addresses: any[];
  error: string | null;
}

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const { user, logout } = useAuth();
  const [data] = useState(initialData);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-900" />
          <p className="mt-2 text-sm text-ink-400">Loading...</p>
        </div>
      </div>
    );
  }

  const pendingBookings = data.bookings?.filter((b: any) => b.status === 'PENDING') || [];

  return (
    <div>
      <Header />
      <div className="container-page py-12">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-ink-900">Welcome back, {user.fullName}</h1>
          <p className="mt-1 text-sm text-ink-400">Manage your bookings and account</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px,1fr]">
          {/* Sidebar */}
          <aside className="space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-indigo-900 px-4 py-3 text-sm font-semibold text-paper-50"
            >
              <Home size={18} /> Dashboard
            </Link>
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-ink-700 hover:bg-paper-100"
            >
              <Calendar size={18} /> My Bookings
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-ink-700 hover:bg-paper-100"
            >
              <History size={18} /> Booking History
            </Link>
            <Link
              href="/dashboard/favorites"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-ink-700 hover:bg-paper-100"
            >
              <Heart size={18} /> Favorites
            </Link>
            <Link
              href="/dashboard/addresses"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-ink-700 hover:bg-paper-100"
            >
              <MapPin size={18} /> Addresses
            </Link>
            <button
              onClick={logout}
              className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} /> Logout
            </button>
          </aside>

          {/* Main Content */}
          <div className="space-y-8">
            {data.error && (
              <div className="rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                Failed to load dashboard data. Please refresh the page.
              </div>
            )}

            {/* Stats */}
            {data.dashboard?.summary && (
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                  <p className="text-xs text-ink-400">Total Bookings</p>
                  <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                    {data.dashboard.summary.totalBookings || 0}
                  </p>
                </div>
                <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                  <p className="text-xs text-ink-400">Total Spent</p>
                  <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                    Rs {data.dashboard.summary.completedSpent || 0}
                  </p>
                </div>
                <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                  <p className="text-xs text-ink-400">Favorites</p>
                  <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                    {data.favorites?.length || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Pending Bookings */}
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">Pending Bookings</h2>
              {pendingBookings.length === 0 ? (
                <div className="mt-4 rounded-xl2 border border-dashed border-ink-900/15 p-8 text-center">
                  <p className="text-sm text-ink-400">No pending bookings</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {pendingBookings.map((booking: any) => (
                    <div key={booking.id} className="rounded-xl2 border border-ink-900/8 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-ink-900">{booking.category?.name || 'Service'}</p>
                          <p className="mt-1 text-sm text-ink-400">
                            <Calendar size={14} className="inline mr-1" />
                            {new Date(booking.scheduledAt).toLocaleDateString()}
                          </p>
                          <p className="mt-1 text-sm text-ink-400">
                            <MapPin size={14} className="inline mr-1" />
                            {booking.addressText}
                          </p>
                        </div>
                        <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                          Pending
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">Quick Actions</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/browse"
                  className="flex items-center justify-center gap-2 rounded-xl2 border border-ink-900/8 bg-white p-4 text-sm font-medium text-ink-900 hover:border-indigo-900/40"
                >
                  <Calendar size={18} /> Book a Service
                </Link>
                <Link
                  href="/dashboard/favorites"
                  className="flex items-center justify-center gap-2 rounded-xl2 border border-ink-900/8 bg-white p-4 text-sm font-medium text-ink-900 hover:border-indigo-900/40"
                >
                  <Heart size={18} /> View Favorites
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
