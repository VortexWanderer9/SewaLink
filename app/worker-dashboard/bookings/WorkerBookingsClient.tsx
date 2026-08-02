"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { workersApi } from "@/lib/api";

interface WorkerBookingsData {
  bookings: any[];
  error: string | null;
}

export default function WorkerBookingsClient({ initialData }: { initialData: WorkerBookingsData }) {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState<string>("ALL");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

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

  const filteredBookings = data.bookings.filter((b: any) => {
    if (filter === "ALL") return true;
    return b.status === filter;
  });

  const paginatedBookings = filteredBookings.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredBookings.length / pageSize);

  const handleFilterChange = async (newFilter: string) => {
    setFilter(newFilter);
    setPage(0);
    setLoading(true);
    try {
      const status = newFilter === "ALL" ? undefined : newFilter;
      const bookings = await workersApi.getMyBookings(status, 0, 50);
      setData({ bookings, error: null });
    } catch (error: any) {
      setData({ bookings: [], error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "IN_PROGRESS":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div>
      <Header />
      <div className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">My Bookings</h1>
            <p className="mt-1 text-sm text-ink-400">View and manage your service bookings</p>
          </div>
          <Link
            href="/worker-dashboard"
            className="text-sm font-medium text-indigo-900 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        {data.error && (
          <div className="mb-6 rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            Failed to load bookings. Please refresh the page.
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={18} className="text-ink-400 shrink-0" />
          {["ALL", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              disabled={loading}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition ${
                filter === status
                  ? "bg-indigo-900 text-paper-50"
                  : "bg-paper-100 text-ink-700 hover:bg-paper-200"
              }`}
            >
              {status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-900" />
          </div>
        ) : paginatedBookings.length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-ink-900/15 p-12 text-center">
            <p className="text-sm text-ink-400">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedBookings.map((booking: any) => (
              <div key={booking.id} className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-ink-900">{booking.category?.name || 'Service'}</p>
                        <p className="mt-1 text-sm text-ink-400">
                          <Calendar size={14} className="inline mr-1" />
                          {new Date(booking.scheduledAt).toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm text-ink-400">
                          <MapPin size={14} className="inline mr-1" />
                          {booking.addressText}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.replace("_", " ")}
                      </span>
                    </div>
                    {booking.description && (
                      <p className="mt-2 text-sm text-ink-700">{booking.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="text-ink-900 font-semibold">Rs {booking.totalAmount}</span>
                      {booking.customer && (
                        <span className="text-ink-400">
                          Customer: {booking.customer.fullName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-full border border-ink-900/12 p-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-ink-400">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="rounded-full border border-ink-900/12 p-2 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
