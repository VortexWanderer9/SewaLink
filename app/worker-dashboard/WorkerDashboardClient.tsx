"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, DollarSign, User, Briefcase, LogOut, Loader2, ToggleRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { workersApi } from "@/lib/api";

interface WorkerDashboardData {
  profile: any;
  bookings: any[];
  earnings: any;
  error: string | null;
}

export default function WorkerDashboardClient({ initialData }: { initialData: WorkerDashboardData }) {
  const { user, logout } = useAuth();
  const [data, setData] = useState(initialData);
  const [isOnline, setIsOnline] = useState(data.profile?.isOnline || false);
  const [loading, setLoading] = useState(false);

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

  const handleToggleOnline = async () => {
    setLoading(true);
    try {
      await workersApi.setOnline(!isOnline);
      setIsOnline(!isOnline);
      const profile = await workersApi.getMyProfile();
      setData({ ...data, profile });
    } catch (error: any) {
      console.error('Failed to toggle online status:', error);
    } finally {
      setLoading(false);
    }
  };

  const inProgressBookings = data.bookings?.filter((b: any) => b.status === 'IN_PROGRESS') || [];

  return (
    <div>
      <Header />
      <div className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">Worker Dashboard</h1>
            <p className="mt-1 text-sm text-ink-400">Manage your profile, bookings, and earnings</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium">
              <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              {isOnline ? 'Online' : 'Offline'}
            </div>
            <button
              onClick={handleToggleOnline}
              disabled={loading}
              className="flex items-center gap-2 rounded-full border border-ink-900/12 px-4 py-2 text-sm font-medium text-ink-900 hover:border-indigo-900/40 disabled:opacity-40"
            >
              <ToggleRight size={18} />
              {loading ? 'Switching...' : isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[250px,1fr]">
          {/* Sidebar */}
          <aside className="space-y-2">
            <Link
              href="/worker-dashboard"
              className="flex items-center gap-2 rounded-lg bg-indigo-900 px-4 py-3 text-sm font-semibold text-paper-50"
            >
              <Briefcase size={18} /> Dashboard
            </Link>
            <Link
              href="/worker-dashboard/profile"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-ink-700 hover:bg-paper-100"
            >
              <User size={18} /> My Profile
            </Link>
            <Link
              href="/worker-dashboard/bookings"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-ink-700 hover:bg-paper-100"
            >
              <Calendar size={18} /> My Bookings
            </Link>
            <Link
              href="/worker-dashboard/earnings"
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-ink-700 hover:bg-paper-100"
            >
              <DollarSign size={18} /> Earnings
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
            {data.profile && (
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                  <p className="text-xs text-ink-400">Total Jobs</p>
                  <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                    {data.profile.totalJobsDone || 0}
                  </p>
                </div>
                <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                  <p className="text-xs text-ink-400">Rating</p>
                  <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                    {data.profile.rating || 0}.0
                  </p>
                </div>
                <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                  <p className="text-xs text-ink-400">Reviews</p>
                  <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                    {data.profile.totalReviews || 0}
                  </p>
                </div>
                <div className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                  <p className="text-xs text-ink-400">Total Earnings</p>
                  <p className="mt-2 font-display text-2xl font-bold text-indigo-900">
                    Rs {data.profile.totalEarnings || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Active Bookings */}
            <div>
              <h2 className="font-display text-lg font-semibold text-ink-900">Active Bookings</h2>
              {inProgressBookings.length === 0 ? (
                <div className="mt-4 rounded-xl2 border border-dashed border-ink-900/15 p-8 text-center">
                  <p className="text-sm text-ink-400">No active bookings</p>
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {inProgressBookings.map((booking: any) => (
                    <div key={booking.id} className="rounded-xl2 border border-ink-900/8 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-ink-900">{booking.category?.name || 'Service'}</p>
                          <p className="mt-1 text-sm text-ink-400">
                            <Calendar size={14} className="inline mr-1" />
                            {new Date(booking.scheduledAt).toLocaleString()}
                          </p>
                          <p className="mt-1 text-sm text-ink-400">
                            Customer: {booking.customer?.fullName || 'N/A'}
                          </p>
                        </div>
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                          In Progress
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
                  href="/worker-dashboard/profile"
                  className="flex items-center justify-center gap-2 rounded-xl2 border border-ink-900/8 bg-white p-4 text-sm font-medium text-ink-900 hover:border-indigo-900/40"
                >
                  <User size={18} /> Update Profile
                </Link>
                <Link
                  href="/worker-dashboard/bookings"
                  className="flex items-center justify-center gap-2 rounded-xl2 border border-ink-900/8 bg-white p-4 text-sm font-medium text-ink-900 hover:border-indigo-900/40"
                >
                  <Calendar size={18} /> View All Bookings
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
