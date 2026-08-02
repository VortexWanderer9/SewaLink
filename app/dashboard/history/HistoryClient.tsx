"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { customersApi } from "@/lib/api";

interface HistoryData {
  history: any[];
  error: string | null;
}

export default function HistoryClient({ 
  initialData 
}: { 
  initialData: HistoryData; 
}) {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
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

  const paginatedHistory = data.history.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(data.history.length / pageSize);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      const history = await customersApi.history(0, (page + 2) * pageSize);
      setData({ history, error: null });
    } catch (error: any) {
      setData({ history: [], error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container-page py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink-900">Booking History</h1>
            <p className="mt-1 text-sm text-ink-400">View your completed service bookings</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-indigo-900 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        {data.error && (
          <div className="mb-6 rounded-xl2 border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            Failed to load booking history. Please refresh the page.
          </div>
        )}

        {/* History List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-900" />
          </div>
        ) : paginatedHistory.length === 0 ? (
          <div className="rounded-xl2 border border-dashed border-ink-900/15 p-12 text-center">
            <p className="text-sm text-ink-400">No completed bookings yet</p>
            <Link
              href="/browse"
              className="mt-4 inline-block rounded-full bg-indigo-900 px-6 py-2 text-sm font-semibold text-paper-50"
            >
              Book a Service
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedHistory.map((booking: any) => (
              <div key={booking.id} className="rounded-xl2 border border-ink-900/8 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-ink-900">{booking.category?.name || 'Service'}</p>
                        <p className="mt-1 text-sm text-ink-400">
                          <Calendar size={14} className="inline mr-1" />
                          {new Date(booking.completedAt || booking.scheduledAt).toLocaleString()}
                        </p>
                        <p className="mt-1 text-sm text-ink-400">
                          <MapPin size={14} className="inline mr-1" />
                          {booking.addressText}
                        </p>
                      </div>
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Completed
                      </span>
                    </div>
                    {booking.description && (
                      <p className="mt-2 text-sm text-ink-700">{booking.description}</p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-sm">
                      <span className="text-ink-900 font-semibold">Rs {booking.totalAmount}</span>
                      {booking.worker && (
                        <span className="text-ink-400">
                          with {booking.worker.fullName}
                        </span>
                      )}
                    </div>
                    {booking.reviews && booking.reviews.length > 0 && (
                      <div className="mt-3 flex items-center gap-1 text-sm text-ink-400">
                        <Star size={14} className="fill-marigold-500 text-marigold-500" />
                        <span>{booking.reviews[0].rating}.0</span>
                      </div>
                    )}
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

        {/* Load More */}
        {data.history.length > (page + 1) * pageSize && (
          <div className="mt-6 text-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="rounded-full border border-ink-900/12 px-6 py-2 text-sm font-medium text-ink-900 hover:border-indigo-900/40 disabled:opacity-40"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
